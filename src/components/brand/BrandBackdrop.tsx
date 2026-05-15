import type { ReactNode } from 'react'

type BrandBackdropProps = {
  children: ReactNode
  className?: string
  variant?: 'mint' | 'dark'
}

/** 메인 배너·스플래시 등 앱 브랜드 배경 */
export function BrandBackdrop({ children, className = '', variant = 'mint' }: BrandBackdropProps) {
  const bg =
    variant === 'dark'
      ? 'bg-gradient-to-b from-[#2d4a42] via-[#1a2e28] to-[#0f1a17]'
      : 'bg-gradient-to-br from-[#8ee8c4] via-[#55CB9F] to-[#45b88a]'

  return (
    <div className={`relative overflow-hidden ${bg} ${className}`}>
      {variant === 'mint' ? (
        <>
          <div className="pointer-events-none absolute right-[-2rem] top-[-1rem] size-40 rounded-full bg-white/20" />
          <div className="pointer-events-none absolute bottom-[-2.5rem] left-[-1.5rem] size-48 rounded-full bg-white/15" />
          <div className="pointer-events-none absolute right-8 top-14 size-24 rounded-full bg-[#ffd6e8]/30" />
          <div className="pointer-events-none absolute left-8 top-24 size-14 rounded-full bg-white/15" />
        </>
      ) : null}
      <div className="relative z-10">{children}</div>
    </div>
  )
}
