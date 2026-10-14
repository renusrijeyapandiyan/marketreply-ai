import { Link } from 'react-router-dom'
import { BadgePercent, Truck, MessageCircle } from 'lucide-react'
import ProductImage from './ProductImage.jsx'
import StarRating from '../ui/StarRating.jsx'
import { formatCurrency } from '../../utils/formatter.js'

export default function ProductCard({ product }) {
  const outOfStock = product.stock !== null && product.stock !== undefined && product.stock <= 0
  const freeDelivery = product.deliveryAvailable && !(product.deliveryCharge > 0)
  return (
    <Link to={`/product/${product.id}`} className="card card-hover group flex flex-col overflow-hidden">
      <div className="relative aspect-[4/3] overflow-hidden bg-ink-100">
        <ProductImage src={product.thumbnail} name={product.productName} className="transition duration-500 group-hover:scale-105" />
        <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {product.negotiable && !outOfStock && (
            <span className="badge bg-accent-500 text-white shadow"><BadgePercent className="h-3.5 w-3.5" /> Negotiable</span>
          )}
          {outOfStock && <span className="badge bg-ink-900 text-white">Sold out</span>}
        </div>
        {product.category && <span className="absolute bottom-3 left-3 badge bg-white/90 text-ink-700 backdrop-blur">{product.category}</span>}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 text-base font-bold leading-snug text-ink-900 group-hover:text-brand-700">{product.productName}</h3>
        <p className="mt-0.5 truncate text-xs text-ink-500">by {product.sellerName}</p>

        <div className="mt-3 flex items-baseline gap-2">
          <span className="font-display text-xl font-extrabold text-ink-900">{formatCurrency(product.listedPrice)}</span>
        </div>

        <div className="mt-2"><StarRating value={product.averageRating || 0} count={product.reviewCount} /></div>

        <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 pt-3 text-xs font-medium text-ink-500">
          {freeDelivery && <span className="inline-flex items-center gap-1 text-emerald-700"><Truck className="h-3.5 w-3.5" /> Free delivery</span>}
          {product.deliveryAvailable && product.estimatedDeliveryDays && <span>{product.estimatedDeliveryDays}-day delivery</span>}
          <span className="inline-flex items-center gap-1 text-brand-700"><MessageCircle className="h-3.5 w-3.5" /> Ask the AI</span>
        </div>
      </div>
    </Link>
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="card overflow-hidden">
      <div className="skeleton aspect-[4/3] !rounded-none" />
      <div className="space-y-3 p-4">
        <div className="skeleton h-5 w-4/5" />
        <div className="skeleton h-3 w-2/5" />
        <div className="skeleton h-6 w-1/3" />
      </div>
    </div>
  )
}
