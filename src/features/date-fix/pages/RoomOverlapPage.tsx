import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { MeetingCelebration } from '../components/MeetingCelebration'
import { OverlapDateConfirm } from '../components/OverlapDateConfirm'
import { RoomMeetingCard } from '../components/RoomMeetingCard'
import { useRoomBundle } from '../hooks/useRoomBundle'
import { formatDateLabel } from '../lib/dates'
import { computeEveryoneFreeDates } from '../lib/overlap'
import type { MeetingTimeSlot } from '../lib/meetingTimeSlots'
import { clearRoomMeeting, confirmRoomMeeting, getLocalProfile } from '../lib/roomStore'
import type { Participant, RoomMeeting } from '../types'

type OverlapPhase = 'summary' | 'schedule' | 'celebrate'

export function RoomOverlapPage() {
  const { roomId } = useParams<{ roomId: string }>()
  const { bundle, loading } = useRoomBundle(roomId)
  const [phase, setPhase] = useState<OverlapPhase>('schedule')
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedTimeId, setSelectedTimeId] = useState<string | null>(null)
  const [confirming, setConfirming] = useState(false)
  const [confirmError, setConfirmError] = useState<string | null>(null)
  const [rescheduleError, setRescheduleError] = useState<string | null>(null)
  const [celebrateMeeting, setCelebrateMeeting] = useState<RoomMeeting | null>(null)

  const profile = roomId ? getLocalProfile(roomId) : null

  const participants = useMemo(
    () => (bundle ? Object.values(bundle.participants) : []),
    [bundle],
  )

  const overlap = useMemo(() => computeEveryoneFreeDates(participants), [participants])
  const savedMeeting = bundle?.room.meeting ?? null

  useEffect(() => {
    if (!bundle) {
      return
    }
    if (bundle.room.meeting) {
      setCelebrateMeeting(bundle.room.meeting)
      setPhase((p) => (p === 'celebrate' ? 'celebrate' : 'summary'))
    } else {
      setCelebrateMeeting(null)
      setPhase(overlap.length > 0 ? 'schedule' : 'summary')
    }
  }, [bundle?.room.id, bundle?.room.meeting, overlap.length])

  const handleSelectDate = (iso: string) => {
    setSelectedDate(iso)
    setSelectedTimeId(null)
  }

  const handleChangeDate = () => {
    setSelectedDate(null)
    setSelectedTimeId(null)
  }

  const handleSelectTime = (slot: MeetingTimeSlot) => {
    setSelectedTimeId(slot.id)
  }

  const startSchedule = async () => {
    setRescheduleError(null)
    if (bundle && savedMeeting) {
      try {
        await clearRoomMeeting(bundle)
      } catch {
        setRescheduleError('일정을 다시 잡을 수 없어요. 잠시 후 다시 시도해 주세요.')
        return
      }
    }
    setSelectedDate(null)
    setSelectedTimeId(null)
    setConfirmError(null)
    setPhase('schedule')
  }

  const handleConfirm = async () => {
    if (!bundle || !selectedDate || !selectedTimeId) {
      return
    }
    if (!overlap.includes(selectedDate)) {
      setConfirmError('선택한 날이 더 이상 모두 가능한 날이 아니에요. 날짜를 다시 골라 주세요.')
      setSelectedDate(null)
      setSelectedTimeId(null)
      return
    }
    setConfirming(true)
    setConfirmError(null)
    try {
      const saved = await confirmRoomMeeting(bundle, selectedDate, selectedTimeId)
      const meeting = saved.room.meeting ?? null
      if (!meeting) {
        setConfirmError('저장에 실패했어요. 다시 시도해 주세요.')
        return
      }
      setCelebrateMeeting(meeting)
      setPhase('celebrate')
    } catch {
      setConfirmError('약속을 저장하지 못했어요. 서버 연결을 확인해 주세요.')
    } finally {
      setConfirming(false)
    }
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
        <div className="cute-card p-6 text-center">
          <p className="text-sm text-neutral-600">방을 찾을 수 없어요.</p>
          <Link to="/" className="cute-link-back mt-4 inline-flex">
            메인으로
          </Link>
        </div>
      </div>
    )
  }

  const roomTitle = bundle.room.title || '우리 방'
  const showCelebrate = phase === 'celebrate' && celebrateMeeting
  const showSummary = phase === 'summary' && savedMeeting && !showCelebrate
  const showSchedule = phase === 'schedule' && overlap.length > 0

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      {!showCelebrate ? (
        <header className="shrink-0 border-b border-neutral-100 bg-white px-4 pb-4 pt-[max(0.5rem,env(safe-area-inset-top))]">
          <Link
            to={`/room/${roomId}`}
            className="cute-link-back active:opacity-80"
            aria-label="방 캘린더로 돌아가기"
          >
            ← 내 캘린더로
          </Link>
          <h1 className="mt-3 text-xl font-bold text-neutral-900">
            {showSummary ? '우리 약속' : '만날 날 정하기'}
          </h1>
          <p className="mt-1 truncate text-xs font-medium text-neutral-500">{roomTitle}</p>
        </header>
      ) : null}

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        {showCelebrate ? (
          <MeetingCelebration meeting={celebrateMeeting!} />
        ) : showSummary && savedMeeting ? (
          <>
            <RoomMeetingCard
              meeting={savedMeeting}
              roomId={roomId}
              hideDetailLink
              onReschedule={() => void startSchedule()}
            />
            {rescheduleError ? (
              <p className="mt-3 text-sm font-medium text-red-600" role="alert">
                {rescheduleError}
              </p>
            ) : null}
          </>
        ) : overlap.length === 0 ? (
          <section className="df-overlap-panel px-5 py-5">
            <h2 className="text-base font-bold text-neutral-900">아직 겹치는 날이 없어요</h2>
            <div className="mt-2 space-y-2 text-sm text-neutral-600">
              <p>아직 모두 가능한 날이 없어요.</p>
              <ul className="list-inside list-decimal space-y-1 text-xs text-neutral-500">
                <li>친구에게 초대 링크를 보냈는지 확인</li>
                <li>친구가 링크로 들어와 이름 입력</li>
                <li>나와 친구가 각자 캘린더에서 날짜 선택</li>
              </ul>
            </div>
            {savedMeeting ? (
              <div className="mt-4">
                <RoomMeetingCard meeting={savedMeeting} roomId={roomId} compact />
              </div>
            ) : null}
          </section>
        ) : showSchedule ? (
          <OverlapDateConfirm
            overlapDates={overlap}
            selectedDate={selectedDate}
            selectedTimeId={selectedTimeId}
            confirming={confirming}
            confirmError={confirmError}
            onSelectDate={handleSelectDate}
            onSelectTime={handleSelectTime}
            onChangeDate={handleChangeDate}
            onConfirm={() => void handleConfirm()}
          />
        ) : null}

        {!showCelebrate && showSchedule ? (
          <ParticipantSection
            participants={participants}
            profileParticipantId={profile?.participantId}
            highlightDate={selectedDate}
          />
        ) : null}
      </div>
    </div>
  )
}

