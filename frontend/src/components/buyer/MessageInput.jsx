import { useState } from 'react'
import Button from '../common/Button.jsx'
import { Send } from 'lucide-react'

const SAMPLE_MESSAGES = [
  'Can you sell it for ₹500 and deliver today?',
  'Is this still available? I can pick it up tomorrow evening.',
  'I can pay via bank transfer, will you accept ₹1000 less than listed?',
]

export default function MessageInput({ onSubmit, loading, error }) {
  const [message, setMessage] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (message.trim()) onSubmit(message.trim())
  }

  return (
    <form onSubmit={handleSubmit} className="card p-6">
      <label htmlFor="buyerMessage" className="label">Buyer message</label>
      <textarea
        id="buyerMessage"
        rows={4}
        className="input-field resize-none"
        placeholder="Paste or type what the buyer said…"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      {error && <p className="mt-1.5 text-xs text-rose-600">{error}</p>}

      <div className="flex flex-wrap gap-2 mt-3">
        {SAMPLE_MESSAGES.map((sample) => (
          <button
            type="button"
            key={sample}
            onClick={() => setMessage(sample)}
            className="text-xs rounded-full border border-slate-200 px-3 py-1.5 text-slate-500 hover:border-brand-300 hover:text-brand-700"
          >
            {sample}
          </button>
        ))}
      </div>

      <div className="flex justify-end mt-5">
        <Button type="submit" disabled={loading || !message.trim()}>
          <Send className="h-4 w-4" />
          {loading ? 'Analyzing with Gemini…' : 'Analyze message'}
        </Button>
      </div>
    </form>
  )
}
