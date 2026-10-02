export const INTENTS = {
  NEGOTIATE_PRICE: 'Negotiate price',
  ASK_DELIVERY: 'Ask about delivery',
  ASK_AVAILABILITY: 'Ask availability',
  ASK_PAYMENT: 'Ask about payment',
  CONFIRM_PURCHASE: 'Confirm purchase',
  GENERAL_QUESTION: 'General question',
  OTHER: 'Other',
}

export const SENTIMENT_COLORS = {
  POSITIVE: 'badge-success',
  NEUTRAL: 'badge-neutral',
  NEGATIVE: 'badge-danger',
}

export const NEGOTIATION_STYLES = ['FLEXIBLE', 'MODERATE', 'FIRM']

export const ORDER_STATUS_LABELS = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
}

export const ORDER_STATUS_COLORS = {
  PENDING: 'badge-neutral',
  CONFIRMED: 'badge-brand',
  SHIPPED: 'badge-brand',
  DELIVERED: 'badge-success',
  CANCELLED: 'badge-danger',
}

/** What a seller can move an order to next, in order. */
export const ORDER_STATUS_FLOW = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED']

export const PAYMENT_METHOD_OPTIONS = [
  'Cash', 'UPI', 'Bank Transfer', 'Credit Card', 'Debit Card', 'PayPal',
]

export const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/seller-settings', label: 'Seller Settings' },
  { to: '/buyer-analyzer', label: 'Buyer Analyzer' },
  { to: '/orders', label: 'Orders' },
  { to: '/history', label: 'History' },
  { to: '/analytics', label: 'Analytics' },
]