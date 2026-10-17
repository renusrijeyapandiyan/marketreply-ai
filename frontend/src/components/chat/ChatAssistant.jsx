import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Send, RotateCcw, CheckCircle2, X, Lock } from 'lucide-react'
import { chatService } from '../../services/chatService.js'
import { useAuth } from '../../hooks/useAuth.js'
import { formatCurrency } from '../../utils/formatter.js'
import { classNames } from '../../utils/helpers.js'
import ProductImage from '../shop/ProductImage.jsx'
import OrderSummary from './OrderSummary.jsx'

function TypingDots() {
  return (
    <div className="bubble bubble-ai inline-flex items-center gap-1 !py-3" aria-label="Typing">
      {[0, 1, 2].map((i) => <span key={i} className="h-1.5 w-1.5 animate-dots rounded-full bg-ink-400" style={{ animationDelay: `${i * 0.15}s` }} />)}
    </div>
  )
}

/** Floating chat box: bottom-right card on desktop, full screen on phones. */
export default function ChatAssistant({ product, onClose }) {
  const { isAuthenticated } = useAuth()
  const location = useLocation()
  const [view, setView] = useState(null)
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState(null)
  const scroller = useRef(null)

  const start = useCallback(async (fresh = false) => {
    setError(null)
    try { setView(await chatService.start(product.id, fresh)) } catch (err) { setError(err.message) }
  }, [product.id])

  useEffect(() => { if (isAuthenticated) start(false) }, [isAuthenticated, start])
  useEffect(() => { scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: 'smooth' }) }, [view?.messages?.length, sending, view?.stage])

  const send = async (text) => {
    const message = (text ?? input).trim()
    if (!message || sending || !view) return
    setInput('')
    setError(null)
    setView((v) => ({ ...v, messages: [...v.messages, { role: 'BUYER', text: message }], quickReplies: [] }))
    setSending(true)
    try { setView(await chatService.send(view.sessionId, message)) }
    catch (err) { setError(err.message); setView(await chatService.get(view.sessionId).catch(() => view)) }
    finally { setSending(false) }
  }

  const confirm = async () => {
    setSending(true); setError(null)
    try { setView(await chatService.confirm(view.sessionId)) } catch (err) { setError(err.message) } finally { setSending(false) }
  }

  const ordered = view?.stage === 'ORDERED'
  const confirming = view?.stage === 'CONFIRMING'
  const dealPrice = view?.agreedPrice

  return (
    <div className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-ink-100 shadow-2xl sm:inset-auto sm:bottom-5 sm:right-5 sm:h-[640px] sm:max-h-[calc(100vh-2.5rem)] sm:w-[400px] sm:rounded-3xl sm:ring-1 sm:ring-ink-900/10" role="dialog" aria-label="Chat with seller">
      <div className="flex items-center gap-3 bg-gradient-to-r from-ink-900 to-ink-800 px-3 py-3 text-white">
        <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full ring-2 ring-accent-400"><ProductImage src={product.thumbnail || product.productImages?.[0]} name={product.productName} /></div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold leading-tight">{product.sellerName}</p>
          <p className="flex items-center gap-1.5 truncate text-xs text-ink-300"><span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />{product.productName} · {dealPrice ? `Your price ${formatCurrency(dealPrice)}` : formatCurrency(product.listedPrice)}</p>
        </div>
        {view && !ordered && <button onClick={() => start(true)} className="rounded-lg p-2 text-ink-200 hover:bg-white/10" title="Start a new chat" aria-label="Start a new chat"><RotateCcw className="h-4 w-4" /></button>}
        <button onClick={onClose} className="rounded-lg p-2 text-ink-200 hover:bg-white/10" aria-label="Close chat"><X className="h-5 w-5" /></button>
      </div>

      {!isAuthenticated ? (
        <div className="flex flex-1 flex-col items-center justify-center bg-white px-6 text-center">
          <span className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-600"><Lock className="h-6 w-6" /></span>
          <h3 className="text-lg font-bold">Log in to chat with the seller</h3>
          <p className="mt-1.5 max-w-xs text-sm text-ink-500">Ask questions, bargain and place your order in one conversation.</p>
          <div className="mt-5 flex gap-2">
            <Link to="/login" state={{ from: location }} className="btn-primary">Log in</Link>
            <Link to="/register" state={{ from: location }} className="btn-outline">Sign up</Link>
          </div>
        </div>
      ) : (
        <>
          <div ref={scroller} className="min-h-0 flex-1 space-y-2.5 overflow-y-auto p-4">
            {!view && !error && <p className="py-10 text-center text-sm text-ink-500">Connecting…</p>}
            {view?.messages?.map((m, i) => (
              <div key={i} className={classNames('flex', m.role === 'BUYER' ? 'justify-end' : 'justify-start')}>
                <div className={classNames('bubble', m.role === 'BUYER' ? 'bubble-me' : 'bubble-ai')}>{m.text}</div>
              </div>
            ))}
            {sending && <TypingDots />}
            {confirming && <OrderSummary view={view} product={product} onConfirm={confirm} busy={sending} />}
            {ordered && view.order && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-center">
                <CheckCircle2 className="mx-auto h-9 w-9 text-emerald-500" />
                <p className="mt-1 font-display text-lg font-bold text-emerald-900">Order placed!</p>
                <p className="text-sm text-emerald-800">{formatCurrency(view.order.totalPrice)} · {view.order.paymentMethod}</p>
                <div className="mt-3 flex justify-center gap-2">
                  <Link to="/orders" className="btn-primary btn-sm">Track order</Link>
                  <button onClick={() => start(true)} className="btn-outline btn-sm">Buy again</button>
                </div>
              </div>
            )}
            {error && <p className="rounded-xl bg-rose-50 px-3 py-2 text-xs text-rose-700" role="alert">{error}</p>}
          </div>

          {!ordered && (
            <div className="border-t border-ink-200 bg-white p-3">
              {view?.quickReplies?.length > 0 && !sending && (
                <div className="no-scrollbar mb-2.5 flex gap-2 overflow-x-auto pb-0.5">
                  {view.quickReplies.map((q) => <button key={q} onClick={() => send(q)} className="chip shrink-0 !py-1.5 !text-[13px]">{q}</button>)}
                </div>
              )}
              <form onSubmit={(e) => { e.preventDefault(); send() }} className="flex items-center gap-2">
                <input className="input !rounded-full" placeholder={confirming ? 'Type “yes” to place the order…' : 'Type a message…'} value={input} maxLength={600} onChange={(e) => setInput(e.target.value)} disabled={!view || sending} aria-label="Message" />
                <button type="submit" className="btn-primary !h-10 !w-10 shrink-0 !rounded-full !p-0" disabled={!input.trim() || sending || !view} aria-label="Send"><Send className="h-4 w-4" /></button>
              </form>
            </div>
          )}
        </>
      )}
    </div>
  )
}
