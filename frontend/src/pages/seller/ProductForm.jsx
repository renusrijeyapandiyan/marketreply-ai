import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { ChevronLeft, Lock, Calculator } from 'lucide-react'
import { Input, Select, Textarea } from '../../components/ui/Field.jsx'
import Toggle from '../../components/ui/Toggle.jsx'
import TagInput from '../../components/ui/TagInput.jsx'
import Alert from '../../components/ui/Alert.jsx'
import Spinner from '../../components/ui/Spinner.jsx'
import ImageManager from '../../components/seller/ImageManager.jsx'
import { productService } from '../../services/productService.js'
import { validateProductForm } from '../../utils/validator.js'
import { CATEGORIES, PAYMENT_METHOD_OPTIONS, NEGOTIATION_STYLES } from '../../utils/constants.js'
import { formatCurrency } from '../../utils/formatter.js'
import { classNames } from '../../utils/helpers.js'

const EMPTY = {
  productName: '', productDescription: '', category: '', listedPrice: '', stock: '', maxDiscountPercent: 10, negotiationStyle: 'MODERATE',
  deliveryAvailable: true, pickupAvailable: false, deliveryCharge: '', freeDeliveryAbove: '', estimatedDeliveryDays: '', deliveryLocations: [], pickupAddress: '',
  acceptedPaymentMethods: ['UPI', 'Cash on Delivery'], returnPolicy: '', warranty: '', additionalNotes: '',
}

const num = (v) => (v === '' || v === null || v === undefined ? null : Number(v))

function Section({ title, desc, children }) {
  return (
    <section className="card p-5 sm:p-6">
      <h2 className="text-lg font-bold">{title}</h2>
      {desc && <p className="mb-4 mt-0.5 text-sm text-ink-500">{desc}</p>}
      <div className="space-y-4">{children}</div>
    </section>
  )
}

