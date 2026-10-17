import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ShoppingCart, Search, Store, LogOut, Package, ChevronDown, Sparkles, LayoutDashboard } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth.js'
import { useCart } from '../../hooks/useCart.js'
import { classNames } from '../../utils/helpers.js'

export function Logo({ className = '', dark = false }) {
  return (
    <Link to="/" className={classNames('flex shrink-0 items-center gap-2.5', className)}>
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-accent-400 text-white shadow-brand">
        <Sparkles className="h-5 w-5" />
      </span>
      <span className={classNames('font-display text-xl font-extrabold tracking-tight', dark ? 'text-white' : 'text-ink-900')}>
        market<span className="text-accent-400">reply</span>
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
  }
  const handleLogout = () => { logout(); setMenuOpen(false); navigate('/') }
  const initial = (user?.name || '?').trim().charAt(0).toUpperCase()

  const search = (
    <form onSubmit={submit} className="flex w-full overflow-hidden rounded-xl bg-white shadow-sm ring-2 ring-transparent focus-within:ring-accent-400">
      <input
        className="min-w-0 flex-1 bg-transparent px-4 py-2.5 text-sm text-ink-900 outline-none placeholder:text-ink-400"
        placeholder="Search for products, brands and more"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Search products"
      />
      <button type="submit" className="grid w-12 place-items-center bg-accent-400 text-ink-900 transition hover:bg-accent-300" aria-label="Search">
        <Search className="h-5 w-5" />
      </button>
    </form>
  )

  return (
    <header className="sticky top-0 z-40 bg-ink-900 text-white shadow-lg shadow-ink-950/20">
      <div className="page flex h-16 items-center gap-4">
        <Logo dark />
        <div className="mx-auto hidden w-full max-w-2xl md:block">{search}</div>

        <nav className="ml-auto flex items-center gap-1">
          <Link to="/seller" className="hidden items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-ink-100 transition hover:bg-white/10 sm:inline-flex">
            <Store className="h-4 w-4" /> Sell
          </Link>

          <Link to="/cart" className="relative rounded-xl px-3 py-2 text-ink-100 transition hover:bg-white/10" aria-label="Cart">
            <ShoppingCart className="h-5 w-5" />
            {cart.itemCount > 0 && (
              <span className="absolute right-0.5 top-0 grid h-5 min-w-[1.25rem] place-items-center rounded-full bg-accent-400 px-1 text-[11px] font-extrabold text-ink-900">
                {cart.itemCount}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <div className="relative" ref={menuRef}>
              <button onClick={() => setMenuOpen((v) => !v)} className="flex items-center gap-2 rounded-full bg-white/10 py-1 pl-1 pr-2.5 transition hover:bg-white/15">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-accent-400 text-sm font-bold text-white">{initial}</span>
                <ChevronDown className="h-4 w-4 text-ink-200" />
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-56 animate-pop rounded-2xl border border-ink-100 bg-white p-1.5 text-ink-900 shadow-lift">
                  <div className="px-3 py-2">
                    <p className="truncate text-sm font-semibold">{user?.name}</p>
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
              <Link to="/login" className="rounded-xl px-3 py-2 text-sm font-semibold text-ink-100 transition hover:bg-white/10">Log in</Link>
              <Link to="/register" className="btn-accent btn-sm hidden sm:inline-flex">Sign up</Link>
            </>
          )}
        </nav>
      </div>
      <div className="page pb-3 md:hidden">{search}</div>
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
