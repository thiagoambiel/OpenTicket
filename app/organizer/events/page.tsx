import { requireUser, isOrganizer } from '@/lib/auth'
import { listEventsForUser, listEventsForPromoter } from '@/lib/data/events'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import OrganizerEventCard from '@/components/OrganizerEventCard'

export default async function Page() {
  const user = await requireUser()
  const canCreate = await isOrganizer()
  const email = user.emailAddresses.find(e => e.id === user.primaryEmailAddressId)?.emailAddress || null
  const adminItems = await listEventsForUser(user.id)
  const promoterItemsRaw = await listEventsForPromoter(user.id, email)
  // evitar duplicação se o criador também estiver listado como promoter
  const adminIds = new Set(adminItems.map(e => e.id))
  const promoterItems = promoterItemsRaw.filter(e => !adminIds.has(e.id))
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Meus eventos</h1>
        <div className="flex gap-2">
          {canCreate && <Link href="/organizer/check-in" className="btn-ghost">Check-in</Link>}
          {canCreate && <Link href="/organizer/events/new" className="btn-primary">Criar novo evento</Link>}
        </div>
      </div>
      {adminItems.length === 0 && <p className="muted">Você ainda não criou eventos.</p>}
      <div className="grid gap-4 md:grid-cols-2">
        {adminItems.map(ev => (
          <OrganizerEventCard key={ev.id} ev={ev} />
        ))}
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-semibold">Eventos como promoter</h2>
        {promoterItems.length === 0 && <p className="muted">Nenhum evento como promoter.</p>}
        <div className="grid gap-4 md:grid-cols-2 mt-2">
          {promoterItems.map(ev => (
            <article key={ev.id} className="card p-0 overflow-hidden">
              {ev.bannerUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={ev.bannerUrl} alt="Banner do evento" className="w-full h-32 object-cover" />
              ) : null}
              <div className="p-4">
                <h3 className="font-semibold">{ev.title}</h3>
                <div className="mt-2 flex flex-wrap gap-3 text-sm text-slate-500 dark:text-slate-400">
                  <span>{format(new Date(ev.dateISO), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}</span>
                  {ev.location && <span>• {ev.location}</span>}
                </div>
                <div className="mt-3 flex gap-2">
                  <Link href={`/organizer/events/${ev.id}/invites`} className="btn-ghost">Gerar convites</Link>
                  <Link href={`/events/${ev.id}`} className="btn-ghost">Ver público</Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
