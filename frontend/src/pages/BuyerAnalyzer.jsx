import { useEffect, useState } from 'react'
import { Store } from 'lucide-react'
import MessageInput from '../components/buyer/MessageInput.jsx'
import ChatThread from '../components/buyer/ChatThread.jsx'
import Loader from '../components/common/Loader.jsx'
import ProductGallery from '../components/seller/ProductGallery.jsx'
import { sellerService } from '../services/sellerService.js'
import { useAI } from '../hooks/useAI.js'
import { validateBuyerMessage } from '../utils/validator.js'
import { formatCurrency } from '../utils/formatter.js'
import { getFollowUpSuggestions, DEFAULT_SUGGESTIONS } from '../utils/followUpSuggestions.js'

export default function BuyerAnalyzer() {
  // Marketplace-wide listing: any seller, not just ones you own — a "buyer"
  // browses everyone's products here and picks one to message.
  const [marketplace, setMarketplace] = useState([])
  const [marketplaceLoading, setMarketplaceLoading] = useState(true)
  const [marketplaceError, setMarketplaceError] = useState(null)
  const [selectedSellerId, setSelectedSellerId] = useState('')

  const { turns, loading, error, analyze, reset } = useAI()
  const [validationError, setValidationError] = useState(null)

  useEffect(() => {
    sellerService.marketplace()
      .then((data) => {
        setMarketplace(data)
        if (data.length > 0) setSelectedSellerId(data[0].id)
      })
      .catch((e) => setMarketplaceError(e.message))
      .finally(() => setMarketplaceLoading(false))
  }, [])

  const selectedSeller = marketplace.find((s) => s.id === selectedSellerId)

  // Talking to a different seller starts a fresh conversation.
  const handleSellerChange = (id) => {
    setSelectedSellerId(id)
    reset()
  }

  const handleAnalyze = async (message) => {
    const errors = validateBuyerMessage(selectedSellerId, message)
    if (Object.keys(errors).length > 0) {
      setValidationError(errors.sellerId || errors.message)
      return
    }
    setValidationError(null)
    try {
      await analyze(selectedSellerId, message)
    } catch {
      // error state already captured by useAI
    }
  }

  const lastTurn = turns[turns.length - 1]
  const suggestions = lastTurn ? getFollowUpSuggestions(lastTurn.analysis) : DEFAULT_SUGGESTIONS

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-slate-900">Buyer message analyzer</h1>
        <p className="text-sm text-slate-500 mt-1">
          Browse any seller's listing, chat with Gemini as the buyer, and get replies drafted turn by turn.
        </p>
      </div>

      <div className="card p-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
        <div className="flex items-center gap-2 shrink-0">
          <Store className="h-4 w-4 text-slate-400" />
          <label className="label mb-0" htmlFor="sellerSelect">Marketplace listing</label>
        </div>

        {marketplaceLoading ? (
          <Loader label="Loading listings…" size="sm" />
        ) : marketplaceError ? (
          <p className="text-sm text-rose-600">{marketplaceError}</p>
        ) : marketplace.length === 0 ? (
          <p className="text-sm text-slate-400">No sellers have listed anything yet.</p>
        ) : (
          <>
            <select
              id="sellerSelect"
              className="input-field sm:max-w-xs"
              value={selectedSellerId}
              onChange={(e) => handleSellerChange(e.target.value)}
            >
              {marketplace.map((s) => (
                <option key={s.id} value={s.id}>{s.productName} — {s.name}</option>
              ))}
            </select>
            {selectedSeller && (
              <span className="text-sm text-slate-400">
                Listed at {formatCurrency(selectedSeller.listedPrice)}
                {selectedSeller.rules?.minPrice != null && ` · min ${formatCurrency(selectedSeller.rules.minPrice)}`}
                {selectedSeller.productSize === 'CUSTOMIZE' && ' · customizable size'}
                {selectedSeller.productSize && selectedSeller.productSize !== 'CUSTOMIZE' && ` · size ${selectedSeller.productSize}`}
              </span>
            )}
          </>
        )}
      </div>

      {selectedSeller && (
        <div className="card p-5">
          <p className="text-xs uppercase tracking-wide text-slate-400 mb-3">Product details</p>
          <div className="grid sm:grid-cols-[220px_1fr] gap-5">
            <ProductGallery images={selectedSeller.productImages} alt={selectedSeller.productName} />
            <div>
              <p className="font-display font-semibold text-slate-900">{selectedSeller.productName}</p>
              {selectedSeller.productDescription && (
                <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">{selectedSeller.productDescription}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {turns.length > 0 && <ChatThread turns={turns} />}

      <MessageInput
        onSubmit={handleAnalyze}
        loading={loading}
        error={validationError}
        suggestions={suggestions}
      />

      {loading && <Loader label="Gemini is reading the message…" className="justify-center py-8" />}
      {error && <p className="text-sm text-rose-600">{error}</p>}
    </div>
  )
}