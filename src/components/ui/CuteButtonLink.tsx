import type { ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router-dom'

type CuteButtonLinkVariant = 'primary' | 'accent'
type CuteButtonLinkSize = 'md' | 'lg'

type CuteButtonLinkProps = LinkProps & {
  variant?: CuteButtonLinkVariant
  size?: CuteButtonLinkSize
  children: ReactNode
  className?: string
}

const VARIANT_CLASS: Record<CuteButtonLinkVariant, string> = {
  primary: 'cute-btn cute-btn-primary',
  accent: 'cute-btn cute-btn-accent',
}

const SIZE_CLASS: Record<CuteButtonLinkSize, string> = {
  md: 'cute-btn-md',
  lg: 'cute-btn-lg',
}

/** 라우터 링크용 통통 버튼 */
export function CuteButtonLink({
  variant = 'accent',
  size = 'md',
  className = '',
  children,
  ...props
}: CuteButtonLinkProps) {
  return (
    <Link
      className={[VARIANT_CLASS[variant], SIZE_CLASS[size], 'w-full text-center', className]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {children}
    </Link>
  )
}
