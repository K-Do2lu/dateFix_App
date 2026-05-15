import { Outlet, useLocation } from 'react-router-dom'
import { InstallPrompt } from '../pwa/InstallPrompt'
import { PageDecor } from '../ui/PageDecor'

export function AppShell() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'
  const isRoom = pathname.startsWith('/room')

  let mainClass = 'relative flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-6'
  if (isHome) {
    mainClass = 'relative flex min-h-0 flex-1 flex-col'
  } else if (isRoom) {
    mainClass = 'relative flex min-h-0 flex-1 flex-col overflow-hidden'
  }

  return (
    <div className="cute-page mx-auto flex h-[100dvh] max-h-[100dvh] w-full max-w-md flex-col overflow-hidden text-neutral-800">
      <PageDecor variant="subtle" />
      <main className={mainClass}>
        <Outlet />
      </main>
      <InstallPrompt />
    </div>
  )
}
