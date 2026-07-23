import { CheckCircle2 } from 'lucide-react'
import { formatCurrency } from '../../utils/formatter.js'

export default function OrderConfirmedBanner({ analysis }) {
  return (
    <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 flex items-start gap-3">
      <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
      <div>
        <p className="text-sm font-semibold text-emerald-800">Order placed automatically</p>
        <p className="text-xs text-emerald-700 mt-1">
          Agreed price: {formatCurrency(analysis.offeredPrice)}
          {analysis.requestedDeliveryMethod && analysis.requestedDeliveryMethod !== 'UNSPECIFIED' && (
            <> · {analysis.requestedDeliveryMethod === 'DELIVERY' ? 'Delivery' : 'Pickup'}</>
          )}
          {analysis.deliveryAddress && <> · {analysis.deliveryAddress}</>}
        </p>
      </div>
    </div>
  )
}