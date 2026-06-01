# Pending Tasks

### Task 3: Add a top-level error boundary to prevent blank screens

- Wrap the routed application in an error boundary that catches render-time/runtime failures
- Render the shared fallback screen when uncaught errors escape normal page logic

**Verification:** A test that throws from a child component renders the fallback screen instead of leaving the UI blank

### Task 4: Preserve structured context when Supabase data is read and transformed

- Update the API/service/adapter path to attach operation details and record context before errors reach the UI
- Ensure record-data failures identify which record and field failed, plus the raw value when available

**Verification:** Tests show malformed row data becomes a structured invalid-record-data error with the correct record and field context

### Task 5: Replace generic page-level error states with structured error rendering

- Update list/dashboard loading failures and the edit-form record-load path to use the shared error component instead of generic text or redirects
- Preserve retry/reload affordances for transient failures where appropriate

**Verification:** Page/hook tests prove Supabase-unavailable and missing-record failures render actionable on-screen details instead of generic messages or navigation away

### Task 6: Add regression coverage for the main failure classes

- Cover at least Supabase unavailable, invalid record data, missing record, and uncaught render failure
- Run the existing lint/build/test commands after implementation

**Verification:** The relevant Jest tests assert the new behavior, and the project lint/build/test commands complete successfully
