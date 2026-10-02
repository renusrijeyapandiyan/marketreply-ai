import { createContext, useCallback, useEffect, useState } from 'react'
import { cartService } from '../services/cartService.js'
import { useAuth } from '../hooks/useAuth.js'

export const CartContext = createContext(null)

const EMPTY_CART = { items: [], subtotal: 0, itemCount: 0 }

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth()
  const [cart, setCart] = useState(EMPTY_CART)
  const [loading, setLoading] = useState(false)

  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) return
    setLoading(true)
    try {
      const data = await cartService.get()
      setCart(data)
    } catch {
      // Silently ignore — the cart badge just keeps its last known value.
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated])

  useEffect(() => {
    if (isAuthenticated) {
      refreshCart()
    } else {
      setCart(EMPTY_CART)
    }
  }, [isAuthenticated, refreshCart])

  const addToCart = useCallback(async (sellerId, quantity = 1) => {
    const data = await cartService.addItem(sellerId, quantity)
    setCart(data)
    return data
  }, [])

  return (
    <CartContext.Provider value={{ cart, loading, refreshCart, addToCart, setCart }}>
      {children}
    </CartContext.Provider>
  )
}