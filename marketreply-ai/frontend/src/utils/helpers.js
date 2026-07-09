export function classNames(...args) {
  return args.filter(Boolean).join(' ')
}

export function safeArray(value) {
  return Array.isArray(value) ? value : []
}

export function percentage(part, total) {
  if (!total) return 0
  return Math.round((part / total) * 100)
}
