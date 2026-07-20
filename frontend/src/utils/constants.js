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

/** Must match SellerDTO.CUSTOM_SIZE on the backend. */
export const CUSTOM_SIZE = 'CUSTOMIZE'

export const PAYMENT_METHOD_OPTIONS = [
  'Cash', 'UPI', 'Bank Transfer', 'Credit Card', 'Debit Card', 'PayPal',
]

export const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/seller-settings', label: 'Seller Settings' },
  { to: '/buyer-analyzer', label: 'Buyer Analyzer' },
  { to: '/history', label: 'History' },
  { to: '/analytics', label: 'Analytics' },
]