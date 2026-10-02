import { useState } from 'react'
import { MessageSquareQuote } from 'lucide-react'
import StarRating from './StarRating.jsx'
import { reviewService } from '../../services/reviewService.js'

/** Embedded in OrderCard for DELIVERED orders the buyer hasn't reviewed yet. */
export default function ReviewForm({ orderId, onSubmitted }) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (rating === 0) {
      setError('Pick a star rating first')
      return
    }
    setError(null)
    setSubmitting(true)
    try {
      const review = await reviewService.create({ orderId, rating, comment: comment || undefined })
      onSubmitted?.(review)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 pt-4 border-t border-slate-100 space-y-3">
      <div className="flex items-center gap-2">
        <MessageSquareQuote className="h-4 w-4 text-brand-600" />
        <p className="text-sm font-medium text-slate-700">Leave a review</p>
      </div>
      <StarRating value={rating} interactive onChange={setRating} size="md" />
      <textarea
        rows={2}
        className="input-field resize-none"
        placeholder="How was the product and the seller? (optional)"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      {error && <p className="text-xs text-rose-600">{error}</p>}
      <div className="flex justify-end">
        <button type="submit" className="btn-primary py-2 px-3.5 text-sm" disabled={submitting}>
          {submitting ? 'Submitting…' : 'Submit review'}
        </button>
      </div>
    </form>
  )
}