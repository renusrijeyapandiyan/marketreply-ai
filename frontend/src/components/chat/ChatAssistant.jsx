import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Bot, Send, RotateCcw, CheckCircle2, Lock, Sparkles, TriangleAlert } from 'lucide-react'
import { chatService } from '../../services/chatService.js'
import { useAuth } from '../../hooks/useAuth.js'
import { formatCurrency, percentOff } from '../../utils/formatter.js'
import { MISSING_LABELS } from '../../utils/constants.js'
import { classNames } from '../../utils/helpers.js'
import OrderSummary from './OrderSummary.jsx'

function TypingDots() {
  return (
    <div className="bubble bubble-ai inline-flex items-center gap-1 !py-3" aria-label="Assistant is typing">
      {[0, 1, 2].map((i) => <span key={i} className="h-1.5 w-1.5 animate-dots rounded-full bg-ink-400" style={{ animationDelay: `${i * 0.15}s` }} />)}
    </div>
  )
}

/** The price strip: what it's listed at, what is on the table, and the agreed deal. */
function DealStrip({ view }) {
  const price = view.agreedPrice ?? view.currentOffer
  if (price === null || price === undefined) return null
  const off = percentOff(view.listedPrice, price)
  const agreed = view.agreedPrice !== null && view.agreedPrice !== undefined
  return (
    <div className={classNames('flex items-center justify-between gap-3 border-b px-4 py-2.5 text-sm', agreed ? 'border-emerald-100 bg-emerald-50' : 'border-accent-100 bg-accent-50')}>
      <div>
        <p className={classNames('text-[11px] font-bold uppercase tracking-wide', agreed ? 'text-emerald-700' : 'text-accent-700')}>
          {agreed ? 'Deal agreed' : view.finalPrice ? 'Final offer' : 'Current offer'}
        </p>
        <p className="font-display text-lg font-extrabold text-ink-900">
          {formatCurrency(price)} <span className="text-xs font-medium text-ink-500">per unit</span>
        </p>
      </div>
      <div className="text-right">
        <p className="text-xs text-ink-500 line-through">{formatCurrency(view.listedPrice)}</p>
        {off > 0 && <span className="badge-success">{off}% off</span>}
      </div>
    </div>
  )
}

