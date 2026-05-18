import type { Subscription } from '@prisma/client'

interface StatsCardsProps {
  subscriptions: Subscription[]
}

export default function StatsCards({ subscriptions }: StatsCardsProps) {
  const monthlyEquivalent = subscriptions.reduce((acc, sub) => {
    return acc + (sub.billingCycle === 'yearly' ? sub.amount / 12 : sub.amount)
  }, 0)

  const annualEquivalent = subscriptions.reduce((acc, sub) => {
    return acc + (sub.billingCycle === 'monthly' ? sub.amount * 12 : sub.amount)
  }, 0)

  const nextPayment = subscriptions[0]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
          Monthly Spend
        </p>
        <p className="text-3xl font-bold text-pink-400 mt-3 tabular-nums">
          ${monthlyEquivalent.toFixed(2)}
        </p>
        <p className="text-zinc-500 text-xs mt-2">Average across all cycles</p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
          Annual Spend
        </p>
        <p className="text-3xl font-bold text-pink-400 mt-3 tabular-nums">
          ${annualEquivalent.toFixed(2)}
        </p>
        <p className="text-zinc-500 text-xs mt-2">Estimated total per year</p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
          Active Services
        </p>
        <p className="text-3xl font-bold text-pink-400 mt-3 tabular-nums">
          {subscriptions.length}
        </p>
        <p className="text-zinc-500 text-xs mt-2">
          {nextPayment
            ? `Next: ${nextPayment.name} on ${new Date(nextPayment.nextPaymentDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
            : 'No subscriptions yet'}
        </p>
      </div>
    </div>
  )
}
