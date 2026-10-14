import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useNavigate, useSearchParams } from 'react-router-dom'
import { ShoppingCart, Search, Store, LogOut, Package, Menu, X, ChevronDown, Sparkles, LayoutDashboard } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth.js'
import { useCart } from '../../hooks/useCart.js'
import { classNames } from '../../utils/helpers.js'

export function Logo({ className = '' }) {
  return (
    <Link to="/" className={classNames('flex items-center gap-2.5 shrink-0', className)}>
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-600 text-white shadow-brand">
        <Sparkles className="h-5 w-5" />
      </span>
      <span className="font-display text-xl font-extrabold tracking-tight text-ink-900">
        market<span className="text-brand-600">reply</span>
      </span>
    </Link>
  )
}

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth()
  const { cart } = useCart()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [query, setQuery] = useState(params.get('q') || '')
  const [menuOpen, setMenuOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => { setQuery(params.get('q') || '') }, [params])
  useEffect(() => {
    const close = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false) }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  const submit = (e) => {
    e.preventDefault()
    navigate(query.trim() ? `/?q=${encodeURIComponent(query.trim())}` : '/')
    setMobileOpen(false)
  }

  const handleLogout = () => { logout(); setMenuOpen(false); navigate('/') }
  const initial = (user?.name || '?').trim().charAt(0).toUpperCase()

  return (
    <header className="sticky top-0 z-40 border-b border-ink-100 bg-white/90 backdrop-blur-md">
      <div className="page flex h-16 items-center gap-4">
        <Logo />

        <form onSubmit={submit} className="relative mx-auto hidden w-full max-w-xl md:block">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input
            className="input !rounded-full !bg-ink-50 !pl-10"
            placeholder="Search products, e.g. study table, headphones…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search products"
          />
        </form>

        <nav className="ml-auto flex items-center gap-1.5">
          <NavLink to="/seller" className={({ isActive }) => classNames('btn-ghost hidden sm:inline-flex', isActive && '!bg-brand-50 !text-brand-700')}>
            <Store className="h-4 w-4" /> Sell
          </NavLink>

          <Link to="/cart" className="btn-ghost relative !px-3" aria-label="Cart">
            <ShoppingCart className="h-5 w-5" />
            {cart.itemCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-[1.25rem] place-items-center rounded-full bg-accent-500 px-1 text-[11px] font-bold text-white">
                {cart.itemCount}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <div className="relative" ref={menuRef}>
              <button onClick={() => setMenuOpen((v) => !v)} className="flex items-center gap-2 rounded-full border border-ink-200 bg-white py-1 pl-1 pr-2.5 hover:border-ink-300">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-brand-600 text-sm font-bold text-white">{initial}</span>
                <ChevronDown className="h-4 w-4 text-ink-500" />
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-56 animate-pop rounded-2xl border border-ink-100 bg-white p-1.5 shadow-lift">
                  <div className="px-3 py-2">
                    <p className="truncate text-sm font-semibold text-ink-900">{user?.name}</p>
                    <p className="truncate text-xs text-ink-500">{user?.email}</p>
                  </div>
                  <div className="my-1 h-px bg-ink-100" />
                  <MenuLink to="/orders" icon={Package} onClick={() => setMenuOpen(false)}>My orders</MenuLink>
                  <MenuLink to="/seller" icon={LayoutDashboard} onClick={() => setMenuOpen(false)}>Seller hub</MenuLink>
                  <button onClick={handleLogout} className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50">
                    <LogOut className="h-4 w-4" /> Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="btn-ghost">Log in</Link>
              <Link to="/register" className="btn-primary hidden sm:inline-flex">Sign up</Link>
            </>
          )}

          <button className="btn-ghost !px-2.5 md:hidden" onClick={() => setMobileOpen((v) => !v)} aria-label="Menu">
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>
      </div>

      {mobileOpen && (
        <div className="border-t border-ink-100 bg-white px-4 py-3 md:hidden">
          <form onSubmit={submit} className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input className="input !rounded-full !pl-10" placeholder="Search products…" value={query} onChange={(e) => setQuery(e.target.value)} />
          </form>
          <Link to="/seller" onClick={() => setMobileOpen(false)} className="mt-2 flex items-center gap-2 rounded-xl px-2 py-2 text-sm font-medium text-ink-700">
            <Store className="h-4 w-4" /> Sell on marketreply
          </Link>
        </div>
      )}
    </header>
  )
}

function MenuLink({ to, icon: Icon, children, onClick }) {
  return (
    <Link to={to} onClick={onClick} className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-ink-700 hover:bg-ink-50">
      <Icon className="h-4 w-4 text-ink-400" /> {children}
    </Link>
  )
}
