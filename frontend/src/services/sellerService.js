import api from './api.js'

export const sellerService = {
  list: () => api.get('/sellers').then((res) => res.data),                  // my sellers only
  listAll: () => api.get('/sellers/marketplace').then((res) => res.data),   // everyone's sellers
  marketplace: () => api.get('/sellers/marketplace').then((res) => res.data), // used by Buyer Analyzer
  get: (id) => api.get(`/sellers/${id}`).then((res) => res.data),
  create: (payload) => api.post('/sellers', payload).then((res) => res.data),
  update: (id, payload) => api.put(`/sellers/${id}`, payload).then((res) => res.data),
  remove: (id) => api.delete(`/sellers/${id}`).then((res) => res.data),

  uploadImage: (id, file) => {
    const formData = new FormData()
    formData.append('file', file)
    return api
      .post(`/sellers/${id}/images`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((res) => res.data)
  },

  removeImage: (id, index) => api.delete(`/sellers/${id}/images/${index}`).then((res) => res.data),
}