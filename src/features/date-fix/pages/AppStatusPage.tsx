import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CuteButton } from '../../../components/ui/CuteButton'
import { fetchAppHealth, type AppHealth } from '../lib/appStatusApi'
import { fetchVapidPublicKey } from '../lib/pushApi'
import { getPushPermission, isPushSupported } from '../lib/pushClient'

type RowState = 'ok' | 'warn' | 'fail' | 'loading'

type StatusRow = {
  label: string
  detail: string
  state: RowState
}

function isStandaloneApp(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  )
}

function isProductionHost(): boolean {
  const host = window.location.hostname
  return host.includes('onrender.com') || host.includes('datefix')
}

function rowDot(state: RowState): string {
  if (state === 'ok') {
    return 'bg-[#55CB9F]'
  }
  if (state === 'warn') {
    return 'bg-amber-400'
  }
  if (state === 'fail') {
    return 'bg-red-400'
  }
  return 'bg-neutral-300 animate-pulse'
}

function buildRows(
  health: AppHealth | null | undefined,
  vapidEnabled: boolean | undefined,
  swReady: boolean | undefined,
): StatusRow[] {
  const permission = getPushPermission()
  const pushSupported = isPushSupported()
  const standalone = isStandaloneApp()
  const prod = isProductionHost()

  const rows: StatusRow[] = [
    {
      label: '서버 연결',
      detail: health?.ok ? 'API 응답 정상' : '서버에 연결할 수 없어요',
      state: health === undefined ? 'loading' : health?.ok ? 'ok' : 'fail',
    },
    {
      label: '배포 환경',
      detail: prod
        ? `운영 서버 (${window.location.host})`
        : `로컬·개발 (${window.location.host})`,
      state: health === undefined ? 'loading' : prod ? 'ok' : 'warn',
    },
  ]

  if (health?.commit) {
    rows.push({
      label: '배포 버전',
      detail: `커밋 ${health.commit.slice(0, 7)}`,
      state: 'ok',
    })
  }

  rows.push(
    {
      label: '푸시 서버 설정',
      detail:
        vapidEnabled === undefined
          ? '확인 중…'
          : vapidEnabled
            ? 'VAPID 키 등록됨'
            : '서버에 알림 키가 없어요 (Render 환경 변수)',
      state:
        vapidEnabled === undefined ? 'loading' : vapidEnabled ? 'ok' : 'fail',
    },
    {
      label: '알림 API',
      detail: pushSupported ? '이 기기에서 지원' : '이 브라우저는 알림을 지원하지 않아요',
      state: pushSupported ? 'ok' : 'fail',
    },
    {
      label: '알림 권한',
      detail:
        permission === 'granted'
          ? '허용됨'
          : permission === 'denied'
            ? '차단됨 — 기기 설정에서 허용해 주세요'
            : permission === 'default'
              ? '아직 묻지 않음 — 아래에서 켜 보세요'
              : '지원 안 됨',
      state:
        permission === 'granted' ? 'ok' : permission === 'denied' ? 'fail' : 'warn',
    },
    {
      label: '백그라운드 앱 (SW)',
      detail:
        swReady === undefined
          ? '확인 중…'
          : swReady
            ? '설치·업데이트 준비됨'
            : '잠시 후 다시 확인해 주세요',
      state: swReady === undefined ? 'loading' : swReady ? 'ok' : 'warn',
    },
    {
      label: '앱으로 실행',
      detail: standalone
        ? '홈 화면 앱 모드'
        : '브라우저 탭 — 홈 화면에 추가하면 앱처럼 쓸 수 있어요',
      state: standalone ? 'ok' : 'warn',
    },
  )

  return rows
}

