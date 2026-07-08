import { useContext } from 'react'
import { SellerContext } from '../context/SellerContext.jsx'

export function useSeller() {
  const ctx = useContext(SellerContext)
  if (!ctx) throw new Error('useSeller must be used within a SellerProvider')
  return ctx
}
