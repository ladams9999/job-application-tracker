# Pending Tasks

### Task 3: Integrate the summary into ApplicationsList

- Render the filter summary between `ApplicationsHeader` and `FilterBar`
- Wire the summary clear actions into the existing Applications page without changing the current loading, error, or table branches

**Verification:** Page tests prove the summary appears in the intended location and that existing loading/error states still render correctly

### Task 4: Finish regression coverage and validation

- Update affected mocks and fixtures for the expanded filter-hook contract
- Run `npm run lint`, `npm run build`, and focused Jest coverage for the new filter-summary behavior

**Verification:** Repository checks pass and focused tests cover hook behavior, summary rendering, and Applications page integration
