import { NavLink, useNavigate } from 'react-router-dom'
import { Sparkles, LogOut } from 'lucide-react'
import { NAV_LINKS } from '../../utils/constants.js'
import { classNames } from '../../utils/helpers.js'
import { useAuth } from '../../hooks/useAuth.js'

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-brand-600 flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="font-display font-bold text-slate-900 leading-tight">MarketReply AI</p>
            <p className="text-xs text-slate-400 leading-tight">Gemini-powered buyer replies</p>
          </div>
        </div>

        {isAuthenticated && (
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  classNames(
                    'px-3.5 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <span className="hidden sm:block text-sm text-slate-500">
                Hi, <span className="font-medium text-slate-700">{user?.name}</span>
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-rose-600 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Log out
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900">
                Log in
              </NavLink>
              <NavLink to="/register" className="btn-primary py-2 px-3.5 text-sm">
                Sign up
              </NavLink>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
