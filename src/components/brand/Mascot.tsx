import { MASCOT_SRC } from '../../lib/constants'

const SIZES = {
  sm: 'w-16',
  md: 'w-24',
  lg: 'w-36',
  xl: 'w-52',
} as const

type MascotProps = {
  size?: keyof typeof SIZES
  /** 검은 배경 PNG를 그라데이션 위에 자연스럽게 올릴 때 */
  blend?: boolean
  className?: string
}

export function Mascot({ size = 'md', blend = false, className = '' }: MascotProps) {
  return (
    <img
      src={MASCOT_SRC}
      alt=""
      aria-hidden
      draggable={false}
      className={[
        SIZES[size],
        'h-auto select-none object-contain',
        blend ? 'mix-blend-screen' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    />
  )
}
