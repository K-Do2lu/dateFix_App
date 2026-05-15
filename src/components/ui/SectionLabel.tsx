import type { ReactNode } from 'react'

type SectionLabelProps = {
  children: ReactNode
  className?: string
}

export function SectionLabel({ children, className = '' }: SectionLabelProps) {
  return (
    <p
      className={[
        'flex items-center gap-2 text-xs font-bold tracking-wide text-neutral-500',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span className="size-1.5 shrink-0 rounded-full bg-[#55CB9F]" aria-hidden />
      {children}
    </p>
  )
}
