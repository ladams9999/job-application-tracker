# AGENT INSTRUCTIONS

This repository uses Jest for testing. Run `npx jest` from the repository root to execute the test suite.

Refer to the Product Requirements Document in `PRD.md` for a detailed description of the intended application features.

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
