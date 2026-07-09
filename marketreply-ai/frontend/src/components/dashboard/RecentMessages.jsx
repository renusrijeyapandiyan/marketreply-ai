import { Link } from 'react-router-dom'
import { truncate, formatDate } from '../../utils/formatter.js'
import { SENTIMENT_COLORS } from '../../utils/constants.js'

export default function RecentMessages({ conversations = [] }) {
  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-semibold text-slate-900">Recent conversations</h3>
        <Link to="/history" className="text-sm font-medium text-brand-600 hover:text-brand-700">
          View all
        </Link>
      </div>

      {conversations.length === 0 ? (
        <p className="text-sm text-slate-400 py-8 text-center">
          No conversations yet. Try the Buyer Analyzer to generate your first AI reply.
        </p>
      ) : (
        <ul className="divide-y divide-slate-100">
          {conversations.map((c) => (
            <li key={c.id} className="py-3 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-800 truncate">{truncate(c.buyerMessage, 70)}</p>
                <p className="text-xs text-slate-400 mt-0.5">{c.sellerName} · {formatDate(c.createdAt)}</p>
              </div>
              <span className={SENTIMENT_COLORS[c.aiAnalysis?.sentiment] || 'badge-neutral'}>
                {c.aiAnalysis?.sentiment || 'N/A'}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
