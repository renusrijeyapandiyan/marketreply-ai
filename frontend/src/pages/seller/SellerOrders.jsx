import { useEffect, useState } from 'react'
import { ClipboardList } from 'lucide-react'
import OrderCard from '../../components/orders/OrderCard.jsx'
import Spinner from '../../components/ui/Spinner.jsx'
import EmptyState from '../../components/ui/EmptyState.jsx'
import Alert from '../../components/ui/Alert.jsx'
import { orderService } from '../../services/orderService.js'

export default function SellerOrders() {
  const [orders, setOrders] = useState(null)
  const [error, setError] = useState(null)
  const load = () => orderService.selling().then(setOrders).catch((e) => setError(e.message))
  useEffect(() => { load() }, [])
  const advance = async (id, status) => { try { await orderService.updateStatus(id, status); load() } catch (e) { setError(e.message) } }

  return (
    <div className="max-w-4xl">
      <h1 className="mb-6 text-3xl font-extrabold">Orders to fulfil</h1>
      {error && <Alert type="error" className="mb-4">{error}</Alert>}
      {!orders && !error && <Spinner />}
      {orders?.length === 0 && <EmptyState icon={ClipboardList} title="No orders yet">Orders placed by the assistant or directly will show up here.</EmptyState>}
      <div className="space-y-4">{orders?.map((o) => <OrderCard key={o.id} order={o} role="SELLER" onAdvance={advance} />)}</div>
    </div>
  )
}
