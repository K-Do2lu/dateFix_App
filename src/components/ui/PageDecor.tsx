type PageDecorProps = {
  variant?: 'hero' | 'subtle'
}

/** 배경 장식 — 일러스트 느낌의 부드러운 원형 */
export function PageDecor({ variant = 'subtle' }: PageDecorProps) {
  if (variant === 'hero') {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="df-blob absolute -left-8 top-0 size-36 bg-[#55CB9F]/20" />
        <div className="df-blob df-blob-delay-1 absolute -right-10 top-8 size-28 bg-[#a8e6cf]/50" />
        <div className="df-blob df-blob-delay-2 absolute bottom-0 left-1/3 size-20 bg-[#d4f5e6]/80" />
      </div>
    )
  }

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="df-blob absolute -right-12 top-20 size-32 bg-[#55CB9F]/10" />
      <div className="df-blob df-blob-delay-2 absolute -left-8 bottom-32 size-24 bg-[#e8f7f0]" />
    </div>
  )
}
