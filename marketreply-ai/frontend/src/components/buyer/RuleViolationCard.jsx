import { ShieldCheck, ShieldAlert } from 'lucide-react'
import { safeArray } from '../../utils/helpers.js'

export default function RuleViolationCard({ analysis }) {
  const compliant = analysis.compliesWithRules
  const violations = safeArray(analysis.ruleViolations)

  return (
    <div className={`card p-5 ${compliant ? '' : 'ring-1 ring-rose-100'}`}>
      <div className="flex items-center gap-2 mb-3">
        {compliant ? (
          <ShieldCheck className="h-4.5 w-4.5 text-accent-600" />
        ) : (
          <ShieldAlert className="h-4.5 w-4.5 text-rose-600" />
        )}
        <h4 className="font-display font-semibold text-slate-900">Rule compliance</h4>
      </div>

      <span className={compliant ? 'badge-success' : 'badge-danger'}>
        {compliant ? 'Complies with your rules' : 'Needs your attention'}
      </span>

      {violations.length > 0 ? (
        <ul className="mt-4 space-y-2 text-sm text-slate-600 list-disc list-inside">
          {violations.map((v, i) => <li key={i}>{v}</li>)}
        </ul>
      ) : (
        <p className="mt-4 text-sm text-slate-400">No rule violations detected.</p>
      )}
    </div>
  )
}
