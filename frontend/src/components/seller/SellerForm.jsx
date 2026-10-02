import { useState, useEffect } from 'react'
import Input from '../common/Input.jsx'
import Button from '../common/Button.jsx'
import RuleEditor from './RuleEditor.jsx'
import { validateSellerForm } from '../../utils/validator.js'
import { useAuth } from '../../hooks/useAuth.js'

const emptyForm = {
  productName: '',
  productDescription: '',
  listedPrice: '',
  rules: {
    minPrice: null,
    deliveryAvailable: true,
    pickupAvailable: true,
    acceptedPaymentMethods: [],
    maxDeliveryDistanceKm: null,
    negotiationStyle: 'MODERATE',
    additionalNotes: '',
  },
}

// Seller name/email are the account's identity, not per-product fields — the
// backend always fills them in from whoever is logged in, so this form never
// asks for or sends them. That's what lets one account list many products
// without re-typing seller details every time.
export default function SellerForm({ initialValue, onSubmit, submitting }) {
  const { user } = useAuth()
  const [form, setForm] = useState(initialValue || emptyForm)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (initialValue) setForm(initialValue)
  }, [initialValue])

  const handleSubmit = (e) => {
    e.preventDefault()
    const validationErrors = validateSellerForm(form)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length === 0) {
      onSubmit({ ...form, listedPrice: Number(form.listedPrice) })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-500">
        Selling as <span className="font-medium text-slate-700">{user?.name}</span>
        {user?.email && <> · {user.email}</>}
        <span className="block text-xs text-slate-400 mt-0.5">
          This comes from your account and is shared across every product you list.
        </span>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Input
          id="productName"
          label="Product name"
          placeholder="e.g. iPhone 13, 128GB"
          value={form.productName}
          onChange={(e) => setForm({ ...form, productName: e.target.value })}
          error={errors.productName}
        />
        <Input
          id="listedPrice"
          label="Listed price (₹)"
          type="number"
          min="0"
          placeholder="e.g. 35000"
          value={form.listedPrice}
          onChange={(e) => setForm({ ...form, listedPrice: e.target.value })}
          error={errors.listedPrice}
        />
      </div>

      <div>
        <label htmlFor="productDescription" className="label">Product description</label>
        <textarea
          id="productDescription"
          rows={3}
          className="input-field resize-none"
          placeholder="Condition, accessories included, reason for selling, etc."
          value={form.productDescription}
          onChange={(e) => setForm({ ...form, productDescription: e.target.value })}
        />
      </div>

      <div className="border-t border-slate-100 pt-6">
        <h3 className="font-display font-semibold text-slate-900 mb-4">Negotiation rules</h3>
        <RuleEditor
          rules={form.rules}
          onChange={(rules) => setForm({ ...form, rules })}
          errors={errors}
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Saving…' : 'Save product'}
        </Button>
      </div>
    </form>
  )
}