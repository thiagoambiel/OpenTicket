import { currentUser } from '@clerk/nextjs/server'

// Optional: allow organizer emails without setting metadata
const ORGANIZER_EMAILS = new Set<string>([
  // Add emails of organizadores aqui se desejar
])

export async function requireUser() {
  const user = await currentUser()
  if (!user) throw new Error('Unauthorized')
  return user
}

export async function isOrganizer() {
  const user = await currentUser()
  if (!user) return false
  if (process.env.DEV_ORGANIZER_ALLOW_ALL === 'true') return true
  const role = (user.publicMetadata?.role as string | undefined) || ''
  const email = user.emailAddresses.find(e => e.id === user.primaryEmailAddressId)?.emailAddress
  return role === 'organizer' || (!!email && ORGANIZER_EMAILS.has(email.toLowerCase()))
}

export async function requireOrganizer() {
  const ok = await isOrganizer()
  if (!ok) throw new Error('Forbidden')
}
