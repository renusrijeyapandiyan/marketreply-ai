import { useEffect, useState, useCallback } from 'react'
import { ordersService } from '../services/ordersService.js'
import { useAuth } from '../hooks/useAuth.js'
import OrderCard from '../components/orders/OrderCard.jsx'
import Loader from '../components/common/Loader.jsx'

const TABS = [
  { key: 'ALL', label: 'All' },
  { key: 'BUYER', label: 'My purchases' },
  { key: 'SELLER', label: 'Sales on my listings' },
]

export default function Orders() {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [tab, setTab] = useState('ALL')

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await ordersService.list()
      setOrders(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const roleFor = (order) => (order.buyerId === user?.userId ? 'BUYER' : 'SELLER')

  const filtered = orders.filter((o) => tab === 'ALL' || roleFor(o) === tab)

  const handleAdvanceStatus = async (id, status) => {
    await ordersService.updateStatus(id, status)
    await fetchOrders()
  }

  const handleCancel = async (id) => {
    await ordersService.cancel(id)
    await fetchOrders()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-slate-900">Orders</h1>
        <p className="text-sm text-slate-500 mt-1">
          Track purchases you've made and sales on your own listings.
        </p>
      </div>

      <div className="flex gap-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={
              tab === t.key
                ? 'px-3.5 py-2 rounded-xl text-sm font-medium border bg-slate-900 border-slate-900 text-white'
                : 'px-3.5 py-2 rounded-xl text-sm font-medium border bg-white border-slate-200 text-slate-600 hover:border-slate-300'
            }
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <Loader label="Loading orders…" className="py-16 justify-center" />
      ) : error ? (
        <p className="text-sm text-rose-600">{error}</p>
      ) : filtered.length === 0 ? (
        <div className="card p-10 text-center text-slate-500">
          No orders here yet. Place one from the Buyer Analyzer page.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-5">
          {filtered.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              viewerRole={roleFor(order)}
              onAdvanceStatus={handleAdvanceStatus}
              onCancel={handleCancel}
            />
          ))}
        </div>
      )}
    </div>
  )
}