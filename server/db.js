import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DB_PATH = join(__dirname, 'data', 'store.json')

export function loadStore() {
  if (!existsSync(DB_PATH)) {
    return { rooms: {} }
  }
  try {
    const data = JSON.parse(readFileSync(DB_PATH, 'utf8'))
    return data?.rooms ? data : { rooms: {} }
  } catch {
    return { rooms: {} }
  }
}

export function saveStore(store) {
  mkdirSync(dirname(DB_PATH), { recursive: true })
  writeFileSync(DB_PATH, JSON.stringify(store, null, 2), 'utf8')
}

export function getRoomBundle(roomId) {
  const store = loadStore()
  return store.rooms[roomId] ?? null
}

export function putRoomBundle(bundle) {
  const store = loadStore()
  store.rooms[bundle.room.id] = bundle
  saveStore(store)
  return bundle
}

export function listRooms() {
  const store = loadStore()
  return Object.values(store.rooms)
}
