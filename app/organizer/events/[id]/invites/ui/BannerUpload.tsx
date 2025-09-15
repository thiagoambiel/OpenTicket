"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function BannerUpload({ eventId, currentUrl }: { eventId: string; currentUrl?: string }) {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)
  const router = useRouter()

  async function upload() {
    if (!file) return
    setLoading(true)
    setMsg(null)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch(`/api/events/${eventId}/banner`, { method: 'POST', body: fd })
      if (!res.ok) throw new Error(await res.text())
      setMsg('Banner atualizado com sucesso!')
      router.refresh()
    } catch (e: any) {
      setMsg(e.message || 'Falha ao enviar banner')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Banner do evento</h2>
      </div>
      <div className="mt-2 space-y-3">
        {currentUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={currentUrl} alt="Banner atual" className="w-full h-40 object-cover rounded-md" />
        ) : (
          <p className="muted">Nenhum banner definido.</p>
        )}
        <div className="flex items-center gap-2">
          <input type="file" accept="image/png,image/jpeg,image/webp" onChange={e => setFile(e.target.files?.[0] || null)} />
          <button className="btn-primary" onClick={upload} disabled={loading || !file}>{loading ? 'Enviando...' : 'Enviar banner'}</button>
        </div>
        {msg && <p className="text-sm" aria-live="polite">{msg}</p>}
      </div>
    </div>
  )
}

