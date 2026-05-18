import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import StatsCards from '@/components/StatsCards'
import SubscriptionList from '@/components/SubscriptionList'

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const subscriptions = await prisma.subscription.findMany({
    where: { userId: session.user.id },
    orderBy: { nextPaymentDate: 'asc' },
  })

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">Dashboard</h1>
        <p className="text-zinc-400 text-sm mt-1">
          Overview of your active subscriptions
        </p>
      </div>

      <StatsCards subscriptions={subscriptions} />
      <SubscriptionList subscriptions={subscriptions} />
    </div>
  )
}
