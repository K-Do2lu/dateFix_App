import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CuteButton } from '../../../components/ui/CuteButton'
import { SectionLabel } from '../../../components/ui/SectionLabel'
import { formatMeetingListLine } from '../lib/formatMeeting'
import { removeRoomFromMyList } from '../lib/roomStore'
import { useRoomList } from '../hooks/useRoomList'
import type { RoomListItem } from '../types'

function formatCreatedAt(ts: number): string {
  return new Date(ts).toLocaleDateString('ko-KR', {
    month: 'short',
    day: 'numeric',
  })
}

export function RoomListSection() {
  const { rooms, loading } = useRoomList()
  const [pendingRemove, setPendingRemove] = useState<RoomListItem | null>(null)

  const confirmRemove = () => {
    if (!pendingRemove) {
      return
    }
    removeRoomFromMyList(pendingRemove.id)
    setPendingRemove(null)
  }

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col">
      <SectionLabel>내 방</SectionLabel>
      {!loading && rooms.length > 0 ? (
        <p className="mt-1.5 text-[11px] leading-relaxed text-neutral-400">
          목록에서 지우면 이 기기에서만 사라져요. 다시 들어가려면 초대 링크가 필요해요.
        </p>
      ) : null}

      {loading ? (
        <p className="mt-6 text-center text-sm text-neutral-500">불러오는 중…</p>
      ) : rooms.length === 0 ? (
        <div className="cute-card-dashed mt-4 px-4 py-12 text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-[#e8f7f0] text-2xl">
            📅
          </div>
          <p className="mt-3 text-sm font-semibold text-neutral-700">아직 방이 없어요</p>
          <p className="mt-1 text-xs text-neutral-400">위에서 방을 만들어 보세요</p>
        </div>
      ) : (
        <ul className="mt-4 flex flex-col gap-2 overflow-y-auto pb-2">
          {rooms.map((room) => (
            <li key={room.id} className="cute-card flex items-stretch p-1">
              <Link
                to={`/room/${room.id}`}
                className="flex min-w-0 flex-1 items-center gap-3 rounded-[1.125rem] px-3 py-3 active:bg-[#e8f7f0]/60"
              >
                <span
                  className={[
                    'flex size-11 shrink-0 items-center justify-center rounded-xl text-lg text-white shadow-sm',
                    room.meeting ? 'bg-[#3da882]' : 'bg-[#55CB9F]',
                  ].join(' ')}
                >
                  {room.meeting ? '✓' : '📅'}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-neutral-900">
                    {room.title}
                  </span>
                  {room.meeting ? (
                    <span className="mt-1 block truncate text-xs font-bold text-[#3da882]">
                      {formatMeetingListLine(room.meeting)}
                    </span>
                  ) : (
                    <span className="mt-0.5 block text-xs text-neutral-500">
                      {room.participantCount}명 · {room.candidateDayCount}일 ·{' '}
                      {formatCreatedAt(room.createdAt)}
                    </span>
                  )}
                </span>
                <ChevronRight aria-hidden />
              </Link>
              <button
                type="button"
                onClick={() => setPendingRemove(room)}
                aria-label={`${room.title} 목록에서 지우기`}
                className="flex shrink-0 items-center px-2.5 text-neutral-300 active:text-red-400"
              >
                <TrashIcon />
              </button>
            </li>
          ))}
        </ul>
      )}

      {pendingRemove ? (
        <RemoveConfirmDialog
          room={pendingRemove}
          onCancel={() => setPendingRemove(null)}
          onConfirm={confirmRemove}
        />
      ) : null}
    </div>
  )
}

function RemoveConfirmDialog({
  room,
  onCancel,
  onConfirm,
}: {
  room: RoomListItem
  onCancel: () => void
  onConfirm: () => void
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/25 p-4 sm:items-center"
      role="presentation"
      onClick={onCancel}
    >
      <div
        role="dialog"
        aria-labelledby="remove-room-title"
        aria-modal="true"
        className="cute-card w-full max-w-sm p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 id="remove-room-title" className="text-base font-bold text-neutral-900">
          목록에서 지울까요?
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-neutral-600">
          <span className="font-semibold text-neutral-800">{room.title}</span> 방이 이 기기 목록에서만
          사라져요.
        </p>
        <p className="mt-2 rounded-xl bg-[#e8f7f0] px-3 py-2 text-xs leading-relaxed text-[#3da882]">
          다시 참여하려면 친구가 초대 링크를 보내줘야 해요.
        </p>
        <div className="mt-5 flex gap-2">
          <CuteButton type="button" variant="secondary" onClick={onCancel} className="flex-1">
            취소
          </CuteButton>
          <CuteButton type="button" variant="danger" onClick={onConfirm} className="flex-1">
            지우기
          </CuteButton>
        </div>
      </div>
    </div>
  )
}

function ChevronRight() {
  return (
    <svg
      className="size-5 shrink-0 text-[#55CB9F]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      aria-hidden
    >
      <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path
        d="M4 7h16M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m2 0v11a2 2 0 01-2 2H8a2 2 0 01-2-2V7h12z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
