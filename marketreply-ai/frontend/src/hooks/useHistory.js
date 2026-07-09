import { useState, useCallback, useEffect } from 'react'
import { historyService } from '../services/historyService.js'

export function useHistory(sellerId) {
  const [conversations, setConversations] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchHistory = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await historyService.list(sellerId)
      setConversations(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [sellerId])

  useEffect(() => {
    fetchHistory()
  }, [fetchHistory])

  return { conversations, loading, error, refresh: fetchHistory }
}
