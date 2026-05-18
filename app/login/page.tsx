import { auth, signIn } from '@/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import LoginForm from '@/components/auth/LoginForm'

export default async function LoginPage() {
  const session = await auth()
  if (session) redirect('/')

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-zinc-950">
      <div className="w-full max-w-sm">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
          {/* Header */}
          <div className="mb-7">
            <h1 className="text-2xl font-bold text-zinc-100 tracking-tight">
              Subs Tracker
            </h1>
            <p className="text-zinc-400 text-sm mt-1.5">
              Inicia sesión en tu cuenta
            </p>
          </div>

          {/* Credentials form (client component) */}
          <LoginForm />

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-800" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-zinc-900 px-3 text-xs text-zinc-600">
                o continúa con
              </span>
            </div>
          </div>

          {/* OAuth buttons */}
          <div className="space-y-2.5">
            <form
              action={async () => {
                'use server'
                await signIn('google', { redirectTo: '/' })
              }}
            >
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-3 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-zinc-600 text-zinc-100 font-medium py-2.5 px-4 rounded-xl transition-colors text-sm"
              >
                <GoogleIcon />
                Google
              </button>
            </form>

            <form
              action={async () => {
                'use server'
                await signIn('github', { redirectTo: '/' })
              }}
            >
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-3 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-zinc-600 text-zinc-100 font-medium py-2.5 px-4 rounded-xl transition-colors text-sm"
              >
                <GitHubIcon />
                GitHub
              </button>
            </form>
          </div>

          {/* Register link */}
          <p className="text-center text-xs text-zinc-500 mt-6">
            ¿No tienes cuenta?{' '}
            <Link
              href="/register"
              className="text-pink-400 hover:text-pink-300 font-medium transition-colors"
            >
              Crear cuenta
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
      <path
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
        fill="#4285F4"
      />
      <path
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"
        fill="#34A853"
      />
      <path
        d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
        fill="#EA4335"
      />
    </svg>
  )
}

function GitHubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  )
}
