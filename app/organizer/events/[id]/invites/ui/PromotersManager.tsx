"use client"
import { useEffect, useState } from 'react'

type Item = { id: string; email: string; userId?: string; createdAt: string }

export default function PromotersManager({ eventId }: { eventId: string }) {
  const [items, setItems] = useState<Item[]>([])
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  async function load() {
    const res = await fetch(`/api/events/${eventId}/promoters`)
    if (!res.ok) return
    const json = await res.json()
    setItems(json.promoters || [])
  }

  useEffect(() => { load() }, [])

  async function add() {
    setLoading(true)
    setMsg(null)
    try {
      const res = await fetch(`/api/events/${eventId}/promoters`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      if (!res.ok) throw new Error(await res.text())
      setEmail('')
      await load()
      setMsg('Promoter adicionado')
    } catch (e: any) {
      setMsg(e.message || 'Não foi possível adicionar')
    } finally {
      setLoading(false)
    }
  }

  async function remove(id: string) {
    if (!confirm('Remover promoter?')) return
    setLoading(true)
    setMsg(null)
    try {
      const res = await fetch(`/api/events/${eventId}/promoters/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error(await res.text())
      await load()
    } catch (e: any) {
      setMsg(e.message || 'Falha ao remover')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card p-4">
      <h2 className="text-lg font-semibold">Promoters</h2>
      <p className="muted mt-1">Usuários que podem gerar convites para este evento.</p>
      <div className="mt-3 flex gap-2">
        <input className="input" placeholder="E-mail do promoter" value={email} onChange={e => setEmail(e.target.value)} />
        <button className="btn-ghost" onClick={add} disabled={loading || !email.trim()}>{loading ? 'Adicionando...' : 'Adicionar'}</button>
      </div>
      {msg && <p className="text-sm mt-2" aria-live="polite">{msg}</p>}
      <ul className="mt-4 space-y-2">
        {items.map(p => (
          <li key={p.id} className="flex items-center justify-between border rounded-md px-3 py-2 border-slate-200 dark:border-slate-800">
            <span className="text-sm">
              {p.email}
              {p.userId ? <span className="ml-2 muted">({p.userId.slice(0,6)}…)</span> : null}
            </span>
            <button className="btn-ghost" onClick={() => remove(p.id)}>Remover</button>
          </li>
        ))}
        {items.length === 0 && <li className="muted">Nenhum promoter adicionado.</li>}
      </ul>
    </div>
  )
}

