import api from './api.js'

export const aiService = {
  analyze: (sellerId, message, history = []) =>
    api.post('/ai/analyze', { sellerId, message, history }).then((res) => res.data),
}