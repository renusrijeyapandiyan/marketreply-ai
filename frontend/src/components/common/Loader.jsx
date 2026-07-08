import { classNames } from '../../utils/helpers.js'

export default function Loader({ label = 'Loading…', size = 'md', className }) {
  const sizes = { sm: 'h-4 w-4', md: 'h-6 w-6', lg: 'h-9 w-9' }
  return (
    <div className={classNames('flex items-center gap-3 text-slate-500', className)}>
      <span
        className={classNames(
          sizes[size],
          'inline-block rounded-full border-2 border-slate-200 border-t-brand-600 animate-spin'
        )}
      />
      {label && <span className="text-sm">{label}</span>}
    </div>
  )
}
