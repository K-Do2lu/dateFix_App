import { useEffect, useState } from 'react'
import { CuteButton } from '../../../../components/ui/CuteButton'
import { APP_GUIDE_STEPS } from '../../lib/guideSteps'
import { GuideStepVisual } from './GuideStepVisual'

type AppGuideModalProps = {
  open: boolean
  onClose: () => void
}

export function AppGuideModal({ open, onClose }: AppGuideModalProps) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (open) {
      setIndex(0)
    }
  }, [open])

  if (!open) {
    return null
  }

  const step = APP_GUIDE_STEPS[index]
  const isLast = index === APP_GUIDE_STEPS.length - 1

  const handleClose = () => {
    setIndex(0)
    onClose()
  }

  const goNext = () => {
    if (isLast) {
      handleClose()
      return
    }
    setIndex((i) => i + 1)
  }

  return (
    <div
      className="fixed inset-0 z-[90] flex items-end justify-center bg-black/40 p-4 sm:items-center"
      role="presentation"
      onClick={handleClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="guide-title"
        className="cute-card w-full max-w-sm overflow-hidden p-0"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-3">
          <span className="text-xs font-semibold text-[#3da882]">
            이용 가이드 {index + 1}/{APP_GUIDE_STEPS.length}
          </span>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-full px-3 py-1 text-sm font-medium text-neutral-500 active:bg-neutral-100"
          >
            건너뛰기
          </button>
        </div>

        <div className="p-4">
          <GuideStepVisual stepId={step.id} />
          <h2 id="guide-title" className="mt-4 text-lg font-bold text-neutral-900">
            {step.title}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-neutral-600">{step.description}</p>

          <div className="mt-4 flex justify-center gap-1.5">
            {APP_GUIDE_STEPS.map((_, i) => (
              <span
                key={i}
                className={[
                  'h-1.5 rounded-full transition-all',
                  i === index ? 'w-5 bg-[#55CB9F]' : 'w-1.5 bg-neutral-200',
                ].join(' ')}
              />
            ))}
          </div>

          <CuteButton type="button" fullWidth size="lg" className="mt-5" onClick={goNext}>
            {isLast ? '시작하기' : '다음'}
          </CuteButton>
        </div>
      </div>
    </div>
  )
}
