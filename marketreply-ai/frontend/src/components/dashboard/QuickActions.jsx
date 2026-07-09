import { Link } from 'react-router-dom'
import { MessageSquareText, Store, History } from 'lucide-react'

const actions = [
  { to: '/buyer-analyzer', label: 'Analyze a buyer message', icon: MessageSquareText, tone: 'bg-brand-600' },
  { to: '/seller-settings', label: 'Update seller rules', icon: Store, tone: 'bg-accent-600' },
  { to: '/history', label: 'Browse conversation history', icon: History, tone: 'bg-slate-700' },
]

export default function QuickActions() {
  return (
    <div className="card p-6">
      <h3 className="font-display font-semibold text-slate-900 mb-4">Quick actions</h3>
      <div className="grid gap-3">
        {actions.map(({ to, label, icon: Icon, tone }) => (
          <Link
            key={to}
            to={to}
            className="flex items-center gap-3 rounded-xl border border-slate-100 px-4 py-3 hover:bg-slate-50 transition-colors"
          >
            <span className={`h-9 w-9 rounded-lg ${tone} flex items-center justify-center text-white`}>
              <Icon className="h-4.5 w-4.5" />
            </span>
            <span className="text-sm font-medium text-slate-700">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
