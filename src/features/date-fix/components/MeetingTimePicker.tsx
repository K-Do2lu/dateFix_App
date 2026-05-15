import { MEETING_TIME_SLOTS, type MeetingTimeSlot } from '../lib/meetingTimeSlots'

type MeetingTimePickerProps = {
  selectedId: string | null
  onSelect: (slot: MeetingTimeSlot) => void
}

export function MeetingTimePicker({ selectedId, onSelect }: MeetingTimePickerProps) {
  return (
    <fieldset className="mt-5 border-0 p-0">
      <legend className="text-sm font-bold text-neutral-900">몇 시에 만날까요?</legend>
      <p className="mt-1 text-xs text-neutral-500">원하는 시간대를 골라 주세요.</p>
      <ul className="mt-3 grid grid-cols-2 gap-2">
        {MEETING_TIME_SLOTS.map((slot) => {
          const selected = selectedId === slot.id
          return (
            <li key={slot.id}>
              <button
                type="button"
                className="df-time-chip"
                aria-pressed={selected}
                onClick={() => onSelect(slot)}
              >
                <span className={['text-sm font-bold', selected ? 'text-[#3da882]' : 'text-neutral-800'].join(' ')}>
                  {slot.label}
                </span>
                <span className="mt-0.5 text-xs font-medium text-neutral-500">{slot.range}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </fieldset>
  )
}
