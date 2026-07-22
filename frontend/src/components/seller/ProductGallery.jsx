import { useState } from 'react'
import { ImageOff } from 'lucide-react'

/** Main image + clickable thumbnail strip, for viewing multi-photo product listings. */
export default function ProductGallery({ images = [], alt = 'Product photo' }) {
  const [active, setActive] = useState(0)
  const list = (images || []).filter(Boolean)

  if (list.length === 0) {
    return (
      <div className="h-48 w-full rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center mb-4">
        <ImageOff className="h-8 w-8 text-slate-300" />
      </div>
    )
  }

  return (
    <div className="mb-4">
      <div className="h-48 w-full rounded-xl border border-slate-200 bg-slate-50 overflow-hidden">
        <img src={list[active]} alt={alt} className="h-full w-full object-cover" />
      </div>
      {list.length > 1 && (
        <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
          {list.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              className={`h-14 w-14 rounded-lg overflow-hidden border shrink-0 ${
                i === active ? 'border-brand-600 ring-2 ring-brand-100' : 'border-slate-200'
              }`}
            >
              <img src={img} alt={`${alt} ${i + 1}`} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}