import { useState } from 'react'
import { Copy, Check, MessageCircle } from 'lucide-react'

export default function AIResponseCard({ reply }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(reply)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="card p-6 bg-gradient-to-br from-brand-600 to-brand-700 text-white">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-4.5 w-4.5" />
          <h4 className="font-display font-semibold">Suggested reply</h4>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs font-medium bg-white/15 hover:bg-white/25 rounded-lg px-2.5 py-1.5 transition-colors"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <p className="text-sm leading-relaxed text-brand-50">{reply}</p>
    </div>
  )
}
