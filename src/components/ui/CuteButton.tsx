import type { ButtonHTMLAttributes, ReactNode } from 'react'

type CuteButtonVariant = 'primary' | 'accent' | 'secondary' | 'danger' | 'ghost'
type CuteButtonSize = 'md' | 'lg' | 'sm'

export type CuteButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: CuteButtonVariant
  size?: CuteButtonSize
  fullWidth?: boolean
  children: ReactNode
}

const VARIANT_CLASS: Record<CuteButtonVariant, string> = {
  primary: 'cute-btn cute-btn-primary',
  accent: 'cute-btn cute-btn-accent',
  secondary: 'cute-btn cute-btn-secondary',
  danger: 'cute-btn cute-btn-danger',
  ghost: 'cute-btn cute-btn-ghost',
}

const SIZE_CLASS: Record<CuteButtonSize, string> = {
  sm: 'cute-btn-sm',
  md: 'cute-btn-md',
  lg: 'cute-btn-lg',
}

export function CuteButton({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  type = 'button',
  children,
  ...props
}: CuteButtonProps) {
  return (
    <button
      type={type}
      className={[
        VARIANT_CLASS[variant],
        SIZE_CLASS[size],
        fullWidth ? 'w-full' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      <span className="cute-btn-label">{children}</span>
    </button>
  )
}
