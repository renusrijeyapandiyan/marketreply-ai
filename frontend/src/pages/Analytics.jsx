import { useEffect, useState } from 'react'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import Loader from '../components/common/Loader.jsx'
import { historyService } from '../services/historyService.js'
import { humanizeIntent } from '../utils/formatter.js'
import { percentage } from '../utils/helpers.js'

const COLORS = ['#4f46e5', '#059669', '#d97706', '#e11d48', '#0ea5e9', '#7c3aed']

export default function Analytics() {
  const [dashboard, setDashboard] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    historyService.dashboard().then(setDashboard).finally(() => setLoading(false))
  }, [])

  if (loading) return <Loader label="Crunching the numbers…" className="py-24 justify-center" />

  const intentData = Object.entries(dashboard?.intentBreakdown || {}).map(([intent, count], i) => ({
    name: humanizeIntent(intent),
    value: count,
    color: COLORS[i % COLORS.length],
  }))

  const total = dashboard?.totalConversations || 0
  const compliant = dashboard?.ruleCompliantReplies || 0

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-display font-bold text-slate-900">Analytics</h1>
        <p className="text-sm text-slate-500 mt-1">Understand how buyers talk to you and how well replies follow your rules.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="font-display font-semibold text-slate-900 mb-4">Intent distribution</h3>
          {intentData.length === 0 ? (
            <p className="text-sm text-slate-400 py-16 text-center">No data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={intentData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={95} paddingAngle={2}>
                  {intentData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, borderColor: '#e2e8f0', fontSize: 13 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="card p-6">
          <h3 className="font-display font-semibold text-slate-900 mb-4">Rule compliance rate</h3>
          <div className="flex items-center justify-center py-10">
            <div className="relative h-40 w-40">
              <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none" stroke="#f1f5f9" strokeWidth="3.5"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none" stroke="#059669" strokeWidth="3.5"
                  strokeDasharray={`${percentage(compliant, total)}, 100`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-display font-bold text-slate-900">{percentage(compliant, total)}%</span>
                <span className="text-xs text-slate-400">compliant</span>
              </div>
            </div>
          </div>
          <p className="text-sm text-slate-500 text-center">
            {compliant} of {total} replies fully respected your seller rules.
          </p>
        </div>
      </div>
    </div>
  )
}
