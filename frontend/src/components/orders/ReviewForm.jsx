import { useState } from 'react'
import StarRating from '../ui/StarRating.jsx'
import Alert from '../ui/Alert.jsx'
import { reviewService } from '../../services/reviewService.js'

export default function ReviewForm({ orderId, onSubmitted }) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)

  const submit = async (e) => {
    e.preventDefault()
    if (!rating) return setError('Pick a star rating first')
    setBusy(true)
    setError(null)
    try {
      onSubmitted?.(await reviewService.create({ orderId, rating, comment: comment || undefined }))
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={submit} className="mt-4 space-y-3 border-t border-ink-100 pt-4">
      <p className="text-sm font-semibold">How was it?</p>
      <StarRating value={rating} interactive onChange={setRating} size="md" />
      <textarea rows={2} className="input resize-none" placeholder="Share a few words about the product and the seller (optional)" value={comment} onChange={(e) => setComment(e.target.value)} />
      {error && <Alert type="error">{error}</Alert>}
      <div className="flex justify-end"><button className="btn-primary btn-sm" disabled={busy}>{busy ? 'Sending…' : 'Submit review'}</button></div>
    </form>
  )
}
