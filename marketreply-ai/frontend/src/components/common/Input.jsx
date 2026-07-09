import { classNames } from '../../utils/helpers.js'

export default function Input({ label, error, className, id, ...props }) {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="label">
          {label}
        </label>
      )}
      <input id={id} className={classNames('input-field', error && 'border-rose-400 focus:ring-rose-100 focus:border-rose-500')} {...props} />
      {error && <p className="mt-1.5 text-xs text-rose-600">{error}</p>}
    </div>
  )
}
