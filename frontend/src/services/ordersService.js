import api from './api.js'

export const ordersService = {
  list: () => api.get('/orders').then((res) => res.data),
  get: (id) => api.get(`/orders/${id}`).then((res) => res.data),
  create: (payload) => api.post('/orders', payload).then((res) => res.data),
  updateStatus: (id, status) => api.patch(`/orders/${id}/status`, { status }).then((res) => res.data),
  cancel: (id) => api.patch(`/orders/${id}/cancel`).then((res) => res.data),
}