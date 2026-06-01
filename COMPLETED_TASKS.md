# Completed Tasks

## 1. Supabase keep-alive automation

### Task 1: Define the keep-alive operation

- Chosen operation: public read against `job_applications` using the Supabase publishable key
- Target request: `GET /rest/v1/job_applications?select=id&limit=1`
- Required inputs documented in `IMPLEMENTATION.md`
- Success criteria documented in `IMPLEMENTATION.md`

**Verified:** the chosen operation matches the current app architecture, uses the existing Supabase table, and aligns with Supabase API activity behavior for keeping a project active

### Task 2: Choose the script interface

- Chosen interface: Node script runnable with `node` and later through an npm script
- Configuration contract: `SUPABASE_*` variables first, then fallback to `VITE_*`
- Output contract: short success output on stdout, short failure output on stderr
- Exit codes documented for success, runtime/request failure, and missing configuration

**Verified:** the script interface is now documented in `IMPLEMENTATION.md` with explicit command shape, configuration precedence, output expectations, and exit-code behavior

### Task 3: Implement the keep-alive script

- Added `scripts/supabase-keepalive.mjs`
- Added the `npm run supabase:keepalive` command in `package.json`
- Implemented environment-variable fallback from `SUPABASE_*` to `VITE_*`
- Implemented clear success and failure output with the documented exit codes

**Verified:** the script succeeds against a local HTTP stub that returns a valid JSON array and fails with exit code `2` when required configuration is missing

### Task 4: Document setup and usage

- Updated `README.md` with keep-alive configuration, manual usage, and scheduler expectations
- Updated `.env.example` with optional dedicated `SUPABASE_*` variables for the script
- Documented the shared `npm run supabase:keepalive` command for manual and scheduled execution

**Verified:** the repository now contains human-readable setup and usage instructions covering configuration, manual runs, and scheduler prerequisites

### Task 5: Validate against the target Supabase project

- Ran `npm run supabase:keepalive` against the configured Supabase project
- Confirmed the keep-alive request succeeded end-to-end with the current project credentials
- Rechecked the invalid-key path and confirmed the script fails clearly with a non-zero exit

**Verified:** the script now succeeds against the real Supabase project and still fails as expected when given an invalid publishable key

## 2. Repository maintenance

### Task 5: Persist contact fields through create and update flows

- Passed `contactEmail`, `contactPhone`, and `applicationUrl` through the submit hook and service layer
- Kept the existing form load behavior intact so saved contact fields continue to hydrate in edit mode
- Added regression coverage for both create and edit submissions

**Verified:** `npx jest --runTestsByPath src/__tests__/hooks/useApplicationSubmit.test.tsx --runInBand` confirms create and edit submissions include all contact fields

### Task 6: Normalize `date_applied` handling as a date-only value

- Added shared date-only parse and format helpers for storage, edit-mode hydration, and display formatting
- Replaced `toISOString()` submission and naive `new Date(dateString)` loading with date-only-safe handling
- Added regression coverage for submit, loader, and date utility round-tripping

**Verified:** `npx jest --runTestsByPath src/__tests__/hooks/useApplicationSubmit.test.tsx src/__tests__/hooks/useApplicationDataLoader.test.tsx src/__tests__/lib/date.test.ts --runInBand` confirms the same calendar date is preserved across save and reload flows

### Task 7: Move application data flows onto shared React Query hooks

- Added shared query hooks and query keys for application lists, individual records, and suggestion data
- Replaced manual `useEffect` / `useState` loaders in the list, dashboard, and form-related hooks with React Query
- Added cache invalidation on create, update, and delete so the dashboard, list, and form flows stay in sync
- Updated hook tests to run with a QueryClient test wrapper

**Verified:** `npx jest --runInBand && npm run build` completes successfully with the migrated query-based data flows

### Task 8: Centralize Supabase row mapping and payload shaping

- Extracted shared typed adapters for Supabase row-to-model mapping and request-to-payload conversion
- Reused the same application request builder from the service layer for both create and update flows
- Removed repeated snake_case/camelCase transformation blocks from the CRUD paths

