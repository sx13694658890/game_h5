import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
}

export function Button({ children, className = '', ...rest }: Props) {
  return (
    <button
      type="button"
      className={`rounded-lg border border-cyan-400/40 bg-cyan-500/10 px-4 py-2 font-body text-sm text-cyan-300 shadow-[var(--shadow-neon)] transition hover:bg-cyan-500/20 ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}
