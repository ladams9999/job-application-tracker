# Pending Tasks

### Task 1: Extend filter hook criteria and clear actions

- Update `useApplicationFilters` to derive active criteria for `search`, `status`, and `view`
- Add explicit handlers to clear each supported criterion individually and to clear all active criteria together
- Keep query-parameter-derived state aligned when a visible criterion is cleared

**Verification:** Hook tests prove active criteria are derived from query parameters correctly and that individual/all-clear actions reset the expected filter fields and URL params

### Task 2: Add an Applications filter-summary component

- Create a reusable component that renders only active filter criteria as chips, badges, or similar compact UI
- Give each rendered criterion its own clear control and show a single clear-all action only when multiple criteria are active

**Verification:** Component or page tests prove the expected search/status/view criteria render when active and disappear when no criteria remain

### Task 3: Integrate the summary into ApplicationsList

- Render the filter summary between `ApplicationsHeader` and `FilterBar`
- Wire the summary clear actions into the existing Applications page without changing the current loading, error, or table branches

**Verification:** Page tests prove the summary appears in the intended location and that existing loading/error states still render correctly

### Task 4: Finish regression coverage and validation

- Update affected mocks and fixtures for the expanded filter-hook contract
- Run `npm run lint`, `npm run build`, and focused Jest coverage for the new filter-summary behavior

**Verification:** Repository checks pass and focused tests cover hook behavior, summary rendering, and Applications page integration
