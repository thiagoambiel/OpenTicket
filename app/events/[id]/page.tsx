import { notFound } from 'next/navigation'
import { getEvent } from '@/lib/data/events'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: { id: string } }) {
  const ev = await getEvent(params.id)
  if (!ev) return { title: 'Evento não encontrado' }
  const date = new Date(ev.dateISO)
  const when = format(date, "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })
  return {
    title: `${ev.title} — Open Ticket`,
    description: `${ev.description ? ev.description.slice(0, 150) : 'Evento'} • ${when}${ev.location ? ` • ${ev.location}` : ''}`,
    openGraph: {
      title: ev.title,
      description: ev.description || undefined,
      images: ev.bannerUrl ? [{ url: ev.bannerUrl }] : undefined,
    },
  }
}

export default async function Page({ params }: { params: { id: string } }) {
  const ev = await getEvent(params.id)
  if (!ev) notFound()
  const date = new Date(ev.dateISO)
  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div className="card overflow-hidden">
        {ev.bannerUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={ev.bannerUrl} alt={`Banner do evento ${ev.title}`} className="w-full h-56 object-cover" />
        ) : null}
        <div className="p-4">
          <h1 className="text-2xl font-semibold">{ev.title}</h1>
          <div className="mt-2 flex flex-wrap gap-3 text-sm text-slate-500 dark:text-slate-400">
            <span>{format(date, "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}</span>
            {ev.location && <span>• {ev.location}</span>}
          </div>
          {ev.description && <p className="mt-3 text-slate-700 dark:text-slate-300 whitespace-pre-line">{ev.description}</p>}
          <div className="mt-4 flex gap-2">
            <Link className="btn-ghost" href="/">Voltar</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
