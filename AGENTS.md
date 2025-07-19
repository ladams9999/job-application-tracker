# AGENT INSTRUCTIONS

## Environment Setup
- **Node.js**: v20.19.4 (installed via nvm - load with `export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"`)
- **npm**: v10.8.2
- **Git remote**: `github` (NOT `origin`) - points to `git@github.com:ladams9999/job-application-tracker-lovable-050d317f.git`
- **Current branch**: `using-warp`

## Testing
This repository uses Jest for testing. Run `npx jest` from the repository root to execute the test suite.

## Build System
- **Vite**: v7.0.5 (upgraded from v5.4.19 to fix security vulnerabilities)
- **Build command**: `npm run build`
- **Dev server**: `npm run dev` (runs on port 8080)
- **Security status**: All npm audit vulnerabilities resolved (0 vulnerabilities as of last check)

## Recent Changes
- Removed `lovable-tagger` dependency (was only used for Lovable platform development tagging)
- Upgraded vite to latest stable version (7.0.5) which resolved esbuild security vulnerabilities
- Node.js updated from v18.19.0 to v20.19.4 to meet React Router v7.7.0 requirements

## Project Documentation
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
