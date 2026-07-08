import { classNames } from '../../utils/helpers.js'

const FILTERS = [
  { key: 'ALL', label: 'All' },
  { key: 'COMPLIANT', label: 'Rule-compliant' },
  { key: 'VIOLATION', label: 'Violations' },
]

export default function FilterBar({ activeFilter, onChange }) {
  return (
    <div className="flex gap-2">
      {FILTERS.map((f) => (
        <button
          key={f.key}
          type="button"
          onClick={() => onChange(f.key)}
          className={classNames(
            'px-3.5 py-2 rounded-xl text-sm font-medium border transition-colors',
            activeFilter === f.key
              ? 'bg-slate-900 border-slate-900 text-white'
              : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
          )}
        >
          {f.label}
        </button>
      ))}
    </div>
  )
}
