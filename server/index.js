import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import { existsSync } from 'node:fs'
import { networkInterfaces } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { randomUUID } from 'node:crypto'
import { getRoomBundle, listRooms, putRoomBundle } from './db.js'
import { isPushConfigured, notifyRoomExcept } from './push.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const distPath = path.join(__dirname, '..', 'dist')
const hasWebBuild = existsSync(path.join(distPath, 'index.html'))

const app = express()
const PORT = Number(process.env.PORT) || 3001
const HOST = process.env.HOST || '0.0.0.0'

app.use(cors())
app.use(express.json({ limit: '1mb' }))

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, push: isPushConfigured() })
})

app.get('/api/push/vapid-public-key', (_req, res) => {
  const publicKey = process.env.VAPID_PUBLIC_KEY
  if (!publicKey) {
    res.json({ enabled: false })
    return
  }
  res.json({ enabled: true, publicKey })
})

app.put('/api/rooms/:roomId/push/subscribe', (req, res) => {
  const bundle = getRoomBundle(req.params.roomId)
  if (!bundle) {
    res.status(404).json({ error: 'Room not found' })
    return
  }

  const participantId = String(req.body?.participantId ?? '')
  const subscription = req.body?.subscription
  const participant = bundle.participants[participantId]

  if (!participant || !subscription?.endpoint || !subscription?.keys) {
    res.status(400).json({ error: 'Invalid subscription' })
    return
  }

  bundle.participants[participantId] = {
    ...participant,
    pushSubscription: {
      endpoint: subscription.endpoint,
      keys: {
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
      },
      expirationTime: subscription.expirationTime ?? null,
    },
  }
  putRoomBundle(bundle)
  res.json({ ok: true })
})

app.post('/api/rooms/:roomId/push/notify', async (req, res) => {
  const bundle = getRoomBundle(req.params.roomId)
  if (!bundle) {
    res.status(404).json({ error: 'Room not found' })
    return
  }

  const participantId = String(req.body?.participantId ?? '')
  const kind = String(req.body?.kind ?? '')
  const actor = bundle.participants[participantId]

  if (!actor) {
    res.status(400).json({ error: 'Invalid participant' })
    return
  }

  const roomPath = `/room/${bundle.room.id}`
  const overlapPath = `${roomPath}/overlap`
  let payload

  if (kind === 'overlap_scheduling') {
    payload = {
      title: 'Date Fix',
      body: String(req.body?.body ?? `${actor.name}님이 만날 날을 정하고 있어요`),
      url: overlapPath,
      tag: `datefix-overlap-${bundle.room.id}`,
    }
  } else if (kind === 'meeting_confirmed') {
    payload = {
      title: 'Date Fix',
      body: String(req.body?.body ?? `${actor.name}님이 약속을 정했어요`),
      url: roomPath,
      tag: `datefix-meeting-${bundle.room.id}`,
    }
  } else {
    res.status(400).json({ error: 'Invalid kind' })
    return
  }

  try {
    const result = await notifyRoomExcept(bundle, participantId, payload)
    res.json({ ok: true, ...result })
  } catch (err) {
    console.error('[push] notify failed', err)
    res.status(500).json({ error: 'Push failed' })
  }
})

/** 방 목록 (메인 화면) */
app.get('/api/rooms', (_req, res) => {
  const bundles = listRooms()
  const items = bundles
    .map((b) => ({
      id: b.room.id,
      title: b.room.title || '우리 모임',
      createdAt: b.room.createdAt,
      participantCount: Object.keys(b.participants).length,
      candidateDayCount: b.room.candidateDates.length,
      meeting: b.room.meeting ?? null,
    }))
    .sort((a, b) => b.createdAt - a.createdAt)
  res.json(items)
})

