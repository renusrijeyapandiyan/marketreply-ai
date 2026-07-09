import { createContext, useCallback, useEffect, useState } from 'react'
import { authService } from '../services/authService.js'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('mr_user')
    return saved ? JSON.parse(saved) : null
  })
  const [token, setToken] = useState(() => localStorage.getItem('mr_token'))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const persist = useCallback((authResponse) => {
    const { token: newToken, ...userInfo } = authResponse
    localStorage.setItem('mr_token', newToken)
    localStorage.setItem('mr_user', JSON.stringify(userInfo))
    setToken(newToken)
    setUser(userInfo)
  }, [])

  const register = useCallback(async (payload) => {
    setLoading(true)
    setError(null)
    try {
      const data = await authService.register(payload)
      persist(data)
      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [persist])

  const login = useCallback(async (payload) => {
    setLoading(true)
    setError(null)
    try {
      const data = await authService.login(payload)
      persist(data)
      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [persist])

  const logout = useCallback(() => {
    localStorage.removeItem('mr_token')
    localStorage.removeItem('mr_user')
    localStorage.removeItem('mr_active_seller')
    setToken(null)
    setUser(null)
  }, [])

  // Keep state in sync if the token gets cleared elsewhere (e.g. api.js on 401).
  useEffect(() => {
    const handleStorage = () => {
      setToken(localStorage.getItem('mr_token'))
      const saved = localStorage.getItem('mr_user')
      setUser(saved ? JSON.parse(saved) : null)
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        loading,
        error,
        register,
        login,
        logout,
        setError,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
