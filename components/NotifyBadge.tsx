const config: Record<string, { label: string; classes: string }> = {
  whatsapp: {
    label: 'WhatsApp',
    classes: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  },
  telegram: {
    label: 'Telegram',
    classes: 'text-sky-400 bg-sky-400/10 border-sky-400/20',
  },
  email: {
    label: 'Email',
    classes: 'text-pink-400 bg-pink-400/10 border-pink-400/20',
  },
}

export default function NotifyBadge({ method }: { method: string }) {
  const entry = config[method] ?? {
    label: method,
    classes: 'text-zinc-400 bg-zinc-800 border-zinc-700',
  }

  return (
    <span
      className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-md border ${entry.classes}`}
    >
      {entry.label}
    </span>
  )
}
