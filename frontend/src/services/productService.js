import api from './api.js'

export const productService = {
  // ---- public (no login) ----
  marketplace: () => api.get('/sellers/marketplace').then((r) => r.data),
  getPublic: (id) => api.get(`/sellers/public/${id}`).then((r) => r.data),
  reviews: (id) => api.get(`/reviews/seller/${id}`).then((r) => r.data),

  // ---- seller (login) ----
  mine: () => api.get('/sellers').then((r) => r.data),
  getMine: (id) => api.get(`/sellers/${id}`).then((r) => r.data),
  create: (payload) => api.post('/sellers', payload).then((r) => r.data),
  update: (id, payload) => api.put(`/sellers/${id}`, payload).then((r) => r.data),
  remove: (id) => api.delete(`/sellers/${id}`).then((r) => r.data),
  uploadImage: (id, file) => {
    const form = new FormData()
    form.append('file', file)
    return api.post(`/sellers/${id}/images`, form, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data)
  },
  removeImage: (id, index) => api.delete(`/sellers/${id}/images/${index}`).then((r) => r.data),
}
