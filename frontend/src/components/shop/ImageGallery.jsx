import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import ProductImage from './ProductImage.jsx'
import { classNames } from '../../utils/helpers.js'

export default function ImageGallery({ images = [], name }) {
  const [index, setIndex] = useState(0)
  const list = images.length ? images : [null]
  const go = (d) => setIndex((i) => (i + d + list.length) % list.length)

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-2xl border border-ink-100 bg-ink-100 sm:aspect-[4/3]">
        <ProductImage src={list[index]} name={name} />
        {list.length > 1 && (
          <>
            <button onClick={() => go(-1)} className="absolute left-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white/90 shadow hover:bg-white" aria-label="Previous photo"><ChevronLeft className="h-5 w-5" /></button>
            <button onClick={() => go(1)} className="absolute right-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white/90 shadow hover:bg-white" aria-label="Next photo"><ChevronRight className="h-5 w-5" /></button>
          </>
        )}
      </div>
      {list.length > 1 && (
        <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
          {list.map((src, i) => (
            <button key={i} onClick={() => setIndex(i)} className={classNames('h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2', i === index ? 'border-brand-600' : 'border-transparent opacity-70 hover:opacity-100')}>
              <ProductImage src={src} name={name} />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
