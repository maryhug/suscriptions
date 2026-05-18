import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ProfileForm from '@/components/ProfileForm'

export default async function ProfilePage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true, image: true, phone: true },
  })

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">Profile</h1>
        <p className="text-zinc-400 text-sm mt-1">
          Manage your account and notification settings
        </p>
      </div>

      <ProfileForm user={user} />
    </div>
  )
}
