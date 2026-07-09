import { ListChecks } from 'lucide-react'
import { formatCurrency } from '../../utils/formatter.js'
import { safeArray } from '../../utils/helpers.js'

export default function EntityCard({ analysis }) {
  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 mb-3">
        <ListChecks className="h-4.5 w-4.5 text-brand-600" />
        <h4 className="font-display font-semibold text-slate-900">Extracted details</h4>
      </div>
      <dl className="space-y-2 text-sm">
        <div className="flex justify-between">
          <dt className="text-slate-500">Offered price</dt>
          <dd className="font-medium text-slate-800">
            {analysis.offeredPrice != null ? formatCurrency(analysis.offeredPrice) : '—'}
          </dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-slate-500">Payment method</dt>
          <dd className="font-medium text-slate-800">{analysis.requestedPaymentMethod || '—'}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-slate-500">Delivery method</dt>
          <dd className="font-medium text-slate-800">{analysis.requestedDeliveryMethod || 'UNSPECIFIED'}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-slate-500">Requested timing</dt>
          <dd className="font-medium text-slate-800">{analysis.requestedDeliveryTime || '—'}</dd>
        </div>
      </dl>

      {safeArray(analysis.extractedEntities).length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-100">
          {analysis.extractedEntities.map((entity, i) => (
            <span key={i} className="badge-neutral">{entity}</span>
          ))}
        </div>
      )}
    </div>
  )
}
