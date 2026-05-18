import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { auth } from '@/auth'
import Navbar from '@/components/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Subs Tracker',
  description: 'Track and manage your subscriptions',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} bg-zinc-950 text-zinc-100 min-h-screen antialiased`}>
        {session?.user && <Navbar user={session.user} />}
        {children}
      </body>
    </html>
  )
}
