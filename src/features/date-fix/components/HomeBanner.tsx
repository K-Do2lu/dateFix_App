import { CloverLogo } from '../../../components/brand/CloverLogo'
import { Mascot } from '../../../components/brand/Mascot'
import { useAppGuide } from '../context/AppGuideContext'

export function HomeBanner() {
  const { openGuide } = useAppGuide()
  return (
    <header className="px-5 pb-2 pt-[max(1.25rem,env(safe-area-inset-top))]">
      <div className="relative overflow-hidden rounded-[1.75rem] border border-white/90 bg-gradient-to-b from-white via-white to-[#f8fffb] px-5 py-6 shadow-[0_8px_28px_-10px_rgba(85,203,159,0.2)]">
        <div className="pointer-events-none absolute -right-6 -top-6 size-28 rounded-full bg-[#55CB9F]/12" />
        <div className="pointer-events-none absolute -bottom-8 -left-4 size-24 rounded-full bg-[#ffd6e8]/30" />

        <div className="relative flex items-end justify-between gap-3">
          <div className="min-w-0 flex-1 pb-1">
            <div className="flex items-center gap-2">
              <CloverLogo size="sm" />
              <span className="cute-pill px-3 py-1 text-xs font-extrabold text-[#3da882]">
                Date Fix
              </span>
            </div>
            <h1 className="mt-4 text-[1.65rem] font-extrabold leading-[1.25] tracking-tight text-neutral-900">
              우리 날짜를
              <br />
              <span className="text-[#3da882]">정해보자</span>
            </h1>
            <p className="mt-2.5 max-w-[15rem] text-sm leading-relaxed text-neutral-500">
              친구들과 가능한 날을 맞춰 보세요.
            </p>
            <button
              type="button"
              onClick={openGuide}
              className="mt-3 rounded-full border border-[#55CB9F]/35 bg-white px-3.5 py-1.5 text-xs font-bold text-[#3da882] shadow-sm active:scale-[0.98]"
            >
              가이드
            </button>
          </div>
          <Mascot size="md" className="shrink-0 -mr-1 -mb-1 w-20 opacity-95" />
        </div>
      </div>
    </header>
  )
}
