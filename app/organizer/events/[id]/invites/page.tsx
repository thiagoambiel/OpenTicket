import { requireUser } from '@/lib/auth'
import { getEvent } from '@/lib/data/events'
import { notFound, redirect } from 'next/navigation'
import InviteGenerator from './ui/InviteGenerator'
import BannerUpload from './ui/BannerUpload'
import Link from 'next/link'
import DeleteEventButton from '@/components/DeleteEventButton'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { canGenerateInvites, isEventAdmin } from '@/lib/permissions'
import PromotersManager from './ui/PromotersManager'

export default async function Page({ params }: { params: { id: string } }) {
  await requireUser()
  const ev = await getEvent(params.id)
  if (!ev) notFound()
  const allowed = await canGenerateInvites(params.id)
  if (!allowed) redirect('/')
  const admin = await isEventAdmin(params.id)
  return (
    <div className="space-y-6">
      <div className="card p-4">
        {ev.bannerUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={ev.bannerUrl} alt="Banner" className="w-full h-48 object-cover rounded-md mb-3" />
        ) : null}
        <h1 className="text-xl font-semibold">{ev.title}</h1>
        <p className="muted">{format(new Date(ev.dateISO), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}</p>
        <div className="mt-2 flex gap-2">
          <Link href="/organizer/events" className="btn-ghost">Voltar</Link>
          {admin && <Link href={`/organizer/events/${ev.id}/edit`} className="btn-ghost">Editar</Link>}
          {admin && <DeleteEventButton id={ev.id} />}
        </div>
      </div>
      {admin && <BannerUpload eventId={ev.id} currentUrl={ev.bannerUrl} />}
      {admin && <PromotersManager eventId={ev.id} />}
      <InviteGenerator eventId={ev.id} />
    </div>
  )
}
