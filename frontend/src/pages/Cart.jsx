import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Trash2, ShoppingCart, Minus, Plus } from 'lucide-react'
import { cartService } from '../services/cartService.js'
import { useCart } from '../hooks/useCart.js'
import { formatCurrency } from '../utils/formatter.js'
import Loader from '../components/common/Loader.jsx'
import Button from '../components/common/Button.jsx'

export default function Cart() {
  const navigate = useNavigate()
  const { cart, loading, refreshCart, setCart } = useCart()
  const [error, setError] = useState(null)
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('')
  const [checkingOut, setCheckingOut] = useState(false)
  const [placedOrders, setPlacedOrders] = useState(null)

  const changeQuantity = async (sellerId, quantity) => {
    setError(null)
    try {
      setCart(await cartService.updateQuantity(sellerId, quantity))
    } catch (err) {
      setError(err.message)
    }
  }

  const removeItem = async (sellerId) => {
    setError(null)
    try {
      setCart(await cartService.removeItem(sellerId))
    } catch (err) {
      setError(err.message)
    }
  }

  const handleCheckout = async (e) => {
    e.preventDefault()
    setError(null)
    setCheckingOut(true)
    try {
      const orders = await cartService.checkout({ deliveryAddress, paymentMethod })
      setPlacedOrders(orders)
      await refreshCart()
    } catch (err) {
      setError(err.message)
    } finally {
      setCheckingOut(false)
    }
  }

  if (loading && !cart.items.length) {
    return <Loader label="Loading your cart…" className="py-24 justify-center" />
  }

  if (placedOrders) {
    return (
      <div className="card p-8 text-center space-y-4 max-w-lg mx-auto">
        <ShoppingCart className="h-8 w-8 text-accent-600 mx-auto" />
        <h1 className="text-xl font-display font-bold text-slate-900">
          Order{placedOrders.length > 1 ? 's' : ''} placed!
        </h1>
        <p className="text-sm text-slate-500">
          {placedOrders.length} order{placedOrders.length > 1 ? 's have' : ' has'} been created and sent to the
          seller{placedOrders.length > 1 ? 's' : ''}.
        </p>
        <Button onClick={() => navigate('/orders')}>View my orders</Button>
      </div>
    )
  }

  const items = cart?.items || []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-slate-900">Cart</h1>
        <p className="text-sm text-slate-500 mt-1">
          Review your items and check out to place the order — no chat needed.
        </p>
      </div>

      {error && <div className="rounded-xl bg-rose-50 text-rose-700 text-sm px-4 py-3">{error}</div>}

      {items.length === 0 ? (
        <div className="card p-10 text-center text-slate-500">
          Your cart is empty.{' '}
          <Link to="/sellers" className="text-brand-600 font-medium">Browse products</Link> to add something.
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.sellerId} className="card p-4 flex items-center gap-4">
                <div className="h-14 w-14 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 overflow-hidden">
                  {item.thumbnailImage ? (
                    <img src={item.thumbnailImage} alt={item.productName} className="h-full w-full object-cover" />
                  ) : (
                    <ShoppingCart className="h-5 w-5 text-slate-300" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-800 truncate">{item.productName}</p>
                  <p className="text-sm text-slate-400">{formatCurrency(item.listedPrice)} each</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => changeQuantity(item.sellerId, item.quantity - 1)}
                    className="h-7 w-7 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => changeQuantity(item.sellerId, item.quantity + 1)}
                    className="h-7 w-7 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
                <p className="w-24 text-right font-semibold text-slate-800 shrink-0">
                  {formatCurrency(item.lineTotal)}
                </p>
                <button
                  type="button"
                  onClick={() => removeItem(item.sellerId)}
                  className="text-slate-300 hover:text-rose-600 shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          <form onSubmit={handleCheckout} className="card p-6 h-fit space-y-4">
            <h3 className="font-display font-semibold text-slate-900">Checkout</h3>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Items</span>
              <span className="font-medium text-slate-800">{cart.itemCount}</span>
            </div>
            <div className="flex items-center justify-between text-sm pb-3 border-b border-slate-100">
              <span className="text-slate-500">Subtotal</span>
              <span className="font-semibold text-slate-900">{formatCurrency(cart.subtotal)}</span>
            </div>
            <div>
              <label className="label" htmlFor="deliveryAddress">Delivery address</label>
              <textarea
                id="deliveryAddress"
                rows={2}
                className="input-field resize-none"
                required
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
              />
            </div>
            <div>
              <label className="label" htmlFor="paymentMethod">Preferred payment method</label>
              <input
                id="paymentMethod"
                className="input-field"
                placeholder="e.g. UPI, Cash"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
            </div>
            <button type="submit" className="btn-primary w-full justify-center" disabled={checkingOut}>
              {checkingOut ? 'Placing order…' : `Place order${items.length > 1 ? 's' : ''}`}
            </button>
            {items.length > 1 && (
              <p className="text-xs text-slate-400">Items from different sellers become separate orders.</p>
            )}
          </form>
        </div>
      )}
    </div>
  )
}