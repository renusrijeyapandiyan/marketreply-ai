import api from './api.js'

export const cartService = {
  get: () => api.get('/cart').then((res) => res.data),
  addItem: (sellerId, quantity = 1) => api.post('/cart/items', { sellerId, quantity }).then((res) => res.data),
  updateQuantity: (sellerId, quantity) => api.patch(`/cart/items/${sellerId}`, { quantity }).then((res) => res.data),
  removeItem: (sellerId) => api.delete(`/cart/items/${sellerId}`).then((res) => res.data),
  clear: () => api.delete('/cart').then((res) => res.data),
  checkout: (payload) => api.post('/cart/checkout', payload).then((res) => res.data),
}