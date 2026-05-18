'use client'

import { useState, useEffect, useRef } from 'react'
import type { Subscription } from '@prisma/client'
import {
  createSubscription,
  updateSubscription,
} from '@/app/actions/subscriptions'

interface SubscriptionModalProps {
  subscription?: Subscription
  onClose: () => void
}

const NOTIFY_OPTIONS = [
  { value: 'email', label: 'Email' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'telegram', label: 'Telegram' },
]

const CYCLE_OPTIONS = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
]

export default function SubscriptionModal({
  subscription,
  onClose,
}: SubscriptionModalProps) {
  const [name, setName] = useState(subscription?.name ?? '')
  const [amount, setAmount] = useState(
    subscription?.amount?.toString() ?? ''
  )
  const [billingCycle, setBillingCycle] = useState(
    subscription?.billingCycle ?? 'monthly'
  )
  const [nextPaymentDate, setNextPaymentDate] = useState(
    subscription?.nextPaymentDate
      ? new Date(subscription.nextPaymentDate).toISOString().split('T')[0]
      : ''
  )
  const [notifyVia, setNotifyVia] = useState(
    subscription?.notifyVia ?? 'email'
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const firstInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    firstInputRef.current?.focus()

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!name.trim() || !amount || !nextPaymentDate) {
      setError('Please fill in all required fields.')
      return
    }

    setLoading(true)
    try {
      const data = {
        name: name.trim(),
        amount: parseFloat(amount),
        billingCycle,
        nextPaymentDate,
        notifyVia,
      }

      if (subscription) {
        await updateSubscription(subscription.id, data)
      } else {
        await createSubscription(data)
      }

      onClose()
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
          <h2 className="text-lg font-semibold text-zinc-100">
            {subscription ? 'Edit Subscription' : 'New Subscription'}
          </h2>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-300 transition-colors p-1 rounded-lg hover:bg-zinc-800"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Name */}
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">
              Service Name
            </label>
            <input
              ref={firstInputRef}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Netflix, Spotify, Adobe..."
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-pink-500 transition-colors text-sm"
              required
            />
          </div>

          {/* Amount + Cycle */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">
                Amount ($)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="9.99"
                min="0"
                step="0.01"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-pink-500 transition-colors text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">
                Billing Cycle
              </label>
              <div className="flex rounded-xl overflow-hidden border border-zinc-700">
                {CYCLE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setBillingCycle(opt.value)}
                    className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                      billingCycle === opt.value
                        ? 'bg-pink-500 text-white border-pink-500'
                        : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Next Payment Date */}
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">
              Next Payment Date
            </label>
            <input
              type="date"
              value={nextPaymentDate}
              onChange={(e) => setNextPaymentDate(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-zinc-100 focus:outline-none focus:border-pink-500 transition-colors text-sm"
              required
            />
          </div>

          {/* Notify Via */}
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-2 uppercase tracking-wider">
              Alert Method
            </label>
            <div className="flex gap-2">
              {NOTIFY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setNotifyVia(opt.value)}
                  className={`flex-1 py-2.5 text-sm font-medium rounded-xl border transition-colors ${
                    notifyVia === opt.value
                      ? 'bg-pink-500 border-pink-500 text-white'
                      : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p className="text-red-400 text-xs bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 text-sm font-medium text-zinc-400 hover:text-zinc-100 bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-colors border border-zinc-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 text-sm font-medium text-white bg-pink-500 hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-colors"
            >
              {loading ? 'Saving...' : subscription ? 'Save Changes' : 'Add Subscription'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
