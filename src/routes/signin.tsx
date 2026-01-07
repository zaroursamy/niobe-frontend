import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/signin')({
  component: SignInPage,
})

function SignInPage() {
  return (
    <main className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-8">
      <h1 className="text-4xl font-bold">Hello world</h1>
    </main>
  )
}
