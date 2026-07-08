import { formatDate, humanizeIntent } from '../../utils/formatter.js'
import { SENTIMENT_COLORS } from '../../utils/constants.js'

export default function ConversationCard({ conversation }) {
  const analysis = conversation.aiAnalysis || {}
  return (
    <div className="card card-hover p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs text-slate-400 mb-1">{conversation.sellerName} · {formatDate(conversation.createdAt)}</p>
          <p className="text-sm font-medium text-slate-800">{conversation.buyerMessage}</p>
        </div>
        <span className={SENTIMENT_COLORS[analysis.sentiment] || 'badge-neutral'}>
          {analysis.sentiment || 'N/A'}
        </span>
      </div>

      <div className="flex flex-wrap gap-2 mt-3">
        <span className="badge-brand">{humanizeIntent(analysis.intent)}</span>
        <span className={analysis.compliesWithRules ? 'badge-success' : 'badge-danger'}>
          {analysis.compliesWithRules ? 'Compliant' : 'Violation'}
        </span>
      </div>

      {conversation.finalReply && (
        <div className="mt-4 pt-4 border-t border-slate-100">
          <p className="text-xs font-medium text-slate-400 mb-1">AI reply</p>
          <p className="text-sm text-slate-600">{conversation.finalReply}</p>
        </div>
      )}
    </div>
  )
}
