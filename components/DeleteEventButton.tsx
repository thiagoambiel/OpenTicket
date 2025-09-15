"use client"
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function DeleteEventButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function onDelete() {
    if (!confirm('Tem certeza que deseja excluir este evento? Essa ação não pode ser desfeita.')) return
    setLoading(true)
    try {
      const res = await fetch(`/api/events/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error(await res.text())
      router.push('/')
    } catch (e) {
      alert('Falha ao excluir evento')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button className="btn-ghost" onClick={onDelete} disabled={loading}>
      {loading ? 'Excluindo...' : 'Excluir evento'}
    </button>
  )
}

