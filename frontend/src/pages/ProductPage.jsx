import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ChevronLeft, ShoppingCart, Zap, BadgePercent, PackageX } from 'lucide-react'
import ImageGallery from '../components/shop/ImageGallery.jsx'
import DeliveryInfo from '../components/shop/DeliveryInfo.jsx'
import CheckoutModal from '../components/shop/CheckoutModal.jsx'
import ChatAssistant from '../components/chat/ChatAssistant.jsx'
import StarRating from '../components/ui/StarRating.jsx'
import Spinner from '../components/ui/Spinner.jsx'
import Alert from '../components/ui/Alert.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import { productService } from '../services/productService.js'
import { useAuth } from '../hooks/useAuth.js'
import { useCart } from '../hooks/useCart.js'
import { formatCurrency, formatDate } from '../utils/formatter.js'

export default function ProductPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const { addToCart } = useCart()
  const [product, setProduct] = useState(null)
  const [reviews, setReviews] = useState([])
  const [error, setError] = useState(null)
  const [notice, setNotice] = useState(null)
  const [buying, setBuying] = useState(false)

  useEffect(() => {
    setProduct(null); setError(null)
    productService.getPublic(id).then(setProduct).catch((e) => setError(e.message))
    productService.reviews(id).then(setReviews).catch(() => setReviews([]))
  }, [id])

  if (error) return <div className="page py-10"><EmptyState icon={PackageX} title="Product not found" action={<Link to="/" className="btn-primary">Back to shop</Link>}>{error}</EmptyState></div>
  if (!product) return <Spinner label="Loading product…" className="py-24" />

  const soldOut = product.stock !== null && product.stock !== undefined && product.stock <= 0
  const needLogin = (fn) => () => (isAuthenticated ? fn() : navigate('/login', { state: { from: { pathname: `/product/${id}` } } }))
  const add = needLogin(async () => {
    try { await addToCart(product.id, 1); setNotice({ type: 'success', text: 'Added to your cart.' }) }
    catch (e) { setNotice({ type: 'error', text: e.message }) }
  })

  return (
    <div className="page py-6 sm:py-8">
      <Link to="/" className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-ink-500 hover:text-brand-700"><ChevronLeft className="h-4 w-4" /> All products</Link>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px]">
        <div className="space-y-6">
          <ImageGallery images={product.productImages || []} name={product.productName} />

          <div>
            <div className="flex flex-wrap items-center gap-2">
              {product.category && <span className="badge-neutral">{product.category}</span>}
              {product.negotiable && <span className="badge-accent"><BadgePercent className="h-3.5 w-3.5" /> Price is negotiable</span>}
            </div>
            <h1 className="mt-3 text-3xl font-extrabold sm:text-4xl">{product.productName}</h1>
            <p className="mt-1 text-sm text-ink-500">Sold by <strong className="text-ink-700">{product.sellerName}</strong></p>
            <div className="mt-2"><StarRating value={product.averageRating || 0} count={product.reviewCount} /></div>

            <p className="mt-5 font-display text-4xl font-extrabold">{formatCurrency(product.listedPrice)}</p>
            <p className="mt-1 text-sm text-ink-500">
              {soldOut ? 'Currently sold out' : product.stock !== null && product.stock !== undefined ? (product.stock <= 5 ? `Only ${product.stock} left` : `${product.stock} in stock`) : 'In stock'}
            </p>

            {notice && <Alert type={notice.type} className="mt-4">{notice.text} {notice.type === 'success' && <Link to="/cart" className="font-semibold underline">View cart</Link>}</Alert>}
            <div className="mt-5 flex flex-wrap gap-3">
              <button className="btn-primary btn-lg" disabled={soldOut} onClick={needLogin(() => setBuying(true))}><Zap className="h-5 w-5" /> Buy now</button>
              <button className="btn-outline btn-lg" disabled={soldOut} onClick={add}><ShoppingCart className="h-5 w-5" /> Add to cart</button>
            </div>

            {product.productDescription && <p className="mt-6 whitespace-pre-line text-ink-700">{product.productDescription}</p>}
          </div>

          <DeliveryInfo product={product} />

          <section>
            <h2 className="section-title mb-3">Reviews</h2>
            {reviews.length === 0 ? <p className="text-sm text-ink-500">No reviews yet.</p> : (
              <div className="space-y-3">
                {reviews.map((r) => (
                  <div key={r.id} className="card p-4">
                    <div className="flex items-center justify-between"><StarRating value={r.rating} /><span className="text-xs text-ink-400">{formatDate(r.createdAt)}</span></div>
                    {r.comment && <p className="mt-2 text-sm text-ink-700">{r.comment}</p>}
                    <p className="mt-1 text-xs text-ink-500">{r.buyerName || 'Verified buyer'}</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        <aside className="lg:sticky lg:top-20 lg:self-start">
          <ChatAssistant product={product} className="h-[640px] max-h-[calc(100vh-7rem)]" />
        </aside>
      </div>

      {buying && <CheckoutModal open onClose={() => setBuying(false)} product={product} />}
    </div>
  )
}
