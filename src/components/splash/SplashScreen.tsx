import { Mascot } from '../brand/Mascot'
import { IMessageBubble } from './IMessageBubble'
import { SplashTypingIndicator } from './SplashTypingIndicator'

type SplashScreenProps = {
  fadingOut: boolean
  onFadeOutEnd: () => void
}

export function SplashScreen({ fadingOut, onFadeOutEnd }: SplashScreenProps) {
  return (
    <div
      role="presentation"
      aria-hidden
      onTransitionEnd={(e) => {
        if (e.propertyName === 'opacity' && fadingOut) {
          onFadeOutEnd()
        }
      }}
      className={[
        'fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-white transition-opacity duration-500 ease-out',
        fadingOut ? 'pointer-events-none opacity-0' : 'opacity-100',
      ].join(' ')}
    >
      <div className="splash-bg-blob splash-bg-blob-a" aria-hidden />
      <div className="splash-bg-blob splash-bg-blob-b" aria-hidden />
      <div className="splash-bg-blob splash-bg-blob-c" aria-hidden />

      <div className="relative flex w-full max-w-xs flex-col items-center px-8">
        <div className="splash-mascot-wrap">
          <Mascot size="xl" className="splash-mascot w-44 max-w-[52vw] sm:w-52" />
        </div>

        <div className="relative mt-5 flex min-h-[3.25rem] w-full max-w-[16.5rem] items-end justify-center">
          <SplashTypingIndicator />
          <IMessageBubble tail="top" className="splash-bubble-reveal absolute bottom-0 w-fit">
            <p className="text-left text-[17px] leading-[1.35] tracking-[-0.01em] text-black">
              안녕 친구들아
            </p>
          </IMessageBubble>
        </div>
      </div>
    </div>
  )
}
