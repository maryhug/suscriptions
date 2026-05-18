'use client'

import { useState } from 'react'
import Image from 'next/image'
import { updatePhone } from '@/app/actions/profile'

interface ProfileFormProps {
  user: {
    name?: string | null
    email?: string | null
    image?: string | null
    phone?: string | null
  } | null
}

export default function ProfileForm({ user }: ProfileFormProps) {
  const [phone, setPhone] = useState(user?.phone ?? '')
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>(
    'idle'
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('saving')
    try {
      await updatePhone(phone)
      setStatus('saved')
      setTimeout(() => setStatus('idle'), 3000)
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

  return (
    <div className="space-y-4">
      {/* Account card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-4">
          Account
        </h2>
        <div className="flex items-center gap-4">
          {user?.image ? (
            <Image
              src={user.image}
              alt={user.name ?? 'User'}
              width={48}
              height={48}
              className="rounded-full ring-2 ring-zinc-700"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-pink-500 flex items-center justify-center text-lg font-bold text-white">
              {user?.name?.[0]?.toUpperCase() ?? 'U'}
            </div>
          )}
          <div>
            <p className="font-semibold text-zinc-100">{user?.name}</p>
            <p className="text-sm text-zinc-400 mt-0.5">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Phone card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-1">
          Notification Contact
        </h2>
        <p className="text-xs text-zinc-600 mb-5">
          Your phone number is used by the automated alerts system (WhatsApp /
          Telegram). Include country code.
        </p>

        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1 555 000 0000"
            className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-pink-500 transition-colors text-sm"
          />
          <button
            type="submit"
            disabled={status === 'saving'}
            className="shrink-0 bg-pink-500 hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors"
          >
            {status === 'saving'
              ? 'Saving...'
              : status === 'saved'
              ? 'Saved'
              : 'Save'}
          </button>
        </form>

        {status === 'error' && (
          <p className="mt-2 text-red-400 text-xs">
            Failed to save. Please try again.
          </p>
        )}
        {status === 'saved' && (
          <p className="mt-2 text-emerald-400 text-xs">
            Phone number updated successfully.
          </p>
        )}
      </div>

      {/* Info card for n8n */}
      <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-5">
        <p className="text-xs text-zinc-600 leading-relaxed">
          The n8n automation reads your phone number and notification preferences
          from the database to send payment reminders via WhatsApp, Telegram, or
          Email before each billing date.
        </p>
      </div>
    </div>
  )
}
