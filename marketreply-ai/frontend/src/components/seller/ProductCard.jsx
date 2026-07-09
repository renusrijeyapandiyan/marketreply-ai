import { formatCurrency } from '../../utils/formatter.js'
import { classNames } from '../../utils/helpers.js'

export default function ProductCard({ seller, active, onSelect, onEdit, onDelete }) {
  return (
    <div
      className={classNames(
        'card p-5 cursor-pointer transition-all',
        active ? 'ring-2 ring-brand-500' : 'card-hover'
      )}
      onClick={() => onSelect(seller.id)}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="font-display font-semibold text-slate-900">{seller.productName}</p>
          <p className="text-sm text-slate-500 mt-0.5">{seller.name} · {seller.email}</p>
        </div>
        <span className="badge-brand">{formatCurrency(seller.listedPrice)}</span>
      </div>

      {seller.productDescription && (
        <p className="text-sm text-slate-500 mt-3 line-clamp-2">{seller.productDescription}</p>
      )}

      <div className="flex flex-wrap gap-2 mt-4">
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
  )
}
