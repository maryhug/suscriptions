'use client'

import { signOut } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

interface NavbarProps {
  user: {
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

export default function Navbar({ user }: NavbarProps) {
  const pathname = usePathname()

  return (
    <nav className="border-b border-zinc-800 bg-zinc-950 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-lg font-bold text-pink-400 tracking-tight">
            Subs Tracker
          </Link>
          <div className="hidden sm:flex items-center gap-1">
            <Link
              href="/"
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                pathname === '/'
                  ? 'text-zinc-100 bg-zinc-800'
                  : 'text-zinc-400 hover:text-zinc-100'
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/profile"
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                pathname === '/profile'
                  ? 'text-zinc-100 bg-zinc-800'
                  : 'text-zinc-400 hover:text-zinc-100'
              }`}
            >
              Profile
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2">
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name ?? 'User'}
                width={28}
                height={28}
                className="rounded-full ring-1 ring-zinc-700"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-pink-500 flex items-center justify-center text-xs font-semibold text-white">
                {user.name?.[0]?.toUpperCase() ?? 'U'}
              </div>
            )}
            <span className="text-sm text-zinc-300 max-w-[120px] truncate">
              {user.name}
            </span>
          </div>

          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="text-xs text-zinc-400 hover:text-zinc-100 px-3 py-1.5 rounded-lg border border-zinc-800 hover:border-zinc-600 transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      <div className="sm:hidden border-t border-zinc-800 flex">
        <Link
          href="/"
          className={`flex-1 py-2 text-center text-sm font-medium transition-colors ${
            pathname === '/' ? 'text-pink-400' : 'text-zinc-400'
          }`}
        >
          Dashboard
        </Link>
        <Link
          href="/profile"
          className={`flex-1 py-2 text-center text-sm font-medium transition-colors ${
            pathname === '/profile' ? 'text-pink-400' : 'text-zinc-400'
          }`}
        >
          Profile
        </Link>
      </div>
    </nav>
  )
}
