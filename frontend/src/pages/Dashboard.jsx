import { useEffect, useState } from 'react'
import { MessageSquareText, Users, ShieldCheck, ShieldAlert } from 'lucide-react'
import StatsCard from '../components/dashboard/StatsCard.jsx'
import AnalyticsChart from '../components/dashboard/AnalyticsChart.jsx'
import RecentMessages from '../components/dashboard/RecentMessages.jsx'
import QuickActions from '../components/dashboard/QuickActions.jsx'
import OrdersPanel from '../components/dashboard/OrdersPanel.jsx'
import Loader from '../components/common/Loader.jsx'
import { historyService } from '../services/historyService.js'

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    historyService.dashboard()
      .then(setDashboard)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Loader label="Loading dashboard…" className="py-24 justify-center" />
  if (error) return <p className="text-rose-600 text-sm">{error}</p>

  const d = dashboard || {}

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-display font-bold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">A snapshot of your AI-assisted buyer conversations.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard label="Total conversations" value={d.totalConversations ?? 0} icon={MessageSquareText} tone="brand" />
        <StatsCard label="Seller profiles" value={d.totalSellers ?? 0} icon={Users} tone="slate" />
        <StatsCard label="Rule-compliant replies" value={d.ruleCompliantReplies ?? 0} icon={ShieldCheck} tone="accent" />
        <StatsCard label="Needs attention" value={d.ruleViolationReplies ?? 0} icon={ShieldAlert} tone="rose" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <AnalyticsChart intentBreakdown={d.intentBreakdown} />
          <RecentMessages conversations={d.recentConversations} />
        </div>
        <QuickActions />
      </div>

      <OrdersPanel />
    </div>
  )
}