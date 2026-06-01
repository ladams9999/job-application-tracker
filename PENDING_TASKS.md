# Pending Tasks

## 1. Normalize `date_applied` handling as a date-only value

- The database stores `date_applied` as a `date`, but the app currently converts dates with `toISOString()` on submit and `new Date(dateString)` on load
- That pattern can shift the visible calendar day across time zones and makes date round-tripping unreliable
- Introduce shared parse/format helpers for date-only values and use them consistently in create, edit, and display flows

**Verifiable outcome:** a selected application date saves and reloads as the same calendar day regardless of local time zone

## 2. Move application data flows onto shared React Query hooks

- `App.tsx` already provides `QueryClientProvider`, but the list, form loaders, suggestions, and dashboard still rely on manual `useEffect` / `useState` orchestration
- `Dashboard` fetches its own application list once on mount, so its metrics can drift from the table after deletes or edits
- Current service-layer fallbacks also blur the difference between a real empty state and a failed request

**Verifiable outcome:** list, dashboard, and form-related queries use shared React Query hooks with predictable loading/error states and mutation invalidation keeps views in sync

## 3. Centralize Supabase row mapping and payload shaping

- `applicationsApi.ts` repeats snake_case-to-camelCase mapping logic and request payload construction in multiple CRUD paths
- This duplication increases the chance that future schema changes update one path but miss another
- Extract typed adapter helpers that own row transformation and request shaping in one place

**Verifiable outcome:** Supabase request/response mapping lives in shared typed helpers, duplicated transformation logic is removed, and existing behavior stays intact

## 4. Harden search and suggestion queries

- `getApplications` interpolates raw search text into a PostgREST `.or(...)` filter string, which is fragile for punctuation-heavy input
- `getSuggestions` currently reads whole columns and deduplicates client-side, which will not scale well as the table grows
- Tighten query construction for arbitrary user input and replace broad scans with a more bounded query strategy

**Verifiable outcome:** search works reliably with arbitrary input characters, and suggestion loading avoids full-table fetch patterns

## 5. Remove or fully ship the dormant company autocomplete path

- `ApplicationForm.tsx` hardcodes `enableAutocomplete = false`, so `CompanyFieldsWithAutocomplete` and its fallback/error-boundary complexity are never used in production
- Keeping an always-off feature path increases maintenance cost and test surface without user benefit
- Decide whether the company/job-title autocomplete should be supported now; then either wire it in intentionally or delete the dead path

**Verifiable outcome:** no permanently disabled autocomplete flag remains, and the production form only contains behavior the app actually supports

## 6. Modernize routing and navigation primitives

- The root route redirects with `useEffect` + `navigate` instead of using declarative routing
- `NotFound` logs expected 404 navigation to the console and uses a plain anchor tag, causing a full page reload back to the app
- The mobile layout also shows a standalone dashboard icon that is not an actionable navigation item

**Verifiable outcome:** redirects and links use idiomatic React Router primitives, expected 404s no longer spam the console, and mobile navigation only shows clear actionable items