function ParticipantSection({
  participants,
  profileParticipantId,
  highlightDate,
}: {
  participants: Participant[]
  profileParticipantId?: string
  highlightDate: string | null
}) {
  if (participants.length === 0) {
    return null
  }

  return (
    <section className="mt-6" aria-labelledby="participant-dates-title">
      <h2 id="participant-dates-title" className="text-sm font-bold text-neutral-700">
        친구별 가능한 날
      </h2>
      <ul className="mt-3 space-y-3">
        {participants.map((p) => (
          <ParticipantDatesCard
            key={p.id}
            participant={p}
            isMe={p.id === profileParticipantId}
            highlightDate={highlightDate}
          />
        ))}
      </ul>
    </section>
  )
}

function ParticipantDatesCard({
  participant,
  isMe,
  highlightDate,
}: {
  participant: Participant
  isMe: boolean
  highlightDate: string | null
}) {
  const dates = participant.availableDates

  return (
    <li className="cute-card p-4">
      <div className="flex items-center justify-between gap-2">
        <span className="truncate font-semibold text-neutral-900">
          {participant.name}
          {isMe ? ' (나)' : ''}
        </span>
        <span className="shrink-0 rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-bold text-neutral-600">
          {dates.length}일
        </span>
      </div>
      {dates.length === 0 ? (
        <p className="mt-2 text-sm text-neutral-400">아직 선택한 날이 없어요</p>
      ) : (
        <ul className="mt-2 flex flex-wrap gap-1.5">
          {dates.map((d) => {
            const picked = highlightDate === d
            return (
              <li
                key={d}
                className={[
                  'rounded-full px-3 py-1 text-xs font-semibold',
                  picked
                    ? 'bg-white font-bold text-neutral-900 ring-2 ring-[#55CB9F]'
                    : 'bg-neutral-100 text-neutral-600',
                ].join(' ')}
              >
                {formatDateLabel(d)}
              </li>
            )
          })}
        </ul>
      )}
    </li>
  )
}
