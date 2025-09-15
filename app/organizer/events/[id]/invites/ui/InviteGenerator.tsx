"use client"
import { useState } from 'react'

type Row = { email: string; nickname?: string }

export default function InviteGenerator({ eventId }: { eventId: string }) {
  const [rows, setRows] = useState<Row[]>([{ email: '', nickname: '' }])
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<Array<{ code: string; email: string; nickname?: string }>>([])
  const [error, setError] = useState<string | null>(null)

  function updateRow(i: number, patch: Partial<Row>) {
    setRows(prev => prev.map((r, idx) => idx === i ? { ...r, ...patch } : r))
  }
  function addRow() {
    setRows(prev => [...prev, { email: '', nickname: '' }])
  }
  function removeRow(i: number) {
    setRows(prev => prev.filter((_, idx) => idx !== i))
  }

  async function generate() {
    setLoading(true)
    setError(null)
    setResult([])
    try {
      const payload = { invites: rows.filter(r => r.email.trim().length > 0) }
      const res = await fetch(`/api/events/${eventId}/invites`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      setResult(data.invites)
    } catch (e: any) {
      setError(e.message || 'Erro ao gerar convites')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card p-4">
      <h2 className="text-lg font-semibold mb-3">Gerar convites</h2>
      <div className="space-y-3">
        {rows.map((r, i) => (
          <div key={i} className="flex gap-2 items-center">
            <input
              className="input"
              placeholder="Email do convidado"
              value={r.email}
              onChange={e => updateRow(i, { email: e.target.value })}
              type="email"
            />
            <input
              className="input"
              placeholder="Apelido (opcional)"
              value={r.nickname || ''}
              onChange={e => updateRow(i, { nickname: e.target.value })}
            />
            <button className="btn-ghost" onClick={() => removeRow(i)} title="Remover">Remover</button>
          </div>
        ))}
        <div className="flex gap-2">
          <button className="btn-ghost" onClick={addRow}>Adicionar</button>
          <button className="btn-primary" onClick={generate} disabled={loading}>{loading ? 'Gerando...' : 'Gerar convites'}</button>
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        {result.length > 0 && (
          <div className="mt-4">
            <h3 className="font-medium mb-2">Convites gerados</h3>
            <ul className="space-y-2">
              {result.map((r, idx) => (
                <li key={idx} className="text-sm">
                  <span className="font-semibold">{r.email}</span>
                  {r.nickname ? <span> — “{r.nickname}”</span> : null}
                  <span className="ml-2 text-slate-500">Código: {r.code}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

