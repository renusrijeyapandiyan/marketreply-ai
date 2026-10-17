import { Link } from 'react-router-dom'
import { BadgePercent, Truck, MessageCircle } from 'lucide-react'
import ProductImage from './ProductImage.jsx'
import StarRating from '../ui/StarRating.jsx'
import { formatCurrency } from '../../utils/formatter.js'

export default function ProductCard({ product }) {
  const outOfStock = product.stock !== null && product.stock !== undefined && product.stock <= 0
  const freeDelivery = product.deliveryAvailable && !(product.deliveryCharge > 0)
  return (
    <div className="card card-hover group flex flex-col overflow-hidden">
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-ink-100">
          <ProductImage src={product.thumbnail} name={product.productName} className="transition duration-500 group-hover:scale-105" />
          <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
            {product.negotiable && !outOfStock && (
              <span className="badge bg-accent-400 text-ink-900 shadow"><BadgePercent className="h-3.5 w-3.5" /> Negotiable</span>
            )}
            {outOfStock && <span className="badge bg-ink-900 text-white">Sold out</span>}
          </div>
        </div>
        <div className="px-4 pt-3.5">
          {product.category && <p className="text-[11px] font-bold uppercase tracking-wider text-brand-600">{product.category}</p>}
          <h3 className="mt-0.5 line-clamp-2 min-h-[2.6rem] text-[15px] font-bold leading-snug text-ink-900 group-hover:text-brand-700">{product.productName}</h3>
          <p className="mt-0.5 truncate text-xs text-ink-500">by {product.sellerName}</p>
          <p className="mt-2 font-display text-2xl font-extrabold text-ink-900">{formatCurrency(product.listedPrice)}</p>
          <div className="mt-1.5 flex items-center justify-between gap-2">
            <StarRating value={product.averageRating || 0} count={product.reviewCount} />
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-ink-500">
            {freeDelivery && <span className="inline-flex items-center gap-1 text-emerald-700"><Truck className="h-3.5 w-3.5" /> Free delivery</span>}
            {product.deliveryAvailable && product.estimatedDeliveryDays ? <span>{product.estimatedDeliveryDays}-day delivery</span> : null}
          </div>
        </div>
      </Link>
      <div className="mt-auto p-4 pt-3">
        <Link to={`/product/${product.id}?chat=1`} className="btn-primary w-full !py-2.5">
          <MessageCircle className="h-4 w-4" /> Chat with seller
        </Link>
      </div>
    </div>
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="card overflow-hidden">
      <div className="skeleton aspect-square !rounded-none" />
      <div className="space-y-3 p-4">
        <div className="skeleton h-3 w-1/3" />
        <div className="skeleton h-5 w-4/5" />
        <div className="skeleton h-7 w-1/3" />
        <div className="skeleton h-10 w-full" />
      </div>
    </div>
  )
}
