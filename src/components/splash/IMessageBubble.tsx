import type { ReactNode } from 'react'

type IMessageBubbleProps = {
  children: ReactNode
  /** 말풍선 꼬리 방향 — 캐릭터가 위에 있을 때 top */
  tail?: 'top' | 'bottom'
  className?: string
}

/** iPhone 메시지 앱 스타일 말풍선 (흰 배경) */
export function IMessageBubble({ children, tail = 'top', className = '' }: IMessageBubbleProps) {
  const tailOnTop = tail === 'top'

  return (
    <div className={`relative ${className}`}>
      {tailOnTop ? (
        <svg
          width="14"
          height="8"
          viewBox="0 0 14 8"
          aria-hidden
          className="absolute -top-[7px] left-1/2 -translate-x-1/2 text-white drop-shadow-[0_-0.5px_0_rgba(0,0,0,0.06)]"
        >
          <path
            fill="currentColor"
            d="M7 0c1.2 2.2 4.5 4 7 8H0c2.5-4 5.8-5.8 7-8z"
          />
        </svg>
      ) : null}

      <div className="rounded-[1.125rem] bg-white px-3.5 py-2 shadow-[0_1px_2px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.08]">
        {children}
      </div>

      {!tailOnTop ? (
        <svg
          width="14"
          height="8"
          viewBox="0 0 14 8"
          aria-hidden
          className="absolute -bottom-[7px] left-1/2 -translate-x-1/2 rotate-180 text-white drop-shadow-[0_0.5px_0_rgba(0,0,0,0.06)]"
        >
          <path
            fill="currentColor"
            d="M7 0c1.2 2.2 4.5 4 7 8H0c2.5-4 5.8-5.8 7-8z"
          />
        </svg>
      ) : null}
    </div>
  )
}
