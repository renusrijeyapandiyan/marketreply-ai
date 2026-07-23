import api from './api.js'

export const ordersService = {
  list: () => api.get('/orders').then((res) => res.data),
}