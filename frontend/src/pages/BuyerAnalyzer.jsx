import { useState } from 'react'
import MessageInput from '../components/buyer/MessageInput.jsx'
import IntentCard from '../components/buyer/IntentCard.jsx'
import EntityCard from '../components/buyer/EntityCard.jsx'
import RuleViolationCard from '../components/buyer/RuleViolationCard.jsx'
import AIResponseCard from '../components/buyer/AIResponseCard.jsx'
import Loader from '../components/common/Loader.jsx'
import { useSeller } from '../hooks/useSeller.js'
import { useAI } from '../hooks/useAI.js'
import { validateBuyerMessage } from '../utils/validator.js'
import { formatCurrency } from '../utils/formatter.js'

export default function BuyerAnalyzer() {
  const { sellers, activeSellerId, setActiveSellerId } = useSeller()
  const { result, loading, error, analyze } = useAI()
  const [validationError, setValidationError] = useState(null)

  const activeSeller = sellers.find((s) => s.id === activeSellerId)

  const handleAnalyze = async (message) => {
    const errors = validateBuyerMessage(activeSellerId, message)
    if (Object.keys(errors).length > 0) {
      setValidationError(errors.sellerId || errors.message)
      return
    }
    setValidationError(null)
    try {
      await analyze(activeSellerId, message)
    } catch {
      // error state already captured by useAI
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-slate-900">Buyer message analyzer</h1>
        <p className="text-sm text-slate-500 mt-1">Paste a buyer's message and let Gemini draft the reply.</p>
      </div>

      <div className="card p-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
        <label className="label mb-0 shrink-0" htmlFor="sellerSelect">Seller profile</label>
        <select
          id="sellerSelect"
          className="input-field sm:max-w-xs"
          value={activeSellerId || ''}
          onChange={(e) => setActiveSellerId(e.target.value)}
        >
          <option value="" disabled>Select a seller profile</option>
          {sellers.map((s) => (
            <option key={s.id} value={s.id}>{s.productName} — {s.name}</option>
          ))}
        </select>
        {activeSeller && (
          <span className="text-sm text-slate-400">
            Listed at {formatCurrency(activeSeller.listedPrice)}
            {activeSeller.rules?.minPrice != null && ` · min ${formatCurrency(activeSeller.rules.minPrice)}`}
          </span>
        )}
      </div>

      <MessageInput onSubmit={handleAnalyze} loading={loading} error={validationError} />

      {loading && <Loader label="Gemini is reading the message…" className="justify-center py-8" />}
      {error && <p className="text-sm text-rose-600">{error}</p>}

      {result && (
        <div className="space-y-6 animate-in">
          <AIResponseCard reply={result.analysis.suggestedReply} />
          <div className="grid sm:grid-cols-2 gap-5">
            <IntentCard analysis={result.analysis} />
            <RuleViolationCard analysis={result.analysis} />
          </div>
          <EntityCard analysis={result.analysis} />
        </div>
      )}
    </div>
  )
}
