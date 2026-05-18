export type RoomMeeting = {
  date: string
  timeSlotId: string
  confirmedAt: number
}

export type Room = {
  id: string
  title: string
  candidateDates: string[]
  createdAt: number
  meeting?: RoomMeeting | null
}

export type PushSubscriptionJSON = {
  endpoint: string
  keys: {
    p256dh: string
    auth: string
  }
  expirationTime?: number | null
}

export type Participant = {
  id: string
  name: string
  availableDates: string[]
  pushSubscription?: PushSubscriptionJSON | null
}

export type RoomBundle = {
  room: Room
  participants: Record<string, Participant>
}

export type LocalProfile = {
  participantId: string
  name: string
}

export type RoomListItem = {
  id: string
  title: string
  createdAt: number
  participantCount: number
  candidateDayCount: number
  meeting: RoomMeeting | null
}
