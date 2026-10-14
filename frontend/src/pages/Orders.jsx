import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Package } from 'lucide-react'
import OrderCard from '../components/orders/OrderCard.jsx'
import Spinner from '../components/ui/Spinner.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import Alert from '../components/ui/Alert.jsx'
import { orderService } from '../services/orderService.js'
import { useAuth } from '../hooks/useAuth.js'

export default function Orders() {
  const { user } = useAuth()
  const [orders, setOrders] = useState(null)
  const [error, setError] = useState(null)
  const load = () => orderService.list().then((l) => setOrders(l.filter((o) => o.buyerId === user.userId))).catch((e) => setError(e.message))
  useEffect(() => { load() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const cancel = async (id) => { try { await orderService.cancel(id); load() } catch (e) { setError(e.message) } }

  return (
    <div className="page max-w-4xl py-8">
      <h1 className="mb-6 text-3xl font-extrabold">My orders</h1>
      {error && <Alert type="error" className="mb-4">{error}</Alert>}
      {!orders && !error && <Spinner />}
      {orders?.length === 0 && <EmptyState icon={Package} title="No orders yet" action={<Link to="/" className="btn-primary">Browse products</Link>}>When you buy something, you can track it here.</EmptyState>}
      <div className="space-y-4">{orders?.map((o) => <OrderCard key={o.id} order={o} role="BUYER" onCancel={cancel} />)}</div>
    </div>
  )
}
