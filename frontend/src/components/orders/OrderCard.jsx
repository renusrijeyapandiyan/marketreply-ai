import { useState } from 'react'
import { Package, Truck, CheckCircle2, XCircle, ArrowRight, Star } from 'lucide-react'
import { formatCurrency, formatDate } from '../../utils/formatter.js'
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS, ORDER_STATUS_FLOW } from '../../utils/constants.js'
import ReviewForm from '../reviews/ReviewForm.jsx'

const STATUS_ICON = {
  PENDING: Package,
  CONFIRMED: CheckCircle2,
  SHIPPED: Truck,
  DELIVERED: CheckCircle2,
  CANCELLED: XCircle,
}

export default function OrderCard({ order, viewerRole, onAdvanceStatus, onCancel }) {
  const [busy, setBusy] = useState(false)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewed, setReviewed] = useState(false)
  const Icon = STATUS_ICON[order.status] || Package

  const currentIndex = ORDER_STATUS_FLOW.indexOf(order.status)
  const nextStatus = currentIndex >= 0 && currentIndex < ORDER_STATUS_FLOW.length - 1
    ? ORDER_STATUS_FLOW[currentIndex + 1]
    : null

  const canAdvance = viewerRole === 'SELLER' && nextStatus && order.status !== 'CANCELLED'
  const canCancel = viewerRole === 'BUYER' && order.status === 'PENDING'
  const canReview = viewerRole === 'BUYER' && order.status === 'DELIVERED' && !reviewed

  const handleAdvance = async () => {
    setBusy(true)
    try {
      await onAdvanceStatus(order.id, nextStatus)
    } finally {
      setBusy(false)
    }
  }

  const handleCancel = async () => {
    if (!window.confirm('Cancel this order? This cannot be undone.')) return
    setBusy(true)
    try {
      await onCancel(order.id)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="card p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="badge-neutral !py-0.5 !px-2">
              {viewerRole === 'BUYER' ? 'Your purchase' : 'Sale on your listing'}
            </span>
            <p className="text-xs text-slate-400">{formatDate(order.createdAt)}</p>
          </div>
          <p className="font-display font-semibold text-slate-900">{order.productName}</p>
          <p className="text-sm text-slate-500 mt-0.5">
            {viewerRole === 'BUYER' ? `Seller: ${order.sellerName}` : `Buyer: ${order.buyerName}`}
          </p>
        </div>
        <span className={ORDER_STATUS_COLORS[order.status] || 'badge-neutral'}>
          <Icon className="h-3.5 w-3.5 mr-1 inline" />
          {ORDER_STATUS_LABELS[order.status] || order.status}
        </span>
      </div>

      <dl className="grid grid-cols-2 gap-3 mt-4 text-sm">
        <div>
          <dt className="text-slate-400 text-xs">Quantity</dt>
          <dd className="font-medium text-slate-800">{order.quantity}</dd>
        </div>
        <div>
          <dt className="text-slate-400 text-xs">Total</dt>
          <dd className="font-medium text-slate-800">{formatCurrency(order.totalPrice)}</dd>
        </div>
        {order.deliveryMethod && (
          <div>
            <dt className="text-slate-400 text-xs">Delivery method</dt>
            <dd className="font-medium text-slate-800">{order.deliveryMethod}</dd>
          </div>
        )}
        {order.deliveryAddress && (
          <div className="col-span-2">
            <dt className="text-slate-400 text-xs">Address</dt>
            <dd className="font-medium text-slate-800">{order.deliveryAddress}</dd>
          </div>
        )}
      </dl>

      {order.buyerNotes && (
        <p className="text-sm text-slate-500 mt-3 pt-3 border-t border-slate-100">
          <span className="text-slate-400">Note: </span>{order.buyerNotes}
        </p>
      )}

      {(canAdvance || canCancel || canReview) && (
        <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-100">
          {canCancel && (
            <button
              type="button"
              onClick={handleCancel}
              disabled={busy}
              className="text-sm font-medium text-rose-600 hover:text-rose-700 disabled:opacity-50"
            >
              Cancel order
            </button>
          )}
          {canAdvance && (
            <button
              type="button"
              onClick={handleAdvance}
              disabled={busy}
              className="btn-primary py-2 px-3.5 text-sm disabled:opacity-50"
            >
              Mark as {ORDER_STATUS_LABELS[nextStatus]} <ArrowRight className="h-3.5 w-3.5" />
            </button>
          )}
          {canReview && !showReviewForm && (
            <button
              type="button"
              onClick={() => setShowReviewForm(true)}
              className="btn-secondary py-2 px-3.5 text-sm"
            >
              <Star className="h-3.5 w-3.5" /> Leave a review
            </button>
          )}
        </div>
      )}

      {canReview && showReviewForm && (
        <ReviewForm orderId={order.id} onSubmitted={() => { setReviewed(true); setShowReviewForm(false) }} />
      )}

      {viewerRole === 'BUYER' && order.status === 'DELIVERED' && reviewed && (
        <p className="mt-4 pt-4 border-t border-slate-100 text-sm text-accent-700 flex items-center gap-1.5">
          <Star className="h-3.5 w-3.5 fill-gold-400 text-gold-400" /> Thanks for your review!
        </p>
      )}
    </div>
  )
}