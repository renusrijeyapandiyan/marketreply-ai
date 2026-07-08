import { useState, useEffect } from 'react'
import Input from '../common/Input.jsx'
import Button from '../common/Button.jsx'
import RuleEditor from './RuleEditor.jsx'
import { validateSellerForm } from '../../utils/validator.js'

const emptyForm = {
  name: '',
  email: '',
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

export default function SellerForm({ initialValue, onSubmit, submitting }) {
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
      <div className="grid sm:grid-cols-2 gap-4">
        <Input
          id="name"
          label="Seller name"
          placeholder="e.g. Priya Sharma"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          error={errors.name}
        />
        <Input
          id="email"
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          error={errors.email}
        />
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
          {submitting ? 'Saving…' : 'Save seller profile'}
        </Button>
      </div>
    </form>
  )
}
