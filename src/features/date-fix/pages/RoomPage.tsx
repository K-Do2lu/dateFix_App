import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { CuteButton } from '../../../components/ui/CuteButton'
import { CuteButtonLink } from '../../../components/ui/CuteButtonLink'
import { AvailabilityGrid } from '../components/AvailabilityGrid'
import { RoomHeader } from '../components/RoomHeader'
import { RoomInviteBar } from '../components/RoomInviteBar'
import { RoomMeetingCard } from '../components/RoomMeetingCard'
import { useRoomBundle } from '../hooks/useRoomBundle'
import { parseLocalDate } from '../lib/dates'
import {
  getLocalProfile,
  joinRoomAsParticipant,
  toggleMyAvailability,
} from '../lib/roomStore'

export function RoomPage() {
  const { roomId } = useParams<{ roomId: string }>()
  const { bundle, loading } = useRoomBundle(roomId)
  const [joinError, setJoinError] = useState<string | null>(null)
  const [joining, setJoining] = useState(false)
  const [name, setName] = useState('')
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'err'>('idle')
  const [staleGate, setStaleGate] = useState(0)

  useEffect(() => {
    if (!bundle || !roomId) {
      return
    }
    const p = getLocalProfile(roomId)
    if (p && !bundle.participants[p.participantId]) {
      localStorage.removeItem(`datefix:profile:${roomId}`)
      setStaleGate((g) => g + 1)
    }
  }, [bundle, roomId])

  const profile = useMemo(() => {
    void staleGate
    return roomId ? getLocalProfile(roomId) : null
  }, [roomId, staleGate, bundle])

  const me = bundle && profile ? bundle.participants[profile.participantId] : undefined
  const needsJoin = Boolean(bundle && (!profile || !me))

  const [cursor, setCursor] = useState(() => new Date())

  useEffect(() => {
    if (!bundle?.room.candidateDates.length) {
      return
    }
    setCursor(parseLocalDate(bundle.room.candidateDates[0]))
  }, [bundle?.room.id])

  const candidateSet = useMemo(
    () => new Set(bundle?.room.candidateDates ?? []),
    [bundle?.room.candidateDates],
  )

  const mySet = useMemo(() => new Set(me?.availableDates ?? []), [me?.availableDates])

  const participants = useMemo(
    () => (bundle ? Object.values(bundle.participants) : []),
    [bundle],
  )
  const participantCount = participants.length
  const friendsJoined = Math.max(0, participantCount - 1)
  const canCheckOverlap = participantCount >= 2
  const meeting = bundle?.room.meeting ?? null

  const inviteUrl = useMemo(() => {
    if (!roomId) {
      return ''
    }
    return `${window.location.origin}/room/${roomId}`
  }, [roomId])

  const copyInvite = useCallback(async () => {
    if (!inviteUrl) {
      return
    }
    try {
      await navigator.clipboard.writeText(inviteUrl)
      setCopyState('copied')
      window.setTimeout(() => setCopyState('idle'), 2000)
    } catch {
      setCopyState('err')
    }
  }, [inviteUrl])

  const onToggle = useCallback(
    (iso: string) => {
      if (!bundle || !profile) {
        return
      }
      void toggleMyAvailability(bundle, profile.participantId, iso)
    },
    [bundle, profile],
  )

  const onJoin = async (e: FormEvent) => {
    e.preventDefault()
    if (!roomId || !name.trim()) {
      return
    }
    setJoinError(null)
    setJoining(true)
    try {
      await joinRoomAsParticipant(roomId, name)
      setName('')
    } catch {
      setJoinError('입장에 실패했어요. 서버 연결을 확인해 주세요.')
    } finally {
      setJoining(false)
    }
  }

  const goPrevMonth = () => {
    setCursor((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))
  }

  const goNextMonth = () => {
    setCursor((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))
  }

  if (!roomId) {
    return null
  }

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <p className="text-sm text-neutral-500">불러오는 중…</p>
      </div>
    )
  }

  if (bundle === null) {
    return (
      <div className="flex flex-1 flex-col overflow-y-auto px-4 py-6">
        <div className="cute-card p-8 text-center">
          <p className="text-3xl" aria-hidden>
            😢
          </p>
          <h1 className="mt-2 text-lg font-extrabold text-neutral-800">
            {'\ubc29\uc744 \ucc3e\uc744 \uc218 \uc5c6\uc5b4\uc694'}
          </h1>
          <p className="mt-2 text-sm text-neutral-600">
            {'\ub9c1\ud06c\uac00 \uc798\ub418\uc5c8\uac70\ub098 \uc874\uc7ac\ud558\uc9c0 \uc54a\ub294 \ubc29\uc774\uc5d0\uc694.'}
          </p>
          <Link to="/" className="cute-link-back mt-6 inline-flex active:opacity-80">
            {'\uba54\uc778\uc73c\ub85c \ub3cc\uc544\uac00\uae30'}
          </Link>
        </div>
      </div>
    )
  }

  if (needsJoin) {
    return (
      <div className="flex flex-1 flex-col overflow-y-auto px-4 py-6">
        <Link to="/" className="cute-link-back active:opacity-80">
          {'\u2190 \uba54\uc778\uc73c\ub85c'}
        </Link>
        <div className="cute-card mt-4 p-6">
          <h1 className="text-lg font-extrabold text-neutral-800">{'\ubc29 \uc785\uc7a5 👋'}</h1>
          <p className="mt-2 text-sm text-neutral-600">
            {bundle.room.title || '\uc6b0\ub9ac \ubc29'} {'\xb7 \ud6c4\ubcf4 '}
            {bundle.room.candidateDates.length}
            {'\uc77c'}
          </p>
          <form onSubmit={onJoin} className="mt-6 space-y-4">
            <div>
              <label htmlFor="nickname" className="text-sm font-bold text-neutral-700">
                {'\uc774\ub984'}
              </label>
              <input
                id="nickname"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                maxLength={24}
                placeholder={'\uc608: \ubbfc\uc218'}
                className="cute-input mt-2 w-full"
              />
            </div>
            {joinError ? (
              <p className="rounded-2xl bg-[#ffe8e8] px-3 py-2 text-sm font-medium text-red-600" role="alert">
                {joinError}
              </p>
            ) : null}
            <CuteButton type="submit" disabled={joining} fullWidth size="lg">
              {joining ? '입장 중…' : '\uc785\uc7a5\ud558\uace0 \uce98\ub9b0\ub354 \ubcf4\uae30'}
            </CuteButton>
          </form>
        </div>
      </div>
    )
  }

  const roomTitle = bundle.room.title || '\uc6b0\ub9ac \ubc29'

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <RoomHeader title={roomTitle} participantName={me?.name} />

      <div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto">
        <section className="space-y-4 px-4 pt-4">
          {meeting && roomId ? (
            <RoomMeetingCard meeting={meeting} roomId={roomId} compact />
          ) : null}
          <RoomInviteBar
            inviteUrl={inviteUrl}
            copyState={copyState}
            onCopy={copyInvite}
            participantCount={participantCount}
          />
        </section>

        <section className="mt-2 px-4">
          <p className="mb-2 text-sm font-semibold text-neutral-900">내가 만날 수 있는 날 고르기</p>
        </section>

        <section className="min-w-0 px-1 py-2">
          <AvailabilityGrid
            year={cursor.getFullYear()}
            monthIndex={cursor.getMonth()}
            candidateSet={candidateSet}
            mySet={mySet}
            onPrevMonth={goPrevMonth}
            onNextMonth={goNextMonth}
            onToggle={onToggle}
          />
        </section>

        <section className="space-y-2 px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          {meeting ? (
            <CuteButtonLink
              to={`/room/${roomId}/overlap`}
              variant="accent"
              size="lg"
              className="mt-2 flex flex-col gap-1 py-4"
            >
              <span className="text-base font-semibold text-white">약속 확인하기</span>
              <span className="text-xs font-medium text-white/85">날짜·시간 자세히 보기</span>
            </CuteButtonLink>
          ) : canCheckOverlap ? (
            <CuteButtonLink
              to={`/room/${roomId}/overlap`}
              variant="accent"
              size="lg"
              className="mt-2 flex flex-col gap-1 py-4"
            >
              <span className="text-base font-semibold text-white">만날 날 정하기</span>
              <span className="text-xs font-medium text-white/85">
                친구 {friendsJoined}명과 겹치는 날 보기
              </span>
            </CuteButtonLink>
          ) : (
            <div className="cute-card-dashed mt-2 px-4 py-5 text-center">
              <p className="text-sm font-extrabold text-neutral-700">겹치는 날짜 보기</p>
              <p className="mt-1 text-xs leading-relaxed text-neutral-500">
                친구가 초대 링크로 들어와 이름을 입력한 뒤,
                <br />
                서로 날짜를 고르면 확인할 수 있어요.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
