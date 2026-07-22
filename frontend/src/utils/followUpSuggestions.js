export const DEFAULT_SUGGESTIONS = [
  'Can you sell it for ₹500 and deliver today?',
  'Is this still available? I can pick it up tomorrow evening.',
  'I can pay via bank transfer, will you accept ₹1000 less than listed?',
]

/** Generates 1-3 plausible follow-up questions based on the last AI analysis. */
export function getFollowUpSuggestions(analysis) {
  if (!analysis) return DEFAULT_SUGGESTIONS

  const suggestions = []
  const violations = analysis.ruleViolations || []

  if (analysis.compliesWithRules === false) {
    if (analysis.offeredPrice != null) {
      suggestions.push('Okay, what price would work for you?')
    }
    if (violations.some((v) => /payment/i.test(v))) {
      suggestions.push('What payment methods do you accept?')
    }
    if (violations.some((v) => /deliver|distance|pickup/i.test(v))) {
      suggestions.push('Can I pick it up instead?')
    }
  }

  if (!analysis.requestedDeliveryMethod || analysis.requestedDeliveryMethod === 'UNSPECIFIED') {
    suggestions.push('Can you deliver it, or is it pickup only?')
  }

  if (!analysis.requestedPaymentMethod) {
    suggestions.push('Do you accept UPI?')
  }

  if (analysis.intent === 'NEGOTIATE_PRICE' && analysis.compliesWithRules) {
    suggestions.push("Great, I'll take it. How do we proceed?")
  }

  const unique = [...new Set(suggestions)]
  return unique.length > 0 ? unique.slice(0, 3) : DEFAULT_SUGGESTIONS
}