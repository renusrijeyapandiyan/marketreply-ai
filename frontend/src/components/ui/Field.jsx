import { classNames } from '../../utils/helpers.js'

/** Label + control + hint/error, so every form in the app looks and reads the same. */
export default function Field({ label, hint, error, htmlFor, children, className = '' }) {
  return (
    <div className={className}>
      {label && <label className="label" htmlFor={htmlFor}>{label}</label>}
      {children}
      {error ? <p className="field-error">{error}</p> : hint ? <p className="hint">{hint}</p> : null}
    </div>
  )
}

export function Input({ id, label, hint, error, className = '', prefix, ...props }) {
  return (
    <Field label={label} hint={hint} error={error} htmlFor={id} className={className}>
      <div className="relative">
        {prefix && <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-ink-400">{prefix}</span>}
        <input id={id} className={classNames('input', prefix && '!pl-8', error && '!border-rose-400')} {...props} />
      </div>
    </Field>
  )
}

export function Textarea({ id, label, hint, error, className = '', ...props }) {
  return (
    <Field label={label} hint={hint} error={error} htmlFor={id} className={className}>
      <textarea id={id} rows={3} className={classNames('input resize-y', error && '!border-rose-400')} {...props} />
    </Field>
  )
}

export function Select({ id, label, hint, error, className = '', children, ...props }) {
  return (
    <Field label={label} hint={hint} error={error} htmlFor={id} className={className}>
      <select id={id} className="input" {...props}>{children}</select>
    </Field>
  )
}
