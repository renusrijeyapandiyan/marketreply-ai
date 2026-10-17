import api from './api.js'

export const chatService = {
  start: (sellerId, fresh = false) => api.post('/chat/start', { sellerId }, { params: { fresh } }).then((r) => r.data),
  send: (sessionId, message) => api.post('/chat/message', { sessionId, message }).then((r) => r.data),
  confirm: (sessionId) => api.post(`/chat/${sessionId}/confirm`).then((r) => r.data),
  get: (sessionId) => api.get(`/chat/${sessionId}`).then((r) => r.data),
  list: () => api.get('/chat/sessions').then((r) => r.data),
}
