import { useState, useEffect } from 'react'
import Input from '../common/Input.jsx'
import Button from '../common/Button.jsx'
import RuleEditor from './RuleEditor.jsx'
import ImageUploader from './ImageUploader.jsx'
import { validateSellerForm } from '../../utils/validator.js'
import { classNames } from '../../utils/helpers.js'
import { CUSTOM_SIZE } from '../../utils/constants.js'

const emptyForm = {
  name: '',
  email: '',
  productName: '',
  productDescription: '',
  listedPrice: '',
  productSize: '',
  productImages: [],
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
    if (initialValue) {
      setForm({
        productImages: [],
        productSize: '',
        ...initialValue,
      })
    }
  }, [initialValue])

  const isCustomSize = form.productSize === CUSTOM_SIZE

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

      <div>
        <p className="label">Size (optional)</p>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            className={classNames('input-field sm:flex-1', isCustomSize && 'opacity-50 cursor-not-allowed')}
            placeholder="e.g. M, UK 9, 42, 10x8 ft…"
            value={isCustomSize ? '' : form.productSize}
            disabled={isCustomSize}
            onChange={(e) => setForm({ ...form, productSize: e.target.value })}
          />
          <button
            type="button"
            onClick={() => setForm({ ...form, productSize: isCustomSize ? '' : CUSTOM_SIZE })}
            className={classNames(
              'px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors whitespace-nowrap',
              isCustomSize
                ? 'bg-accent-600 border-accent-600 text-white'
                : 'bg-white border-slate-200 text-slate-600 hover:border-accent-300'
            )}
          >
            {isCustomSize ? '✓ Customize' : "Don't specify — Customize"}
          </button>
        </div>
        <p className="mt-1.5 text-xs text-slate-400">
          {isCustomSize
            ? 'Buyers will see this as "made/sized to order" and can request their own size.'
            : "Leave blank or pick \"Customize\" if size doesn't apply or varies per order."}
        </p>
      </div>

      <div>
        <ImageUploader
          images={form.productImages || []}
          onChange={(productImages) => setForm({ ...form, productImages })}
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