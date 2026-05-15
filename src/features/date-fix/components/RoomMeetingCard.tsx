import { Link } from 'react-router-dom'
import { formatMeetingSummary } from '../lib/formatMeeting'
import type { RoomMeeting } from '../types'

type RoomMeetingCardProps = {
  meeting: RoomMeeting
  roomId: string
  compact?: boolean
  onReschedule?: () => void
  hideDetailLink?: boolean
}

export function RoomMeetingCard({
  meeting,
  roomId,
  compact = false,
  onReschedule,
  hideDetailLink = false,
}: RoomMeetingCardProps) {
  const { dateLine, timeLine } = formatMeetingSummary(meeting)

  return (
    <article
      className={['df-meeting-card', compact ? 'px-4 py-3' : 'px-5 py-4'].join(' ')}
      aria-label={`정해진 약속: ${dateLine}, ${timeLine}`}
    >
      <p className="df-overlap-kicker">약속</p>
      <p className={['font-extrabold text-neutral-900', compact ? 'mt-1 text-base' : 'mt-1 text-lg'].join(' ')}>
        {dateLine}
      </p>
      <p className="mt-0.5 text-sm font-medium text-neutral-600">{timeLine}</p>

      {!compact && (onReschedule || !hideDetailLink) ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {onReschedule ? (
            <button
              type="button"
              onClick={onReschedule}
              className="rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-600 active:bg-neutral-50"
            >
              일정 다시 잡기
            </button>
          ) : null}
          {!hideDetailLink ? (
            <Link
              to={`/room/${roomId}/overlap`}
              className="rounded-full border border-[#55CB9F]/40 bg-white px-3 py-1.5 text-xs font-semibold text-[#3da882] active:bg-neutral-50"
            >
              자세히 보기
            </Link>
          ) : null}
        </div>
      ) : null}
    </article>
  )
}
