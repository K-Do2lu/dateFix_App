import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CuteButton } from '../../../components/ui/CuteButton'
import { CuteField } from '../../../components/ui/CuteField'
import { SectionLabel } from '../../../components/ui/SectionLabel'
import { eachDateBetweenInclusive, toLocalDateString } from '../lib/dates'
import { createRoomBundle, setLocalProfile } from '../lib/roomStore'

const MAX_RANGE_DAYS = 120

const INPUT_CLASS =
  'cute-input placeholder:text-neutral-400 focus:ring-0'

export function CreateRoomPage() {
  const navigate = useNavigate()
  const today = useMemo(() => toLocalDateString(new Date()), [])
  const [roomTitle, setRoomTitle] = useState('')
  const [myName, setMyName] = useState('')
  const [from, setFrom] = useState(today)
  const [to, setTo] = useState(() => {
    const d = new Date()
    d.setDate(d.getDate() + 14)
    return toLocalDateString(d)
  })
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const dayCount = useMemo(() => {
    const dates = eachDateBetweenInclusive(from, to)
    return dates.length
  }, [from, to])

  const handleCreate = async () => {
    if (!roomTitle.trim()) {
      setError('방 이름을 입력해 주세요.')
      return
    }
    if (!myName.trim()) {
      setError('내 이름을 입력해 주세요.')
      return
    }
    const dates = eachDateBetweenInclusive(from, to)
    if (dates.length === 0) {
      setError('날짜 범위를 다시 확인해 주세요.')
      return
    }
    if (dates.length > MAX_RANGE_DAYS) {
      setError(`한 번에 최대 ${MAX_RANGE_DAYS}일까지 선택할 수 있어요.`)
      return
    }
    setError(null)
    setSubmitting(true)
    try {
      const { bundle, profile } = await createRoomBundle(dates, roomTitle, myName)
      if (profile) {
        setLocalProfile(bundle.room.id, profile)
      }
      navigate(`/room/${bundle.room.id}`)
    } catch {
      setError('서버에 연결할 수 없어요. 터미널에서 npm run dev 로 API가 켜져 있는지 확인해 주세요.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto w-full min-w-0 max-w-lg">
      <header className="mb-5">
        <Link to="/" className="cute-link-back active:opacity-80">
          ← 메인으로
        </Link>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-neutral-900">방 만들기</h1>
        <p className="mt-1.5 text-sm leading-relaxed text-neutral-500">
          이름과 날짜만 정하면 바로 캘린더로 이동해요.
        </p>
      </header>

      <div className="cute-card space-y-5 p-5">
        <section className="space-y-4">
          <SectionLabel>기본 정보</SectionLabel>

          <CuteField label="방 이름" htmlFor="room-title">
            <input
              id="room-title"
              type="text"
              value={roomTitle}
              onChange={(e) => setRoomTitle(e.target.value)}
              maxLength={40}
              placeholder="예: 5월 모임, 주말 브런치"
              className={INPUT_CLASS}
            />
          </CuteField>

          <CuteField label="내 이름" htmlFor="my-name">
            <input
              id="my-name"
              type="text"
              value={myName}
              onChange={(e) => setMyName(e.target.value)}
              maxLength={24}
              placeholder="예: 민수"
              className={INPUT_CLASS}
            />
          </CuteField>
        </section>

        <div className="h-px bg-neutral-100" />

        <section className="space-y-3">
          <div className="flex items-end justify-between gap-2">
            <SectionLabel className="!mb-0">날짜 범위</SectionLabel>
            {dayCount > 0 ? (
              <span className="text-xs font-medium text-neutral-500">후보 {dayCount}일</span>
            ) : null}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <CuteField label="시작일" htmlFor="date-from">
              <input
                id="date-from"
                type="date"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className={INPUT_CLASS}
              />
            </CuteField>
            <CuteField label="종료일" htmlFor="date-to">
              <input
                id="date-to"
                type="date"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className={INPUT_CLASS}
              />
            </CuteField>
          </div>
          <p className="text-xs text-neutral-400">한 번에 최대 {MAX_RANGE_DAYS}일까지 선택할 수 있어요.</p>
        </section>

        {error ? (
          <p
            className="rounded-xl bg-red-50 px-3 py-2.5 text-sm font-medium text-red-600"
            role="alert"
          >
            {error}
          </p>
        ) : null}

        <CuteButton
          type="button"
          onClick={() => void handleCreate()}
          disabled={submitting}
          fullWidth
          size="lg"
          className="!mt-1"
        >
          {submitting ? '만드는 중…' : '방 만들고 시작하기'}
        </CuteButton>
      </div>
    </div>
  )
}
