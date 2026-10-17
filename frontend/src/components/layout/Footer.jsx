import { Link } from 'react-router-dom'
import { Logo } from './Navbar.jsx'

export default function Footer() {
  return (
    <footer className="mt-16 bg-ink-900 text-ink-200">
      <div className="page grid gap-8 py-12 sm:grid-cols-3">
        <div>
          <Logo dark />
          <p className="mt-3 max-w-xs text-sm text-ink-300">A marketplace where every product has its own AI assistant. Ask, bargain and order in one chat.</p>
        </div>
        <div>
          <p className="mb-3 text-sm font-bold text-white">Shop</p>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-accent-300">All products</Link></li>
            <li><Link to="/orders" className="hover:text-accent-300">My orders</Link></li>
            <li><Link to="/cart" className="hover:text-accent-300">Cart</Link></li>
          </ul>
        </div>
        <div>
          <p className="mb-3 text-sm font-bold text-white">Sell</p>
          <ul className="space-y-2 text-sm">
            <li><Link to="/seller/products/new" className="hover:text-accent-300">List a product</Link></li>
            <li><Link to="/seller" className="hover:text-accent-300">Seller hub</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-ink-400">© {new Date().getFullYear()} marketreply</div>
    </footer>
  )
}