**Verified:** `npx jest --runTestsByPath src/__tests__/services/applicationAdapters.test.ts src/__tests__/hooks/useApplicationSubmit.test.tsx src/__tests__/hooks/useApplicationDataLoader.test.tsx src/__tests__/lib/date.test.ts --runInBand && npm run build` passes with the adapter-based service/API flow

### Task 9: Harden search and suggestion queries

- Replaced raw PostgREST `or(...)` search-string interpolation with literal client-side matching on the fetched application set
- Added bounded ordering and limits to the suggestion queries so they no longer scan full columns
- Extracted shared query helpers and added regression coverage for punctuation-heavy search input and suggestion deduplication

**Verified:** `npx jest --runTestsByPath src/__tests__/services/applicationQueryUtils.test.ts src/__tests__/services/applicationAdapters.test.ts --runInBand && npm run build` passes with the hardened search and suggestion flow

### Task 10: Remove the dormant company autocomplete path

- Removed the permanently disabled company/job-title autocomplete branch from the production form
- Deleted the autocomplete-specific component, fallback error boundary, and their dedicated tests
- Simplified the shipped form path and kept the source suggestions flow intact

**Verified:** `npx jest --runInBand && npm run build` passes with the simplified production form flow

### Task 11: Modernize routing and navigation primitives

- Replaced the imperative root-page redirect with a declarative router redirect
- Updated the 404 page to use SPA navigation back to `/applications` without logging expected misses
- Removed the non-actionable dashboard icon from the mobile nav and added explicit labels to the remaining actions

**Verified:** `npx jest --runInBand && npm run build` passes with the updated routing and navigation behavior

## 3. Repository maintenance

### Task 1: Fix lint dependency resolution

- Added `concat-map` as a development dependency
- Updated the lockfile so the missing transitive dependency is installed consistently
- Confirmed ESLint now starts normally instead of failing during module resolution

**Verified:** `npm run lint` no longer fails with `Cannot find module 'concat-map'` and now proceeds to real project lint findings

### Task 2: Fix lint code violations

- Broadened previous-entry input typing so defensive form fallbacks can be expressed without `any`
- Replaced empty-interface patterns with type aliases where appropriate
- Tightened chart payload typing and updated the Tailwind suppression comment to satisfy ESLint

**Verified:** `npm run lint` now completes successfully for the current codebase

### Task 3: Clean up Jest configuration and noisy test output

- Moved `ts-jest` options from deprecated `globals` config into the transform entry
- Removed debug logging from form components and hooks
- Tightened the autocomplete fallback so undefined previous-entry data no longer triggers expected test-time error-boundary noise
- Silenced the intentionally exercised error path in the loader hook test

**Verified:** `npx jest --runInBand` runs without the deprecated `ts-jest` warning and without the prior console noise from expected test paths

### Task 4: Reduce large production bundle warning

- Added targeted manual vendor chunk splitting in `vite.config.ts`
- Split the production bundle into React, data, UI, and date-related chunks
- Reduced the main application chunk from a single large asset to smaller generated chunks

**Verified:** `npm run build` completes without the previous Vite chunk-size warning

### Task 5: Fix white screen from legacy `date_applied` timestamps

- Normalized stored `date_applied` values so legacy timestamp strings are treated as date-only values before the UI renders them
- Reused the shared normalization in Supabase row mapping and date parsing so the list page and edit form handle old and new records consistently
- Added regression coverage for legacy timestamp values in the date utilities, row adapters, and application data loader

**Verified:** `npx jest --runInBand && npm run build && npm run lint` passes with legacy timestamp rows rendering without the prior white-screen crash

## 4. Robust error handling

### Task 1: Define the app error contract and classification rules

