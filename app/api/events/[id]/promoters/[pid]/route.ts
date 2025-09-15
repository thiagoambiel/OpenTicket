import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { isEventAdmin } from '@/lib/permissions'
import { removePromoter } from '@/lib/data/promoters'

export async function DELETE(_req: Request, { params }: { params: { id: string; pid: string } }) {
  const { userId } = auth()
  if (!userId) return new NextResponse('Unauthorized', { status: 401 })
  const admin = await isEventAdmin(params.id)
  if (!admin) return new NextResponse('Forbidden', { status: 403 })
  await removePromoter(params.pid)
  return NextResponse.json({ ok: true })
}

