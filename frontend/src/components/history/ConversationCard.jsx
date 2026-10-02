import { formatDate, humanizeIntent } from '../../utils/formatter.js'
import { SENTIMENT_COLORS } from '../../utils/constants.js'

export default function ConversationCard({ conversation, viewerRole }) {
  const analysis = conversation.aiAnalysis || {}
  return (
    <div className="card card-hover p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="text-xs text-slate-400">{conversation.sellerName} · {formatDate(conversation.createdAt)}</p>
            {viewerRole && (
              <span className="badge-neutral !py-0.5 !px-2">
                {viewerRole === 'BUYER' ? 'You messaged this seller' : 'Sent to your listing'}
              </span>
            )}
          </div>
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
