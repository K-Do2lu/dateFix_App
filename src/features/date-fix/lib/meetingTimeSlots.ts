export type MeetingTimeSlot = {
  id: string
  label: string
  range: string
}

export const MEETING_TIME_SLOTS: MeetingTimeSlot[] = [
  { id: 'morning', label: '오전', range: '10:00 – 12:00' },
  { id: 'lunch', label: '점심', range: '12:00 – 14:00' },
  { id: 'afternoon', label: '오후', range: '14:00 – 17:00' },
  { id: 'evening', label: '저녁', range: '18:00 – 20:00' },
  { id: 'night', label: '밤', range: '20:00 – 22:00' },
]

export function getMeetingTimeSlot(id: string): MeetingTimeSlot | undefined {
  return MEETING_TIME_SLOTS.find((s) => s.id === id)
}
