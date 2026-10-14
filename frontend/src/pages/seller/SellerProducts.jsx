import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2, Boxes, Eye, Lock } from 'lucide-react'
import Spinner from '../../components/ui/Spinner.jsx'
import EmptyState from '../../components/ui/EmptyState.jsx'
import Alert from '../../components/ui/Alert.jsx'
import ProductImage from '../../components/shop/ProductImage.jsx'
import { productService } from '../../services/productService.js'
import { formatCurrency } from '../../utils/formatter.js'

export default function SellerProducts() {
  const [items, setItems] = useState(null)
  const [error, setError] = useState(null)
  const load = () => productService.mine().then(setItems).catch((e) => setError(e.message))
  useEffect(() => { load() }, [])

  const remove = async (p) => {
    if (!window.confirm(`Delete "${p.productName}"? This cannot be undone.`)) return
    try { await productService.remove(p.id); load() } catch (e) { setError(e.message) }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-3">
        <h1 className="text-3xl font-extrabold">Your products</h1>
        <Link to="/seller/products/new" className="btn-primary"><Plus className="h-4 w-4" /> New product</Link>
      </div>
      {error && <Alert type="error" className="mb-4">{error}</Alert>}
      {!items && !error && <Spinner />}
      {items?.length === 0 && <EmptyState icon={Boxes} title="List your first product" action={<Link to="/seller/products/new" className="btn-primary">Add product</Link>}>Set a price, how low you'll go, delivery and payment options. The AI assistant handles the rest.</EmptyState>}
      <div className="space-y-3">
        {items?.map((p) => (
          <div key={p.id} className="card flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
            <div className="h-24 w-full shrink-0 overflow-hidden rounded-xl sm:w-32"><ProductImage src={p.productImages?.[0]} name={p.productName} /></div>
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-lg font-bold">{p.productName}</h3>
              <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-600">
                <span>Price <strong>{formatCurrency(p.listedPrice)}</strong></span>
                <span className="inline-flex items-center gap-1"><Lock className="h-3.5 w-3.5 text-ink-400" /> Min <strong>{formatCurrency(p.rules?.minPrice)}</strong> ({p.rules?.maxDiscountPercent || 0}% max discount)</span>
                <span>Stock {p.stock ?? '∞'}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Link to={`/product/${p.id}`} className="btn-outline btn-sm"><Eye className="h-4 w-4" /> View</Link>
              <Link to={`/seller/products/${p.id}/edit`} className="btn-outline btn-sm"><Pencil className="h-4 w-4" /> Edit</Link>
              <button className="btn-danger btn-sm" onClick={() => remove(p)} aria-label="Delete"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
