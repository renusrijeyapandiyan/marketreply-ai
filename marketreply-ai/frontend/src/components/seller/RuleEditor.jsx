import Input from '../common/Input.jsx'
import { NEGOTIATION_STYLES, PAYMENT_METHOD_OPTIONS } from '../../utils/constants.js'
import { classNames } from '../../utils/helpers.js'

export default function RuleEditor({ rules, onChange, errors = {} }) {
  const update = (patch) => onChange({ ...rules, ...patch })

  const togglePayment = (method) => {
    const current = rules.acceptedPaymentMethods || []
    const next = current.includes(method)
      ? current.filter((m) => m !== method)
      : [...current, method]
    update({ acceptedPaymentMethods: next })
  }

  return (
    <div className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <Input
          id="minPrice"
          label="Minimum acceptable price (₹)"
          type="number"
          min="0"
          value={rules.minPrice ?? ''}
          onChange={(e) => update({ minPrice: e.target.value ? Number(e.target.value) : null })}
          error={errors.minPrice}
        />
        <Input
          id="maxDeliveryDistanceKm"
          label="Max delivery distance (km)"
          type="number"
          min="0"
          value={rules.maxDeliveryDistanceKm ?? ''}
          onChange={(e) => update({ maxDeliveryDistanceKm: e.target.value ? Number(e.target.value) : null })}
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <label className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 cursor-pointer">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
            checked={!!rules.deliveryAvailable}
            onChange={(e) => update({ deliveryAvailable: e.target.checked })}
          />
          <span className="text-sm font-medium text-slate-700">Delivery available</span>
        </label>
        <label className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 cursor-pointer">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
            checked={!!rules.pickupAvailable}
            onChange={(e) => update({ pickupAvailable: e.target.checked })}
          />
          <span className="text-sm font-medium text-slate-700">Pickup available</span>
        </label>
      </div>

      <div>
        <p className="label">Accepted payment methods</p>
        <div className="flex flex-wrap gap-2">
          {PAYMENT_METHOD_OPTIONS.map((method) => {
            const active = (rules.acceptedPaymentMethods || []).includes(method)
            return (
              <button
                type="button"
                key={method}
                onClick={() => togglePayment(method)}
                className={classNames(
                  'px-3.5 py-1.5 rounded-full text-sm font-medium border transition-colors',
                  active
                    ? 'bg-brand-600 border-brand-600 text-white'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-brand-300'
                )}
              >
                {method}
              </button>
            )
          })}
        </div>
      </div>

      <div>
        <p className="label">Negotiation style</p>
        <div className="flex gap-2">
          {NEGOTIATION_STYLES.map((style) => (
            <button
              type="button"
              key={style}
              onClick={() => update({ negotiationStyle: style })}
              className={classNames(
                'flex-1 px-3.5 py-2 rounded-xl text-sm font-medium border transition-colors',
                rules.negotiationStyle === style
                  ? 'bg-accent-600 border-accent-600 text-white'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-accent-300'
              )}
            >
              {style.charAt(0) + style.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="additionalNotes" className="label">Additional notes for Gemini (optional)</label>
        <textarea
          id="additionalNotes"
          rows={3}
          className="input-field resize-none"
          placeholder="e.g. Prefer buyers who can pick up within 2 days. Product is gently used."
          value={rules.additionalNotes || ''}
          onChange={(e) => update({ additionalNotes: e.target.value })}
        />
      </div>
    </div>
  )
}
