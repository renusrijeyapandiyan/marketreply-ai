import axios from 'axios'

// In dev, Vite proxies /api to the Spring Boot backend (see vite.config.js).
// In production, set VITE_API_BASE_URL to the deployed backend URL.
const baseURL = import.meta.env.VITE_API_BASE_URL || '/api'

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
})

// Attach the JWT (if present) to every outgoing request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('mr_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Session expired or invalid — clear it and force a re-login.
    if (error?.response?.status === 401) {
      localStorage.removeItem('mr_token')
      localStorage.removeItem('mr_user')
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login'
      }
    }

    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      'Something went wrong. Please try again.'
    return Promise.reject(new Error(message))
  }
)

export default api
