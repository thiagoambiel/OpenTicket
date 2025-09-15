import { NextResponse } from 'next/server'
import { createEvent, listEvents } from '@/lib/data/events'
import { auth } from '@clerk/nextjs/server'
import { isOrganizer } from '@/lib/auth'

export async function GET() {
  const items = await listEvents()
  return NextResponse.json(items)
}

export async function POST(req: Request) {
  const { userId } = auth()
  if (!userId) return new NextResponse('Unauthorized', { status: 401 })
  const organizer = await isOrganizer()
  if (!organizer) return new NextResponse('Forbidden', { status: 403 })
  const body = await req.json()
  const { title, description, location, dateISO, inviteLimit } = body || {}
  if (!title || !dateISO) return new NextResponse('Missing fields', { status: 400 })
  const ev = await createEvent({
    title,
    description,
    location,
    dateISO,
    createdBy: userId,
    inviteLimit: typeof inviteLimit === 'number' ? inviteLimit : undefined,
  })
  return NextResponse.json(ev)
}
