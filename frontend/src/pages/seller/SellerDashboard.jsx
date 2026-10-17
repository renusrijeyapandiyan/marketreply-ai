import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Boxes, IndianRupee, ClipboardList, MessagesSquare, BadgePercent, Plus } from 'lucide-react'
import Spinner from '../../components/ui/Spinner.jsx'
import Alert from '../../components/ui/Alert.jsx'
import { dashboardService } from '../../services/dashboardService.js'
import { formatCurrency, timeAgo } from '../../utils/formatter.js'
import { ORDER_STATUS_LABELS, ORDER_STATUS_BADGE } from '../../utils/constants.js'

function Stat({ icon: Icon, label, value, sub, tone = 'brand' }) {
  const tones = { brand: 'bg-brand-50 text-brand-700', accent: 'bg-accent-50 text-accent-700' }
  return (
    <div className="card p-5">
      <span className={`grid h-10 w-10 place-items-center rounded-xl ${tones[tone]}`}><Icon className="h-5 w-5" /></span>
      <p className="mt-3 font-display text-3xl font-extrabold">{value}</p>
      <p className="text-sm font-medium text-ink-600">{label}</p>
      {sub && <p className="text-xs text-ink-400">{sub}</p>}
    </div>
  )
}

export default function SellerDashboard() {
  const [d, setD] = useState(null)
  const [error, setError] = useState(null)
  useEffect(() => { dashboardService.get().then(setD).catch((e) => setError(e.message)) }, [])
  if (error) return <Alert type="error">{error}</Alert>
  if (!d) return <Spinner />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-3xl font-extrabold">Seller hub</h1>
        <Link to="/seller/products/new" className="btn-primary"><Plus className="h-4 w-4" /> New product</Link>
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <Stat icon={Boxes} label="Products" value={d.productCount} />
        <Stat icon={IndianRupee} label="Revenue" value={formatCurrency(d.revenue)} tone="accent" />
        <Stat icon={ClipboardList} label="Orders" value={d.totalOrders} sub={`${d.pendingOrders} pending`} />
        <Stat icon={MessagesSquare} label="AI chats" value={d.chatCount} />
        <Stat icon={BadgePercent} label="Negotiated deals" value={d.negotiatedOrders} sub={d.negotiatedOrders ? `avg ${d.averageDiscountPercent}% off` : 'none yet'} tone="accent" />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="card p-5">
          <div className="mb-3 flex items-center justify-between"><h2 className="text-lg font-bold">Recent orders</h2><Link to="/seller/orders" className="text-sm font-semibold text-brand-700">All orders</Link></div>
          {d.recentOrders.length === 0 ? <p className="text-sm text-ink-500">No orders yet.</p> : d.recentOrders.map((o) => (
            <div key={o.id} className="flex items-center justify-between gap-3 border-t border-ink-100 py-2.5 first:border-0">
              <div className="min-w-0"><p className="truncate font-semibold">{o.productName}</p><p className="text-xs text-ink-500">{o.quantity} × {formatCurrency(o.unitPrice)} · {timeAgo(o.createdAt)}</p></div>
              <div className="text-right"><p className="font-bold">{formatCurrency(o.totalPrice)}</p><span className={ORDER_STATUS_BADGE[o.status]}>{ORDER_STATUS_LABELS[o.status]}</span></div>
            </div>
          ))}
        </section>
        <section className="card p-5">
          <div className="mb-3 flex items-center justify-between"><h2 className="text-lg font-bold">Recent AI chats</h2><Link to="/seller/chats" className="text-sm font-semibold text-brand-700">All chats</Link></div>
          {d.recentChats.length === 0 ? <p className="text-sm text-ink-500">No conversations yet.</p> : d.recentChats.map((c) => (
            <div key={c.id} className="border-t border-ink-100 py-2.5 first:border-0">
              <div className="flex justify-between gap-2"><p className="truncate font-semibold">{c.productName}</p><span className="text-xs text-ink-400">{timeAgo(c.updatedAt)}</span></div>
              <p className="truncate text-sm text-ink-500">{c.buyerName}: {c.lastMessage}</p>
            </div>
          ))}
        </section>
      </div>
    </div>
  )
}
