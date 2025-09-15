import { isOrganizer, requireUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import CheckInvite from './ui/CheckInvite'

export default async function Page() {
  await requireUser()
  const ok = await isOrganizer()
  if (!ok) redirect('/')
  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <h1 className="text-2xl font-semibold">Checagem de Convite</h1>
      <p className="muted">Digite o código do QR (ou use um leitor que insere como teclado) para verificar e confirmar a entrada.</p>
      <CheckInvite />
    </div>
  )
}

