import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles, ShieldCheck, Zap } from 'lucide-react'
import { useAuth } from '../hooks/useAuth.js'

const FEATURES = [
  {
    icon: Sparkles,
    title: 'Understands buyer intent',
    desc: 'Gemini 2.5 Flash reads every message to detect what the buyer actually wants — a discount, delivery, or just information.',
  },
  {
    icon: ShieldCheck,
    title: 'Honors your rules',
    desc: 'Set a minimum price, delivery radius, and accepted payment methods once. Every reply respects them automatically.',
  },
  {
    icon: Zap,
    title: 'Replies in seconds',
    desc: 'Get a polite, professional, ready-to-send reply drafted for you — no more staring at a blank chat box.',
  },
]

export default function Home() {
  const { isAuthenticated } = useAuth()
  const primaryCta = isAuthenticated ? '/seller-settings' : '/register'
  const secondaryCta = isAuthenticated ? '/buyer-analyzer' : '/login'

  return (
    <div className="space-y-16">
      <section className="text-center pt-6 pb-2">
        <span className="badge-brand mb-4">Powered by Gemini 2.5 Flash</span>
        <h1 className="text-4xl sm:text-5xl font-display font-extrabold text-slate-900 tracking-tight">
          Never miss the right words<br className="hidden sm:block" /> with a buyer again.
        </h1>
        <p className="mt-5 text-lg text-slate-500 max-w-2xl mx-auto">
          MarketReply AI reads buyer messages, checks them against your rules, and drafts the reply —
          so you can close more sales without repeating yourself.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link to={primaryCta} className="btn-primary">
            {isAuthenticated ? 'Set up your seller profile' : 'Get started free'} <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to={secondaryCta} className="btn-secondary">
            {isAuthenticated ? 'Try the analyzer' : 'Log in'}
          </Link>
        </div>
      </section>

      <section className="grid sm:grid-cols-3 gap-6">
        {FEATURES.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="card p-6">
            <div className="h-10 w-10 rounded-xl bg-brand-50 flex items-center justify-center mb-4">
              <Icon className="h-5 w-5 text-brand-600" />
            </div>
            <h3 className="font-display font-semibold text-slate-900">{title}</h3>
            <p className="text-sm text-slate-500 mt-2 leading-relaxed">{desc}</p>
          </div>
        ))}
      </section>

      <section className="card p-8 bg-slate-900 text-white text-center">
        <h2 className="font-display text-2xl font-bold">Three steps to your first AI reply</h2>
        <div className="grid sm:grid-cols-3 gap-6 mt-8 text-left">
          <div>
            <p className="text-brand-300 font-display font-bold text-sm">Step 1</p>
            <p className="mt-1 text-sm text-slate-300">Create a seller profile with your product and rules.</p>
          </div>
          <div>
            <p className="text-brand-300 font-display font-bold text-sm">Step 2</p>
            <p className="mt-1 text-sm text-slate-300">Paste a buyer's message into the analyzer.</p>
          </div>
          <div>
            <p className="text-brand-300 font-display font-bold text-sm">Step 3</p>
            <p className="mt-1 text-sm text-slate-300">Review the AI's analysis and send the suggested reply.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
