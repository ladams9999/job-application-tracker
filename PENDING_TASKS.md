# Pending Tasks

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
