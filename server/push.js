import webpush from 'web-push'

export function isPushConfigured() {
  return Boolean(
    process.env.VAPID_PUBLIC_KEY &&
      process.env.VAPID_PRIVATE_KEY &&
      process.env.VAPID_SUBJECT,
  )
}

export function configureWebPush() {
  if (!isPushConfigured()) {
    return false
  }
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT,
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY,
  )
  return true
}

/**
 * @param {import('web-push').PushSubscription} subscription
 * @param {{ title: string; body: string; url?: string; tag?: string }} payload
 */
export async function sendPushNotification(subscription, payload) {
  if (!configureWebPush()) {
    return
  }
  await webpush.sendNotification(
    subscription,
    JSON.stringify({
      title: payload.title,
      body: payload.body,
      url: payload.url ?? '/',
      tag: payload.tag ?? 'datefix',
    }),
  )
}

/**
 * @param {import('../src/features/date-fix/types.js').RoomBundle} bundle
 * @param {string} excludeParticipantId
 * @param {{ title: string; body: string; url?: string; tag?: string }} payload
 */
export async function notifyRoomExcept(bundle, excludeParticipantId, payload) {
  if (!configureWebPush()) {
    return { sent: 0, skipped: true }
  }

  let sent = 0
  const roomUrl = `/room/${bundle.room.id}`

  for (const [id, participant] of Object.entries(bundle.participants)) {
    if (id === excludeParticipantId || !participant.pushSubscription) {
      continue
    }
    try {
      await sendPushNotification(participant.pushSubscription, {
        ...payload,
        url: payload.url ?? roomUrl,
      })
      sent += 1
    } catch (err) {
      console.warn('[push] failed for participant', id, err?.statusCode ?? err?.message)
    }
  }

  return { sent, skipped: false }
}
