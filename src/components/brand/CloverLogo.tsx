import { CloverShape } from '../../features/date-fix/components/CloverShape'

const SIZES = {
  sm: 'h-10 w-10',
  md: 'h-14 w-14',
  lg: 'h-20 w-20',
  xl: 'h-28 w-28',
  hero: 'h-36 w-36',
} as const

type CloverLogoProps = {
  size?: keyof typeof SIZES
  className?: string
}

/** 앱 로고 — 네잎클로버 */
export function CloverLogo({ size = 'md', className = '' }: CloverLogoProps) {
  return (
    <div className={`relative flex items-center justify-center ${className}`} aria-hidden>
      <div className="absolute size-[85%] rounded-full bg-[#55CB9F]/12 blur-md" />
      <CloverShape className={`relative ${SIZES[size]}`} fill="#55CB9F" />
    </div>
  )
}
