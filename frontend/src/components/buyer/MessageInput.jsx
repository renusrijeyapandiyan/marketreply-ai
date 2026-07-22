import { useState, useEffect } from 'react'
import Button from '../common/Button.jsx'
import { Send } from 'lucide-react'
import { DEFAULT_SUGGESTIONS } from '../../utils/followUpSuggestions.js'

export default function MessageInput({ onSubmit, loading, error, suggestions }) {
  const [message, setMessage] = useState('')
  const chips = suggestions && suggestions.length > 0 ? suggestions : DEFAULT_SUGGESTIONS

  // Clear the draft after each successful send so the box is ready for the next turn.
  useEffect(() => {
    if (!loading) setMessage((m) => m)
  }, [loading])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (message.trim()) {
      onSubmit(message.trim())
      setMessage('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card p-6">
      <label htmlFor="buyerMessage" className="label">
        {chips === DEFAULT_SUGGESTIONS ? 'Buyer message' : 'Continue the conversation'}
      </label>
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
        {chips.map((sample) => (
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
          {loading ? 'Analyzing with Gemini…' : 'Send'}
        </Button>
      </div>
    </form>
  )
}