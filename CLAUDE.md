# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Dev**: `npm run dev` (Vite on port 3000)
- **Build**: `npm run build`
- **Test**: `npm run test` (Vitest)
- **Add UI component**: `pnpm dlx shadcn@latest add <component>`

## Architecture

React 19 + TypeScript (strict) frontend for Niobe HR. Backend URL configured via `VITE_BACKEND_URL` (default `http://localhost:8000`).

**Stack**: TanStack Router (file-based, SPA mode) · TanStack Query (server state) · TanStack Form + Zod (forms/validation) · Tailwind CSS v4 · Shadcn UI (Radix-based) · Lucide icons · Sonner toasts · Recharts

**Path alias**: `@/*` → `./src/*`

## Key directories

- `src/routes/` — File-based routes, auto-generates `routeTree.gen.ts`. Protected routes use `requireAuth()` middleware from `src/lib/middleware/auth.ts`.
- `src/data/` — API functions (`candidates.ts`, `ai.ts`). Use `fetchWithRefresh()` from `src/lib/auth.ts` which auto-retries on 401 after refreshing the session.
- `src/components/ui/` — Shadcn components (do not edit manually).
- `src/components/forms/` — Form components using TanStack Form + Zod schemas.
- `src/hooks/use-auth.tsx` — Auth context provider (`useAuth()` hook). Cookie-based auth.
- `src/lib/config.ts` — Exports `BACKEND_URL`.

## Patterns

**API calls**: Always use `fetchWithRefresh()` (not raw `fetch`) for authenticated endpoints. It handles 401 → refresh → retry automatically.

**Route data loading**: Define `queryOptions()`, use in route `loader` with `context.queryClient.ensureQueryData()`, consume with `useSuspenseQuery()` in component.

**Forms**: Zod schema → `useForm({ defaultValues, validators: { onSubmit: schema }, onSubmit })`. Submit handlers call backend directly via fetch, not through TanStack Query mutations.

**Search/filtering**: URL search params validated with Zod via `validateSearch`, accessed with `Route.useSearch()`, updated with `navigate({ search, replace: true })`. Loader `deps` tracks search params for cache keys.
