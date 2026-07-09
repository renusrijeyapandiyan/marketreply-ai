import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { humanizeIntent } from '../../utils/formatter.js'

export default function AnalyticsChart({ intentBreakdown = {} }) {
  const data = Object.entries(intentBreakdown).map(([intent, count]) => ({
    intent: humanizeIntent(intent),
    count,
  }))

  if (data.length === 0) {
    return (
      <div className="card p-6 h-72 flex items-center justify-center text-sm text-slate-400">
        No conversations analyzed yet — intent breakdown will appear here.
      </div>
    )
  }

  return (
    <div className="card p-6">
      <h3 className="font-display font-semibold text-slate-900 mb-4">Buyer intent breakdown</h3>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 4, right: 12, left: -12, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
          <XAxis dataKey="intent" tick={{ fontSize: 11, fill: '#64748b' }} interval={0} angle={-15} textAnchor="end" height={60} />
          <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#64748b' }} />
          <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: 12, borderColor: '#e2e8f0', fontSize: 13 }} />
          <Bar dataKey="count" fill="#4f46e5" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
