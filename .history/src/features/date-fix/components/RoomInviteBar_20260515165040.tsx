type RoomInviteBarProps = {
  inviteUrl: string
  copyState: 'idle' | 'copied' | 'err'
  onCopy: () => void
  participantCount: number
}

export function RoomInviteBar({
  inviteUrl,
  copyState,
  onCopy,
  participantCount,
}: RoomInviteBarProps) {
  const friendsCount = Math.max(0, participantCount - 1)

  return (
    <div className="cute-card-soft p-5">
      <div className="flex items-start justify-between gap-2">
        <div>
          <span className="cute-step-badge">1단계</span>
          <p className="mt-2 text-sm font-extrabold text-neutral-800">친구 초대 링크 💌</p>
          <p className="mt-1.5 text-xs leading-relaxed text-neutral-600">
            친구가 링크로 들어와 이름을 입력해야 겹치는 날을 볼 수 있어요.
          </p>
        </div>
        <span className="cute-pill shrink-0 px-3 py-1.5 text-xs font-bold text-[#3da882]">
          참여 {participantCount}명
          {friendsCount > 0 ? ` · 친구 ${friendsCount}` : ''}
        </span>
      </div>
      <p className="mt-3 break-all rounded-2xl border-2 border-white/80 bg-white/90 px-3 py-2 text-[11px] leading-snug text-neutral-600">
        {inviteUrl}
      </p>
      <button
        type="button"
        onClick={onCopy}
        className="cute-btn cute-btn-primary mt-3 w-full py-3.5 text-sm"
      >
        {copyState === 'copied'
          ? '복사됐어요! 친구에게 보내기 🎉'
          : copyState === 'err'
            ? '복사 실패 — 길게 눌러 복사'
            : '초대 링크 복사하기'}
      </button>
    </div>
  )
}
