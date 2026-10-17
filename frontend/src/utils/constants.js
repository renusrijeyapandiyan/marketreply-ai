export const CATEGORIES = [
  'Electronics', 'Furniture', 'Fashion', 'Home & Kitchen', 'Books', 'Sports & Fitness',
  'Toys & Kids', 'Vehicles & Parts', 'Handmade', 'Groceries', 'Beauty', 'Other',
]

export const PAYMENT_METHOD_OPTIONS = ['UPI', 'Cash on Delivery', 'Card', 'Bank Transfer']

export const NEGOTIATION_STYLES = [
  { value: 'FLEXIBLE', label: 'Flexible', desc: 'Moves quickly toward your lowest price' },
  { value: 'MODERATE', label: 'Balanced', desc: 'Gives ground in steady steps' },
  { value: 'FIRM', label: 'Firm', desc: 'Concedes slowly and holds the price longer' },
]

export const ORDER_STATUS_LABELS = {
  PENDING: 'Pending', CONFIRMED: 'Confirmed', SHIPPED: 'Shipped', DELIVERED: 'Delivered', CANCELLED: 'Cancelled',
}

export const ORDER_STATUS_BADGE = {
  PENDING: 'badge-accent', CONFIRMED: 'badge-brand', SHIPPED: 'badge-brand', DELIVERED: 'badge-success', CANCELLED: 'badge-danger',
}

/** What a seller can move an order to next, in order. */
export const ORDER_STATUS_FLOW = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED']

export const CHAT_STAGE_LABELS = {
  CHATTING: 'In conversation', CONFIRMING: 'Awaiting confirmation', ORDERED: 'Order placed',
}

export const MISSING_LABELS = {
  deliveryMethod: 'Delivery or pickup',
  deliveryAddress: 'Delivery address',
  paymentMethod: 'Payment method',
  buyerPhone: 'Phone number',
}