- Added `src/lib/appError.ts` with a shared normalized error shape covering Supabase unavailability, app configuration, missing-record, invalid-record-data, and unknown failures
- Defined the diagnostic fields that later UI and data flows can reuse: category, summary, technical message, retryability, operation, record id, field name, and raw failing value
- Added `InvalidRecordDataError` so record-mapping failures can carry structured context instead of plain string-only exceptions

**Verified:** `npm run lint && npm run build && npx jest --runTestsByPath src/__tests__/lib/appError.test.ts --runInBand` passes, and the new tests prove representative raw errors normalize into the expected classified shape

### Task 2: Add a shared minimal error UI for fatal and recoverable failures

- Added `src/components/error/AppErrorPanel.tsx` as a reusable fallback component that can render either as an in-page panel or a full-screen error view
- Rendered the agreed diagnostics directly from the normalized error contract, including category, summary, technical message, operation, record id, field name, raw failing value, and retryability
- Added optional primary and secondary action slots so later tasks can wire retry and reload affordances into the same shared UI

**Verified:** `npm run lint && npm run build && npx jest --runTestsByPath src/__tests__/components/error/AppErrorPanel.test.tsx --runInBand` passes, and the component tests prove both Supabase and invalid-record examples render the expected diagnostics

### Task 3: Add a top-level error boundary to prevent blank screens

- Added `src/components/error/AppErrorBoundary.tsx` to catch uncaught render-time/runtime failures and render the shared full-screen fallback with retry/reload affordances
- Updated `src/main.tsx` to lazy-load the routed app tree inside the boundary so unexpected app-bootstrap failures surface through the same fallback instead of dropping to a blank page
- Normalized boundary failures through the shared app-error contract so fatal crashes still expose a summary, technical message, and operation context

**Verified:** `npm run lint && npm run build && npx jest --runTestsByPath src/__tests__/components/error/AppErrorBoundary.test.tsx --runInBand` passes, and the boundary test proves a thrown child renders the fallback instead of a blank screen

### Task 4: Preserve structured context when Supabase data is read and transformed

- Updated `src/services/applicationAdapters.ts` so malformed `date_applied` values now throw `InvalidRecordDataError` with record id, field name, and raw value instead of an unstructured exception
- Updated `src/services/applicationsApi.ts` to normalize read and transform failures with operation context for load, create, update, delete, and stats flows
- Added regression coverage proving malformed row data is surfaced as a structured invalid-record-data error with the correct operation and record details

**Verified:** `npm run lint && npm run build && npx jest --runTestsByPath src/__tests__/services/applicationAdapters.test.ts src/__tests__/services/applicationsApi.test.ts --runInBand` passes, and the tests prove malformed row data becomes a structured error with the expected record and field context

### Task 5: Replace generic page-level error states with structured error rendering

- Updated the applications list and dashboard to render `AppErrorPanel` with retry and reload actions instead of generic error text
- Updated the edit-form loading path to preserve and expose structured load errors instead of redirecting away, so missing-record and invalid-record issues stay visible on screen
- Added page and hook tests covering Supabase-unavailable list/dashboard failures and missing-record edit-form failures

**Verified:** `npm run lint && npm run build && npx jest --runTestsByPath src/__tests__/pages/ApplicationsList.test.tsx src/__tests__/components/analytics/Dashboard.test.tsx src/__tests__/pages/ApplicationForm.test.tsx src/__tests__/hooks/useApplicationDataLoader.test.tsx src/__tests__/hooks/useApplicationForm.test.tsx --runInBand` passes, and the tests prove these failures now render actionable UI instead of generic text or navigation away

### Task 6: Add regression coverage for the main failure classes

- Added direct regression coverage for the main failure classes across the shared error model, API layer, page-level fallbacks, and the top-level error boundary
- Added an API-level missing-record regression so real Supabase `PGRST116` responses are normalized with the expected operation and record context
- Ran the full repository lint, build, and Jest commands after the full error-handling implementation landed

**Verified:** `npm run lint && npm run build && npx jest --runInBand` completes successfully, and the full suite now covers Supabase unavailable, invalid record data, missing record, and uncaught render failures

## 5. Home page and dashboard deep-linking

