import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { isEventAdmin } from '@/lib/permissions'
import { addPromoter, listPromoters } from '@/lib/data/promoters'

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const { userId } = auth()
  if (!userId) return new NextResponse('Unauthorized', { status: 401 })
  const admin = await isEventAdmin(params.id)
  if (!admin) return new NextResponse('Forbidden', { status: 403 })
  const items = await listPromoters(params.id)
  return NextResponse.json({ promoters: items })
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const { userId } = auth()
  if (!userId) return new NextResponse('Unauthorized', { status: 401 })
  const admin = await isEventAdmin(params.id)
  if (!admin) return new NextResponse('Forbidden', { status: 403 })
  const body = await req.json().catch(() => ({}))
  const email = String(body?.email || '').toLowerCase()
  if (!email) return new NextResponse('Missing email', { status: 400 })
  const promoter = await addPromoter(params.id, email)
  return NextResponse.json(promoter)
}

