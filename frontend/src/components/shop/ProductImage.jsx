import { Package } from 'lucide-react'
import { classNames } from '../../utils/helpers.js'

const TINTS = ['from-brand-100 to-brand-200', 'from-accent-100 to-accent-200', 'from-sky-100 to-sky-200', 'from-rose-100 to-rose-200', 'from-violet-100 to-violet-200']

/** Product photo, or a soft tinted placeholder when the seller has not uploaded one. */
export default function ProductImage({ src, name = '', className = '' }) {
  if (src) return <img src={src} alt={name} loading="lazy" className={classNames('h-full w-full object-cover', className)} />
  const tint = TINTS[(name.length || 0) % TINTS.length]
  return (
    <div className={classNames('grid h-full w-full place-items-center bg-gradient-to-br', tint, className)} aria-label={name}>
      <Package className="h-10 w-10 text-ink-400/70" />
    </div>
  )
}