/** 방 생성 */
app.post('/api/rooms', (req, res) => {
  const { title, candidateDates, hostName } = req.body ?? {}
  if (!Array.isArray(candidateDates) || candidateDates.length === 0) {
    res.status(400).json({ error: 'candidateDates required' })
    return
  }

  const roomId = randomUUID()
  const room = {
    id: roomId,
    title: String(title ?? '').trim() || '우리 모임',
    candidateDates: [...new Set(candidateDates)].sort(),
    createdAt: Date.now(),
  }

  const bundle = { room, participants: {} }

  if (hostName && String(hostName).trim()) {
    const participantId = randomUUID()
    bundle.participants[participantId] = {
      id: participantId,
      name: String(hostName).trim(),
      availableDates: [],
    }
    putRoomBundle(bundle)
    res.status(201).json({
      bundle,
      profile: { participantId, name: bundle.participants[participantId].name },
    })
    return
  }

  putRoomBundle(bundle)
  res.status(201).json({ bundle })
})

app.get('/api/rooms/:roomId', (req, res) => {
  const bundle = getRoomBundle(req.params.roomId)
  if (!bundle) {
    res.status(404).json({ error: 'Room not found' })
    return
  }
  res.json(bundle)
})

/** 방 전체 저장 (참가자·날짜 동기화) */
app.put('/api/rooms/:roomId', (req, res) => {
  const bundle = req.body
  if (!bundle?.room?.id || bundle.room.id !== req.params.roomId) {
    res.status(400).json({ error: 'Invalid bundle' })
    return
  }
  putRoomBundle(bundle)
  res.json(bundle)
})

/** 방 입장 (새 참가자) */
app.post('/api/rooms/:roomId/join', (req, res) => {
  const bundle = getRoomBundle(req.params.roomId)
  if (!bundle) {
    res.status(404).json({ error: 'Room not found' })
    return
  }

  const name = String(req.body?.name ?? '').trim() || '익명'
  const participantId = randomUUID()
  const next = {
    ...bundle,
    participants: {
      ...bundle.participants,
      [participantId]: { id: participantId, name, availableDates: [] },
    },
  }
  putRoomBundle(next)
  res.json({
    bundle: next,
    profile: { participantId, name },
  })
})

if (hasWebBuild) {
  app.use(express.static(distPath, { index: false, maxAge: '1d' }))
  app.get(/^(?!\/api).*/, (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'))
  })
} else {
  app.get('/', (_req, res) => {
    res.status(200).type('html').send(`<!DOCTYPE html>
<html lang="ko"><head><meta charset="utf-8"><title>Date Fix</title></head>
<body style="font-family:sans-serif;max-width:28rem;margin:2rem auto;padding:0 1rem;line-height:1.6">
<h1>Date Fix</h1>
<p><strong>개발 모드</strong>에서는 Vite 주소로 열어 주세요.</p>
<p><a href="http://localhost:5173" style="color:#3da882;font-weight:bold">http://localhost:5173</a></p>
<p>앱 설치·배포용은 터미널에서 <code>npm run start</code> 후 이 주소(3001)를 사용하세요.</p>
</body></html>`)
  })
}

function printLanUrls(port) {
  const urls = []
  for (const ifaces of Object.values(networkInterfaces())) {
    if (!ifaces) {
      continue
    }
    for (const iface of ifaces) {
      if (iface.family === 'IPv4' && !iface.internal) {
        urls.push(`http://${iface.address}:${port}`)
      }
    }
  }
  if (urls.length > 0) {
    console.log('같은 Wi-Fi에서 폰으로 접속 (설치는 HTTPS 배포 URL 권장):')
    for (const url of urls) {
      console.log(`  ${url}`)
    }
  }
}

app.listen(PORT, HOST, () => {
  console.log(`Date Fix ${hasWebBuild ? 'app' : 'API only'} http://localhost:${PORT}`)
  if (!hasWebBuild) {
    console.log('웹 UI: npm run dev → http://localhost:5173  |  설치용: npm run start → http://localhost:3001')
  }
  if (hasWebBuild) {
    printLanUrls(PORT)
    console.log('PC에서 앱 설치: Chrome 주소창 오른쪽 「설치」 또는 하단 설치 배너')
  }
})
