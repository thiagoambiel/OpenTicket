import { isOrganizer, requireUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import NewEventForm from './ui/NewEventForm'

export default async function Page() {
  await requireUser()
  const ok = await isOrganizer()
  if (!ok) redirect('/')
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Criar novo evento</h1>
      <NewEventForm />
    </div>
  )
}

