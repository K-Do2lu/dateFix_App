import { CloverLogo } from '../../../../components/brand/CloverLogo'
import { Mascot } from '../../../../components/brand/Mascot'
import type { GuideStepId } from '../../lib/guideSteps'

export function GuideStepVisual({ stepId }: { stepId: GuideStepId }) {
  return (
    <div className="flex h-44 w-full items-center justify-center rounded-2xl border border-neutral-100 bg-gradient-to-b from-neutral-50 to-white">
      {stepId === 'welcome' && <Mascot size="lg" className="w-32" />}
      {stepId === 'invite' && <InviteVisual />}
      {stepId === 'pick' && <PickVisual />}
      {stepId === 'overlap' && <OverlapVisual />}
      {stepId === 'celebrate' && <CelebrateVisual />}
    </div>
  )
}

function InviteVisual() {
  return (
    <div className="flex flex-col items-center gap-3 px-6">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-white text-3xl shadow-sm">
        🔗
      </div>
      <div className="w-full max-w-[12rem] rounded-xl bg-white px-3 py-2 text-center text-[11px] text-neutral-500 shadow-sm">
        datefix.app/room/···
      </div>
      <p className="text-xs font-medium text-[#3da882]">친구에게 링크 보내기</p>
    </div>
  )
}

function PickVisual() {
  return (
    <div className="flex items-center gap-4">
      <CloverLogo size="lg" />
      <div className="grid grid-cols-3 gap-1.5">
        {[false, true, false, true, true, false].map((on, i) => (
          <span
            key={i}
            className={['size-7 rounded-lg', on ? 'bg-[#55CB9F] shadow-sm' : 'bg-white ring-1 ring-neutral-100'].join(' ')}
          />
        ))}
      </div>
    </div>
  )
}

function OverlapVisual() {
  return (
    <div className="flex flex-col items-center gap-3 px-4">
      <div className="flex flex-wrap justify-center gap-2">
        {['5/18 (토)', '5/20 (월)'].map((d, i) => (
          <span
            key={d}
            className={[
              'rounded-full border bg-white px-3 py-1.5 text-[11px] font-semibold shadow-sm',
              i === 0
                ? 'border-[#55CB9F] text-neutral-900 ring-2 ring-[#55CB9F]/30'
                : 'border-neutral-200 text-neutral-600',
            ].join(' ')}
          >
            {d}
          </span>
        ))}
      </div>
      <p className="text-xs font-medium text-neutral-500">겹치는 날 중 하나 선택</p>
    </div>
  )
}

function CelebrateVisual() {
  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-3xl font-black text-neutral-900">
        야호<span className="text-[#55CB9F]">~</span>!
      </p>
      <div className="df-meeting-card mt-1 w-full max-w-[11rem] px-3 py-2.5 text-left">
        <p className="text-[10px] font-bold uppercase tracking-wide text-[#3da882]">약속</p>
        <p className="text-xs font-extrabold text-neutral-900">5월 18일 (토)</p>
        <p className="text-[10px] font-medium text-neutral-500">오후 · 14:00 – 17:00</p>
      </div>
    </div>
  )
}
