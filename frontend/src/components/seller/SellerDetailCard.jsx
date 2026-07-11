import { Truck, MapPin, CreditCard, Gauge, Mail, StickyNote } from 'lucide-react'
import { formatCurrency } from '../../utils/formatter.js'

/**
 * Read-only, fully-detailed view of a seller's profile and product —
 * used on the "All Sellers" directory page (as opposed to ProductCard,
 * which is the compact edit/delete/select card used in Seller Settings).
 */
export default function SellerDetailCard({ seller, onViewDetails }) {
  const rules = seller.rules || {}

  return (
    <div className="card card-hover p-5 flex flex-col">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-display font-semibold text-slate-900">{seller.productName}</p>
          <p className="text-sm text-slate-500 mt-0.5 flex items-center gap-1.5">
            <Mail className="h-3.5 w-3.5" /> {seller.name} · {seller.email}
          </p>
        </div>
        <span className="badge-brand shrink-0">{formatCurrency(seller.listedPrice)}</span>
      </div>

      {seller.productDescription && (
        <p className="text-sm text-slate-500 mt-3 line-clamp-2">{seller.productDescription}</p>
      )}

      <div className="flex flex-wrap gap-2 mt-4">
        {rules.minPrice != null && <span className="badge-neutral">Min {formatCurrency(rules.minPrice)}</span>}
        {rules.deliveryAvailable && (
          <span className="badge-neutral flex items-center gap-1">
            <Truck className="h-3 w-3" /> Delivery
          </span>
        )}
        {rules.pickupAvailable && (
          <span className="badge-neutral flex items-center gap-1">
            <MapPin className="h-3 w-3" /> Pickup
          </span>
        )}
        {rules.negotiationStyle && (
          <span className="badge-neutral flex items-center gap-1">
            <Gauge className="h-3 w-3" /> {rules.negotiationStyle.toLowerCase()}
          </span>
        )}
      </div>

      {rules.acceptedPaymentMethods?.length > 0 && (
        <p className="text-xs text-slate-500 mt-3 flex items-start gap-1.5">
          <CreditCard className="h-3.5 w-3.5 mt-0.5 shrink-0" />
          {rules.acceptedPaymentMethods.join(', ')}
        </p>
      )}

      <button
        type="button"
        onClick={() => onViewDetails(seller)}
        className="mt-4 pt-4 border-t border-slate-100 text-sm font-medium text-brand-600 hover:text-brand-700 text-left"
      >
        View full details →
      </button>
    </div>
  )
}