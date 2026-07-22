import { ImageOff, Tag } from 'lucide-react'
import { formatCurrency } from '../../utils/formatter.js'

export default function ProductPreview({ seller }) {
  if (!seller) return null
  const rules = seller.rules || {}

  return (
    <div className="card p-4 flex gap-4">
      <div className="h-20 w-20 rounded-lg border border-slate-200 bg-slate-50 overflow-hidden shrink-0 flex items-center justify-center">
        {seller.productImageUrl ? (
          <img src={seller.productImageUrl} alt={seller.productName} className="h-full w-full object-cover" />
        ) : (
          <ImageOff className="h-5 w-5 text-slate-300" />
        )}
      </div>
      <div className="min-w-0">
        <p className="font-display font-semibold text-slate-900 truncate">{seller.productName}</p>
        {seller.productDescription && (
          <p className="text-sm text-slate-500 line-clamp-2 mt-0.5">{seller.productDescription}</p>
        )}
        <p className="text-sm text-brand-600 font-medium mt-1.5 flex items-center gap-1">
          <Tag className="h-3.5 w-3.5" /> {formatCurrency(seller.listedPrice)}
          {rules.minPrice != null && (
            <span className="text-slate-400 font-normal">· min {formatCurrency(rules.minPrice)}</span>
          )}
        </p>
      </div>
    </div>
  )
}