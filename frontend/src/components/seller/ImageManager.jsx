import { useRef, useState } from 'react'
import { ImagePlus, X, Loader2 } from 'lucide-react'
import { compressImage } from '../../utils/image.js'

const MAX = 5

/** Existing photos (data URIs from the server) plus newly picked files that upload when the product is saved. */
export default function ImageManager({ existing, pending, onAddFiles, onRemoveExisting, onRemovePending }) {
  const input = useRef(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)
  const total = existing.length + pending.length

  const pick = async (e) => {
    const files = Array.from(e.target.files || []).slice(0, MAX - total)
    e.target.value = ''
    if (!files.length) return
    setBusy(true)
    setError(null)
    try {
      onAddFiles(await Promise.all(files.map((f) => compressImage(f))))
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
        {existing.map((src, i) => (
          <Thumb key={`e${i}`} src={src} cover={i === 0} onRemove={() => onRemoveExisting(i)} />
        ))}
        {pending.map((file, i) => (
          <Thumb key={`p${i}`} src={URL.createObjectURL(file)} cover={existing.length === 0 && i === 0} onRemove={() => onRemovePending(i)} isNew />
        ))}
        {total < MAX && (
          <button type="button" onClick={() => input.current?.click()} disabled={busy}
            className="grid aspect-square place-items-center rounded-xl border-2 border-dashed border-ink-300 text-ink-500 transition hover:border-brand-500 hover:bg-brand-50 hover:text-brand-700">
            {busy ? <Loader2 className="h-6 w-6 animate-spin" /> : <span className="flex flex-col items-center gap-1 text-xs font-semibold"><ImagePlus className="h-6 w-6" /> Add photo</span>}
          </button>
        )}
      </div>
      <input ref={input} type="file" accept="image/*" multiple hidden onChange={pick} />
      <p className="hint">Up to {MAX} photos. The first one is the cover. Photos are resized automatically.</p>
      {error && <p className="field-error">{error}</p>}
    </div>
  )
}

function Thumb({ src, cover, onRemove, isNew }) {
  return (
    <div className="group relative aspect-square overflow-hidden rounded-xl border border-ink-200 bg-ink-100">
      <img src={src} alt="" className="h-full w-full object-cover" />
      {cover && <span className="absolute bottom-1.5 left-1.5 badge bg-ink-900/80 text-white !py-0.5">Cover</span>}
      {isNew && <span className="absolute left-1.5 top-1.5 badge bg-accent-500 text-white !py-0.5">New</span>}
      <button type="button" onClick={onRemove} className="absolute right-1.5 top-1.5 grid h-6 w-6 place-items-center rounded-full bg-white/95 text-ink-700 shadow hover:text-rose-600" aria-label="Remove photo">
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}
