import { ImageOff } from 'lucide-react'
import { formatCurrency } from '../../utils/formatter.js'
import { classNames } from '../../utils/helpers.js'
import { CUSTOM_SIZE } from '../../utils/constants.js'

export default function ProductCard({ seller, active, onSelect, onEdit, onDelete }) {
  const thumbnail = seller.productImages?.[0]
  const photoCount = seller.productImages?.length || 0

  return (
    <div
      className={classNames(
        'card overflow-hidden cursor-pointer transition-all',
        active ? 'ring-2 ring-brand-500' : 'card-hover'
      )}
      onClick={() => onSelect(seller.id)}
    >
      <div className="relative aspect-video bg-slate-100">
        {thumbnail ? (
          <img src={thumbnail} alt={seller.productName} className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-slate-300">
            <ImageOff className="h-8 w-8" />
          </div>
        )}
        {photoCount > 1 && (
          <span className="absolute bottom-2 right-2 rounded-full bg-slate-900/70 text-white text-xs px-2 py-0.5">
            +{photoCount - 1} more
          </span>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-display font-semibold text-slate-900">{seller.productName}</p>
            <p className="text-sm text-slate-500 mt-0.5">{seller.name} · {seller.email}</p>
          </div>
          <span className="badge-brand shrink-0">{formatCurrency(seller.listedPrice)}</span>
        </div>

        {seller.productDescription && (
          <p className="text-sm text-slate-500 mt-3 line-clamp-2">{seller.productDescription}</p>
        )}

        <div className="flex flex-wrap gap-2 mt-4">
          {seller.productSize === CUSTOM_SIZE ? (
            <span className="badge-neutral">Customizable size</span>
          ) : seller.productSize ? (
            <span className="badge-neutral">Size {seller.productSize}</span>
          ) : null}
          {seller.rules?.deliveryAvailable && <span className="badge-neutral">Delivery</span>}
          {seller.rules?.pickupAvailable && <span className="badge-neutral">Pickup</span>}
          {seller.rules?.minPrice != null && (
            <span className="badge-neutral">Min {formatCurrency(seller.rules.minPrice)}</span>
          )}
        </div>

        <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onEdit(seller) }}
            className="text-sm font-medium text-brand-600 hover:text-brand-700"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onDelete(seller.id) }}
            className="text-sm font-medium text-rose-600 hover:text-rose-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}