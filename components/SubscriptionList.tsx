'use client'

import { useState, useRef, useEffect } from 'react'
import type { Subscription } from '@prisma/client'
import SubscriptionModal from './SubscriptionModal'
import NotifyBadge from './NotifyBadge'
import { deleteSubscription } from '@/app/actions/subscriptions'

interface SubscriptionListProps {
  subscriptions: Subscription[]
}

function daysUntil(date: Date) {
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const target = new Date(date)
  target.setHours(0, 0, 0, 0)
  const diff = Math.round((target.getTime() - now.getTime()) / 86400000)
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Tomorrow'
  if (diff < 0) return `${Math.abs(diff)}d overdue`
  return `In ${diff}d`
}

function RowMenu({
  onEdit,
  onDelete,
}: {
  onEdit: () => void
  onDelete: () => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors"
        aria-label="Options"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <circle cx="12" cy="5" r="2" />
          <circle cx="12" cy="12" r="2" />
          <circle cx="12" cy="19" r="2" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-9 w-36 bg-zinc-800 border border-zinc-700 rounded-xl shadow-xl z-20 overflow-hidden">
          <button
            onClick={() => {
              onEdit()
              setOpen(false)
            }}
            className="w-full text-left px-4 py-2.5 text-sm text-zinc-300 hover:text-zinc-100 hover:bg-zinc-700 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => {
              onDelete()
              setOpen(false)
            }}
            className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-zinc-700 transition-colors"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  )
}

export default function SubscriptionList({
  subscriptions,
}: SubscriptionListProps) {
  const [modal, setModal] = useState<{
    open: boolean
    subscription?: Subscription
  }>({ open: false })

  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this subscription?')) return
    setDeletingId(id)
    await deleteSubscription(id)
    setDeletingId(null)
  }

  return (
    <>
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800">
          <div>
            <h2 className="text-base font-semibold text-zinc-100">
              Upcoming Payments
            </h2>
            <p className="text-zinc-500 text-xs mt-0.5">
              Ordered by next billing date
            </p>
          </div>
          <button
            onClick={() => setModal({ open: true })}
            className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
            New
          </button>
        </div>

        {/* List */}
        {subscriptions.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-zinc-500 text-sm">No subscriptions yet.</p>
            <button
              onClick={() => setModal({ open: true })}
              className="mt-3 text-pink-400 hover:text-pink-300 text-sm font-medium transition-colors"
            >
              Add your first subscription
            </button>
          </div>
        ) : (
          <>
            {/* Desktop table header */}
            <div className="hidden md:grid grid-cols-[1fr_100px_90px_110px_44px] gap-4 px-6 py-3 border-b border-zinc-800/50">
              <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Service
              </span>
              <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Amount
              </span>
              <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Next Date
              </span>
              <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Alert
              </span>
              <span />
            </div>

            <div className="divide-y divide-zinc-800/50">
              {subscriptions.map((sub) => (
                <div
                  key={sub.id}
                  className={`px-6 py-4 transition-opacity ${
                    deletingId === sub.id ? 'opacity-40' : ''
                  }`}
                >
                  {/* Desktop row */}
                  <div className="hidden md:grid grid-cols-[1fr_100px_90px_110px_44px] gap-4 items-center">
                    <div>
                      <p className="font-medium text-zinc-100 text-sm">
                        {sub.name}
                      </p>
                      <p className="text-xs text-zinc-500 mt-0.5 capitalize">
                        {sub.billingCycle}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold text-zinc-100 text-sm tabular-nums">
                        ${sub.amount.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-zinc-300">
                        {new Date(sub.nextPaymentDate).toLocaleDateString(
                          'en-US',
                          { month: 'short', day: 'numeric' }
                        )}
                      </p>
                      <p className="text-xs text-zinc-500 mt-0.5">
                        {daysUntil(sub.nextPaymentDate)}
                      </p>
                    </div>
                    <div>
                      <NotifyBadge method={sub.notifyVia} />
                    </div>
                    <div className="flex justify-end">
                      <RowMenu
                        onEdit={() =>
                          setModal({ open: true, subscription: sub })
                        }
                        onDelete={() => handleDelete(sub.id)}
                      />
                    </div>
                  </div>

                  {/* Mobile row */}
                  <div className="md:hidden flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium text-zinc-100 text-sm truncate">
                          {sub.name}
                        </p>
                        <NotifyBadge method={sub.notifyVia} />
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-zinc-400 capitalize">
                          {sub.billingCycle}
                        </span>
                        <span className="text-zinc-700">·</span>
                        <span className="text-xs text-zinc-400">
                          {new Date(sub.nextPaymentDate).toLocaleDateString(
                            'en-US',
                            { month: 'short', day: 'numeric', year: 'numeric' }
                          )}
                        </span>
                        <span className="text-zinc-700">·</span>
                        <span className="text-xs text-zinc-500">
                          {daysUntil(sub.nextPaymentDate)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-semibold text-zinc-100 text-sm tabular-nums">
                        ${sub.amount.toFixed(2)}
                      </span>
                      <RowMenu
                        onEdit={() =>
                          setModal({ open: true, subscription: sub })
                        }
                        onDelete={() => handleDelete(sub.id)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {modal.open && (
        <SubscriptionModal
          subscription={modal.subscription}
          onClose={() => setModal({ open: false })}
        />
      )}
    </>
  )
}
