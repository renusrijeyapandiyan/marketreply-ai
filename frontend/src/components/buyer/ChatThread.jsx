import AIResponseCard from './AIResponseCard.jsx'
import IntentCard from './IntentCard.jsx'
import EntityCard from './EntityCard.jsx'
import RuleViolationCard from './RuleViolationCard.jsx'
import OrderConfirmedBanner from './OrderConfirmedBanner.jsx'

export default function ChatThread({ turns }) {
  return (
    <div className="space-y-8">
      {turns.map((turn, i) => (
        <div key={turn.id || i} className="space-y-4 animate-in">
          <div className="flex justify-end">
            <div className="max-w-[85%] sm:max-w-[70%] rounded-2xl rounded-tr-sm bg-slate-800 text-white px-4 py-3 text-sm leading-relaxed">
              {turn.buyerMessage}
            </div>
          </div>

          <AIResponseCard reply={turn.analysis.suggestedReply} />

          {turn.orderId && <OrderConfirmedBanner analysis={turn.analysis} />}

          <div className="grid sm:grid-cols-2 gap-5">
            <IntentCard analysis={turn.analysis} />
            <RuleViolationCard analysis={turn.analysis} />
          </div>
          <EntityCard analysis={turn.analysis} />
        </div>
      ))}
    </div>
  )
}