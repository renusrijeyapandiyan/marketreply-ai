import { useEffect, useMemo, useState } from 'react'
import SearchBar from '../components/history/SearchBar.jsx'
import FilterBar from '../components/history/FilterBar.jsx'
import ConversationCard from '../components/history/ConversationCard.jsx'
import Loader from '../components/common/Loader.jsx'
import { useHistory } from '../hooks/useHistory.js'
import { useAuth } from '../hooks/useAuth.js'
import { sellerService } from '../services/sellerService.js'

export default function ConversationHistory() {
  const { user } = useAuth()
  const [marketplace, setMarketplace] = useState([])
  const [sellerFilter, setSellerFilter] = useState('')
  const { conversations, loading, error } = useHistory(sellerFilter || undefined)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('ALL')

  useEffect(() => {
    sellerService.marketplace().then(setMarketplace).catch(() => {})
  }, [])

  const filtered = useMemo(() => {
    return conversations.filter((c) => {
      const matchesSearch = !search || c.buyerMessage.toLowerCase().includes(search.toLowerCase())
      const compliant = c.aiAnalysis?.compliesWithRules
      const matchesFilter =
        filter === 'ALL' ||
        (filter === 'COMPLIANT' && compliant) ||
        (filter === 'VIOLATION' && !compliant)
      return matchesSearch && matchesFilter
    })
  }, [conversations, search, filter])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-slate-900">Conversation history</h1>
        <p className="text-sm text-slate-500 mt-1">
          Messages sent to your listings, and messages you've sent to other sellers.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <SearchBar value={search} onChange={setSearch} />
        <select
          className="input-field sm:max-w-xs"
          value={sellerFilter}
          onChange={(e) => setSellerFilter(e.target.value)}
        >
          <option value="">All sellers</option>
          {marketplace.map((s) => (
            <option key={s.id} value={s.id}>{s.productName} — {s.name}</option>
          ))}
        </select>
      </div>

      <FilterBar activeFilter={filter} onChange={setFilter} />

      {loading ? (
        <Loader label="Loading conversations…" className="py-16 justify-center" />
      ) : error ? (
        <p className="text-sm text-rose-600">{error}</p>
      ) : filtered.length === 0 ? (
        <div className="card p-10 text-center text-slate-500">No conversations match your filters yet.</div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-5">
          {filtered.map((c) => (
            <ConversationCard
              key={c.id}
              conversation={c}
              viewerRole={c.buyerId === user?.userId ? 'BUYER' : 'SELLER'}
            />
          ))}
        </div>
      )}
    </div>
  )
}
