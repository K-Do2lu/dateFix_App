import { CuteButton } from '../../../components/ui/CuteButton'

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
    <div className="cute-card-soft p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-neutral-900">친구 초대</p>
          <p className="mt-1 text-xs leading-relaxed text-neutral-500">
            링크로 들어와 이름을 입력하면 참여할 수 있어요.
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-[#3da882] shadow-sm">
          {participantCount}명
          {friendsCount > 0 ? ` · 친구 ${friendsCount}` : ''}
        </span>
      </div>
      <p className="mt-3 break-all rounded-xl bg-white px-3 py-2 text-[11px] text-neutral-500">
        {inviteUrl}
      </p>
      <CuteButton type="button" onClick={onCopy} fullWidth size="md" className="mt-3">
        {copyState === 'copied'
          ? '복사 완료!'
          : copyState === 'err'
            ? '복사 실패 — 길게 눌러 복사'
            : '초대 링크 복사'}
      </CuteButton>
    </div>
  )
}
