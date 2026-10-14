import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Sparkles } from 'lucide-react'
import { useAuth } from '../hooks/useAuth.js'
import { Input } from '../components/ui/Field.jsx'
import Alert from '../components/ui/Alert.jsx'
import { validateLoginForm, validateRegisterForm } from '../utils/validator.js'

export default function AuthPage({ mode }) {
  const isLogin = mode === 'login'
  const { login, register, isAuthenticated, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [errors, setErrors] = useState({})
  const [error, setError] = useState(null)
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  if (isAuthenticated) return <Navigate to={from} replace />

  const submit = async (e) => {
    e.preventDefault()
    const errs = isLogin ? validateLoginForm(form) : validateRegisterForm(form)
    setErrors(errs)
    if (Object.keys(errs).length) return
    setError(null)
    try {
      if (isLogin) await login({ email: form.email, password: form.password })
      else await register({ name: form.name, email: form.email, password: form.password })
      navigate(from, { replace: true })
    } catch (err) { setError(err.message) }
  }

  return (
    <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-2">
      <div className="relative hidden flex-col justify-center overflow-hidden bg-gradient-to-br from-brand-800 to-brand-600 p-14 text-white lg:flex">
        <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-accent-400/20 blur-3xl" />
        <Sparkles className="h-10 w-10 text-accent-300" />
        <h2 className="mt-6 font-display text-4xl font-extrabold leading-tight text-white">Shopping that talks back.</h2>
        <p className="mt-4 max-w-md text-lg text-brand-50">Negotiate prices, ask about delivery and place orders with an AI assistant, or list your own products and let it sell for you.</p>
      </div>
      <div className="flex items-center justify-center px-4 py-12">
        <form onSubmit={submit} className="w-full max-w-sm space-y-4">
          <div><h1 className="text-3xl font-extrabold">{isLogin ? 'Welcome back' : 'Create your account'}</h1>
            <p className="mt-1 text-sm text-ink-500">{isLogin ? 'Log in to chat, order and sell.' : 'One account to buy and sell.'}</p></div>
          {error && <Alert type="error">{error}</Alert>}
          {!isLogin && <Input id="name" label="Full name" value={form.name} onChange={set('name')} error={errors.name} autoComplete="name" />}
          <Input id="email" label="Email" type="email" value={form.email} onChange={set('email')} error={errors.email} autoComplete="email" />
          <Input id="password" label="Password" type="password" value={form.password} onChange={set('password')} error={errors.password} autoComplete={isLogin ? 'current-password' : 'new-password'} />
          {!isLogin && <Input id="cp" label="Confirm password" type="password" value={form.confirmPassword} onChange={set('confirmPassword')} error={errors.confirmPassword} />}
          <button className="btn-primary btn-lg w-full" disabled={loading}>{loading ? 'Please wait…' : isLogin ? 'Log in' : 'Sign up'}</button>
          <p className="text-center text-sm text-ink-500">
            {isLogin ? 'New here?' : 'Already have an account?'}{' '}
            <Link to={isLogin ? '/register' : '/login'} state={location.state} className="font-semibold text-brand-700 hover:underline">{isLogin ? 'Create an account' : 'Log in'}</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
