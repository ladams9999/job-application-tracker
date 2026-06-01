# Implementation Guide

This file is agent-focused documentation for the **current implementation**. It should describe what is actually in the repository today, not older plans or unbuilt PRD ideas.

## Purpose

- Use this file for implementation-specific context that helps agents make correct code changes.
- Use `AGENTS.md` for broader project guidance.
- Use `PROJECT_PLAN.md` for goals and future direction.
- Do not treat older design notes as shipped behavior unless they are verified in code.

## Current Application Architecture

### Stack

- **Frontend:** Vite, React 18, TypeScript
- **Routing:** `react-router-dom`
- **Forms:** React Hook Form with Zod validation
- **UI:** Tailwind CSS with shadcn/ui and Radix UI primitives
- **Data layer:** Supabase JavaScript client
- **Testing:** Jest with React Testing Library

### Runtime model

- This repository is a **single-page frontend application**.
- There is **no separate backend service** in this repo.
- The browser talks directly to Supabase through `src/services/applicationsApi.ts`.
- `src/App.tsx` provides:
  - `QueryClientProvider`
  - tooltip and toast providers
  - `BrowserRouter`

### Routes

- `/` -> redirects through `src/pages/Index.tsx` to `/applications`
- `/applications` -> main dashboard and application list
- `/add` -> create form
- `/edit/:id` -> edit form

`Layout` wraps the main list and form routes.

## Implementation Layout

### Main files

- `src/main.tsx` mounts `App`
- `src/App.tsx` wires providers and routes
- `src/pages/ApplicationsList.tsx` renders dashboard, filters, and table
- `src/pages/ApplicationForm.tsx` renders add/edit application form

### Data access and service layer

- `src/services/applicationsApi.ts`
  - owns Supabase queries
  - translates between frontend camelCase fields and database snake_case columns
  - handles CRUD, suggestions, and stats access
- `src/services/applicationService.ts`
  - wraps API calls for UI usage
  - shows success and error toasts
  - is the normal entry point for pages and hooks that need user-facing behavior

### Hooks

- `useApplicationsList`
  - combines filtering state with list data loading
- `useApplicationFilters`
  - manages search, status filter, and sort state
- `useApplicationsData`
  - reloads applications whenever the filter changes
  - handles deletion and then reloads the list
- `useApplicationForm`
  - creates the React Hook Form instance
  - composes the loader and submit hooks
  - exposes `showRecruiterFields`
- `useApplicationDataLoader`
  - resets defaults for `/add`
  - loads existing values for `/edit/:id`
- `usePreviousEntriesLoader`
  - loads suggestion data
  - sanitizes suggestion arrays and falls back to default source values
- `useApplicationSubmit`
  - selects create vs. update flow
  - navigates back to `/applications` after success

### Dashboard behavior

- `src/components/analytics/Dashboard.tsx` loads the full application list through `getAllApplications()`.
- Metrics are computed **client-side** from the loaded list.
- Dashboard data is **not** currently sourced from a shared React Query cache or a dedicated stats endpoint, even though `applicationsApi.ts` contains `getStats()`.

## Data Model

### Frontend model

`src/types/index.ts` defines the main application model:

- `company`
- `jobTitle`
- `jobDescription`
- `dateApplied`
- `status`
- `notes`
- `source`
- `recruiter`
- `recruitingFirm`
- `contactEmail`
- `contactPhone`
- `applicationUrl`
- `createdAt`
- `updatedAt`

### Status values

Current valid status values are:

- `applied`
- `interview`
- `offer`
- `rejected`
- `withdrawn`

These values are constrained in:

- `src/types/index.ts`
- `src/schemas/applicationFormSchema.ts`
- `src/integrations/supabase/types.ts`

Do **not** document or implement additional statuses unless the code and schema are updated together.

### Database schema

The app currently uses Supabase table `public.job_applications`.

Current persisted columns:

- `id`
- `company`
- `job_title`
- `job_description`
- `date_applied`
- `status`
- `notes`
- `source`
- `recruiter`
- `recruiting_firm`
- `contact_email`
- `contact_phone`
- `application_url`
- `created_at`
- `updated_at`

Recent schema changes in this repo are tracked in `supabase/migrations/`.

### Naming convention

- Frontend code uses **camelCase**
- Supabase columns use **snake_case**
- `applicationsApi.ts` is responsible for translating between them

## Form Behavior and Validation

### Required fields

- Company
- Job title
- Job description
- Date applied
- Status
- Source

### Validation rules

- `dateApplied` must not be in the future
- `status` must be one of the five supported enum values
- `applicationUrl` may be blank, but if present it must parse as a valid URL
- `contactEmail` is intentionally permissive and accepts any text, including blank values
- `recruiter` and `recruitingFirm` are required only when `source === "Recruiter"`

### Source behavior

- `source` is intentionally **free-form**
- `SourceField` behaves like a combobox:
  - users can select an existing source
  - users can type a new source
  - users can add the typed value directly
- Do not narrow `source` to a fixed enum

### Recruiter-specific behavior

