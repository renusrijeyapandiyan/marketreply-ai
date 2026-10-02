import api from './api.js'

export const reviewService = {
  listForSeller: (sellerId) => api.get(`/reviews/seller/${sellerId}`).then((res) => res.data),
  create: (payload) => api.post('/reviews', payload).then((res) => res.data),
}