import { CuteButton } from '../../../components/ui/CuteButton'
import { formatDateLabel } from '../lib/dates'
import { MeetingTimePicker } from './MeetingTimePicker'
import type { MeetingTimeSlot } from '../lib/meetingTimeSlots'

type OverlapDateConfirmProps = {
  overlapDates: string[]
  selectedDate: string | null
  selectedTimeId: string | null
  confirming: boolean
  confirmError: string | null
  onSelectDate: (iso: string) => void
  onSelectTime: (slot: MeetingTimeSlot) => void
  onChangeDate: () => void
  onConfirm: () => void
}

export function OverlapDateConfirm({
  overlapDates,
  selectedDate,
  selectedTimeId,
  confirming,
  confirmError,
  onSelectDate,
  onSelectTime,
  onChangeDate,
  onConfirm,
}: OverlapDateConfirmProps) {
  const showTimeStep = Boolean(selectedDate)
  const canConfirm = Boolean(selectedDate && selectedTimeId)

  return (
    <section className="df-overlap-panel px-5 py-5" aria-labelledby="overlap-pick-title">
      <p id="overlap-pick-title" className="df-overlap-kicker">
        Step {showTimeStep ? '2' : '1'}
      </p>
      <h2 className="mt-1 text-base font-bold text-neutral-900">
        {showTimeStep ? '시간 정하기' : '만날 날 고르기'}
      </h2>
      <p className="mt-1 text-xs leading-relaxed text-neutral-500">
        {showTimeStep
          ? '날짜는 정했어요. 이제 시간만 골라 주세요.'
          : '모두 가능한 날 중 하나를 선택해 주세요.'}
      </p>

      {!showTimeStep ? (
        <ul className="mt-4 flex flex-wrap gap-2" role="group" aria-label="겹치는 날짜 목록">
          {overlapDates.map((d) => (
            <li key={d}>
              <button
                type="button"
                className="df-date-chip"
                aria-pressed={selectedDate === d}
                onClick={() => onSelectDate(d)}
              >
                {formatDateLabel(d)}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <>
          <div
            className="mt-4 rounded-2xl border border-neutral-100 bg-neutral-50 px-4 py-4"
            role="status"
          >
            <div className="flex items-start gap-3">
              <span
                className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#55CB9F] text-sm font-bold text-white"
                aria-hidden
              >
                ✓
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-neutral-500">선택한 날</p>
                <p className="mt-0.5 text-base font-extrabold text-neutral-900">
                  {formatDateLabel(selectedDate!)}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onChangeDate}
              className="mt-3 text-xs font-semibold text-neutral-500 underline-offset-2 hover:text-neutral-800 focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#55CB9F]"
            >
              날짜 다시 고르기
            </button>
          </div>

          <MeetingTimePicker selectedId={selectedTimeId} onSelect={onSelectTime} />

          {confirmError ? (
            <p
              className="mt-3 rounded-xl bg-[#fff0f0] px-3 py-2 text-sm font-medium text-red-600"
              role="alert"
            >
              {confirmError}
            </p>
          ) : null}

          <CuteButton
            type="button"
            fullWidth
            size="lg"
            className="mt-4"
            disabled={!canConfirm || confirming}
            onClick={onConfirm}
          >
            {confirming ? '저장 중…' : '약속 확정하기'}
          </CuteButton>
        </>
      )}
    </section>
  )
}
