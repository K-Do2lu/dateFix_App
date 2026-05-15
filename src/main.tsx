import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { App } from './app/App'
import { AppGuideProvider } from './features/date-fix/context/AppGuideContext'
import { SplashGate } from './components/splash/SplashGate'
import './index.css'
import { registerSW } from 'virtual:pwa-register'

registerSW({ immediate: true })

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <SplashGate>
        <AppGuideProvider>
          <App />
        </AppGuideProvider>
      </SplashGate>
    </BrowserRouter>
  </StrictMode>,
)
