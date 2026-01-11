import { useState } from 'react'

import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Lock, Mail, Sparkles } from 'lucide-react'

export const Route = createFileRoute('/signin')({
  component: SignInPage,
})

type SubmissionState = 'idle' | 'loading' | 'success' | 'error'

type LoginResponse = {
  access_token?: string
  token_type?: string
}

function SignInPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState<SubmissionState>('idle')
  const [feedback, setFeedback] = useState('')

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus('loading')
    setFeedback('')

    try {
      const response = await fetch('http://localhost:8000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })

      const data = (await response.json()) as LoginResponse

      if (!response.ok) {
        throw new Error('Unable to sign in')
      }

      setStatus('success')
      setFeedback(
        data?.access_token
          ? `Signed in. Token type: ${data.token_type ?? 'bearer'}`
          : 'Signed in successfully',
      )
      setEmail('')
      setPassword('')
      await navigate({ to: '/dashboard' })
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Something went wrong'
      setStatus('error')
      setFeedback(message)
    }
  }

  return (
    <main
      className="min-h-screen text-[color:var(--foreground)] flex items-center justify-center px-6 py-16"
      style={{
        background:
          'radial-gradient(circle at 20% 20%, color-mix(in oklch, var(--primary) 22%, var(--background)), color-mix(in oklch, var(--accent) 14%, var(--background)) 42%, var(--background))',
      }}
    >
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <section className="space-y-6">
          <div className="inline-flex items-center gap-3 rounded-full bg-[color-mix(in_oklch,var(--accent)_15%,var(--background))] text-[color:var(--accent-foreground)] px-4 py-2 border border-[color:var(--border)]">
            <Sparkles className="w-5 h-5" />
            <span className="text-sm font-medium">Niobé HR Access</span>
          </div>
          <div>
            <h1 className="text-4xl font-bold leading-tight">
              Sign in with your email
            </h1>
            <p className="mt-3 text-[color:var(--muted-foreground)] text-lg max-w-xl">
              Use your work email and a secure password to access your Niobé HR
              account. The form authenticates against the login endpoint at{' '}
              <code className="px-2 py-1 rounded bg-[color:var(--card)] text-[color:var(--primary)]">
                http://localhost:8000/auth/login
              </code>{' '}
              (sets an HttpOnly cookie and returns a bearer token in the
              response body).
            </p>
          </div>
          <ul className="space-y-3 text-[color:var(--muted-foreground)]">
            <li className="flex items-center gap-3">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[color-mix(in_oklch,var(--primary)_18%,var(--background))] text-[color:var(--primary)] font-semibold">
                1
              </span>
              Enter your email and password.
            </li>
            <li className="flex items-center gap-3">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[color-mix(in_oklch,var(--primary)_18%,var(--background))] text-[color:var(--primary)] font-semibold">
                2
              </span>
              We send the details to your backend login endpoint.
            </li>
            <li className="flex items-center gap-3">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[color-mix(in_oklch,var(--primary)_18%,var(--background))] text-[color:var(--primary)] font-semibold">
                3
              </span>
              See immediate feedback when authentication succeeds.
            </li>
          </ul>
        </section>

        <section className="bg-[color:var(--card)] border border-[color:var(--border)] rounded-2xl shadow-xl p-8 backdrop-blur">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-[color-mix(in_oklch,var(--primary)_15%,var(--card))] text-[color:var(--primary)] p-3 rounded-xl">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-[color:var(--muted-foreground)]">
                Secure sign in
              </p>
              <h2 className="text-2xl font-semibold">Access your account</h2>
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <label className="block space-y-2">
              <span className="text-sm font-medium">Email</span>
              <div className="relative">
                <Mail className="w-5 h-5 text-[color:var(--muted-foreground)] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  autoComplete="email"
                  placeholder="you@company.com"
                  className="w-full bg-[color:var(--input)] border border-[color:var(--border)] rounded-lg py-3 pl-11 pr-4 text-[color:var(--foreground)] placeholder:text-[color:var(--muted-foreground)] focus:outline-none focus:border-[color:var(--ring)] focus:ring-2 focus:ring-[color:var(--ring)] transition"
                />
              </div>
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium">Password</span>
              <div className="relative">
                <Lock className="w-5 h-5 text-[color:var(--muted-foreground)] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  minLength={8}
                  autoComplete="current-password"
                  placeholder="At least 8 characters"
                  className="w-full bg-[color:var(--input)] border border-[color:var(--border)] rounded-lg py-3 pl-11 pr-4 text-[color:var(--foreground)] placeholder:text-[color:var(--muted-foreground)] focus:outline-none focus:border-[color:var(--ring)] focus:ring-2 focus:ring-[color:var(--ring)] transition"
                />
              </div>
            </label>

            {feedback && (
              <div
                role="status"
                className="rounded-lg border px-4 py-3 text-sm"
                style={{
                  background:
                    status === 'error'
                      ? 'color-mix(in oklch, var(--destructive) 18%, var(--background))'
                      : 'color-mix(in oklch, var(--primary) 14%, var(--background))',
                  borderColor:
                    status === 'error'
                      ? 'color-mix(in oklch, var(--destructive) 35%, var(--border))'
                      : 'color-mix(in oklch, var(--primary) 35%, var(--border))',
                  color:
                    status === 'error'
                      ? 'var(--destructive-foreground)'
                      : 'var(--foreground)',
                }}
              >
                {feedback}
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[color:var(--primary)] text-[color:var(--primary-foreground)] disabled:opacity-60 disabled:cursor-not-allowed font-semibold py-3 transition-all hover:brightness-95"
            >
              {status === 'loading' ? 'Sending...' : 'Sign in'}
            </button>

            <p className="text-xs text-[color:var(--muted-foreground)]">
              This form sends a POST request to{' '}
              <code className="px-2 py-1 rounded bg-[color:var(--card)] text-[color:var(--primary)]">
                /auth/login
              </code>{' '}
              on{' '}
              <code className="px-2 py-1 rounded bg-[color:var(--card)] text-[color:var(--primary)]">
                http://localhost:8000
              </code>
              .
            </p>
          </form>
        </section>
      </div>
    </main>
  )
}
