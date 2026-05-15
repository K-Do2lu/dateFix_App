import { Mascot } from '../../../components/brand/Mascot'
import { CuteButtonLink } from '../../../components/ui/CuteButtonLink'
import { formatMeetingSummary } from '../lib/formatMeeting'
import type { RoomMeeting } from '../types'

type MeetingCelebrationProps = {
  meeting: RoomMeeting
}

export function MeetingCelebration({ meeting }: MeetingCelebrationProps) {
  const { dateLine, timeLine } = formatMeetingSummary(meeting)

  return (
    <section
      className="meeting-celebrate-shell flex flex-col items-center px-2 py-8 text-center"
      aria-live="polite"
      aria-labelledby="celebrate-title"
    >
      <p className="meeting-pop-yaho text-4xl font-black tracking-tight text-neutral-900" aria-hidden>
        야호<span className="text-[#55CB9F]">~</span>!
      </p>
      <div className="meeting-celebrate-mascot mt-4">
        <Mascot size="lg" className="mx-auto w-28" />
      </div>
      <h2 id="celebrate-title" className="meeting-celebrate-title mt-5 text-2xl font-extrabold text-neutral-900">
        약속이 정해졌어요!
      </h2>
      <p className="mt-2 text-sm text-neutral-500">친구들과 만날 준비가 끝났어요</p>

      <div className="df-meeting-card mt-6 w-full px-5 py-5 text-left">
        <p className="df-overlap-kicker">우리의 약속</p>
        <p className="mt-1 text-lg font-extrabold text-neutral-900">{dateLine}</p>
        <p className="mt-0.5 text-sm font-medium text-neutral-600">{timeLine}</p>
      </div>

      <CuteButtonLink to="/" variant="accent" size="lg" className="meeting-celebrate-cta mt-8">
        메인으로 돌아가기
      </CuteButtonLink>
    </section>
  )
}
