import { Star } from 'lucide-react'
import { classNames } from '../../utils/helpers.js'

/**
 * Displays a 5-star rating. Pass `interactive` + `onChange` to turn it into
 * a clickable input (used by ReviewForm); otherwise it's read-only display.
 */
export default function StarRating({ value = 0, count, interactive = false, onChange, size = 'sm' }) {
  const sizeClass = size === 'lg' ? 'h-6 w-6' : size === 'md' ? 'h-4.5 w-4.5' : 'h-3.5 w-3.5'
  const stars = [1, 2, 3, 4, 5]

  return (
    <div className="flex items-center gap-1">
      {stars.map((star) => {
        const filled = star <= Math.round(value)
        return (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onChange?.(star)}
            className={classNames(
              interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default',
            )}
            aria-label={`${star} star${star === 1 ? '' : 's'}`}
          >
            <Star
              className={classNames(sizeClass, filled ? 'fill-gold-400 text-gold-400' : 'text-slate-200')}
            />
          </button>
        )
      })}
      {count !== undefined && (
        <span className="text-xs text-slate-400 ml-1">
          {value > 0 ? `${value.toFixed(1)} (${count})` : 'No reviews yet'}
        </span>
      )}
    </div>
  )
}