import Link from 'next/link'
import { listEvents } from '@/lib/data/events'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export const dynamic = 'force-dynamic'

export default async function Home({ searchParams }: { searchParams?: { q?: string } }) {
  const q = searchParams?.q?.toLowerCase() || ''
  const events = (await listEvents())
    .filter(e => !q || e.title.toLowerCase().includes(q) || (e.description || '').toLowerCase().includes(q))
    .sort((a,b) => a.dateISO.localeCompare(b.dateISO))

  return (
    <div className="space-y-6">
      <section className="flex items-center gap-2">
        <form action="/" className="flex w-full gap-2">
          <input name="q" placeholder="Pesquisar eventos..." className="input" defaultValue={q} />
          <button className="btn-primary" type="submit">Buscar</button>
        </form>
      </section>
      <section className="grid gap-4 md:grid-cols-2">
        {events.length === 0 && (
          <p className="muted">Nenhum evento encontrado.</p>
        )}
        {events.map(ev => (
          <Link key={ev.id} href={`/events/${ev.id}`} className="block card p-0 overflow-hidden hover:ring-2 hover:ring-brand">
            {ev.bannerUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={ev.bannerUrl} alt="Banner do evento" className="w-full h-40 object-cover" />
            ) : null}
            <div className="p-4">
              <h2 className="text-lg font-semibold">{ev.title}</h2>
            {ev.description && <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{ev.description}</p>}
            <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-500 dark:text-slate-400">
              <span>{format(new Date(ev.dateISO), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}</span>
              {ev.location && <span>• {ev.location}</span>}
            </div>
            {/* Sem ações de gestão na página pública */}
            </div>
          </Link>
        ))}
      </section>
    </div>
  )
}
