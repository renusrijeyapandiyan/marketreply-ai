import { Truck, MapPin, CreditCard, Gauge, Ruler, StickyNote, Mail } from 'lucide-react'
import Modal from '../common/Modal.jsx'
import ProductGallery from './ProductGallery.jsx'
import { formatCurrency } from '../../utils/formatter.js'

function Row({ icon: Icon, label, value }) {
  if (value === null || value === undefined || value === '') return null
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-slate-100 last:border-0">
      <Icon className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
      <div>
        <p className="text-xs text-slate-400">{label}</p>
        <p className="text-sm text-slate-800">{value}</p>
      </div>
    </div>
  )
}

export default function SellerDetailModal({ seller, onClose }) {
  const rules = seller?.rules || {}

  return (
    <Modal open={!!seller} title={seller?.productName || 'Product details'} onClose={onClose}>
      {seller && (
        <div>
          <ProductGallery images={seller.productImages} alt={seller.productName} />

          <p className="text-sm text-slate-500 flex items-center gap-1.5 mb-1">
            <Mail className="h-3.5 w-3.5" /> {seller.name} · {seller.email}
          </p>

          {seller.productDescription && (
            <p className="text-sm text-slate-600 mt-3 leading-relaxed">{seller.productDescription}</p>
          )}

          <div className="mt-4 rounded-xl bg-slate-50 px-4">
            <Row icon={Gauge} label="Listed price" value={formatCurrency(seller.listedPrice)} />
            <Row icon={Gauge} label="Minimum acceptable price" value={formatCurrency(rules.minPrice)} />
            <Row
              icon={Ruler}
              label="Size"
              value={seller.productSize === 'CUSTOMIZE' ? 'Customizable / made to order' : seller.productSize}
            />
            <Row icon={Truck} label="Delivery" value={rules.deliveryAvailable ? 'Available' : 'Not available'} />
            <Row icon={MapPin} label="Pickup" value={rules.pickupAvailable ? 'Available' : 'Not available'} />
            <Row
              icon={Ruler}
              label="Max delivery distance"
              value={rules.maxDeliveryDistanceKm != null ? `${rules.maxDeliveryDistanceKm} km` : null}
            />
            <Row icon={CreditCard} label="Accepted payment methods" value={rules.acceptedPaymentMethods?.join(', ')} />
            <Row
              icon={Gauge}
              label="Negotiation style"
              value={rules.negotiationStyle ? rules.negotiationStyle.charAt(0) + rules.negotiationStyle.slice(1).toLowerCase() : null}
            />
            <Row icon={StickyNote} label="Additional notes" value={rules.additionalNotes} />
          </div>
        </div>
      )}
    </Modal>
  )
}