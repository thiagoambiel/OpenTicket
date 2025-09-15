import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { isEventAdmin } from '@/lib/permissions'
import path from 'path'
import { promises as fs } from 'fs'
import { updateEventBanner } from '@/lib/data/events'

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const { userId } = auth()
  if (!userId) return new NextResponse('Unauthorized', { status: 401 })
  const admin = await isEventAdmin(params.id)
  if (!admin) return new NextResponse('Forbidden', { status: 403 })

  const form = await req.formData()
  const file = form.get('file') as File | null
  if (!file) return new NextResponse('Missing file', { status: 400 })
  const allowed = new Set(['image/png', 'image/jpeg', 'image/webp'])
  if (!allowed.has(file.type)) return new NextResponse('Unsupported type', { status: 415 })

  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  const ext = file.name.split('.').pop()?.toLowerCase() || 'png'
  const base = `${params.id}-${Date.now()}.${ext}`
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
  await fs.mkdir(uploadsDir, { recursive: true })
  const outPath = path.join(uploadsDir, base)
  await fs.writeFile(outPath, buffer)
  const publicUrl = `/uploads/${base}`

  const ev = await updateEventBanner(params.id, publicUrl)
  return NextResponse.json({ ok: true, bannerUrl: publicUrl, event: ev })
}
