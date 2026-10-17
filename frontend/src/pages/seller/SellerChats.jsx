import { useEffect, useState } from 'react'
import { Bot, MessagesSquare, User } from 'lucide-react'
import Spinner from '../../components/ui/Spinner.jsx'
import EmptyState from '../../components/ui/EmptyState.jsx'
import Alert from '../../components/ui/Alert.jsx'
import { chatService } from '../../services/chatService.js'
import { formatCurrency, timeAgo } from '../../utils/formatter.js'
import { CHAT_STAGE_LABELS } from '../../utils/constants.js'
import { classNames } from '../../utils/helpers.js'

export default function SellerChats() {
  const [chats, setChats] = useState(null)
  const [open, setOpen] = useState(null)
  const [detail, setDetail] = useState(null)
  const [error, setError] = useState(null)
  useEffect(() => { chatService.list().then(setChats).catch((e) => setError(e.message)) }, [])
  useEffect(() => { if (open) chatService.get(open).then(setDetail).catch((e) => setError(e.message)) }, [open])

  if (error) return <Alert type="error">{error}</Alert>
  if (!chats) return <Spinner />
  if (!chats.length) return <EmptyState icon={MessagesSquare} title="No conversations yet">When buyers chat with your products' assistants, you can read the transcripts here.</EmptyState>

  return (
    <div className="grid gap-5 lg:grid-cols-[340px_1fr]">
      <div className="space-y-2">
        {chats.map((c) => (
          <button key={c.id} onClick={() => setOpen(c.id)} className={classNames('card w-full p-3.5 text-left transition', open === c.id ? '!border-brand-400 ring-2 ring-brand-100' : 'hover:border-ink-300')}>
            <div className="flex items-center justify-between gap-2"><p className="truncate font-bold">{c.productName}</p><span className="shrink-0 text-xs text-ink-400">{timeAgo(c.updatedAt)}</span></div>
            <p className="truncate text-sm text-ink-500">{c.buyerName} · {c.lastMessage}</p>
            <div className="mt-2 flex items-center gap-2">
              <span className={c.stage === 'ORDERED' ? 'badge-success' : 'badge-neutral'}>{CHAT_STAGE_LABELS[c.stage]}</span>
              {c.agreedPrice != null && <span className="badge-accent">Deal {formatCurrency(c.agreedPrice)}</span>}
            </div>
          </button>
        ))}
      </div>
      <div className="card min-h-[320px] p-4">
        {!detail ? <p className="grid h-60 place-items-center text-sm text-ink-500">Select a conversation to read it.</p> : (
          <div className="space-y-3">
            {detail.messages.map((m, i) => (
              <div key={i} className={classNames('flex gap-2', m.role === 'BUYER' && 'justify-end')}>
                {m.role !== 'BUYER' && <Bot className="mt-1 h-5 w-5 shrink-0 text-brand-600" />}
                <div className={classNames('bubble', m.role === 'BUYER' ? 'bubble-me' : 'bubble-ai')}>{m.text}</div>
                {m.role === 'BUYER' && <User className="mt-1 h-5 w-5 shrink-0 text-ink-400" />}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
