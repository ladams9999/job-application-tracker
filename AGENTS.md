# AGENT INSTRUCTIONS 
## Session Notes (2025-07-21)

- Supabase project URL and public API key have been moved from `src/integrations/supabase/client.ts` to `.env` as `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`.
- `.env` is now included in `.gitignore` to prevent accidental commits of sensitive data.
- `.env.example` has been created with comments and placeholder values for all required environment variables.
- The Vite dev server port is now configurable via `SERVER_PORT` in `.env` and `.env.example`. `vite.config.ts` reads this value using `process.env.SERVER_PORT`.
- All changes have been committed, with `.env` remaining untracked.

This repository uses Jest for testing. Run `npx jest` from the repository root to execute the test suite.

Refer to the Product Requirements Document in `job_application_tracker_prd.md` for a detailed description of the intended application features.

**Existing Features**
- React frontend using React Hook Form and Tailwind CSS
- Supabase integration for data persistence (`src/integrations/supabase`)
- Components and hooks for adding, listing and updating applications
- Unit tests with Jest and React Testing Library

**Missing from PRD**
- Node.js/Express backend and REST endpoints
- SQLite persistence or local database setup
- Soft delete/archive functionality
- Dockerfile, `.env` configuration and full integration test suite

Follow a TDD workflow: write failing tests first, then implement code until they pass.
