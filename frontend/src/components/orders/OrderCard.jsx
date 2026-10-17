import { useState } from 'react'
import { Truck, MapPin, CreditCard, Phone, BadgePercent } from 'lucide-react'
import { formatCurrency, formatDate, percentOff } from '../../utils/formatter.js'
import { ORDER_STATUS_LABELS, ORDER_STATUS_BADGE, ORDER_STATUS_FLOW } from '../../utils/constants.js'
import ReviewForm from './ReviewForm.jsx'
import { classNames } from '../../utils/helpers.js'

function Steps({ status }) {
  if (status === 'CANCELLED') return null
  const idx = ORDER_STATUS_FLOW.indexOf(status)
  return (
    <ol className="mt-4 flex items-center gap-1.5" aria-label="Order progress">
      {ORDER_STATUS_FLOW.map((s, i) => (
        <li key={s} className="flex flex-1 flex-col gap-1.5">
          <span className={classNames('h-1.5 rounded-full', i <= idx ? 'bg-brand-600' : 'bg-ink-200')} />
          <span className={classNames('text-[11px] font-semibold', i <= idx ? 'text-brand-700' : 'text-ink-400')}>{ORDER_STATUS_LABELS[s]}</span>
        </li>
      ))}
    </ol>
  )
}

export default function OrderCard({ order, role, onAdvance, onCancel }) {
  const [busy, setBusy] = useState(false)
  const [reviewed, setReviewed] = useState(false)
  const idx = ORDER_STATUS_FLOW.indexOf(order.status)
  const next = idx >= 0 && idx < ORDER_STATUS_FLOW.length - 1 ? ORDER_STATUS_FLOW[idx + 1] : null
  const off = percentOff(order.listedPrice, order.unitPrice)

  const run = async (fn) => { setBusy(true); try { await fn() } finally { setBusy(false) } }

  return (
    <article className="card p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs text-ink-500">{formatDate(order.createdAt)}</p>
          <h3 className="mt-0.5 text-lg font-bold">{order.productName}</h3>
          <p className="mt-1 text-sm text-ink-600">
            {order.quantity} × {formatCurrency(order.unitPrice)}
            {off > 0 && (
              <>
                {' '}<span className="text-ink-400 line-through">{formatCurrency(order.listedPrice)}</span>{' '}
                <span className="badge-accent ml-1"><BadgePercent className="h-3 w-3" /> negotiated {off}% off</span>
              </>
            )}
          </p>
        </div>
        <div className="text-right">
          <span className={ORDER_STATUS_BADGE[order.status]}>{ORDER_STATUS_LABELS[order.status]}</span>
          <p className="mt-2 font-display text-xl font-extrabold">{formatCurrency(order.totalPrice)}</p>
          {order.deliveryCharge > 0 && <p className="text-xs text-ink-500">incl. {formatCurrency(order.deliveryCharge)} delivery</p>}
        </div>
      </div>

      <div className="mt-4 grid gap-2 rounded-xl bg-ink-50 p-3.5 text-sm text-ink-700 sm:grid-cols-2">
        <p className="flex items-start gap-2"><Truck className="mt-0.5 h-4 w-4 shrink-0 text-ink-400" />{order.deliveryMethod === 'PICKUP' ? 'Pickup' : 'Home delivery'}</p>
        <p className="flex items-start gap-2"><CreditCard className="mt-0.5 h-4 w-4 shrink-0 text-ink-400" />{order.paymentMethod || '—'}</p>
        <p className="flex items-start gap-2 sm:col-span-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-ink-400" />{order.deliveryAddress || '—'}</p>
        {role === 'SELLER' && order.buyerPhone && (
          <p className="flex items-start gap-2"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-ink-400" /><a href={`tel:${order.buyerPhone}`} className="font-semibold text-brand-700">{order.buyerPhone}</a></p>
        )}
      </div>

      <Steps status={order.status} />

      <div className="mt-4 flex flex-wrap justify-end gap-2">
        {role === 'SELLER' && next && order.status !== 'CANCELLED' && (
          <button className="btn-primary btn-sm" disabled={busy} onClick={() => run(() => onAdvance(order.id, next))}>Mark as {ORDER_STATUS_LABELS[next]}</button>
        )}
        {role === 'SELLER' && order.status !== 'CANCELLED' && order.status !== 'DELIVERED' && (
          <button className="btn-danger btn-sm" disabled={busy} onClick={() => window.confirm('Cancel this order? Stock will be returned.') && run(() => onAdvance(order.id, 'CANCELLED'))}>Cancel order</button>
        )}
        {role === 'BUYER' && order.status === 'PENDING' && (
          <button className="btn-danger btn-sm" disabled={busy} onClick={() => window.confirm('Cancel this order?') && run(() => onCancel(order.id))}>Cancel order</button>
        )}
      </div>

      {role === 'BUYER' && order.status === 'DELIVERED' && !reviewed && <ReviewForm orderId={order.id} onSubmitted={() => setReviewed(true)} />}
      {reviewed && <p className="mt-3 text-right text-sm font-medium text-emerald-700">Thanks for your review!</p>}
    </article>
  )
}