### Task 1: Extract shared dashboard activity selectors

- Added `src/services/dashboardMetrics.ts` to centralize dashboard count derivation, the shared active-application rule, and recent-activity sorting helpers
- Defined `isActiveApplication`, `getMostRecentActivityDate`, `sortByMostRecentActivity`, and `getDashboardMetrics` so later Home and dashboard work can reuse the same logic
- Added focused unit coverage for the current Active rule, recent-activity ordering, and shared dashboard counts

**Verified:** `npm run lint && npm run build && npx jest --runTestsByPath src/__tests__/services/dashboardMetrics.test.ts --runInBand` passes, and the new tests prove the active selector and recent-activity sorter match the required behavior

### Task 2: Refactor Dashboard to consume shared selectors

- Refactored `src/components/analytics/Dashboard.tsx` to use `getDashboardMetrics` instead of deriving counts inline
- Added `src/components/analytics/dashboardCardConfig.ts` so card metadata is centralized and ready for deep-link behavior without changing card rendering logic again
- Extended dashboard component coverage to prove the rendered card counts still match the same application set after the refactor

**Verified:** `npm run lint && npm run build && npx jest --runTestsByPath src/__tests__/components/analytics/Dashboard.test.tsx src/__tests__/services/dashboardMetrics.test.ts --runInBand` passes, and the tests prove the refactored dashboard still renders the expected metrics

### Task 3: Add dashboard card deep links

- Added `/applications` deep-link targets to the shared dashboard card config for This Week, Active, Dormant, Silent, and Total views
- Updated `Dashboard` to render each metrics card as a router link while preserving the existing counts and labels
- Added regression coverage that asserts the exact `/applications?...` URLs emitted for the supported cards

**Verified:** `npm run lint && npm run build && npx jest --runTestsByPath src/__tests__/components/analytics/Dashboard.test.tsx --runInBand` passes, and the tests prove the dashboard emits the expected deep-link targets

### Task 4: Add query-parameter hydration to Applications filters

- Extended the applications filter model with dashboard-view state and hydrated it from `/applications` query parameters through `useLocation`
- Added shared query-string parsing and reused the shared dashboard selectors to apply `this-week`, `active`, `dormant`, and `silent` derived views on top of the fetched list without changing the existing sort order
- Added hook coverage for URL hydration and list filtering, and updated the existing Applications page test fixture for the expanded filter shape

**Verified:** `npm run lint && npm run build && npx jest --runTestsByPath src/__tests__/hooks/useApplicationFilters.test.tsx src/__tests__/hooks/useApplicationsList.test.tsx src/__tests__/pages/ApplicationsList.test.tsx --runInBand` passes, and the tests prove `/applications` reads query parameters and returns the expected filtered subset

### Task 5: Create the Home page route and shell

- Added `src/pages/Home.tsx` as a dedicated landing page that uses the shared layout and renders the dashboard section
- Replaced the root redirect in `App.tsx` with a real `/` route while keeping the existing Applications, Add, Edit, and Not Found routes intact
- Exported the route tree for focused routing coverage and added a root-route test that exercises the new Home entry point

**Verified:** `npm run lint && npm run build && npx jest --runTestsByPath src/__tests__/AppRoutes.test.tsx --runInBand` passes, and the route test proves `/` now renders Home instead of redirecting

### Task 6: Add the Active Applications section to Home

- Extended `Home` to load the application list, reuse the shared active selector, and sort the matching records with `sortByMostRecentActivity`
- Added loading, structured error, and empty states for the new section while keeping the dashboard at the top of the page
- Added Home page regression coverage proving only active applications render and that they appear in descending recent-activity order

**Verified:** `npm run lint && npm run build && npx jest --runTestsByPath src/__tests__/pages/Home.test.tsx src/__tests__/AppRoutes.test.tsx --runInBand` passes, and the tests prove Home only shows active applications in the expected order

### Task 7: Add a persisted sample record for today

