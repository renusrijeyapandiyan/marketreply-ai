import api from './api.js'

export const historyService = {
  list: (sellerId) =>
    api.get('/conversations', { params: sellerId ? { sellerId } : {} }).then((res) => res.data),
  get: (id) => api.get(`/conversations/${id}`).then((res) => res.data),
  dashboard: () => api.get('/dashboard').then((res) => res.data),
}