- Recruiter fields are shown only when `source === "Recruiter"`
- Validation and rendering are intentionally coupled around that condition

### Autocomplete behavior

- Previous entry suggestions are loaded for:
  - companies
  - job titles
  - sources
- Suggestion handling is defensive:
  - invalid arrays are sanitized
  - default sources are restored when suggestion data is missing
- `ApplicationFormFields` intentionally preserves invalid `companies` and `jobTitles` input for the autocomplete path so the UI can fall back safely

### Important current detail

`src/pages/ApplicationForm.tsx` currently hardcodes:

```ts
const enableAutocomplete = false;
```

That means the standard `CompanyFields` path is currently used by default, even though autocomplete components and tests exist in the codebase.

## Current List Behavior

### Implemented

- Application list page
- Search by company and job title through the Supabase query
- Filter by status
- Sort by:
  - `dateApplied`
  - `company`
  - `jobTitle`
  - `status`
- Delete applications
- Client-side dashboard metrics

### Not currently implemented

The following should **not** be documented as current behavior:

- Express or Node backend APIs
- SQLite persistence
- Soft delete/archive and restore flows
- Archived applications section
- Server-side pagination
- Custom status values

## Environment and Local Setup

### Required environment variables

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `SERVER_PORT` (optional, defaults to `8080` in Vite config)

`src/integrations/supabase/client.ts` throws at import time if the two Supabase variables are missing.

### Setup

```sh
cp .env.example .env
```

Then fill in real Supabase values before running the app.

## Supabase Keep-Alive Design

### Keep-alive operation

The keep-alive automation should perform a **minimal public read** against the existing `job_applications` table through Supabase REST:

```text
GET {VITE_SUPABASE_URL}/rest/v1/job_applications?select=id&limit=1
```

This request should send:

- `apikey: {VITE_SUPABASE_PUBLISHABLE_KEY}`
- `Authorization: Bearer {VITE_SUPABASE_PUBLISHABLE_KEY}`

### Why this operation

- It uses the same public project URL and publishable key already required by the app
- It targets a table that already exists for normal application behavior
- It is read-only and low-cost
- It does not require introducing auth, a service-role key, or a new backend component
- Supabase counts API/database traffic as project activity, so this is a reasonable keep-alive ping

### Required inputs

- `SUPABASE_URL` or `VITE_SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY` or `VITE_SUPABASE_PUBLISHABLE_KEY`

The keep-alive tool should prefer dedicated `SUPABASE_*` variables if present, while remaining compatible with the existing app-style `VITE_*` variables.

### Success criteria

The keep-alive request is considered successful when:

- the HTTP status is `200`
- the response body is a JSON array
- the script can report the target URL path it queried

An empty array is still a successful result because the purpose is to generate valid Supabase API activity, not to require existing rows.

### Failure criteria

The keep-alive request should fail clearly when:

- required configuration is missing
- the HTTP response is non-2xx
- the response is not valid JSON
- the Supabase project is unreachable

### Script interface

The keep-alive tool should be implemented as a **Node script** stored under `scripts/` and runnable in either of these ways:

```sh
node scripts/supabase-keepalive.mjs
```

or, once wired into `package.json`:

```sh
npm run supabase:keepalive
```

This keeps the tool portable across machines that already have Node installed and avoids dependence on a specific scheduler or shell environment.

### Configuration contract

The script should read configuration from environment variables with this precedence:

1. `SUPABASE_URL`
2. `VITE_SUPABASE_URL`

and:

1. `SUPABASE_PUBLISHABLE_KEY`
2. `VITE_SUPABASE_PUBLISHABLE_KEY`

The script should support loading those values from the process environment, including environments populated from a local `.env` file before invocation.

### Output contract

On success, the script should print a short human-readable success line that includes:

- the queried endpoint path
- the HTTP status
- whether the response contained 0 or more rows

On failure, the script should print a short human-readable error to stderr describing whether the failure was caused by configuration, networking, or a non-success Supabase response.

### Exit codes

- `0`: request succeeded and returned valid JSON
- `1`: request ran but failed due to HTTP, network, or response parsing issues
- `2`: required configuration was missing

## Commands

Use Node.js `v20.19.4` and npm.

```sh
npm run dev
npm run build
npm run lint
npx jest --runInBand
```

Useful targeted test commands:

```sh
npx jest --runTestsByPath src/__tests__/hooks/usePreviousEntriesLoader.test.tsx --runInBand
npx jest --runInBand --testNamePattern="should load suggestions successfully"
```

## Testing Notes

- Tests live under `src/__tests__/`
- Shared mocks are configured in `src/setupTests.ts`
- `jest.config.js` uses `ts-jest` with `jsdom`
- Coverage thresholds are set globally to 80%

When adding new shared dependencies to hooks or pages, update `src/setupTests.ts` if the tests need new default mocks.

## Agent Guidance

- Prefer updating this file when implementation details change in a way that affects future code changes.
- Keep this file factual and code-verified.
- Remove or rewrite outdated content instead of appending contradictory notes.
- Do not mix roadmap items, PRD requirements, and implementation facts in the same section.
