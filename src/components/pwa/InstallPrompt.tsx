import { useCallback, useEffect, useState } from 'react'
import { CuteButton } from '../ui/CuteButton'

const DISMISS_KEY = 'datefix:pwa-install-dismissed'

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

function isStandalone(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  )
}

function isIos(): boolean {
  return /iphone|ipad|ipod/i.test(navigator.userAgent)
}

export function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null)
  const [dismissed, setDismissed] = useState(() => localStorage.getItem(DISMISS_KEY) === '1')
  const [hidden, setHidden] = useState(isStandalone)

  useEffect(() => {
    setHidden(isStandalone())

    const onInstallable = (e: Event) => {
      e.preventDefault()
      setDeferred(e as BeforeInstallPromptEvent)
    }

    const onInstalled = () => {
      setHidden(true)
      setDeferred(null)
    }

    window.addEventListener('beforeinstallprompt', onInstallable)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', onInstallable)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  const dismiss = useCallback(() => {
    localStorage.setItem(DISMISS_KEY, '1')
    setDismissed(true)
  }, [])

  const install = useCallback(async () => {
    if (!deferred) {
      return
    }
    await deferred.prompt()
    const { outcome } = await deferred.userChoice
    if (outcome === 'accepted') {
      setHidden(true)
    }
    setDeferred(null)
  }, [deferred])

  if (hidden || dismissed) {
    return null
  }

  if (deferred) {
    return (
      <div
        className="fixed inset-x-0 bottom-0 z-[80] mx-auto max-w-md px-4 pb-[max(1rem,env(safe-area-inset-bottom))]"
        role="region"
        aria-label="앱 설치 안내"
      >
        <div className="cute-card flex items-center gap-3 p-4 shadow-lg">
          <img src="/images/mascot.png" alt="" className="size-12 shrink-0 rounded-2xl object-contain" aria-hidden />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-neutral-900">Date Fix 설치</p>
            <p className="mt-0.5 text-xs text-neutral-500">홈 화면에 추가하고 앱처럼 쓸 수 있어요</p>
          </div>
          <div className="flex shrink-0 flex-col gap-1.5">
            <CuteButton type="button" size="sm" onClick={() => void install()}>
              설치
            </CuteButton>
            <button
              type="button"
              onClick={dismiss}
              className="text-[11px] font-medium text-neutral-400"
            >
              나중에
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (isIos()) {
    return (
      <div
        className="fixed inset-x-0 bottom-0 z-[80] mx-auto max-w-md px-4 pb-[max(1rem,env(safe-area-inset-bottom))]"
        role="region"
        aria-label="iPhone 앱 설치 안내"
      >
        <div className="cute-card p-4 shadow-lg">
          <p className="text-sm font-bold text-neutral-900">iPhone에 설치하기</p>
          <p className="mt-1 text-xs leading-relaxed text-neutral-500">
            Safari 하단 <span className="font-semibold text-neutral-700">공유</span> 버튼 →{' '}
            <span className="font-semibold text-neutral-700">홈 화면에 추가</span>
          </p>
          <button
            type="button"
            onClick={dismiss}
            className="mt-3 w-full text-center text-xs font-semibold text-neutral-400"
          >
            닫기
          </button>
        </div>
      </div>
    )
  }

  return null
}
