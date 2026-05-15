import { useCallback, useEffect, useState } from 'react'
import { RoomApiError } from '../lib/roomApi'
import { getBundle, subscribeRoomSync } from '../lib/roomStore'
import type { RoomBundle } from '../types'

const POLL_MS = 3000

export function useRoomBundle(roomId: string | undefined): {
  bundle: RoomBundle | null
  loading: boolean
} {
  const [bundle, setBundle] = useState<RoomBundle | null>(null)
  const [loading, setLoading] = useState(Boolean(roomId))

  const refresh = useCallback(async () => {
    if (!roomId) {
      setBundle(null)
      setLoading(false)
      return
    }
    try {
      const next = await getBundle(roomId)
      setBundle(next)
    } catch (e) {
      if (e instanceof RoomApiError && e.status === 404) {
        setBundle(null)
      }
    } finally {
      setLoading(false)
    }
  }, [roomId])

  useEffect(() => {
    setLoading(Boolean(roomId))
    void refresh()
  }, [refresh, roomId])

  useEffect(() => {
    if (!roomId) {
      return
    }
    const interval = window.setInterval(() => {
      void refresh()
    }, POLL_MS)
    const unsub = subscribeRoomSync(roomId, () => {
      void refresh()
    })
    return () => {
      window.clearInterval(interval)
      unsub()
    }
  }, [roomId, refresh])

  return { bundle, loading }
}
