import { useState } from 'react'

import { createFileRoute } from '@tanstack/react-router'
import { Lock, Mail, Sparkles } from 'lucide-react'

export const Route = createFileRoute('/signup')({
  component: SignUpPage,
})

type SubmissionState = 'idle' | 'loading' | 'success' | 'error'

type RegisterResponse = {
  message?: string
}

function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState<SubmissionState>('idle')
  const [feedback, setFeedback] = useState('')

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus('loading')
    setFeedback('')

    try {
      const response = await fetch('http://localhost:8000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })

      const data = (await response.json()) as RegisterResponse

      if (!response.ok) {
        throw new Error(data?.message ?? 'Unable to create account')
      }

      setStatus('success')
      setFeedback(data?.message ?? 'Account created')
      setEmail('')
      setPassword('')
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Something went wrong'
      setStatus('error')
      setFeedback(message)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <section className="space-y-6">
          <div className="inline-flex items-center gap-3 rounded-full bg-emerald-500/10 text-emerald-300 px-4 py-2 border border-emerald-500/30">
            <Sparkles className="w-5 h-5" />
            <span className="text-sm font-medium">Niobé HR Access</span>
          </div>
          <div>
            <h1 className="text-4xl font-bold leading-tight text-white">
              Create your account
            </h1>
            <p className="mt-3 text-slate-300 text-lg max-w-xl">
              Sign up with your work email to get started. The form registers
              new users through the endpoint at{' '}
              <code className="px-2 py-1 rounded bg-slate-800 text-emerald-300">
                http://localhost:8000/auth/register
              </code>{' '}
              (returns a simple confirmation message).
            </p>
          </div>
          <ul className="space-y-3 text-slate-300">
            <li className="flex items-center gap-3">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-300 font-semibold">
                1
              </span>
              Add your email and a secure password (8+ characters).
            </li>
            <li className="flex items-center gap-3">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-300 font-semibold">
                2
              </span>
              We post the details to your backend register endpoint.
            </li>
            <li className="flex items-center gap-3">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-300 font-semibold">
                3
              </span>
              See immediate feedback when the account is created.
            </li>
          </ul>
        </section>

        <section className="bg-slate-900/80 border border-slate-800 rounded-2xl shadow-2xl p-8 backdrop-blur">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-emerald-500/10 text-emerald-300 p-3 rounded-xl">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Create account</p>
              <h2 className="text-2xl font-semibold text-white">
                Register with email & password
              </h2>
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-200">Email</span>
              <div className="relative">
                <Mail className="w-5 h-5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  autoComplete="email"
                  placeholder="you@company.com"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg py-3 pl-11 pr-4 text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/50 transition"
                />
              </div>
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-200">
                Password
              </span>
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  placeholder="At least 8 characters"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg py-3 pl-11 pr-4 text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/50 transition"
                />
              </div>
            </label>

            {feedback && (
              <div
                role="status"
                className={`rounded-lg border px-4 py-3 text-sm ${
                  status === 'error'
                    ? 'border-rose-500/40 bg-rose-500/10 text-rose-100'
                    : 'border-emerald-500/40 bg-emerald-500/10 text-emerald-100'
                }`}
              >
                {feedback}
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 transition-colors"
            >
              {status === 'loading' ? 'Creating account...' : 'Sign up'}
            </button>

            <p className="text-xs text-slate-400">
              This form sends a POST request to{' '}
              <code className="px-2 py-1 rounded bg-slate-800 text-emerald-300">
                /auth/register
              </code>{' '}
              on{' '}
              <code className="px-2 py-1 rounded bg-slate-800 text-emerald-300">
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
