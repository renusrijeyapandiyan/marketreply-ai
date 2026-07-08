import api from './api.js'

export const sellerService = {
  list: () => api.get('/sellers').then((res) => res.data),
  get: (id) => api.get(`/sellers/${id}`).then((res) => res.data),
  create: (payload) => api.post('/sellers', payload).then((res) => res.data),
  update: (id, payload) => api.put(`/sellers/${id}`, payload).then((res) => res.data),
  remove: (id) => api.delete(`/sellers/${id}`).then((res) => res.data),
}
