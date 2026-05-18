import { useState } from 'react'
import { CuteButton } from '../../../components/ui/CuteButton'
import { getPushPermission, hasRoomPushEnabled, isPushSupported, subscribeRoomPush } from '../lib/pushClient'

type PushPermissionCardProps = {
  roomId: string
  participantId: string
}

export function PushPermissionCard({ roomId, participantId }: PushPermissionCardProps) {
  const [dismissed, setDismissed] = useState(false)
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'denied'>('idle')

  if (dismissed || hasRoomPushEnabled(roomId)) {
    return null
  }

  if (!isPushSupported()) {
    return null
  }

  const permission = getPushPermission()
  if (permission === 'denied') {
    return null
  }

  const enable = async () => {
    setStatus('loading')
    const result = await subscribeRoomPush(roomId, participantId)
    if (result === 'granted') {
      setStatus('done')
      return
    }
    setStatus(result === 'denied' ? 'denied' : 'idle')
  }

  if (status === 'done') {
    return null
  }

  return (
    <div className="cute-card-soft px-4 py-4">
      <p className="text-sm font-bold text-neutral-900">친구 활동 알림</p>
      <p className="mt-1 text-xs leading-relaxed text-neutral-500">
        친구가 만날 날을 정하거나 약속을 확정하면 알려 드려요.
      </p>
      <div className="mt-3 flex gap-2">
        <CuteButton
          type="button"
          size="sm"
          className="flex-1"
          disabled={status === 'loading'}
          onClick={() => void enable()}
        >
          {status === 'loading' ? '설정 중…' : '알림 켜기'}
        </CuteButton>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="rounded-full px-3 text-xs font-semibold text-neutral-400"
        >
          나중에
        </button>
      </div>
      {status === 'denied' ? (
        <p className="mt-2 text-xs text-red-500">알림이 차단되어 있어요. 브라우저 설정에서 허용해 주세요.</p>
      ) : null}
    </div>
  )
}
