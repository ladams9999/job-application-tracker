# Pending Tasks

## Issue #29: Exclude dashboard view from applications query key

### Task 1: Isolate the server-side filter shape

- Add or reuse a helper that normalizes `ApplicationFilter` for Supabase-backed queries by removing the client-only `view` dimension from the query identity
- Keep the query behavior unchanged for `search`, `status`, `sortBy`, and `sortDirection`
- Verify that `useApplicationsQuery` builds its query key from the server-side filter only

### Task 2: Preserve client-side dashboard filtering

- Keep `filter.view` applied only in the client-side dashboard filtering step inside `useApplicationsData`
- Confirm that switching between dashboard views still changes the visible subset correctly without changing the underlying server request inputs

### Task 3: Add regression coverage for cache-key behavior

- Add or update tests around `useApplicationsQuery` / `useApplicationsData` so different dashboard views reuse the same query identity
- Verify that changing `search`, `status`, `sortBy`, or `sortDirection` still produces distinct query behavior where expected

### Task 4: Run the repo validation commands for the issue fix

- Run `npm run lint`
- Run `npm run build`
- Run targeted Jest coverage for the affected hooks, plus `npx jest --runInBand` if the changes touch shared query behavior broadly
