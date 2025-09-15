import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { deleteEvent, updateEvent, getEvent } from '@/lib/data/events'
import { isEventAdmin } from '@/lib/permissions'

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const { userId } = auth()
  if (!userId) return new NextResponse('Unauthorized', { status: 401 })
  const admin = await isEventAdmin(params.id)
  if (!admin) return new NextResponse('Forbidden', { status: 403 })
  await deleteEvent(params.id)
  return NextResponse.json({ ok: true })
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { userId } = auth()
  if (!userId) return new NextResponse('Unauthorized', { status: 401 })
  const admin2 = await isEventAdmin(params.id)
  if (!admin2) return new NextResponse('Forbidden', { status: 403 })
  const body = await req.json().catch(() => ({}))
  const { title, description, location, dateISO, inviteLimit } = body || {}
  // Only event creator can change inviteLimit
  if (typeof inviteLimit !== 'undefined') {
    const ev = await getEvent(params.id)
    if (!ev) return new NextResponse('Not Found', { status: 404 })
    if (ev.createdBy !== userId) return new NextResponse('Forbidden (only creator can change inviteLimit)', { status: 403 })
  }
  const updated = await updateEvent(params.id, { title, description, location, dateISO, inviteLimit })
  return NextResponse.json(updated)
}
