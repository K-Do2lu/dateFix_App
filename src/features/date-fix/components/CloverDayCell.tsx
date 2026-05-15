import { CloverShape } from './CloverShape'

export type CloverDayVariant =
  | 'empty'
  | 'muted'
  | 'default'
  | 'marked'
  | 'overlap'
  | 'mine'

type CloverDayCellProps = {
  day: number
  variant: CloverDayVariant
  badge?: number
  isToday?: boolean
  disabled?: boolean
  onClick?: () => void
}

const CLOVER_FILL: Record<CloverDayVariant, string> = {
  empty: 'transparent',
  muted: 'transparent',
  default: '#dcefe6',
  marked: '#1a1a1a',
  overlap: '#1a1a1a',
  mine: '#55CB9F',
}

export function CloverDayCell({
  day,
  variant,
  badge,
  isToday = false,
  disabled = false,
  onClick,
}: CloverDayCellProps) {
  const showClover = variant !== 'empty' && variant !== 'muted'
  const fill = CLOVER_FILL[variant]
  const showBadge =
    badge !== undefined &&
    badge > 0 &&
    (variant === 'marked' || variant === 'overlap' || variant === 'mine')

  const content = (
    <div className="flex flex-col items-center justify-start py-0.5">
      <div className="relative flex h-9 w-full max-w-full items-center justify-center">
        {showClover ? (
          <>
            <CloverShape fill={fill} className="h-8 w-8 max-w-full" />
            {showBadge ? (
              <span className="absolute inset-0 flex items-center justify-center pb-0.5 text-[11px] font-semibold text-white">
                {badge}
              </span>
            ) : null}
          </>
        ) : (
          <span className="h-8 w-8" aria-hidden />
        )}
      </div>
      <span
        className={[
          'mt-0.5 text-[13px] leading-none',
          variant === 'muted' ? 'text-slate-300' : 'text-slate-800',
          isToday
            ? 'font-semibold underline decoration-2 underline-offset-2 decoration-slate-800'
            : '',
        ].join(' ')}
      >
        {day}
      </span>
    </div>
  )

  if (disabled || !onClick) {
    return <div className="min-h-[2.85rem] min-w-0">{content}</div>
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={variant === 'mine' || variant === 'marked' || variant === 'overlap'}
      className="min-h-[2.85rem] min-w-0 w-full rounded-2xl transition active:scale-90"
    >
      {content}
    </button>
  )
}
