import { Link } from 'react-router-dom'
import { Logo } from './Navbar.jsx'

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-ink-100 bg-white">
      <div className="page flex flex-col items-start justify-between gap-6 py-10 sm:flex-row sm:items-center">
        <div>
          <Logo />
          <p className="mt-2 max-w-xs text-sm text-ink-500">Shop, negotiate and check out in one chat with an AI assistant that follows the seller's rules.</p>
        </div>
        <div className="flex gap-6 text-sm font-medium text-ink-600">
          <Link to="/" className="hover:text-brand-700">Browse</Link>
          <Link to="/orders" className="hover:text-brand-700">My orders</Link>
          <Link to="/seller" className="hover:text-brand-700">Sell with us</Link>
        </div>
      </div>
      <div className="border-t border-ink-100 py-4 text-center text-xs text-ink-400">© {new Date().getFullYear()} marketreply</div>
    </footer>
  )
}
