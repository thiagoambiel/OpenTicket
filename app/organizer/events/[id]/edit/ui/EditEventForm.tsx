"use client"
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { Event } from '@/types'

export default function EditEventForm({ ev, isCreator }: { ev: Event; isCreator: boolean }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    const payload: any = {
      title: String(formData.get('title') || ''),
      description: String(formData.get('description') || ''),
      location: String(formData.get('location') || ''),
      dateISO: String(formData.get('dateISO') || ''),
    }
    if (isCreator) {
      const raw = formData.get('inviteLimit')
      payload.inviteLimit = raw === null || raw === '' ? null : Number(raw)
    }
    try {
      const res = await fetch(`/api/events/${ev.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error(await res.text())
      router.push(`/organizer/events/${ev.id}/invites`)
      router.refresh()
    } catch (e: any) {
      setError(e.message || 'Erro ao salvar evento')
    } finally {
      setLoading(false)
    }
  }

  const dt = new Date(ev.dateISO)
  const localValue = new Date(dt.getTime() - dt.getTimezoneOffset() * 60000).toISOString().slice(0,16)

  return (
    <form action={onSubmit} className="space-y-4 card p-4">
      <div>
        <label className="label">Título</label>
        <input name="title" required defaultValue={ev.title} className="input" />
      </div>
      <div>
        <label className="label">Descrição</label>
        <textarea name="description" defaultValue={ev.description} className="input min-h-[100px]" />
      </div>
      <div>
        <label className="label">Local</label>
        <input name="location" defaultValue={ev.location} className="input" />
      </div>
      <div>
        <label className="label">Data e hora</label>
        <input name="dateISO" type="datetime-local" required defaultValue={localValue} className="input" />
      </div>
      {isCreator && (
        <div>
          <label className="label">Limite de convites</label>
          <input name="inviteLimit" type="number" min="0" step="1" defaultValue={ev.inviteLimit ?? ''} className="input" />
          <p className="muted mt-1">Deixe em branco para ilimitado. Somente o criador pode alterar.</p>
        </div>
      )}
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <div className="flex gap-2">
        <button className="btn-primary" disabled={loading}>{loading ? 'Salvando...' : 'Salvar alterações'}</button>
        <button type="button" className="btn-ghost" onClick={() => router.back()}>Cancelar</button>
      </div>
    </form>
  )
}
