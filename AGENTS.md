# Repository Guidelines

## Project Structure & Module Organization
- Source lives in `src/`; React entry at `src/router.tsx` with TanStack Start + Vite. Routes are file-based under `src/routes` (root layout in `__root.tsx`), and `routeTree.gen.ts` is generated—do not edit by hand.
- Shared UI sits in `src/components`; hooks in `src/hooks`; domain helpers in `src/lib`; static seeds/data in `src/data`; third-party wiring under `src/integrations`.
- Global styles and Tailwind layers are in `src/styles.css`; public assets are in `public/`. Use the `@/*` path alias (configured via `vite-tsconfig-paths`) for imports.

## Build, Test, and Development Commands
- `npm install` — install dependencies.
- `npm run dev` — start the Vite dev server on port 3000.
- `npm run build` — production build.
- `npm run preview` — serve the built bundle for smoke-testing.
- `npm run test` — run the Vitest suite once; use `npx vitest watch` while developing tests.

## Coding Style & Naming Conventions
- TypeScript is strict (see `tsconfig.json`); prefer typed props and avoid `any`.
- Functional React components in PascalCase files; hooks in camelCase starting with `use*`. Keep co-located component-specific helpers/tests next to the component (`ComponentName.tsx`, `ComponentName.test.tsx`).
- Tailwind CSS is the primary styling tool; compose classes with `clsx`/`tailwind-merge` when conditional. Keep global overrides in `styles.css`.
- Use 2-space indentation, single quotes as shown in `vite.config.ts`, and keep imports sorted by scope (react → library → local).

## Testing Guidelines
- Testing uses Vitest with Testing Library (`@testing-library/react`). Prefer behavior-driven tests that assert rendered output and accessibility (roles, labels) instead of implementation details.
- Name tests `*.test.tsx`/`*.test.ts` and colocate near the code under test. Include minimal fixtures in `src/data` when needed.
- Run `npm run test` before opening a PR; for UI tweaks, consider a quick `npm run dev` + manual check to catch regressions.

## Commit & Pull Request Guidelines
- No existing commit convention is enforced; use concise, imperative subjects (e.g., `Add leave request form`, `Fix slider bounds`). Group related changes into single commits.
- PRs should describe the change, link issues/tickets, and list validation steps. Include screenshots or short clips for UI-affecting work and note any accessibility considerations (focus states, keyboard nav).
- Ensure the branch is rebased on the latest main branch and that `npm run test`/`npm run build` pass before requesting review.

## Security & Configuration Tips
- Keep secrets out of the repo; Vite only exposes env vars prefixed with `VITE_`. Place local config in a non-committed `.env`.
- When adding integrations, centralize clients/config in `src/integrations` and avoid duplicating fetch logic; prefer TanStack Query loaders for data access with caching.
