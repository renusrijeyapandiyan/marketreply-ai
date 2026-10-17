import { useState } from 'react'
import { X } from 'lucide-react'

/** Type a value and press Enter or comma to add it as a removable chip. */
export default function TagInput({ id, values, onChange, placeholder, suggestions = [] }) {
  const [text, setText] = useState('')

  const add = (raw) => {
    const v = raw.trim().replace(/,$/, '').trim()
    if (!v) return
    if (values.some((x) => x.toLowerCase() === v.toLowerCase())) { setText(''); return }
    onChange([...values, v])
    setText('')
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add(text) }
    else if (e.key === 'Backspace' && !text && values.length) onChange(values.slice(0, -1))
  }

  return (
    <div>
      <div className="flex min-h-[2.75rem] flex-wrap items-center gap-1.5 rounded-xl border border-ink-200 bg-white p-1.5 focus-within:border-brand-500 focus-within:ring-4 focus-within:ring-brand-100">
        {values.map((v) => (
          <span key={v} className="inline-flex items-center gap-1 rounded-lg bg-brand-50 px-2.5 py-1 text-sm font-medium text-brand-800">
            {v}
            <button type="button" onClick={() => onChange(values.filter((x) => x !== v))} aria-label={`Remove ${v}`}>
              <X className="h-3.5 w-3.5" />
            </button>
          </span>
        ))}
        <input
          id={id}
          className="min-w-[8rem] flex-1 bg-transparent px-2 py-1 text-sm outline-none placeholder:text-ink-400"
          value={text}
          placeholder={values.length ? '' : placeholder}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={() => add(text)}
        />
      </div>
      {suggestions.filter((s) => !values.some((v) => v.toLowerCase() === s.toLowerCase())).length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {suggestions.filter((s) => !values.some((v) => v.toLowerCase() === s.toLowerCase())).map((s) => (
            <button key={s} type="button" className="chip !px-2.5 !py-1 !text-xs" onClick={() => add(s)}>+ {s}</button>
          ))}
        </div>
      )}
    </div>
  )
}
