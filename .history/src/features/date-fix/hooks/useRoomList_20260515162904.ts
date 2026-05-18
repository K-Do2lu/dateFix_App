import { useCallback, useEffect, useState } from 'react'
import { getRoomList, subscribeRoomsListChanged } from '../lib/roomStore'
import type { RoomListItem } from '../types'

export function useRoomList(): { rooms: RoomListItem[]; loading: boolean } {
  const [rooms, setRooms] = useState<RoomListItem[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    try {
      const list = await getRoomList()
      setRooms(list)
    } catch {
      setRooms([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
    return subscribeRoomsListChanged(() => {
      void refresh()
    })
  }, [refresh])

  return { rooms, loading }
}
