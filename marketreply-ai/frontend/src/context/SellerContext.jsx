import { createContext, useCallback, useEffect, useState } from 'react'
import { sellerService } from '../services/sellerService.js'
import { useAuth } from '../hooks/useAuth.js'

export const SellerContext = createContext(null)

export function SellerProvider({ children }) {
  const { isAuthenticated } = useAuth()
  const [sellers, setSellers] = useState([])
  const [activeSellerId, setActiveSellerId] = useState(() => localStorage.getItem('mr_active_seller') || null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const refreshSellers = useCallback(async () => {
    if (!isAuthenticated) return
    setLoading(true)
    setError(null)
    try {
      const data = await sellerService.list()
      setSellers(data)
      if (!activeSellerId && data.length > 0) {
        setActiveSellerId(data[0].id)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated])

  useEffect(() => {
    if (isAuthenticated) {
      refreshSellers()
    } else {
      setSellers([])
      setActiveSellerId(null)
    }
  }, [isAuthenticated, refreshSellers])

  useEffect(() => {
    if (activeSellerId) {
      localStorage.setItem('mr_active_seller', activeSellerId)
    }
  }, [activeSellerId])

  const activeSeller = sellers.find((s) => s.id === activeSellerId) || null

  return (
    <SellerContext.Provider
      value={{
        sellers,
        activeSeller,
        activeSellerId,
        setActiveSellerId,
        loading,
        error,
        refreshSellers,
      }}
    >
      {children}
    </SellerContext.Provider>
  )
}
