import { useEffect, useState } from 'react'
import { MessageSquareQuote } from 'lucide-react'
import StarRating from './StarRating.jsx'
import Loader from '../common/Loader.jsx'
import { reviewService } from '../../services/reviewService.js'
import { formatDate } from '../../utils/formatter.js'

/** Shown in SellerDetailModal — every review left for that seller's listing. */
export default function ReviewList({ sellerId }) {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!sellerId) return
    let cancelled = false
    setLoading(true)
    reviewService
      .listForSeller(sellerId)
      .then((data) => { if (!cancelled) setReviews(data) })
      .catch(() => { if (!cancelled) setReviews([]) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [sellerId])

  if (loading) return <Loader label="Loading reviews…" size="sm" className="py-4" />

  if (reviews.length === 0) {
    return (
      <p className="text-sm text-slate-400 py-3 flex items-center gap-2">
        <MessageSquareQuote className="h-4 w-4" /> No reviews yet — be the first to buy and review.
      </p>
    )
  }

  return (
    <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
      {reviews.map((r) => (
        <div key={r.id} className="rounded-xl bg-slate-50 px-4 py-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-800">{r.buyerName}</p>
            <StarRating value={r.rating} />
          </div>
          {r.comment && <p className="text-sm text-slate-600 mt-1.5">{r.comment}</p>}
          <p className="text-xs text-slate-400 mt-1.5">{formatDate(r.createdAt)}</p>
        </div>
      ))}
    </div>
  )
}