export default function ProductForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const editing = Boolean(id)
  const [form, setForm] = useState(EMPTY)
  const [images, setImages] = useState([])
  const [pending, setPending] = useState([])
  const [errors, setErrors] = useState({})
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(editing)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!editing) return
    productService.getMine(id).then((p) => {
      const r = p.rules || {}
      setForm({
        productName: p.productName || '', productDescription: p.productDescription || '', category: p.category || '', listedPrice: p.listedPrice ?? '', stock: p.stock ?? '',
        maxDiscountPercent: r.maxDiscountPercent ?? 0, negotiationStyle: r.negotiationStyle || 'MODERATE',
        deliveryAvailable: !!r.deliveryAvailable, pickupAvailable: !!r.pickupAvailable, deliveryCharge: r.deliveryCharge ?? '', freeDeliveryAbove: r.freeDeliveryAbove ?? '',
        estimatedDeliveryDays: r.estimatedDeliveryDays ?? '', deliveryLocations: r.deliveryLocations || [], pickupAddress: r.pickupAddress || '',
        acceptedPaymentMethods: r.acceptedPaymentMethods || [], returnPolicy: r.returnPolicy || '', warranty: r.warranty || '', additionalNotes: r.additionalNotes || '',
      })
      setImages(p.productImages || [])
    }).catch((e) => setError(e.message)).finally(() => setLoading(false))
  }, [id, editing])

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })
  const patch = (o) => setForm({ ...form, ...o })

  const listed = Number(form.listedPrice) || 0
  const pct = Math.min(90, Math.max(0, Number(form.maxDiscountPercent) || 0))
  const minPrice = Math.round(listed * (1 - pct / 100) * 100) / 100

  const submit = async (e) => {
    e.preventDefault()
    const errs = validateProductForm(form)
    setErrors(errs)
    if (Object.keys(errs).length) return window.scrollTo({ top: 0, behavior: 'smooth' })
    setSaving(true); setError(null)
    const payload = {
      productName: form.productName.trim(), productDescription: form.productDescription.trim(), category: form.category || null,
      listedPrice: Number(form.listedPrice), stock: num(form.stock),
      rules: {
        maxDiscountPercent: pct, negotiationStyle: form.negotiationStyle,
        deliveryAvailable: form.deliveryAvailable, pickupAvailable: form.pickupAvailable,
        deliveryCharge: num(form.deliveryCharge), freeDeliveryAbove: num(form.freeDeliveryAbove), estimatedDeliveryDays: num(form.estimatedDeliveryDays),
        deliveryLocations: form.deliveryAvailable ? form.deliveryLocations : [], pickupAddress: form.pickupAvailable ? form.pickupAddress : null,
        acceptedPaymentMethods: form.acceptedPaymentMethods, returnPolicy: form.returnPolicy, warranty: form.warranty, additionalNotes: form.additionalNotes,
      },
    }
    try {
      const saved = editing ? await productService.update(id, payload) : await productService.create(payload)
      for (const file of pending) await productService.uploadImage(saved.id, file)
      navigate('/seller/products')
    } catch (err) { setError(err.message); window.scrollTo({ top: 0, behavior: 'smooth' }) }
    finally { setSaving(false) }
  }

  const removeExisting = async (i) => {
    if (!editing) return
    try { const p = await productService.removeImage(id, i); setImages(p.productImages || []) } catch (err) { setError(err.message) }
  }

  const togglePay = (m) => patch({ acceptedPaymentMethods: form.acceptedPaymentMethods.includes(m) ? form.acceptedPaymentMethods.filter((x) => x !== m) : [...form.acceptedPaymentMethods, m] })

  if (loading) return <Spinner />
  return (
    <form onSubmit={submit} className="mx-auto max-w-3xl space-y-5">
      <div>
        <Link to="/seller/products" className="mb-2 inline-flex items-center gap-1 text-sm font-medium text-ink-500 hover:text-brand-700"><ChevronLeft className="h-4 w-4" /> Products</Link>
        <h1 className="text-3xl font-extrabold">{editing ? 'Edit product' : 'List a new product'}</h1>
        <p className="mt-1 text-sm text-ink-500">Everything you enter here is what the AI assistant uses to talk to buyers.</p>
      </div>
      {error && <Alert type="error">{error}</Alert>}

      <Section title="Product details">
        <Input id="name" label="Product name" value={form.productName} onChange={set('productName')} error={errors.productName} placeholder="e.g. Teak study table with drawers" />
        <Textarea id="desc" label="Description" rows={4} value={form.productDescription} onChange={set('productDescription')} hint="Materials, size, condition, what's included. The assistant answers buyer questions from this." />
        <div className="grid gap-4 sm:grid-cols-2">
          <Select id="cat" label="Category" value={form.category} onChange={set('category')}><option value="">Select…</option>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</Select>
          <Input id="stock" label="Units in stock" type="number" min="0" value={form.stock} onChange={set('stock')} error={errors.stock} hint="Leave empty for unlimited." />
        </div>
        <div>
          <span className="label">Photos</span>
          <ImageManager existing={images} pending={pending} onAddFiles={(f) => setPending([...pending, ...f].slice(0, 5 - images.length))} onRemoveExisting={removeExisting} onRemovePending={(i) => setPending(pending.filter((_, j) => j !== i))} />
        </div>
      </Section>

      <Section title="Price & negotiation" desc="Set your selling price and the most discount the assistant may give. It will never go below the minimum price.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input id="price" label="Selling price (per unit)" type="number" min="0" step="0.01" prefix="₹" value={form.listedPrice} onChange={set('listedPrice')} error={errors.listedPrice} />
          <Input id="disc" label="Maximum discount" type="number" min="0" max="90" step="0.5" prefix="%" value={form.maxDiscountPercent} onChange={set('maxDiscountPercent')} error={errors.maxDiscountPercent} hint="0 = fixed price, no negotiation." />
        </div>
        <div className="flex items-start gap-3 rounded-xl border border-brand-200 bg-brand-50 p-4">
          <Calculator className="mt-0.5 h-5 w-5 shrink-0 text-brand-700" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-brand-900">Minimum acceptable price (selling price after the maximum discount)</p>
            <p className="font-display text-2xl font-extrabold text-brand-800">{listed ? formatCurrency(minPrice) : '—'}</p>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-brand-800"><Lock className="h-3.5 w-3.5" /> Private. Buyers and the AI model never see this number; the server enforces it.</p>
          </div>
        </div>
        <div>
          <span className="label">Negotiation style</span>
          <div className="grid gap-2 sm:grid-cols-3">
            {NEGOTIATION_STYLES.map((s) => (
              <button type="button" key={s.value} onClick={() => patch({ negotiationStyle: s.value })} className={classNames('rounded-xl border p-3 text-left transition', form.negotiationStyle === s.value ? 'border-brand-500 bg-brand-50 ring-2 ring-brand-100' : 'border-ink-200 hover:border-ink-300')}>
                <p className="text-sm font-bold">{s.label}</p><p className="text-xs text-ink-500">{s.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </Section>

      <Section title="Delivery & pickup">
        {errors.delivery && <Alert type="error">{errors.delivery}</Alert>}
        <Toggle checked={form.deliveryAvailable} onChange={(v) => patch({ deliveryAvailable: v })} label="Home delivery" description="You ship to the buyer's address" />
        {form.deliveryAvailable && (
          <div className="space-y-4 rounded-xl bg-ink-50 p-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <Input id="dc" label="Delivery charge" type="number" min="0" prefix="₹" value={form.deliveryCharge} onChange={set('deliveryCharge')} hint="Empty = free" />
              <Input id="fd" label="Free delivery above" type="number" min="0" prefix="₹" value={form.freeDeliveryAbove} onChange={set('freeDeliveryAbove')} hint="Optional" />
              <Input id="days" label="Delivery time (days)" type="number" min="1" value={form.estimatedDeliveryDays} onChange={set('estimatedDeliveryDays')} />
            </div>
            <div>
              <span className="label">Where do you deliver?</span>
              <TagInput id="loc" values={form.deliveryLocations} onChange={(v) => patch({ deliveryLocations: v })} placeholder="Type a city, area or pincode and press Enter" />
              {errors.deliveryLocations ? <p className="field-error">{errors.deliveryLocations}</p> : <p className="hint">The assistant refuses addresses outside this list.</p>}
            </div>
          </div>
        )}
        <Toggle checked={form.pickupAvailable} onChange={(v) => patch({ pickupAvailable: v })} label="Pickup" description="Buyers collect from you" />
        {form.pickupAvailable && <Input id="pa" label="Pickup address" value={form.pickupAddress} onChange={set('pickupAddress')} placeholder="Shop / warehouse address" />}
      </Section>

      <Section title="Payment methods">
        <div className="flex flex-wrap gap-2">
          {PAYMENT_METHOD_OPTIONS.map((m) => (
            <button type="button" key={m} onClick={() => togglePay(m)} className={classNames('chip', form.acceptedPaymentMethods.includes(m) && 'chip-active')}>{m}</button>
          ))}
        </div>
        {errors.acceptedPaymentMethods && <p className="field-error">{errors.acceptedPaymentMethods}</p>}
      </Section>

      <Section title="Policies & private instructions">
        <div className="grid gap-4 sm:grid-cols-2">
          <Textarea id="ret" label="Return policy" rows={2} value={form.returnPolicy} onChange={set('returnPolicy')} placeholder="e.g. 7-day returns if unused" />
          <Textarea id="war" label="Warranty" rows={2} value={form.warranty} onChange={set('warranty')} placeholder="e.g. 1 year on manufacturing defects" />
        </div>
        <Textarea id="notes" label="Private notes for the assistant (optional)" rows={2} value={form.additionalNotes} onChange={set('additionalNotes')} hint="Stored for you; never shown to buyers." />
      </Section>

      <div className="sticky bottom-0 -mx-4 flex justify-end gap-3 border-t border-ink-100 bg-white/95 px-4 py-3 backdrop-blur sm:mx-0 sm:rounded-2xl sm:border">
        <Link to="/seller/products" className="btn-outline">Cancel</Link>
        <button className="btn-primary" disabled={saving}>{saving ? 'Saving…' : editing ? 'Save changes' : 'Publish product'}</button>
      </div>
    </form>
  )
}
