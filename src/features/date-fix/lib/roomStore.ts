import type { LocalProfile, Participant, RoomBundle, RoomListItem } from '../types'

function bundleToListItem(bundle: RoomBundle): RoomListItem {
  return {
    id: bundle.room.id,
    title: bundle.room.title || '우리 모임',
    createdAt: bundle.room.createdAt,
    participantCount: Object.keys(bundle.participants).length,
    candidateDayCount: bundle.room.candidateDates.length,
    meeting: bundle.room.meeting ?? null,
  }
}
import {
  createRoomOnServer,
  fetchRoomBundle,
  joinRoomOnServer,
  saveRoomBundleOnServer,
} from './roomApi'

const PROFILE_KEY = (roomId: string) => `datefix:profile:${roomId}`
const ROOM_INDEX_KEY = 'datefix:room-index'

const SYNC_EVENT = 'datefix-room-sync'
const ROOMS_LIST_EVENT = 'datefix-rooms-list-changed'

function dispatchRoomsListChanged(): void {
  window.dispatchEvent(new CustomEvent(ROOMS_LIST_EVENT))
}

export function subscribeRoomsListChanged(fn: () => void): () => void {
  const onCustom = () => fn()
  window.addEventListener(ROOMS_LIST_EVENT, onCustom)
  window.addEventListener(SYNC_EVENT, onCustom as EventListener)
  return () => {
    window.removeEventListener(ROOMS_LIST_EVENT, onCustom)
    window.removeEventListener(SYNC_EVENT, onCustom as EventListener)
  }
}

function readRoomIndexIds(): string[] {
  const raw = localStorage.getItem(ROOM_INDEX_KEY)
  if (!raw) {
    return []
  }
  try {
    const ids = JSON.parse(raw) as string[]
    return Array.isArray(ids) ? ids : []
  } catch {
    return []
  }
}

function writeRoomIndexIds(ids: string[]): void {
  localStorage.setItem(ROOM_INDEX_KEY, JSON.stringify(ids))
  dispatchRoomsListChanged()
}

export function registerRoom(roomId: string): void {
  const ids = readRoomIndexIds().filter((id) => id !== roomId)
  ids.unshift(roomId)
  writeRoomIndexIds(ids)
}

/** 메인 '내 방' 목록에서만 제거 (서버 방·참가 데이터는 유지) */
export function removeRoomFromMyList(roomId: string): void {
  const ids = readRoomIndexIds().filter((id) => id !== roomId)
  writeRoomIndexIds(ids)
  localStorage.removeItem(PROFILE_KEY(roomId))
  dispatchRoomsListChanged()
}

export async function getRoomList(): Promise<RoomListItem[]> {
  const ids = readRoomIndexIds()
  const items: RoomListItem[] = []
  const validIds: string[] = []

  for (const id of ids) {
    const bundle = await fetchRoomBundle(id)
    if (!bundle) {
      continue
    }
    validIds.push(id)
    items.push(bundleToListItem(bundle))
  }

  if (validIds.length !== ids.length) {
    writeRoomIndexIds(validIds)
  }

  return items.sort((a, b) => b.createdAt - a.createdAt)
}

export function dispatchRoomSync(roomId: string): void {
  window.dispatchEvent(new CustomEvent(SYNC_EVENT, { detail: { roomId } }))
}

export function subscribeRoomSync(roomId: string, fn: () => void): () => void {
  const onCustom = (e: Event) => {
    const ce = e as CustomEvent<{ roomId?: string }>
    if (ce.detail?.roomId === roomId) {
      fn()
    }
  }
  window.addEventListener(SYNC_EVENT, onCustom as EventListener)
  return () => {
    window.removeEventListener(SYNC_EVENT, onCustom as EventListener)
  }
}

export async function getBundle(roomId: string): Promise<RoomBundle | null> {
  return fetchRoomBundle(roomId)
}

export async function saveBundle(bundle: RoomBundle): Promise<RoomBundle> {
  const saved = await saveRoomBundleOnServer(bundle)
  registerRoom(saved.room.id)
  dispatchRoomSync(saved.room.id)
  return saved
}

export async function createRoomBundle(
  candidateDates: string[],
  title: string,
  hostName?: string,
): Promise<{ bundle: RoomBundle; profile?: LocalProfile }> {
  const result = await createRoomOnServer(candidateDates, title, hostName)
  registerRoom(result.bundle.room.id)
  dispatchRoomSync(result.bundle.room.id)
  return result
}

export function getLocalProfile(roomId: string): LocalProfile | null {
  const raw = localStorage.getItem(PROFILE_KEY(roomId))
  if (!raw) {
    return null
  }
  try {
    return JSON.parse(raw) as LocalProfile
  } catch {
    return null
  }
}

export function setLocalProfile(roomId: string, profile: LocalProfile): void {
  localStorage.setItem(PROFILE_KEY(roomId), JSON.stringify(profile))
}

export async function joinRoomAsParticipant(
  roomId: string,
  name: string,
): Promise<{ bundle: RoomBundle; profile: LocalProfile }> {
  const { bundle, profile } = await joinRoomOnServer(roomId, name)
  setLocalProfile(roomId, profile)
  registerRoom(roomId)
  dispatchRoomSync(roomId)
  return { bundle, profile }
}

export async function toggleMyAvailability(
  bundle: RoomBundle,
  participantId: string,
  date: string,
): Promise<RoomBundle> {
  const me = bundle.participants[participantId]
  if (!me) {
    return bundle
  }
  const set = new Set(me.availableDates)
  if (set.has(date)) {
    set.delete(date)
  } else {
    set.add(date)
  }
  const nextMe: Participant = { ...me, availableDates: [...set].sort() }
  const next: RoomBundle = {
    ...bundle,
    participants: { ...bundle.participants, [participantId]: nextMe },
  }
  return saveBundle(next)
}

export async function confirmRoomMeeting(
  bundle: RoomBundle,
  date: string,
  timeSlotId: string,
): Promise<RoomBundle> {
  const next: RoomBundle = {
    ...bundle,
    room: {
      ...bundle.room,
      meeting: {
        date,
        timeSlotId,
        confirmedAt: Date.now(),
      },
    },
  }
  return saveBundle(next)
}

export async function clearRoomMeeting(bundle: RoomBundle): Promise<RoomBundle> {
  const next: RoomBundle = {
    ...bundle,
    room: {
      ...bundle.room,
      meeting: null,
    },
  }
  return saveBundle(next)
}
