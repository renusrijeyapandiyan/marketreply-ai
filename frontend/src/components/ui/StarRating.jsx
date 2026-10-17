import { Star } from 'lucide-react'
import { classNames } from '../../utils/helpers.js'

/** Read-only by default; pass `interactive` + `onChange` to use it as an input. */
export default function StarRating({ value = 0, count, interactive = false, onChange, size = 'sm' }) {
  const dim = size === 'lg' ? 'h-6 w-6' : size === 'md' ? 'h-5 w-5' : 'h-4 w-4'
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={!interactive}
          onClick={() => interactive && onChange?.(n)}
          className={interactive ? 'transition hover:scale-110' : 'cursor-default'}
          aria-label={`${n} star${n === 1 ? '' : 's'}`}
        >
          <Star className={classNames(dim, n <= Math.round(value) ? 'fill-accent-400 text-accent-400' : 'text-ink-200')} />
        </button>
      ))}
      {count !== undefined && (
        <span className="ml-1.5 text-xs text-ink-500">{value > 0 ? `${Number(value).toFixed(1)} (${count})` : 'No reviews yet'}</span>
      )}
    </div>
  )
}
