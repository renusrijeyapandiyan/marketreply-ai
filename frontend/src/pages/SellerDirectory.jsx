import { useEffect, useMemo, useState } from 'react'
import { Search, Store } from 'lucide-react'
import SellerDetailCard from '../components/seller/SellerDetailCard.jsx'
import SellerDetailModal from '../components/seller/SellerDetailModal.jsx'
import Loader from '../components/common/Loader.jsx'
import { sellerService } from '../services/sellerService.js'

export default function SellerDirectory() {
  const [sellers, setSellers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [query, setQuery] = useState('')
  const [selectedSeller, setSelectedSeller] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    sellerService
      .listAll()
      .then((data) => { if (!cancelled) setSellers(data) })
      .catch((err) => { if (!cancelled) setError(err.message) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return sellers
    return sellers.filter((s) =>
      [s.productName, s.name, s.email, s.productDescription]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(q))
    )
  }, [sellers, query])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-900">All sellers</h1>
          <p className="text-sm text-slate-500 mt-1">
            Every seller profile and product listing registered in MarketReply AI.
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by product, seller, or email…"
            className="input-field pl-9"
          />
        </div>
      </div>

      {loading ? (
        <Loader label="Loading seller profiles…" className="py-16 justify-center" />
      ) : error ? (
        <div className="card p-6 text-sm text-rose-600">{error}</div>
      ) : filtered.length === 0 ? (
        <div className="card p-10 text-center">
          <Store className="h-8 w-8 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">
            {sellers.length === 0 ? 'No seller profiles have been created yet.' : 'No sellers match your search.'}
          </p>
        </div>
      ) : (
        <>
          <p className="text-xs text-slate-400">{filtered.length} of {sellers.length} seller profiles</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((seller) => (
              <SellerDetailCard key={seller.id} seller={seller} onViewDetails={setSelectedSeller} />
            ))}
          </div>
        </>
      )}

      <SellerDetailModal seller={selectedSeller} onClose={() => setSelectedSeller(null)} />
    </div>
  )
}