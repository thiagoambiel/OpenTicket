import { requireUser } from '@/lib/auth'
import { listInvitesForEmail } from '@/lib/data/invites'
import { getEvent } from '@/lib/data/events'
import Link from 'next/link'

export default async function Page() {
  const user = await requireUser()
  const email = user.emailAddresses.find(e => e.id === user.primaryEmailAddressId)?.emailAddress
  if (!email) {
    return <p className="muted">Conta sem e-mail principal.</p>
  }
  const invites = await listInvitesForEmail(email)
  const eventsMap = new Map<string, string>()
  for (const inv of invites) {
    if (!eventsMap.has(inv.eventId)) {
      const ev = await getEvent(inv.eventId)
      eventsMap.set(inv.eventId, ev?.title || 'Evento')
    }
  }
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Meus convites</h1>
      {invites.length === 0 && <p className="muted">Você ainda não possui convites.</p>}
      <ul className="space-y-3">
        {invites.map(inv => (
          <li key={inv.code} className="card p-4 flex items-center justify-between">
            <div>
              <p className="font-medium">{eventsMap.get(inv.eventId)}</p>
              {inv.nickname && <p className="text-sm text-slate-500 dark:text-slate-400">Apelido: “{inv.nickname}”</p>}
              <p className="muted">Código: {inv.code}</p>
            </div>
            <Link className="btn-primary" href={`/tickets/${inv.code}`}>Ver convite</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

