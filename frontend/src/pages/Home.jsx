import { useEffect, useMemo, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import {
  MessageCircle, BadgePercent, Truck, ShieldCheck, SearchX, Smartphone, Armchair, Shirt, CookingPot, BookOpen,
  Dumbbell, Puzzle, Car, Palette, ShoppingBasket, Sparkles, Package, LayoutGrid, ArrowRight,
} from 'lucide-react'
import ProductCard, { ProductCardSkeleton } from '../components/shop/ProductCard.jsx'
import ProductImage from '../components/shop/ProductImage.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import Alert from '../components/ui/Alert.jsx'
import { productService } from '../services/productService.js'
import { formatCurrency } from '../utils/formatter.js'
import { classNames } from '../utils/helpers.js'

const ICONS = {
  Electronics: Smartphone, Furniture: Armchair, Fashion: Shirt, 'Home & Kitchen': CookingPot, Books: BookOpen,
  'Sports & Fitness': Dumbbell, 'Toys & Kids': Puzzle, 'Vehicles & Parts': Car, Handmade: Palette,
  Groceries: ShoppingBasket, Beauty: Sparkles, Other: Package,
}
const SORTS = { new: 'Newest first', low: 'Price: low to high', high: 'Price: high to low', rated: 'Top rated' }
const PAGE = 12

export default function Home() {
  const [params] = useSearchParams()
  const q = (params.get('q') || '').toLowerCase().trim()
  const [products, setProducts] = useState(null)
  const [error, setError] = useState(null)
  const [category, setCategory] = useState('All')
  const [sort, setSort] = useState('new')
  const [negotiableOnly, setNegotiableOnly] = useState(false)
  const [shown, setShown] = useState(PAGE)

  useEffect(() => { productService.marketplace().then(setProducts).catch((e) => setError(e.message)) }, [])
  useEffect(() => { setShown(PAGE) }, [q, category, sort, negotiableOnly])

  const categories = useMemo(() => [...new Set((products || []).map((p) => p.category).filter(Boolean))], [products])
  const deals = useMemo(() => (products || []).filter((p) => p.negotiable && !(p.stock !== null && p.stock <= 0)).slice(0, 10), [products])
  const withPhotos = useMemo(() => (products || []).filter((p) => p.thumbnail).slice(0, 3), [products])

  const visible = useMemo(() => {
    let list = (products || []).filter((p) =>
      (category === 'All' || p.category === category) &&
      (!negotiableOnly || p.negotiable) &&
      (!q || `${p.productName} ${p.productDescription || ''} ${p.category || ''} ${p.sellerName}`.toLowerCase().includes(q)))
    const by = { low: (a, b) => a.listedPrice - b.listedPrice, high: (a, b) => b.listedPrice - a.listedPrice, rated: (a, b) => (b.averageRating || 0) - (a.averageRating || 0) }
    if (by[sort]) list = [...list].sort(by[sort])
    return list
  }, [products, category, sort, negotiableOnly, q])

  const searching = Boolean(q) || category !== 'All'

  return (
    <>
      {!q && (
        <section className="relative overflow-hidden bg-gradient-to-br from-ink-900 via-ink-800 to-brand-900 text-white">
          <div className="hero-glow absolute inset-0" />
          <div className="page relative grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <span className="badge bg-white/10 text-accent-200 ring-1 ring-white/20"><Sparkles className="h-3.5 w-3.5" /> Every product has its own AI seller</span>
              <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.05] text-white sm:text-6xl">
                Find it. <span className="text-accent-400">Bargain</span> it.<br />Own it.
              </h1>
              <p className="mt-5 max-w-lg text-lg text-ink-200">Browse everything in one place, then chat with the seller to ask questions, negotiate the price and place your order without leaving the conversation.</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a href="#products" className="btn-accent btn-lg">Shop now <ArrowRight className="h-5 w-5" /></a>
                <Link to="/seller/products/new" className="btn btn-lg bg-white/10 text-white ring-1 ring-white/25 hover:bg-white/20">Start selling</Link>
              </div>
              <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm text-ink-200">
                <span className="inline-flex items-center gap-2"><MessageCircle className="h-4 w-4 text-accent-300" /> Chat to bargain</span>
                <span className="inline-flex items-center gap-2"><Truck className="h-4 w-4 text-accent-300" /> Delivery & pickup</span>
                <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-accent-300" /> Order tracking</span>
              </div>
            </div>

            <div className="relative mx-auto hidden w-full max-w-md lg:block">
              <div className="grid grid-cols-2 gap-4">
                {(withPhotos.length ? withPhotos : [null, null, null]).map((p, i) => (
                  <Link key={p?.id || i} to={p ? `/product/${p.id}` : '/'} className={classNames('group relative overflow-hidden rounded-3xl bg-white/10 shadow-lift ring-1 ring-white/15', i === 0 && 'row-span-2')}>
                    <div className={classNames('w-full', i === 0 ? 'aspect-[3/4]' : 'aspect-square')}><ProductImage src={p?.thumbnail} name={p?.productName || ''} className="transition duration-500 group-hover:scale-105" /></div>
                    {p && <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-950/85 to-transparent p-3 pt-8"><p className="truncate text-sm font-bold text-white">{p.productName}</p><p className="text-sm font-semibold text-accent-300">{formatCurrency(p.listedPrice)}</p></div>}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <div className="page py-8" id="products">
        {categories.length > 0 && (
          <div className="no-scrollbar -mx-4 mb-8 flex gap-3 overflow-x-auto px-4 sm:mx-0 sm:px-0">
            <CategoryTile icon={LayoutGrid} label="All" active={category === 'All'} onClick={() => setCategory('All')} />
            {categories.map((c) => <CategoryTile key={c} icon={ICONS[c] || Package} label={c} active={category === c} onClick={() => setCategory(c)} />)}
          </div>
        )}

        {error && <Alert type="error">Couldn't load products: {error}</Alert>}

        {!searching && deals.length > 0 && (
          <section className="mb-10">
            <div className="mb-4 flex items-end justify-between">
              <div>
                <h2 className="section-title flex items-center gap-2"><BadgePercent className="h-6 w-6 text-brand-600" /> Deals you can negotiate</h2>
                <p className="text-sm text-ink-500">Chat with the seller and ask for a better price.</p>
              </div>
            </div>
            <div className="snap-row no-scrollbar -mx-4 flex gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
              {deals.map((p) => <div key={p.id} className="w-60 shrink-0 sm:w-64"><ProductCard product={p} /></div>)}
            </div>
          </section>
        )}

        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="section-title">{q ? `Results for “${params.get('q')}”` : category !== 'All' ? category : 'All products'}</h2>
            {products && <p className="text-sm text-ink-500">{visible.length} product{visible.length === 1 ? '' : 's'}</p>}
          </div>
          <div className="flex items-center gap-3">
            <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-ink-700">
              <input type="checkbox" className="h-4 w-4 accent-brand-600" checked={negotiableOnly} onChange={(e) => setNegotiableOnly(e.target.checked)} /> Negotiable only
            </label>
            <select className="input !w-auto !py-2" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort products">
              {Object.entries(SORTS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
          {!products && !error && Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
          {visible.slice(0, shown).map((p) => <ProductCard key={p.id} product={p} />)}
        </div>

        {products && visible.length > shown && (
          <div className="mt-8 text-center"><button className="btn-outline btn-lg" onClick={() => setShown((n) => n + PAGE)}>Show more products</button></div>
        )}

        {products && visible.length === 0 && (
          <EmptyState icon={SearchX} title="Nothing matches yet" action={<Link to="/seller/products/new" className="btn-primary">List a product</Link>}>
            Try a different search or filter, or be the first to list this item.
          </EmptyState>
        )}
      </div>
    </>
  )
}

function CategoryTile({ icon: Icon, label, active, onClick }) {
  return (
    <button onClick={onClick} className="group flex w-24 shrink-0 flex-col items-center gap-2">
      <span className={classNames('grid h-16 w-16 place-items-center rounded-2xl border-2 transition', active ? 'border-brand-600 bg-brand-600 text-white shadow-brand' : 'border-ink-100 bg-white text-ink-600 group-hover:border-brand-300 group-hover:text-brand-600')}>
        <Icon className="h-7 w-7" />
      </span>
      <span className={classNames('text-center text-xs font-semibold leading-tight', active ? 'text-brand-700' : 'text-ink-600')}>{label}</span>
    </button>
  )
}
