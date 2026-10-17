import { ShieldCheck } from 'lucide-react'
import { formatCurrency } from '../../utils/formatter.js'

/** Shown when every detail is collected: the buyer reviews and presses one button. */
export default function OrderSummary({ view, product, onConfirm, busy }) {
  const pickup = view.deliveryMethod === 'PICKUP'
  const rows = [
    ['Quantity', view.quantity],
    ['Price per unit', formatCurrency(view.unitPrice)],
    ['Delivery', view.deliveryCharge > 0 ? formatCurrency(view.deliveryCharge) : 'Free'],
    [pickup ? 'Pickup' : 'Deliver to', pickup ? (product.pickupAddress || 'From the seller') : view.deliveryAddress],
    ['Payment', view.paymentMethod],
    ['Phone', view.buyerPhone],
  ]
  return (
    <div className="animate-rise rounded-2xl border border-brand-200 bg-white p-4 shadow-card">
      <p className="mb-2 flex items-center gap-1.5 text-sm font-bold text-brand-800"><ShieldCheck className="h-4 w-4" /> Review your order</p>
      <p className="text-sm font-semibold text-ink-900">{product.productName}</p>
      <dl className="mt-2 divide-y divide-ink-100 text-sm">
        {rows.map(([k, v]) => (
          <div key={k} className="flex justify-between gap-4 py-1.5">
            <dt className="text-ink-500">{k}</dt>
            <dd className="text-right font-medium text-ink-800">{v}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-2 flex items-center justify-between border-t border-ink-200 pt-3">
        <span className="font-semibold">Total</span>
        <span className="font-display text-2xl font-extrabold text-ink-900">{formatCurrency(view.total)}</span>
      </div>
      <button onClick={onConfirm} disabled={busy} className="btn-accent btn-lg mt-3 w-full">{busy ? 'Placing order…' : 'Confirm & place order'}</button>
    </div>
  )
}
