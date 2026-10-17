import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCart, Trash2, Minus, Plus, CheckCircle2 } from 'lucide-react'
import { useCart } from '../hooks/useCart.js'
import { cartService } from '../services/cartService.js'
import { Input, Select, Textarea } from '../components/ui/Field.jsx'
import Alert from '../components/ui/Alert.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import ProductImage from '../components/shop/ProductImage.jsx'
import { formatCurrency } from '../utils/formatter.js'
import { isValidPhone } from '../utils/validator.js'
import { PAYMENT_METHOD_OPTIONS } from '../utils/constants.js'

export default function Cart() {
  const { cart, setCart, refreshCart } = useCart()
  const [form, setForm] = useState({ deliveryAddress: '', paymentMethod: 'UPI', buyerPhone: '' })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)
  const [done, setDone] = useState(false)
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const wrap = async (fn) => { setError(null); try { setCart(await fn()) } catch (e) { setError(e.message) } }

  const checkout = async (e) => {
    e.preventDefault()
    if (!isValidPhone(form.buyerPhone)) return setError('Enter a valid phone number')
    setBusy(true); setError(null)
    try { await cartService.checkout(form); await refreshCart(); setDone(true) }
    catch (err) { setError(err.message); refreshCart() }
    finally { setBusy(false) }
  }

  if (done) return <div className="page py-10"><EmptyState icon={CheckCircle2} title="Orders placed!" action={<Link to="/orders" className="btn-primary">View my orders</Link>}>Each seller has been notified.</EmptyState></div>
  if (!cart.items.length) return <div className="page py-10"><EmptyState icon={ShoppingCart} title="Your cart is empty" action={<Link to="/" className="btn-primary">Start shopping</Link>}>Add products, or chat with a product's assistant to negotiate first.</EmptyState></div>

  return (
    <div className="page py-8">
      <h1 className="mb-6 text-3xl font-extrabold">Your cart</h1>
      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-3">
          {cart.items.map((it) => (
            <div key={it.sellerId} className="card flex gap-4 p-4">
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl"><ProductImage src={it.thumbnailImage} name={it.productName} /></div>
              <div className="min-w-0 flex-1">
                <Link to={`/product/${it.sellerId}`} className="line-clamp-1 font-bold hover:text-brand-700">{it.productName}</Link>
                <p className="text-sm text-ink-500">{formatCurrency(it.listedPrice)} each</p>
                <div className="mt-2 flex items-center gap-3">
                  <div className="flex items-center rounded-lg border border-ink-200">
                    <button className="p-1.5" onClick={() => wrap(() => cartService.updateQuantity(it.sellerId, Math.max(1, it.quantity - 1)))} aria-label="Less"><Minus className="h-4 w-4" /></button>
                    <span className="w-8 text-center text-sm font-semibold">{it.quantity}</span>
                    <button className="p-1.5" onClick={() => wrap(() => cartService.updateQuantity(it.sellerId, it.quantity + 1))} aria-label="More"><Plus className="h-4 w-4" /></button>
                  </div>
                  <button className="text-sm font-medium text-rose-600 hover:underline" onClick={() => wrap(() => cartService.removeItem(it.sellerId))}><Trash2 className="mr-1 inline h-4 w-4" />Remove</button>
                </div>
              </div>
              <p className="font-display text-lg font-extrabold">{formatCurrency(it.lineTotal)}</p>
            </div>
          ))}
          <Alert type="info">Cart items are bought at the listed price. To bargain, open the product and chat with its assistant.</Alert>
        </div>

        <form onSubmit={checkout} className="card h-fit space-y-4 p-5 lg:sticky lg:top-20">
          <h2 className="text-lg font-bold">Checkout</h2>
          {error && <Alert type="error">{error}</Alert>}
          <Textarea id="addr" label="Delivery address" rows={2} placeholder="House, street, area, city, pincode" value={form.deliveryAddress} onChange={set('deliveryAddress')} required />
          <Select id="pay" label="Payment method" value={form.paymentMethod} onChange={set('paymentMethod')}>{PAYMENT_METHOD_OPTIONS.map((m) => <option key={m}>{m}</option>)}</Select>
          <Input id="phone" label="Phone" type="tel" value={form.buyerPhone} onChange={set('buyerPhone')} required />
          <div className="flex justify-between border-t border-ink-100 pt-3 text-lg font-bold"><span>Subtotal</span><span>{formatCurrency(cart.subtotal)}</span></div>
          <p className="hint !mt-0">Delivery charges are added per seller at checkout.</p>
          <button className="btn-primary btn-lg w-full" disabled={busy}>{busy ? 'Placing…' : 'Place orders'}</button>
        </form>
      </div>
    </div>
  )
}