export default function ChatAssistant({ product, className = '' }) {
  const { isAuthenticated } = useAuth()
  const location = useLocation()
  const [view, setView] = useState(null)
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const scroller = useRef(null)

  const start = useCallback(async (fresh = false) => {
    setLoading(true)
    setError(null)
    try {
      setView(await chatService.start(product.id, fresh))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [product.id])

  useEffect(() => { if (isAuthenticated) start(false) }, [isAuthenticated, start])

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: 'smooth' })
  }, [view?.messages?.length, sending])

  const send = async (text) => {
    const message = (text ?? input).trim()
    if (!message || sending || !view) return
    setInput('')
    setError(null)
    // Show the buyer's message immediately; the server's version replaces it.
    setView((v) => ({ ...v, messages: [...v.messages, { role: 'BUYER', text: message }], quickReplies: [] }))
    setSending(true)
    try {
      setView(await chatService.send(view.sessionId, message))
    } catch (err) {
      setError(err.message)
      setView(await chatService.get(view.sessionId).catch(() => view))
    } finally {
      setSending(false)
    }
  }

  const confirm = async () => {
    setSending(true)
    setError(null)
    try {
      setView(await chatService.confirm(view.sessionId))
    } catch (err) {
      setError(err.message)
    } finally {
      setSending(false)
    }
  }

  const shell = classNames('card flex flex-col overflow-hidden', className)
  const header = (
    <div className="flex items-center justify-between gap-3 border-b border-ink-100 bg-gradient-to-r from-brand-700 to-brand-600 px-4 py-3 text-white">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-white/15"><Bot className="h-5 w-5" /></span>
        <div>
          <p className="font-display text-base font-bold leading-tight">Shopping assistant</p>
          <p className="flex items-center gap-1.5 text-xs text-brand-100"><span className="h-1.5 w-1.5 rounded-full bg-emerald-300" /> Negotiate · ask · order</p>
        </div>
      </div>
      {view && (
        <button onClick={() => start(true)} className="rounded-lg p-2 text-brand-100 hover:bg-white/10 hover:text-white" title="Start a new chat" aria-label="Start a new chat">
          <RotateCcw className="h-4 w-4" />
        </button>
      )}
    </div>
  )

  if (!isAuthenticated) {
    return (
      <div className={shell}>
        {header}
        <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 text-center">
          <span className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-600"><Lock className="h-6 w-6" /></span>
          <h3 className="text-lg font-bold">Log in to chat with the assistant</h3>
          <p className="mt-1.5 max-w-xs text-sm text-ink-500">Ask about delivery, negotiate a better price and place your order, all in one conversation.</p>
          <div className="mt-5 flex gap-2">
            <Link to="/login" state={{ from: location }} className="btn-primary">Log in</Link>
            <Link to="/register" state={{ from: location }} className="btn-outline">Sign up</Link>
          </div>
        </div>
      </div>
    )
  }

  const ordered = view?.stage === 'ORDERED'
  const confirming = view?.stage === 'CONFIRMING'

  return (
    <div className={shell}>
      {header}
      {view && <DealStrip view={view} />}

      <div ref={scroller} className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-ink-50/70 p-4">
        {loading && !view && <div className="py-10 text-center text-sm text-ink-500">Connecting to the assistant…</div>}
        {view?.messages?.map((m, i) => (
          <div key={i} className={classNames('flex', m.role === 'BUYER' ? 'justify-end' : 'justify-start')}>
            <div className={classNames('bubble', m.role === 'BUYER' ? 'bubble-me' : 'bubble-ai')}>{m.text}</div>
          </div>
        ))}
        {sending && <TypingDots />}

        {view && !ordered && view.missing?.length > 0 && (
          <div className="rounded-xl border border-dashed border-ink-300 bg-white/70 p-3 text-xs text-ink-600">
            <p className="mb-1.5 font-semibold text-ink-700">Still needed to place your order</p>
            <div className="flex flex-wrap gap-1.5">
              {view.missing.map((k) => <span key={k} className="badge-neutral">{MISSING_LABELS[k] || k}</span>)}
            </div>
          </div>
        )}

        {confirming && <OrderSummary view={view} product={product} onConfirm={confirm} busy={sending} />}

        {ordered && view.order && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-center">
            <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-500" />
            <p className="mt-2 font-display text-lg font-bold text-emerald-900">Order placed!</p>
            <p className="text-sm text-emerald-800">{formatCurrency(view.order.totalPrice)} · {view.order.paymentMethod}</p>
            <div className="mt-3 flex justify-center gap-2">
              <Link to="/orders" className="btn-primary btn-sm">Track order</Link>
              <button onClick={() => start(true)} className="btn-outline btn-sm">Buy again</button>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-start gap-2 border-t border-rose-100 bg-rose-50 px-4 py-2 text-xs text-rose-700" role="alert">
          <TriangleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {error}
        </div>
      )}
      {view?.aiFallback && !error && (
        <div className="flex items-center gap-2 border-t border-ink-100 bg-white px-4 py-1.5 text-[11px] text-ink-500">
          <Sparkles className="h-3 w-3" /> The AI is busy, so I'm replying in basic mode. Prices and rules are still exact.
        </div>
      )}

      {!ordered && (
        <div className="border-t border-ink-100 bg-white p-3">
          {view?.quickReplies?.length > 0 && !sending && (
            <div className="no-scrollbar mb-2.5 flex gap-2 overflow-x-auto pb-0.5">
              {view.quickReplies.map((q) => (
                <button key={q} onClick={() => send(q)} className="chip shrink-0 !py-1.5 !text-[13px]">{q}</button>
              ))}
            </div>
          )}
          <form onSubmit={(e) => { e.preventDefault(); send() }} className="flex items-center gap-2">
            <input
              className="input !rounded-full"
              placeholder={confirming ? 'Type “yes” to confirm, or change a detail…' : 'Ask a question or make an offer…'}
              value={input}
              maxLength={600}
              onChange={(e) => setInput(e.target.value)}
              disabled={!view || sending}
              aria-label="Message"
            />
            <button type="submit" className="btn-primary !h-10 !w-10 shrink-0 !rounded-full !p-0" disabled={!input.trim() || sending || !view} aria-label="Send">
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
