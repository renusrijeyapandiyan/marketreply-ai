import { classNames } from '../../utils/helpers.js'

export default function Toggle({ checked, onChange, label, description }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={classNames(
        'flex w-full items-center justify-between gap-4 rounded-xl border p-3.5 text-left transition',
        checked ? 'border-brand-300 bg-brand-50/60' : 'border-ink-200 bg-white hover:border-ink-300',
      )}
    >
      <span>
        <span className="block text-sm font-semibold text-ink-900">{label}</span>
        {description && <span className="block text-xs text-ink-500">{description}</span>}
      </span>
      <span className={classNames('relative h-6 w-11 shrink-0 rounded-full transition', checked ? 'bg-brand-600' : 'bg-ink-300')}>
        <span className={classNames('absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all', checked ? 'left-[22px]' : 'left-0.5')} />
      </span>
    </button>
  )
}
