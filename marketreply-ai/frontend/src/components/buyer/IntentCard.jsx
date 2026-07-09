import { Target } from 'lucide-react'
import { humanizeIntent } from '../../utils/formatter.js'
import { SENTIMENT_COLORS } from '../../utils/constants.js'

export default function IntentCard({ analysis }) {
  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 mb-3">
        <Target className="h-4.5 w-4.5 text-brand-600" />
        <h4 className="font-display font-semibold text-slate-900">Buyer intent</h4>
      </div>
      <p className="text-lg font-semibold text-slate-800">{humanizeIntent(analysis.intent)}</p>
      <span className={`${SENTIMENT_COLORS[analysis.sentiment] || 'badge-neutral'} mt-3`}>
        {analysis.sentiment || 'NEUTRAL'} tone
      </span>
    </div>
  )
}
