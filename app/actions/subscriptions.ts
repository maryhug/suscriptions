'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

interface SubscriptionInput {
  name: string
  amount: number
  billingCycle: string
  nextPaymentDate: string
  notifyVia: string
}

export async function createSubscription(data: SubscriptionInput) {
  const session = await auth()
  if (!session?.user?.id) throw new Error('Unauthorized')

  await prisma.subscription.create({
    data: {
      userId: session.user.id,
      name: data.name,
      amount: data.amount,
      billingCycle: data.billingCycle,
      nextPaymentDate: new Date(data.nextPaymentDate),
      notifyVia: data.notifyVia,
    },
  })

  revalidatePath('/')
}

export async function updateSubscription(id: string, data: SubscriptionInput) {
  const session = await auth()
  if (!session?.user?.id) throw new Error('Unauthorized')

  const sub = await prisma.subscription.findUnique({ where: { id } })
  if (!sub || sub.userId !== session.user.id) throw new Error('Not found')

  await prisma.subscription.update({
    where: { id },
    data: {
      name: data.name,
      amount: data.amount,
      billingCycle: data.billingCycle,
      nextPaymentDate: new Date(data.nextPaymentDate),
      notifyVia: data.notifyVia,
    },
  })

  revalidatePath('/')
}

export async function deleteSubscription(id: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error('Unauthorized')

  const sub = await prisma.subscription.findUnique({ where: { id } })
  if (!sub || sub.userId !== session.user.id) throw new Error('Not found')

  await prisma.subscription.delete({ where: { id } })

  revalidatePath('/')
}
