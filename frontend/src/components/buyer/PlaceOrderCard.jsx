import { useState } from 'react'
import { ShoppingCart, CheckCircle2 } from 'lucide-react'
import { ordersService } from '../../services/ordersService.js'
import { formatCurrency } from '../../utils/formatter.js'

export default function PlaceOrderCard({ seller, conversationId }) {
  const [quantity, setQuantity] = useState(1)
  const [deliveryMethod, setDeliveryMethod] = useState(
    seller.rules?.deliveryAvailable ? 'DELIVERY' : seller.rules?.pickupAvailable ? 'PICKUP' : ''
  )
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [buyerNotes, setBuyerNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [placedOrder, setPlacedOrder] = useState(null)

  const total = (seller.listedPrice || 0) * quantity

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      const order = await ordersService.create({
        sellerId: seller.id,
        conversationId: conversationId || undefined,
        quantity,
        deliveryMethod: deliveryMethod || undefined,
        deliveryAddress: deliveryMethod === 'DELIVERY' ? deliveryAddress : undefined,
        buyerNotes: buyerNotes || undefined,
      })
      setPlacedOrder(order)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (placedOrder) {
    return (
      <div className="card p-6 bg-accent-50 border-accent-100">
        <div className="flex items-center gap-2 text-accent-700">
          <CheckCircle2 className="h-5 w-5" />
          <h4 className="font-display font-semibold">Order placed</h4>
        </div>
        <p className="text-sm text-accent-700 mt-2">
          Your order for {placedOrder.quantity} × {placedOrder.productName} ({formatCurrency(placedOrder.totalPrice)}) is
          now pending with the seller. Track it under <span className="font-medium">Orders</span>.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="card p-6">
      <div className="flex items-center gap-2 mb-4">
        <ShoppingCart className="h-4.5 w-4.5 text-brand-600" />
        <h4 className="font-display font-semibold text-slate-900">Place an order</h4>
      </div>

      {error && (
        <div className="mb-4 rounded-xl bg-rose-50 text-rose-700 text-sm px-4 py-3">{error}</div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="label" htmlFor="quantity">Quantity</label>
          <input
            id="quantity"
            type="number"
            min="1"
            className="input-field"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
          />
        </div>

        {(seller.rules?.deliveryAvailable || seller.rules?.pickupAvailable) && (
          <div>
            <label className="label" htmlFor="deliveryMethod">Delivery method</label>
            <select
              id="deliveryMethod"
              className="input-field"
              value={deliveryMethod}
              onChange={(e) => setDeliveryMethod(e.target.value)}
            >
              {seller.rules?.deliveryAvailable && <option value="DELIVERY">Delivery</option>}
              {seller.rules?.pickupAvailable && <option value="PICKUP">Pickup</option>}
            </select>
          </div>
        )}
      </div>

      {deliveryMethod === 'DELIVERY' && (
        <div className="mt-4">
          <label className="label" htmlFor="deliveryAddress">Delivery address</label>
          <textarea
            id="deliveryAddress"
            rows={2}
            className="input-field resize-none"
            placeholder="Where should this be delivered?"
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
          />
        </div>
      )}

      <div className="mt-4">
        <label className="label" htmlFor="buyerNotes">Note to seller (optional)</label>
        <textarea
          id="buyerNotes"
          rows={2}
          className="input-field resize-none"
          placeholder="Anything the seller should know…"
          value={buyerNotes}
          onChange={(e) => setBuyerNotes(e.target.value)}
        />
      </div>

      <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-100">
        <p className="text-sm text-slate-500">
          Total: <span className="font-semibold text-slate-900">{formatCurrency(total)}</span>
        </p>
        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? 'Placing order…' : 'Place order'}
        </button>
      </div>
    </form>
  )
}