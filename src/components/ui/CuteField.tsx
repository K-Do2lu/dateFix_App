import type { ReactNode } from 'react'

type CuteFieldProps = {
  label: string
  htmlFor?: string
  hint?: string
  className?: string
  children: ReactNode
}

export function CuteField({ label, htmlFor, hint, className = '', children }: CuteFieldProps) {
  return (
    <div className={['min-w-0 w-full', className].filter(Boolean).join(' ')}>
      <label htmlFor={htmlFor} className="mb-1.5 block text-[13px] font-semibold text-neutral-700">
        {label}
      </label>
      {children}
      {hint ? <p className="mt-1.5 text-xs text-neutral-400">{hint}</p> : null}
    </div>
  )
}
