import type { LocalProfile, RoomBundle, RoomListItem } from '../types'

const API_BASE = import.meta.env.VITE_API_URL ?? ''

class RoomApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  })

  if (!res.ok) {
    let message = `Request failed (${res.status})`
    try {
      const body = (await res.json()) as { error?: string }
      if (body.error) {
        message = body.error
      }
    } catch {
      /* ignore */
    }
    throw new RoomApiError(message, res.status)
  }

  if (res.status === 204) {
    return undefined as T
  }
  return res.json() as Promise<T>
}

export async function checkApiHealth(): Promise<boolean> {
  try {
    await request<{ ok: boolean }>('/api/health')
    return true
  } catch {
    return false
  }
}

export async function fetchRoomList(): Promise<RoomListItem[]> {
  return request<RoomListItem[]>('/api/rooms')
}

export async function fetchRoomBundle(roomId: string): Promise<RoomBundle | null> {
  try {
    return await request<RoomBundle>(`/api/rooms/${roomId}`)
  } catch (e) {
    if (e instanceof RoomApiError && e.status === 404) {
      return null
    }
    throw e
  }
}

export async function createRoomOnServer(
  candidateDates: string[],
  title: string,
  hostName?: string,
): Promise<{ bundle: RoomBundle; profile?: LocalProfile }> {
  return request('/api/rooms', {
    method: 'POST',
    body: JSON.stringify({ title, candidateDates, hostName }),
  })
}

export async function saveRoomBundleOnServer(bundle: RoomBundle): Promise<RoomBundle> {
  return request(`/api/rooms/${bundle.room.id}`, {
    method: 'PUT',
    body: JSON.stringify(bundle),
  })
}

export async function joinRoomOnServer(
  roomId: string,
  name: string,
): Promise<{ bundle: RoomBundle; profile: LocalProfile }> {
  return request(`/api/rooms/${roomId}/join`, {
    method: 'POST',
    body: JSON.stringify({ name }),
  })
}

export { RoomApiError }
