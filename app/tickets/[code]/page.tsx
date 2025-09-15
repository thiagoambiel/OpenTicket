import { requireUser } from '@/lib/auth'
import { getInviteByCode } from '@/lib/data/invites'
import { getEvent } from '@/lib/data/events'
import QRCode from 'react-qr-code'
import { notFound } from 'next/navigation'

export default async function Page({ params }: { params: { code: string } }) {
  const user = await requireUser()
  const email = user.emailAddresses.find(e => e.id === user.primaryEmailAddressId)?.emailAddress?.toLowerCase()
  const inv = await getInviteByCode(params.code)
  if (!inv) notFound()
  // Apenas o dono pode visualizar (via e-mail)
  if (!email || inv.recipientEmail.toLowerCase() !== email) notFound()
  const ev = await getEvent(inv.eventId)
  return (
    <div className="max-w-md mx-auto space-y-4">
      <div className="card p-4 text-center">
        <h1 className="text-xl font-semibold">{ev?.title || 'Convite'}</h1>
        {inv.nickname && <p className="text-sm text-slate-500 dark:text-slate-400">Apelido: “{inv.nickname}”</p>}
      </div>
      <div className="card p-6 flex justify-center">
        <div className="bg-white p-4 rounded-md">
          {/* QR com o código do convite */}
          {/* Em produção você pode embutir um payload assinado */}
          <QRCode value={inv.code} size={220} />
        </div>
      </div>
      <div className="card p-4">
        <p className="muted">Código: {inv.code}</p>
      </div>
    </div>
  )
}

