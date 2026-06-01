# Pending Tasks

### Task 1: Extract shared dashboard activity selectors

- Move the current Dashboard "active" rule and related count logic into shared helpers
- Add a helper for recent-activity ordering using `updatedAt` with `createdAt` fallback

**Verification:** Unit tests prove the active selector matches the current 14-day/non-rejected/non-withdrawn rule and the recent-activity sorter orders records correctly

### Task 2: Refactor Dashboard to consume shared selectors

- Update `Dashboard` to use the shared helpers instead of deriving card counts inline
- Prepare card configuration so deep links can be added without changing displayed metrics

**Verification:** Tests prove the rendered dashboard counts still match the same input applications after the refactor

### Task 3: Add dashboard card deep links

- Make supported dashboard cards clickable or linked to `/applications` with query parameters
- Define the deep-link mapping for at least the requested Active view and any other cleanly supported cards

**Verification:** Tests prove the dashboard emits the expected `/applications?...` targets for supported cards

### Task 4: Add query-parameter hydration to Applications filters

- Update the Applications filter flow so URL parameters initialize filter state and derived dashboard filters
- Preserve existing manual filtering and sorting after hydration

**Verification:** Tests prove `/applications` reads query parameters and shows the expected filtered and sorted results

### Task 5: Create the Home page route and shell

- Add a dedicated Home page at `/` using the shared app layout
- Replace the existing `/` redirect with the new Home route

**Verification:** Routing tests prove `/` renders Home instead of redirecting to Applications

### Task 6: Add the Active Applications section to Home

- Render only applications matching the shared active rule
- Sort the list from most recent activity to least recent and show a reasonable empty state when no records match

**Verification:** Page tests prove Home shows only active applications in descending recent-activity order

### Task 7: Add a persisted sample record for today

- Create a Supabase migration or seed row for a clearly labeled sample application dated today so it appears in the active list
- Keep the record easy to identify during development

**Verification:** The migration or seed defines a record that qualifies as active today, and the implementation/tests or docs reference how it is used

### Task 8: Update navigation and regression coverage

- Add a Home navigation entry and keep loading/error behavior coherent on the new page
- Finish by running the repository lint, build, and Jest commands

**Verification:** Relevant Jest coverage passes for routing, Home rendering, dashboard deep links, and filter hydration, and the repo lint/build/test commands succeed
