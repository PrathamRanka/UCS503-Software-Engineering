import type { LucideIcon } from 'lucide-react'
import { AlertCircle, LoaderCircle } from 'lucide-react'

type StatePanelProps = {
  type: 'loading' | 'empty' | 'error'
  title?: string
  message?: string
  icon?: LucideIcon
  actionLabel?: string
  onAction?: () => void
}

export function StatePanel({ type, title, message, icon: Icon, actionLabel, onAction }: StatePanelProps) {
  const DefaultIcon = type === 'loading' ? LoaderCircle : AlertCircle
  const StateIcon = Icon ?? DefaultIcon
  return (
    <div className="grid min-h-72 place-items-center p-8 text-center">
      <div>
        <StateIcon className={`mx-auto text-neutral-300 ${type === 'loading' ? 'animate-spin motion-reduce:animate-none' : ''}`} size={42} />
        <h2 className="mt-4 text-lg font-semibold">{title ?? (type === 'loading' ? 'Loading…' : type === 'empty' ? 'Nothing here yet' : 'Something went wrong')}</h2>
        {message ? <p className="mx-auto mt-1 max-w-sm text-sm leading-5 text-neutral-500">{message}</p> : null}
        {actionLabel && onAction ? <button className="mt-5 rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white" onClick={onAction}>{actionLabel}</button> : null}
      </div>
    </div>
  )
}
