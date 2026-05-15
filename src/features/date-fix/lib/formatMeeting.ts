import { formatDateLabel } from './dates'
import { getMeetingTimeSlot } from './meetingTimeSlots'
import type { RoomMeeting } from '../types'

export function formatMeetingSummary(meeting: RoomMeeting): {
  dateLine: string
  timeLine: string
} {
  const slot = getMeetingTimeSlot(meeting.timeSlotId)
  return {
    dateLine: formatDateLabel(meeting.date),
    timeLine: slot ? `${slot.label} · ${slot.range}` : meeting.timeSlotId,
  }
}

export function formatMeetingListLine(meeting: RoomMeeting): string {
  const { dateLine, timeLine } = formatMeetingSummary(meeting)
  return `${dateLine} · ${timeLine}`
}
