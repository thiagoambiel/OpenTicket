"use client"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { Event as EvType } from '@/types'
import DeleteEventButton from './DeleteEventButton'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

type Props = {
  ev: EvType
}

export default function OrganizerEventCard({ ev }: Props) {
  const router = useRouter()

  function goToEdit() {
    router.push(`/organizer/events/${ev.id}/edit`)
  }

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={goToEdit}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); goToEdit() } }}
      className="card p-0 overflow-hidden cursor-pointer"
    >
      {ev.bannerUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={ev.bannerUrl} alt="Banner do evento" className="w-full h-32 object-cover" />
      ) : null}
      <div className="p-4">
        <h2 className="text-lg font-semibold">{ev.title}</h2>
        {ev.description && <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{ev.description}</p>}
        <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-500 dark:text-slate-400">
          <span>{format(new Date(ev.dateISO), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}</span>
          {ev.location && <span>• {ev.location}</span>}
        </div>
        <div
          className="mt-4 flex gap-2"
          // Prevent parent card click when using action buttons/links
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <Link href={`/organizer/events/${ev.id}/invites`} className="btn-ghost">Convites</Link>
          <Link href={`/organizer/events/${ev.id}/edit`} className="btn-ghost">Editar</Link>
          <DeleteEventButton id={ev.id} />
        </div>
      </div>
    </article>
  )
}

