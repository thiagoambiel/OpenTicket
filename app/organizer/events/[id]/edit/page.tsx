import { requireUser } from '@/lib/auth'
import { getEvent } from '@/lib/data/events'
import { notFound, redirect } from 'next/navigation'
import EditEventForm from './ui/EditEventForm'
import BannerUpload from '../invites/ui/BannerUpload'
import { isEventAdmin } from '@/lib/permissions'

export default async function Page({ params }: { params: { id: string } }) {
  const user = await requireUser()
  const ok = await isEventAdmin(params.id)
  if (!ok) redirect('/')
  const ev = await getEvent(params.id)
  if (!ev) notFound()
  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <h1 className="text-2xl font-semibold mb-4">Editar evento</h1>
      <BannerUpload eventId={ev.id} currentUrl={ev.bannerUrl} />
      <EditEventForm ev={ev} isCreator={ev.createdBy === user.id} />
    </div>
  )
}
