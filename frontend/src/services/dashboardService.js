import api from './api.js'

export const dashboardService = {
  get: () => api.get('/dashboard').then((r) => r.data),
}
