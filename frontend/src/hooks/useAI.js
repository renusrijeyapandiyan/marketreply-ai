import { useState, useCallback } from 'react'
import { aiService } from '../services/aiService.js'

export function useAI() {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const analyze = useCallback(async (sellerId, message) => {
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const data = await aiService.analyze(sellerId, message)
      setResult(data)
      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return { result, loading, error, analyze, setResult }
}
