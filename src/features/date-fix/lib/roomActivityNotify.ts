import { formatMeetingSummary } from './formatMeeting'
import { notifyRoomPush } from './pushApi'
import type { RoomMeeting } from '../types'

const overlapNotifyKey = (roomId: string, participantId: string) =>
  `datefix:overlap-notify:${roomId}:${participantId}`

/** 같은 방에서 짧은 시간 중복 알림 방지 (10분) */
function shouldSendOverlapNotify(roomId: string, participantId: string): boolean {
  const key = overlapNotifyKey(roomId, participantId)
  const last = sessionStorage.getItem(key)
  const now = Date.now()
  if (last && now - Number(last) < 10 * 60 * 1000) {
    return false
  }
  sessionStorage.setItem(key, String(now))
  return true
}

export function notifyFriendsOverlapScheduling(
  roomId: string,
  participantId: string,
  actorName: string,
): void {
  if (!shouldSendOverlapNotify(roomId, participantId)) {
    return
  }
  void notifyRoomPush(
    roomId,
    participantId,
    'overlap_scheduling',
    `${actorName}님이 만날 날을 정하고 있어요`,
  ).catch(() => {
    /* 알림 실패는 앱 흐름을 막지 않음 */
  })
}

export function notifyFriendsMeetingConfirmed(
  roomId: string,
  participantId: string,
  actorName: string,
  meeting: RoomMeeting,
): void {
  const { dateLine, timeLine } = formatMeetingSummary(meeting)
  void notifyRoomPush(
    roomId,
    participantId,
    'meeting_confirmed',
    `${actorName}님이 ${dateLine} ${timeLine} 약속을 정했어요`,
  ).catch(() => {
    /* ignore */
  })
}
