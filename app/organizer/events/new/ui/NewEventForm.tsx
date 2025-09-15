"use client"
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function NewEventForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    const payload = {
      title: String(formData.get('title') || ''),
      description: String(formData.get('description') || ''),
      location: String(formData.get('location') || ''),
      dateISO: String(formData.get('dateISO') || ''),
      inviteLimit: formData.get('inviteLimit') ? Number(formData.get('inviteLimit')) : undefined,
    }
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      // Upload banner se fornecido
      const banner = formData.get('banner') as File | null
      if (banner && (banner as any).size > 0) {
        const fd = new FormData()
        fd.append('file', banner)
        await fetch(`/api/events/${data.id}/banner`, { method: 'POST', body: fd })
      }
      router.push(`/organizer/events/${data.id}/invites`)
    } catch (e: any) {
      setError(e.message || 'Erro ao criar evento')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form action={onSubmit} className="space-y-4 card p-4">
      <div>
        <label className="label">Título</label>
        <input name="title" required placeholder="Ex: Festa Open Beach" className="input" />
      </div>
      <div>
        <label className="label">Descrição</label>
        <textarea name="description" placeholder="Detalhes do evento" className="input min-h-[100px]" />
      </div>
      <div>
        <label className="label">Local</label>
        <input name="location" placeholder="Ex: Sede da República" className="input" />
      </div>
      <div>
        <label className="label">Data e hora</label>
        <input name="dateISO" type="datetime-local" required className="input" />
      </div>
      <div>
        <label className="label">Limite de convites (opcional)</label>
        <input name="inviteLimit" type="number" min="0" step="1" placeholder="Ex.: 150" className="input" />
        <p className="muted mt-1">Deixe em branco para ilimitado.</p>
      </div>
      <div>
        <label className="label">Banner do evento (PNG/JPEG/WebP)</label>
        <input name="banner" type="file" accept="image/png,image/jpeg,image/webp" />
      </div>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <button className="btn-primary" disabled={loading}>{loading ? 'Salvando...' : 'Criar evento'}</button>
    </form>
  )
}
