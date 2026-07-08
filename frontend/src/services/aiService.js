import api from './api.js'

export const aiService = {
  analyze: (sellerId, message) =>
    api.post('/ai/analyze', { sellerId, message }).then((res) => res.data),
}
