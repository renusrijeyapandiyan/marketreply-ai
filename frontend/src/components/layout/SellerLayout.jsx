import { NavLink, Outlet } from 'react-router-dom'
import { LayoutDashboard, Boxes, ClipboardList, MessagesSquare } from 'lucide-react'
import { classNames } from '../../utils/helpers.js'

const TABS = [
  { to: '/seller', end: true, label: 'Overview', icon: LayoutDashboard },
  { to: '/seller/products', label: 'Products', icon: Boxes },
  { to: '/seller/orders', label: 'Orders', icon: ClipboardList },
  { to: '/seller/chats', label: 'AI chats', icon: MessagesSquare },
]

export default function SellerLayout() {
  return (
    <div className="page py-6 sm:py-8">
      <div className="no-scrollbar -mx-1 mb-6 flex gap-1 overflow-x-auto border-b border-ink-100 px-1">
        {TABS.map(({ to, end, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              classNames(
                'flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition',
                isActive ? 'border-brand-600 text-brand-700' : 'border-transparent text-ink-500 hover:text-ink-800',
              )
            }
          >
            <Icon className="h-4 w-4" /> {label}
          </NavLink>
        ))}
      </div>
      <Outlet />
    </div>
  )
}