export function AppStatusPage() {
  const [health, setHealth] = useState<AppHealth | null | undefined>(undefined)
  const [vapidEnabled, setVapidEnabled] = useState<boolean | undefined>(undefined)
  const [swReady, setSwReady] = useState<boolean | undefined>(undefined)
  const [refreshing, setRefreshing] = useState(false)
  const [testMsg, setTestMsg] = useState<string | null>(null)

  const load = useCallback(async () => {
    setRefreshing(true)
    setTestMsg(null)
    const [h, vapid] = await Promise.all([fetchAppHealth(), fetchVapidPublicKey()])
    setHealth(h)
    setVapidEnabled(vapid.enabled)

    if ('serviceWorker' in navigator) {
      try {
        const reg = await navigator.serviceWorker.ready
        setSwReady(Boolean(reg.active))
      } catch {
        setSwReady(false)
      }
    } else {
      setSwReady(false)
    }
    setRefreshing(false)
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const rows = buildRows(health, vapidEnabled, swReady)
  const allOk =
    health?.ok &&
    vapidEnabled &&
    isPushSupported() &&
    getPushPermission() === 'granted' &&
    swReady

  const requestPermission = async () => {
    if (!isPushSupported()) {
      return
    }
    const result = await Notification.requestPermission()
    setTestMsg(
      result === 'granted'
        ? '알림 권한이 허용됐어요.'
        : result === 'denied'
          ? '알림이 차단됐어요. 기기 설정에서 Date Fix를 허용해 주세요.'
          : null,
    )
    void load()
  }

  const sendTestNotification = () => {
    if (Notification.permission !== 'granted') {
      setTestMsg('먼저 알림 권한을 허용해 주세요.')
      return
    }
    try {
      new Notification('Date Fix', {
        body: '테스트 알림이에요! 배포·알림이 잘 동작해요.',
        icon: '/images/mascot.png',
        tag: 'datefix-status-test',
      })
      setTestMsg('테스트 알림을 보냈어요. 알림 센터를 확인해 보세요.')
    } catch {
      setTestMsg('테스트 알림을 보내지 못했어요.')
    }
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
      <Link to="/" className="cute-link-back active:opacity-80">
        홈
      </Link>

      <h1 className="mt-4 text-xl font-extrabold text-neutral-900">앱 상태</h1>
      <p className="mt-1 text-sm text-neutral-500">
        배포·알림이 잘 되는지 이 화면에서만 확인할 수 있어요.
      </p>

      <div
        className={`mt-5 rounded-2xl border px-4 py-3 text-sm font-semibold ${
          allOk
            ? 'border-[#55CB9F]/40 bg-[#f0faf5] text-[#2d8f6a]'
            : health === undefined
              ? 'border-neutral-200 bg-neutral-50 text-neutral-500'
              : 'border-amber-200/80 bg-amber-50 text-amber-900'
        }`}
      >
        {health === undefined
          ? '상태를 불러오는 중…'
          : allOk
            ? '모든 항목이 정상이에요. 앱으로 사용할 준비가 됐어요.'
            : '아래에서 주의·실패 항목을 확인해 주세요.'}
      </div>

      <ul className="mt-5 space-y-2">
        {rows.map((row) => (
          <li
            key={row.label}
            className="cute-card-soft flex items-start gap-3 px-4 py-3"
          >
            <span
              className={`mt-1.5 size-2.5 shrink-0 rounded-full ${rowDot(row.state)}`}
              aria-hidden
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-neutral-900">{row.label}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-neutral-500">{row.detail}</p>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-6 space-y-2">
        <CuteButton
          type="button"
          variant="primary"
          className="w-full"
          disabled={refreshing}
          onClick={() => void load()}
        >
          {refreshing ? '새로고침 중…' : '다시 확인'}
        </CuteButton>

        {getPushPermission() !== 'granted' && isPushSupported() ? (
          <CuteButton
            type="button"
            variant="secondary"
            className="w-full"
            onClick={() => void requestPermission()}
          >
            알림 권한 요청
          </CuteButton>
        ) : null}

        {getPushPermission() === 'granted' ? (
          <CuteButton
            type="button"
            variant="secondary"
            className="w-full"
            onClick={sendTestNotification}
          >
            테스트 알림 보내기
          </CuteButton>
        ) : null}
      </div>

      {testMsg ? (
        <p className="mt-3 text-center text-xs font-medium text-neutral-600">{testMsg}</p>
      ) : null}

      <p className="mt-8 text-center text-[11px] leading-relaxed text-neutral-400">
        운영 주소: https://datefix-app.onrender.com
        <br />
        홈 화면에 추가한 뒤 이 화면에서 확인하세요.
      </p>
    </div>
  )
}
