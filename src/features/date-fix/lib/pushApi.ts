import type { PushSubscriptionJSON } from '../types'

const API_BASE = import.meta.env.VITE_API_URL ?? ''

export type PushNotifyKind = 'overlap_scheduling' | 'meeting_confirmed'

export async function fetchVapidPublicKey(): Promise<{
  enabled: boolean
  publicKey?: string
}> {
  const res = await fetch(`${API_BASE}/api/push/vapid-public-key`)
  if (!res.ok) {
    return { enabled: false }
  }
  return res.json() as Promise<{ enabled: boolean; publicKey?: string }>
}

export async function savePushSubscription(
  roomId: string,
  participantId: string,
  subscription: PushSubscriptionJSON,
): Promise<void> {
  const res = await fetch(`${API_BASE}/api/rooms/${roomId}/push/subscribe`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ participantId, subscription }),
  })
  if (!res.ok) {
    throw new Error('Failed to save push subscription')
  }
}

export async function notifyRoomPush(
  roomId: string,
  participantId: string,
  kind: PushNotifyKind,
  body?: string,
): Promise<void> {
  const res = await fetch(`${API_BASE}/api/rooms/${roomId}/push/notify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ participantId, kind, body }),
  })
  if (!res.ok) {
    throw new Error('Failed to notify room')
  }
}
