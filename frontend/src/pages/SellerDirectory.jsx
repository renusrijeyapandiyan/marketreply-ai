import { useEffect, useMemo, useState } from 'react'
import { Search, Store, Mail } from 'lucide-react'
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

  // Group product listings by the seller identity (name + email) that owns
  // them, so one seller with several products shows up as one section
  // instead of looking like several unrelated sellers.
  const groups = useMemo(() => {
    const byIdentity = new Map()
    for (const listing of filtered) {
      const key = `${listing.name}|${listing.email}`
      if (!byIdentity.has(key)) {
        byIdentity.set(key, { name: listing.name, email: listing.email, listings: [] })
      }
      byIdentity.get(key).listings.push(listing)
    }
    return Array.from(byIdentity.values()).sort((a, b) => b.listings.length - a.listings.length)
  }, [filtered])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-900">All sellers</h1>
          <p className="text-sm text-slate-500 mt-1">
            Every seller and the products they've listed on MarketReply AI.
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
        <Loader label="Loading sellers…" className="py-16 justify-center" />
      ) : error ? (
        <div className="card p-6 text-sm text-rose-600">{error}</div>
      ) : filtered.length === 0 ? (
        <div className="card p-10 text-center">
          <Store className="h-8 w-8 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">
            {sellers.length === 0 ? 'No products have been listed yet.' : 'No products match your search.'}
          </p>
        </div>
      ) : (
        <>
          <p className="text-xs text-slate-400">
            {filtered.length} of {sellers.length} products across {groups.length} seller
            {groups.length === 1 ? '' : 's'}
          </p>

          <div className="space-y-8">
            {groups.map((group) => (
              <div key={`${group.name}|${group.email}`}>
                <div className="flex items-center gap-2 mb-3">
                  <h2 className="font-display font-semibold text-slate-900">{group.name}</h2>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Mail className="h-3 w-3" /> {group.email}
                  </span>
                  <span className="badge-neutral">
                    {group.listings.length} product{group.listings.length === 1 ? '' : 's'}
                  </span>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {group.listings.map((seller) => (
                    <SellerDetailCard key={seller.id} seller={seller} onViewDetails={setSelectedSeller} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <SellerDetailModal seller={selectedSeller} onClose={() => setSelectedSeller(null)} />
    </div>
  )
}