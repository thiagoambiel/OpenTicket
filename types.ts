export type Event = {
  id: string
  title: string
  description?: string
  location?: string
  dateISO: string
  bannerUrl?: string
  inviteLimit?: number | null
  createdBy: string
  createdAt: string
  updatedAt: string
}

export type Invite = {
  code: string
  eventId: string
  recipientEmail: string
  recipientId?: string
  nickname?: string
  status: 'issued' | 'used' | 'cancelled'
  createdAt: string
}
