# Copilot instructions for `job-application-tracker`

## Build, test, and lint commands

- Use Node.js `v20.19.4` and npm.
- Copy `.env.example` to `.env` before running the app. The Supabase client throws at import time if `VITE_SUPABASE_URL` or `VITE_SUPABASE_PUBLISHABLE_KEY` is missing.
- Start the dev server with `npm run dev`. Vite reads `SERVER_PORT` from `.env` via `loadEnv`; default is `8080`.
- Build with `npm run build`.
- Lint with `npm run lint`.
- Run the full Jest suite with `npx jest --runInBand`.
- Run a single test file with `npx jest --runTestsByPath src/__tests__/hooks/usePreviousEntriesLoader.test.tsx --runInBand`.
- Run a single named test with `npx jest --runInBand --testNamePattern="should load suggestions successfully"`.

## High-level architecture

- This is a Vite + React + TypeScript single-page app. `src/main.tsx` mounts `App`, and `src/App.tsx` sets up `BrowserRouter`, `QueryClientProvider`, and the toast/tooltip providers.
- Routing is simple: `/` renders `Home`, `/applications` renders the main list page, and `/add` / `/edit/:id` both render `ApplicationForm`.
- The list page is composed from `Dashboard`, `ApplicationsHeader`, `ApplicationFilterSummary`, `FilterBar`, and `ApplicationsTable`.
- There is no separate backend in this repo. The frontend talks directly to Supabase through `src/services/applicationsApi.ts`, which performs CRUD and suggestion queries against `public.job_applications`.
- `src/services/applicationService.ts` is the UI-facing wrapper around `applicationsApi.ts`. It is where success/error toasts are emitted; pages and hooks call the service layer rather than talking to Supabase directly.
- Form behavior is split across hooks:
  - `useApplicationForm` creates the React Hook Form instance with the Zod schema and composes the loaders/submission hook.
  - `useApplicationDataLoader` resets defaults for `/add` and hydrates existing values for `/edit/:id`.
  - `usePreviousEntriesLoader` loads suggestion data for company, title, and source pickers.
  - `useApplicationSubmit` chooses create vs. update and navigates back to `/applications`.
- Supabase schema changes live under `supabase/migrations/`, while the generated TypeScript representation lives in `src/integrations/supabase/types.ts`. Keep both aligned when changing persisted fields.
- `Dashboard` currently computes metrics client-side from the full application list instead of using a dedicated stats endpoint or React Query cache.

## Key conventions

- Frontend models use camelCase (`jobTitle`, `dateApplied`, `contactEmail`), but `applicationsApi.ts` is responsible for translating to and from Supabase snake_case columns (`job_title`, `date_applied`, `contact_email`).
- `source` is intentionally free-form. `SourceField` behaves like a combobox: users can select an existing source or type a new one. Do not narrow it to a fixed enum.
- Recruiter-specific fields are conditional on `source === "Recruiter"` in both UI rendering and validation. Preserve that coupling if the form changes.
- `contactEmail` is intentionally permissive: empty strings, malformed emails, and general contact notes like `"Ask HR"` are valid. `applicationUrl` is the field that gets URL validation.
- Suggestion handling is defensive. `usePreviousEntriesLoader` sanitizes API results and falls back to default source values. `ApplicationFormFields` intentionally preserves invalid `companies` and `jobTitles` input so `CompanyFieldsWithAutocomplete` can fall back to plain inputs instead of crashing.
- Tests live under `src/__tests__/` and depend on shared mocks from `src/setupTests.ts` for the Supabase client, router hooks, and toast helpers. Update those mocks when introducing new shared dependencies into hooks or pages.
- `App.tsx` already provides a `QueryClientProvider`, but current data loading is still mostly manual `useEffect`/`useState` orchestration through custom hooks. Match the existing pattern unless you are intentionally migrating a flow to React Query.
- Workspace MCP servers are configured in `.vscode/mcp.json`: `playwright` for browser automation and a project-scoped `supabase` server pointed at the repo's Supabase project. The Supabase MCP config is read-only by default, so schema changes should still go through `supabase/migrations/`.
