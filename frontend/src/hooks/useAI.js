import { useState, useCallback } from 'react'
import { aiService } from '../services/aiService.js'

export function useAI() {
  const [turns, setTurns] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const analyze = useCallback(async (sellerId, message) => {
    setLoading(true)
    setError(null)
    try {
      const history = turns.map((t) => ({
        buyerMessage: t.buyerMessage,
        suggestedReply: t.analysis.suggestedReply,
      }))
      const data = await aiService.analyze(sellerId, message, history)
      const turn = { id: data.id ?? `${Date.now()}-${turns.length}`, buyerMessage: message, analysis: data.analysis }
      setTurns((prev) => [...prev, turn])
      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [turns])

  const reset = useCallback(() => {
    setTurns([])
    setError(null)
  }, [])

  return { turns, loading, error, analyze, reset }
}