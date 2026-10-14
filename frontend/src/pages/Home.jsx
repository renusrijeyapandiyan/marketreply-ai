import { useEffect, useMemo, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Sparkles, MessageCircle, BadgePercent, Truck, SearchX } from 'lucide-react'
import ProductCard, { ProductCardSkeleton } from '../components/shop/ProductCard.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import Alert from '../components/ui/Alert.jsx'
import { productService } from '../services/productService.js'
import { classNames } from '../utils/helpers.js'

const SORTS = { new: 'Newest', low: 'Price: low to high', high: 'Price: high to low', rated: 'Top rated' }

export default function Home() {
  const [params] = useSearchParams()
  const q = (params.get('q') || '').toLowerCase()
  const [products, setProducts] = useState(null)
  const [error, setError] = useState(null)
  const [category, setCategory] = useState('All')
  const [sort, setSort] = useState('new')
  const [negotiableOnly, setNegotiableOnly] = useState(false)

  useEffect(() => { productService.marketplace().then(setProducts).catch((e) => setError(e.message)) }, [])

  const categories = useMemo(() => ['All', ...new Set((products || []).map((p) => p.category).filter(Boolean))], [products])
  const visible = useMemo(() => {
    let list = (products || []).filter((p) =>
      (category === 'All' || p.category === category) &&
      (!negotiableOnly || p.negotiable) &&
      (!q || `${p.productName} ${p.productDescription || ''} ${p.category || ''} ${p.sellerName}`.toLowerCase().includes(q)))
    const by = { low: (a, b) => a.listedPrice - b.listedPrice, high: (a, b) => b.listedPrice - a.listedPrice, rated: (a, b) => (b.averageRating || 0) - (a.averageRating || 0) }
    if (by[sort]) list = [...list].sort(by[sort])
    return list
  }, [products, category, sort, negotiableOnly, q])

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-800 via-brand-700 to-brand-600 text-white">
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-accent-400/20 blur-3xl" />
        <div className="page relative grid items-center gap-8 py-12 sm:py-16 lg:grid-cols-2">
          <div>
            <span className="badge bg-white/15 text-white"><Sparkles className="h-3.5 w-3.5" /> AI-powered shopping</span>
            <h1 className="mt-4 font-display text-4xl font-extrabold leading-[1.05] text-white sm:text-5xl">Don't just pay the price. <span className="text-accent-300">Talk to it.</span></h1>
            <p className="mt-4 max-w-lg text-lg text-brand-50">Chat with each product's assistant: ask about delivery, bargain for a better price and place your order, without leaving the conversation.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {[[MessageCircle, 'Ask anything', 'Delivery, payment, warranty'], [BadgePercent, 'Negotiate', 'Make an offer, get a counter'], [Truck, 'Order in chat', 'Details collected for you']].map(([Icon, t, d]) => (
              <div key={t} className="rounded-2xl bg-white/10 p-4 backdrop-blur"><Icon className="h-6 w-6 text-accent-300" /><p className="mt-2 font-bold">{t}</p><p className="text-sm text-brand-100">{d}</p></div>
            ))}
          </div>
        </div>
      </section>

      <div className="page py-8">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:px-0">
            {categories.map((c) => <button key={c} onClick={() => setCategory(c)} className={classNames('chip shrink-0', category === c && 'chip-active')}>{c}</button>)}
          </div>
          <div className="flex items-center gap-3">
            <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-ink-700">
              <input type="checkbox" className="h-4 w-4 accent-brand-600" checked={negotiableOnly} onChange={(e) => setNegotiableOnly(e.target.checked)} /> Negotiable only
            </label>
            <select className="input !w-auto !py-2" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort">
              {Object.entries(SORTS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
        </div>

        {q && <p className="mb-4 text-sm text-ink-600">Results for <strong>“{params.get('q')}”</strong></p>}
        {error && <Alert type="error">Couldn't load products: {error}</Alert>}

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {!products && !error && Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
          {visible.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>

        {products && visible.length === 0 && (
          <EmptyState icon={SearchX} title="Nothing matches yet" action={<Link to="/seller/products/new" className="btn-primary">List a product</Link>}>
            Try a different search or filter, or be the first to list this item.
          </EmptyState>
        )}
      </div>
    </>
  )
}
