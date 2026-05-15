import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { AppGuideModal } from '../components/guide/AppGuideModal'
import { hasSeenAppGuide, markAppGuideSeen } from '../lib/onboarding'

type AppGuideContextValue = {
  openGuide: () => void
}

const AppGuideContext = createContext<AppGuideContextValue | null>(null)

export function AppGuideProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    if (checked) {
      return
    }
    setChecked(true)
    if (!hasSeenAppGuide()) {
      setOpen(true)
    }
  }, [checked])

  const closeGuide = useCallback(() => {
    markAppGuideSeen()
    setOpen(false)
  }, [])

  const openGuide = useCallback(() => {
    setOpen(true)
  }, [])

  const value = useMemo(() => ({ openGuide }), [openGuide])

  return (
    <AppGuideContext.Provider value={value}>
      {children}
      <AppGuideModal open={open} onClose={closeGuide} />
    </AppGuideContext.Provider>
  )
}

export function useAppGuide(): AppGuideContextValue {
  const ctx = useContext(AppGuideContext)
  if (!ctx) {
    throw new Error('useAppGuide must be used within AppGuideProvider')
  }
  return ctx
}
