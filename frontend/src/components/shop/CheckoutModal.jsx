import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'
import Modal from '../ui/Modal.jsx'
import Alert from '../ui/Alert.jsx'
import { Input, Select, Textarea } from '../ui/Field.jsx'
import { orderService } from '../../services/orderService.js'
import { formatCurrency } from '../../utils/formatter.js'
import { isValidPhone } from '../../utils/validator.js'

/** Buy at the listed price without chatting. (Negotiated deals are placed from the chat.) */
export default function CheckoutModal({ open, onClose, product: p }) {
  const defaultMethod = p.deliveryAvailable ? 'DELIVERY' : 'PICKUP'
  const [form, setForm] = useState({
    quantity: 1, deliveryMethod: defaultMethod, deliveryAddress: '', paymentMethod: p.acceptedPaymentMethods?.[0] || 'UPI', buyerPhone: '',
  })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)
  const [done, setDone] = useState(null)

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })
  const qty = Math.max(1, Number(form.quantity) || 1)
  const subtotal = p.listedPrice * qty
  const fee = form.deliveryMethod === 'DELIVERY' && p.deliveryCharge > 0 && !(p.freeDeliveryAbove > 0 && subtotal >= p.freeDeliveryAbove) ? p.deliveryCharge : 0

  const submit = async (e) => {
    e.preventDefault()
    if (!isValidPhone(form.buyerPhone)) return setError('Enter a valid phone number')
    setBusy(true)
    setError(null)
    try {
      setDone(await orderService.create({ sellerId: p.id, ...form, quantity: qty }))
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={done ? 'Order placed' : 'Buy now'}>
      {done ? (
        <div className="py-4 text-center">
          <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-500" />
          <p className="mt-3 text-lg font-bold">Thank you! Your order is in.</p>
          <p className="mt-1 text-sm text-ink-500">Total {formatCurrency(done.totalPrice)} · {done.paymentMethod}</p>
          <Link to="/orders" className="btn-primary mt-5">View my orders</Link>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          {error && <Alert type="error">{error}</Alert>}
          <div className="grid grid-cols-2 gap-3">
            <Input id="qty" label="Quantity" type="number" min="1" max={p.stock || undefined} value={form.quantity} onChange={set('quantity')} />
            <Select id="method" label="Receive by" value={form.deliveryMethod} onChange={set('deliveryMethod')}>
              {p.deliveryAvailable && <option value="DELIVERY">Home delivery</option>}
              {p.pickupAvailable && <option value="PICKUP">Pickup</option>}
            </Select>
          </div>
          {form.deliveryMethod === 'DELIVERY' && (
            <Textarea id="addr" label="Delivery address" rows={2} placeholder="House, street, area, city, pincode" value={form.deliveryAddress} onChange={set('deliveryAddress')} required
              hint={p.deliveryLocations?.length ? `Delivers to: ${p.deliveryLocations.join(', ')}` : undefined} />
          )}
          <div className="grid grid-cols-2 gap-3">
            <Select id="pay" label="Payment" value={form.paymentMethod} onChange={set('paymentMethod')}>
              {(p.acceptedPaymentMethods?.length ? p.acceptedPaymentMethods : ['UPI', 'Cash on Delivery']).map((m) => <option key={m}>{m}</option>)}
            </Select>
            <Input id="phone" label="Phone" type="tel" placeholder="10-digit number" value={form.buyerPhone} onChange={set('buyerPhone')} required />
          </div>
          <div className="rounded-xl bg-ink-50 p-3.5 text-sm">
            <div className="flex justify-between"><span className="text-ink-500">{qty} × {formatCurrency(p.listedPrice)}</span><span>{formatCurrency(subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-ink-500">Delivery</span><span>{fee > 0 ? formatCurrency(fee) : 'Free'}</span></div>
            <div className="mt-1.5 flex justify-between border-t border-ink-200 pt-1.5 text-base font-bold"><span>Total</span><span>{formatCurrency(subtotal + fee)}</span></div>
          </div>
          <button className="btn-primary btn-lg w-full" disabled={busy}>{busy ? 'Placing order…' : 'Place order'}</button>
          <p className="text-center text-xs text-ink-500">Want a better price? Close this and ask the AI assistant.</p>
        </form>
      )}
    </Modal>
  )
}
