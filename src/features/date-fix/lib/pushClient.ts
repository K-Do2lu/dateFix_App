import { fetchVapidPublicKey, savePushSubscription } from './pushApi'
import type { PushSubscriptionJSON } from '../types'

const PUSH_OK_KEY = (roomId: string) => `datefix:push-ok:${roomId}`

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const raw = atob(base64)
  const output = new Uint8Array(raw.length)
  for (let i = 0; i < raw.length; i += 1) {
    output[i] = raw.charCodeAt(i)
  }
  return output
}

function subscriptionToJson(sub: PushSubscription): PushSubscriptionJSON {
  const json = sub.toJSON()
  if (!json.endpoint || !json.keys?.p256dh || !json.keys?.auth) {
    throw new Error('Invalid push subscription')
  }
  return {
    endpoint: json.endpoint,
    keys: { p256dh: json.keys.p256dh, auth: json.keys.auth },
    expirationTime: json.expirationTime ?? null,
  }
}

export function isPushSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    'Notification' in window &&
    'serviceWorker' in navigator &&
    'PushManager' in window
  )
}

export function getPushPermission(): NotificationPermission | 'unsupported' {
  if (!isPushSupported()) {
    return 'unsupported'
  }
  return Notification.permission
}

export async function subscribeRoomPush(
  roomId: string,
  participantId: string,
): Promise<'granted' | 'denied' | 'unsupported' | 'disabled'> {
  if (!isPushSupported()) {
    return 'unsupported'
  }

  const vapid = await fetchVapidPublicKey()
  if (!vapid.enabled || !vapid.publicKey) {
    return 'disabled'
  }

  const permission = await Notification.requestPermission()
  if (permission !== 'granted') {
    return 'denied'
  }

  const registration = await navigator.serviceWorker.ready
  let subscription = await registration.pushManager.getSubscription()

  if (!subscription) {
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapid.publicKey) as BufferSource,
    })
  }

  await savePushSubscription(roomId, participantId, subscriptionToJson(subscription))
  localStorage.setItem(PUSH_OK_KEY(roomId), '1')
  return 'granted'
}

export function hasRoomPushEnabled(roomId: string): boolean {
  return localStorage.getItem(PUSH_OK_KEY(roomId)) === '1'
}
