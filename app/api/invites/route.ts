import { NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import { listInvitesForEmail } from '@/lib/data/invites'

export async function GET() {
  const { userId } = auth()
  if (!userId) return new NextResponse('Unauthorized', { status: 401 })
  const user = await currentUser()
  const email = user?.emailAddresses.find(e => e.id === user.primaryEmailAddressId)?.emailAddress
  if (!email) return new NextResponse('No email', { status: 400 })
  const invites = await listInvitesForEmail(email)
  return NextResponse.json(invites)
}

