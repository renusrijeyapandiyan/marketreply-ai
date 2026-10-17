import { AlertCircle, CheckCircle2, Info } from 'lucide-react'
import { classNames } from '../../utils/helpers.js'

const STYLES = {
  error: ['border-rose-200 bg-rose-50 text-rose-800', AlertCircle],
  success: ['border-emerald-200 bg-emerald-50 text-emerald-800', CheckCircle2],
  info: ['border-brand-200 bg-brand-50 text-brand-900', Info],
}

export default function Alert({ type = 'info', children, className = '' }) {
  const [style, Icon] = STYLES[type]
  return (
    <div className={classNames('flex items-start gap-2.5 rounded-xl border px-3.5 py-3 text-sm', style, className)} role={type === 'error' ? 'alert' : 'status'}>
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <div>{children}</div>
    </div>
  )
}
