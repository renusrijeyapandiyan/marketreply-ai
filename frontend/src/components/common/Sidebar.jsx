import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Store, MessageSquareText, History, BarChart3, Home as HomeIcon, ShoppingCart, ShoppingBag, Sparkles } from 'lucide-react'
import { classNames } from '../../utils/helpers.js'
import { useCart } from '../../hooks/useCart.js'

const items = [
  { to: '/', label: 'Home', icon: HomeIcon },
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/seller-settings', label: 'Seller Settings', icon: Store },
  { to: '/buyer-analyzer', label: 'Buyer Analyzer', icon: MessageSquareText },
  { to: '/cart', label: 'Cart', icon: ShoppingCart, badgeKey: 'cart' },
  { to: '/orders', label: 'Orders', icon: ShoppingBag },
  { to: '/history', label: 'History', icon: History },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
]

export default function Sidebar() {
  const { cart } = useCart()

  return (
    <aside className="hidden lg:flex w-60 shrink-0 flex-col border-r border-slate-200/70 bg-white px-4 py-6">
      <nav className="flex flex-col gap-1">
        {items.map(({ to, label, icon: Icon, badgeKey }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              classNames(
                'flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all',
                isActive
                  ? 'bg-brand-gradient text-white shadow-brand-sm'
                  : 'text-slate-600 hover:bg-slate-50'
              )
            }
          >
            <Icon className="h-4.5 w-4.5" />
            {label}
            {badgeKey === 'cart' && cart.itemCount > 0 && (
              <span className="ml-auto text-xs font-semibold bg-brand-100 text-brand-700 rounded-full h-5 min-w-5 px-1.5 flex items-center justify-center">
                {cart.itemCount}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto rounded-2xl surface-brand border border-brand-100 p-4">
        <div className="flex items-center gap-1.5 mb-1">
          <Sparkles className="h-3.5 w-3.5 text-brand-600" />
          <p className="text-sm font-semibold text-brand-800">Tip</p>
        </div>
        <p className="text-xs text-brand-700/90 leading-relaxed">
          Set your minimum price and payment rules once — Gemini will hold the line on every negotiation.
        </p>
      </div>
    </aside>
  )
}