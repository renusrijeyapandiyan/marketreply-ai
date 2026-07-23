import { useEffect, useState } from 'react'
import { PackageCheck, Truck, MapPin } from 'lucide-react'
import Loader from '../common/Loader.jsx'
import { ordersService } from '../../services/ordersService.js'
import { formatCurrency } from '../../utils/formatter.js'

export default function OrdersPanel() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    ordersService.list()
      .then(setOrders)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="card p-6">
      <div className="flex items-center gap-2 mb-4">
        <PackageCheck className="h-4.5 w-4.5 text-brand-600" />
        <h3 className="font-display font-semibold text-slate-900">Orders</h3>
      </div>

      {loading ? (
        <Loader label="Loading orders…" className="py-8 justify-center" />
      ) : error ? (
        <p className="text-sm text-rose-600">{error}</p>
      ) : orders.length === 0 ? (
        <p className="text-sm text-slate-400 py-4">
          No orders yet — they'll appear here automatically once a buyer confirms a purchase in chat.
        </p>
      ) : (
        <ul className="divide-y divide-slate-100">
          {orders.map((o) => (
            <li key={o.id} className="py-3.5 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-slate-800">{o.productName}</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {o.role === 'SELLER' ? `Sold by you` : `Bought from ${o.sellerName}`}
                  {' · '}
                  {new Date(o.createdAt).toLocaleDateString()}
                </p>
                <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500">
                  {o.deliveryMethod && o.deliveryMethod !== 'UNSPECIFIED' && (
                    <span className="flex items-center gap-1">
                      <Truck className="h-3 w-3" /> {o.deliveryMethod === 'DELIVERY' ? 'Delivery' : 'Pickup'}
                    </span>
                  )}
                  {o.deliveryAddress && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {o.deliveryAddress}
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-semibold text-slate-800">{formatCurrency(o.agreedPrice)}</p>
                <span className="badge-success mt-1 inline-block">{o.status}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}