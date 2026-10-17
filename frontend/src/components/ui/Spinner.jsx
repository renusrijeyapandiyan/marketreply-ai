import { Loader2 } from 'lucide-react'
import { classNames } from '../../utils/helpers.js'

export default function Spinner({ label, className = '' }) {
  return (
    <div className={classNames('flex items-center justify-center gap-2 py-10 text-sm text-ink-500', className)} role="status">
      <Loader2 className="h-5 w-5 animate-spin text-brand-600" />
      {label && <span>{label}</span>}
    </div>
  )
}
