import { useMemo } from 'react'
import {
  getMonthGridCells,
  getWeekdayLabels,
  isSameLocalMonth,
  toLocalDateString,
} from '../lib/dates'
import { CloverDayCell, type CloverDayVariant } from './CloverDayCell'

type AvailabilityGridProps = {
  year: number
  monthIndex: number
  candidateSet: ReadonlySet<string>
  mySet: ReadonlySet<string>
  onPrevMonth: () => void
  onNextMonth: () => void
  onToggle: (isoDate: string) => void
}

function resolveVariant(isCandidate: boolean, mine: boolean): CloverDayVariant {
  if (!isCandidate) {
    return 'muted'
  }
  if (mine) {
    return 'mine'
  }
  return 'default'
}

/** 내가 만날 수 있는 날만 고르는 캘린더 */
export function AvailabilityGrid({
  year,
  monthIndex,
  candidateSet,
  mySet,
  onPrevMonth,
  onNextMonth,
  onToggle,
}: AvailabilityGridProps) {
  const cells = getMonthGridCells(year, monthIndex)
  const labels = getWeekdayLabels()
  const todayIso = useMemo(() => toLocalDateString(new Date()), [])

  const title = new Date(year, monthIndex, 1).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
  })

  return (
    <div className="cute-card mx-2 w-[calc(100%-1rem)] min-w-0 px-2 pb-4 pt-4">
      <div className="mb-5 flex items-center justify-between gap-2 px-1">
        <button
          type="button"
          onClick={onPrevMonth}
          aria-label="이전 달"
          className="cute-btn cute-btn-ghost cute-btn-sm !min-h-0 flex size-10 items-center justify-center !p-0"
        >
          <ChevronIcon direction="left" />
        </button>
        <h2 className="text-base font-extrabold text-neutral-800">{title}</h2>
        <button
          type="button"
          onClick={onNextMonth}
          aria-label="다음 달"
          className="cute-btn cute-btn-ghost cute-btn-sm !min-h-0 flex size-10 items-center justify-center !p-0"
        >
          <ChevronIcon direction="right" />
        </button>
      </div>

      <p className="mb-3 px-1 text-center text-xs text-neutral-500">
        만날 수 있는 날을 탭해서 표시해 주세요
      </p>

      <div className="grid grid-cols-7 gap-y-1 text-center text-xs font-medium text-neutral-400">
        {labels.map((w) => (
          <div key={w} className="py-1">
            {w}
          </div>
        ))}
      </div>

      <div className="mt-1 grid w-full min-w-0 grid-cols-7">
        {cells.map((d) => {
          const key = d.getTime()
          const inMonth = isSameLocalMonth(d, year, monthIndex)
          const iso = toLocalDateString(d)
          const day = d.getDate()

          if (!inMonth) {
            return <div key={key} className="min-h-[2.85rem] min-w-0" aria-hidden />
          }

          const isCandidate = candidateSet.has(iso)
          const mine = mySet.has(iso)
          const variant = resolveVariant(isCandidate, mine)

          return (
            <CloverDayCell
              key={key}
              day={day}
              variant={variant}
              isToday={iso === todayIso}
              disabled={!isCandidate}
              onClick={isCandidate ? () => onToggle(iso) : undefined}
            />
          )
        })}
      </div>

      <ul className="mt-6 flex flex-wrap justify-center gap-4 border-t-2 border-[#55CB9F]/10 pt-4 text-[11px] font-medium text-neutral-500">
        <li className="flex items-center gap-1.5">
          <span className="inline-block size-3.5 rounded-full bg-[#e8e8e8]" />
          후보 날
        </li>
        <li className="flex items-center gap-1.5">
          <span className="inline-block size-3.5 rounded-full bg-[#55CB9F] shadow-sm" />
          내가 되는 날
        </li>
      </ul>
    </div>
  )
}

function ChevronIcon({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg
      className="size-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden
    >
      {direction === 'left' ? <path d="M15 18l-6-6 6-6" /> : <path d="M9 18l6-6-6-6" />}
    </svg>
  )
}
