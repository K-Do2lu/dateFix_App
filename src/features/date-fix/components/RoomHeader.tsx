import { Link } from 'react-router-dom'

type RoomHeaderProps = {
  title: string
  participantName?: string
}

export function RoomHeader({ title, participantName }: RoomHeaderProps) {
  return (
    <header className="shrink-0 border-b border-[#55CB9F]/10 bg-white px-4 pb-4 pt-[max(0.5rem,env(safe-area-inset-top))]">
      <Link to="/" className="cute-link-back active:opacity-80">
        ← 메인
      </Link>
      <h1 className="mt-3 truncate text-xl font-bold text-neutral-900">{title}</h1>
      {participantName ? (
        <p className="mt-1 truncate text-sm text-neutral-500">
          {participantName}님 · 만날 수 있는 날을 골라 주세요
        </p>
      ) : null}
    </header>
  )
}
