import { Truck, MapPin, CreditCard, Gauge, Mail, ImageOff } from 'lucide-react'
import { formatCurrency } from '../../utils/formatter.js'

export default function SellerDetailCard({ seller, onViewDetails }) {
  const rules = seller.rules || {}
  const thumbnail = seller.productImages?.[0]

  return (
    <div className="card card-hover p-5 flex flex-col">
      <div className="flex items-start gap-3">
        <div className="h-16 w-16 rounded-lg border border-slate-200 bg-slate-50 overflow-hidden shrink-0 flex items-center justify-center">
          {thumbnail ? (
            <img src={thumbnail} alt={seller.productName} className="h-full w-full object-cover" />
          ) : (
            <ImageOff className="h-5 w-5 text-slate-300" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-display font-semibold text-slate-900 truncate">{seller.productName}</p>
          <p className="text-sm text-slate-500 mt-0.5 flex items-center gap-1.5 truncate">
            <Mail className="h-3.5 w-3.5 shrink-0" /> {seller.name} · {seller.email}
          </p>
        </div>
        <span className="badge-brand shrink-0">{formatCurrency(seller.listedPrice)}</span>
      </div>

      {seller.productDescription && (
        <p className="text-sm text-slate-500 mt-3 line-clamp-2">{seller.productDescription}</p>
      )}

      <div className="flex flex-wrap gap-2 mt-4">
        {seller.productSize && (
          <span className="badge-neutral">
            {seller.productSize === 'CUSTOMIZE' ? 'Customizable size' : `Size ${seller.productSize}`}
          </span>
        )}
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