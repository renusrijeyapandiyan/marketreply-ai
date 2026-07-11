import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Store, Users, MessageSquareText, History, BarChart3, Home as HomeIcon } from 'lucide-react'
import { classNames } from '../../utils/helpers.js'

const items = [
  { to: '/', label: 'Home', icon: HomeIcon },
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/seller-settings', label: 'Seller Settings', icon: Store },
  { to: '/sellers', label: 'All Sellers', icon: Users },
  { to: '/buyer-analyzer', label: 'Buyer Analyzer', icon: MessageSquareText },
  { to: '/history', label: 'History', icon: History },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
]

export default function Sidebar() {
  return (
    <aside className="hidden lg:flex w-60 shrink-0 flex-col border-r border-slate-200 bg-white px-4 py-6">
      <nav className="flex flex-col gap-1">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              classNames(
                'flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors',
                isActive ? 'bg-brand-600 text-white shadow-card' : 'text-slate-600 hover:bg-slate-50'
              )
            }
          >
            <Icon className="h-4.5 w-4.5" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto rounded-2xl bg-brand-50 p-4">
        <p className="text-sm font-semibold text-brand-800">Tip</p>
        <p className="text-xs text-brand-700 mt-1 leading-relaxed">
          Set your minimum price and payment rules once — Gemini will hold the line on every negotiation.
        </p>
      </div>
    </aside>
  )
}