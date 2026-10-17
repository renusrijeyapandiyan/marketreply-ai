import { Truck, MapPin, CreditCard, RotateCcw, ShieldCheck, Store } from 'lucide-react'
import { formatCurrency } from '../../utils/formatter.js'

function Row({ icon: Icon, title, children }) {
  return (
    <div className="flex gap-3">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700"><Icon className="h-4.5 w-4.5" /></span>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-ink-900">{title}</p>
        <div className="text-sm text-ink-600">{children}</div>
      </div>
    </div>
  )
}

/** Everything the buyer needs to know before ordering - the same facts the AI assistant answers from. */
export default function DeliveryInfo({ product: p }) {
  return (
    <div className="card space-y-4 p-5">
      {p.deliveryAvailable && (
        <Row icon={Truck} title="Home delivery">
          {p.deliveryCharge > 0 ? formatCurrency(p.deliveryCharge) : 'Free'}
          {p.freeDeliveryAbove > 0 && p.deliveryCharge > 0 && <> · free above {formatCurrency(p.freeDeliveryAbove)}</>}
          {p.estimatedDeliveryDays ? <> · about {p.estimatedDeliveryDays} day{p.estimatedDeliveryDays > 1 ? 's' : ''}</> : null}
        </Row>
      )}
      {p.deliveryAvailable && p.deliveryLocations?.length > 0 && (
        <Row icon={MapPin} title="Delivers to">{p.deliveryLocations.join(', ')}</Row>
      )}
      {p.pickupAvailable && <Row icon={Store} title="Pickup">{p.pickupAddress || 'Available from the seller'}</Row>}
      {p.acceptedPaymentMethods?.length > 0 && <Row icon={CreditCard} title="Payment">{p.acceptedPaymentMethods.join(' · ')}</Row>}
      {p.returnPolicy && <Row icon={RotateCcw} title="Returns">{p.returnPolicy}</Row>}
      {p.warranty && <Row icon={ShieldCheck} title="Warranty">{p.warranty}</Row>}
    </div>
  )
}
