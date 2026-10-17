export function formatCurrency(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return '—'
  const n = Number(value)
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: Number.isInteger(n) ? 0 : 2,
  }).format(n)
}

export function formatDate(iso) {
  if (!iso) return '—'
  return new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(iso))
}

export function timeAgo(iso) {
  if (!iso) return ''
  const s = Math.max(1, Math.floor((Date.now() - new Date(iso).getTime()) / 1000))
  if (s < 60) return 'just now'
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  return d < 7 ? `${d}d ago` : formatDate(iso).split(',')[0]
}

export function truncate(text, max = 90) {
  if (!text) return ''
  return text.length > max ? text.slice(0, max).trim() + '…' : text
}

export function percentOff(listed, price) {
  if (!listed || price === null || price === undefined || price >= listed) return 0
  return Math.round(((listed - price) / listed) * 100)
}