- Added a Supabase migration that inserts a clearly labeled `Home Page Sample Company` application for Home page development
- Used `CURRENT_DATE` together with current UTC timestamps so the seeded record always counts as active on the day the migration is applied
- Made the insert idempotent with `ON CONFLICT (id) DO NOTHING` so the sample stays safe to reason about across repeated environments

**Verified:** `supabase/migrations/20260601131500-add-home-sample-application.sql` inserts the sample row with `CURRENT_DATE`, status `applied`, current UTC `created_at`/`updated_at`, and an idempotent conflict clause, which keeps it in the active set on migration day

### Task 8: Update navigation and regression coverage

- Added a Home navigation entry to both the desktop sidebar and mobile action bar so the new root page is reachable from the shared layout
- Kept the Home page loading and structured error states coherent while expanding route coverage to assert the Home nav entry is present at `/`
- Finished with the full repository lint, build, and Jest commands after the complete Home-page implementation landed

**Verified:** `npm run lint && npm run build && npx jest --runInBand` passes, including the new route, Home rendering, dashboard deep-link, and filter-hydration coverage

## 6. Applications filter criteria summary

### Task 1: Extend filter hook criteria and clear actions

- Extended `useApplicationFilters` to derive active `search`, `status`, and `view` criteria from the current filter state
- Added explicit clear handlers for each supported criterion plus a clear-all action that keeps non-filter sort state intact
- Synced clear actions back into the `/applications` query string so URL-hydrated criteria stay removed after navigation or refresh

**Verified:** `npm run lint && npm run build && npx jest --runTestsByPath src/__tests__/hooks/useApplicationFilters.test.tsx --runInBand` passes, and the hook tests prove active criteria and individual/all-clear URL reset behavior

### Task 2: Add an Applications filter-summary component

- Added `ApplicationFilterSummary` to render active search, status, and view criteria as compact chips under a shared “Filtering by” label
- Gave each rendered criterion its own clear button and limited the shared clear-all action to multi-criteria cases
- Added focused component coverage for populated, empty, and single-criterion summary states

**Verified:** `npm run lint && npm run build && npx jest --runTestsByPath src/__tests__/components/application/ApplicationFilterSummary.test.tsx --runInBand` passes, and the component tests prove the expected criteria and clear controls render only when appropriate

### Task 3: Integrate the summary into ApplicationsList

- Updated `useApplicationsList` to expose active criteria plus unified per-criterion and clear-all handlers for the page layer
- Rendered `ApplicationFilterSummary` between `ApplicationsHeader` and `FilterBar` on the Applications page
- Expanded Applications page coverage to prove the summary appears in the intended location while the loading and structured error states still behave as before

**Verified:** `npm run lint && npm run build && npx jest --runTestsByPath src/__tests__/pages/ApplicationsList.test.tsx --runInBand` passes, and the page tests prove the summary placement and existing loading/error behavior

### Task 4: Finish regression coverage and validation

- Updated the affected page fixture to cover the expanded `useApplicationsList` contract, including active criteria and clear handlers
- Re-ran lint, build, and focused Jest coverage for the hook, summary component, and Applications page integration together
- Confirmed the new filter-summary behavior is covered end-to-end across derivation, rendering, and page placement

**Verified:** `npm run lint && npm run build && npx jest --runTestsByPath src/__tests__/hooks/useApplicationFilters.test.tsx src/__tests__/components/application/ApplicationFilterSummary.test.tsx src/__tests__/pages/ApplicationsList.test.tsx --runInBand` passes for the completed filter-summary feature

### Task 5: Fix router hook coverage in the applications-list regression test

- Added an explicit `useNavigate` mock to `useApplicationsList.test.tsx` so the local `react-router-dom` mock matches the hook's current dependencies
- Reset the navigation spy between tests to keep the hook suite isolated and deterministic
- Restored the full Jest suite after the URL-hydration regression started exercising `useApplicationFilters` through `useApplicationsList`

**Verified:** `npm run lint && npm run build && npx jest --runInBand` passes with the repaired router-hook test setup