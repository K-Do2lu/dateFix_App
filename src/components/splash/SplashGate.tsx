import { useEffect, useState, type ReactNode } from 'react'
import { SplashScreen } from './SplashScreen'

const STORAGE_KEY_T0 = 'datefix:splash_t0'
const SPLASH_VISIBLE_MS = 2200
const THEME_COLOR = '#ffffff'

type SplashGateProps = {
  children: ReactNode
}

export function SplashGate({ children }: SplashGateProps) {
  const [splashMounted, setSplashMounted] = useState(true)
  const [fadingOut, setFadingOut] = useState(false)

  useEffect(() => {
    document.documentElement.classList.add('splash-active')
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLOR)

    const nav = performance.getEntriesByType('navigation')[0] as
      | PerformanceNavigationTiming
      | undefined
    if (nav?.type === 'reload') {
      sessionStorage.removeItem(STORAGE_KEY_T0)
    }

    const t0 = sessionStorage.getItem(STORAGE_KEY_T0)
    const start = t0 ? Number(t0) : Date.now()
    if (!t0) {
      sessionStorage.setItem(STORAGE_KEY_T0, String(start))
    }
    const elapsed = Date.now() - start
    const remaining = Math.max(0, SPLASH_VISIBLE_MS - elapsed)

    const showTimer = window.setTimeout(() => {
      setFadingOut(true)
    }, remaining)

    return () => {
      window.clearTimeout(showTimer)
    }
  }, [])

  const handleSplashEnd = () => {
    document.documentElement.classList.remove('splash-active')
    const meta = document.querySelector('meta[name="theme-color"]')
    meta?.setAttribute('content', '#ffffff')
    setSplashMounted(false)
  }

  return (
    <>
      {splashMounted ? (
        <SplashScreen fadingOut={fadingOut} onFadeOutEnd={handleSplashEnd} />
      ) : null}
      {!splashMounted ? children : null}
    </>
  )
}
