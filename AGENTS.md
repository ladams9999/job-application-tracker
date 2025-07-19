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
- **Dev server**: `npm run dev` (port configurable via SERVER_PORT env var, default 8080)
- **Security status**: All npm audit vulnerabilities resolved (0 vulnerabilities as of last check)

## Environment Configuration
- **Environment file**: `.env` (excluded from git, use `.env.example` as template)
- **Required variables**:
  - `VITE_SUPABASE_URL`: Supabase project URL
  - `VITE_SUPABASE_ANON_KEY`: Supabase anonymous key
  - `SERVER_PORT`: Development server port (default: 8080)
- **Setup**: `cp .env.example .env` and edit with actual values

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
- Dockerfile and full integration test suite

## Technology Stack
- **Vite** v7.0.5 - Fast build tool and dev server
- **React** 18 - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Re-usable UI components
- **Supabase** - Backend as a service
- **React Hook Form** - Form handling
- **Jest** - Testing framework
- **React Testing Library** - Component testing utilities

## Available Scripts
```sh
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
npx jest           # Run tests
```

## Project Structure
- `src/` - Source code
- `src/components/` - React components
- `src/integrations/supabase/` - Supabase configuration
- `dist/` - Production build output
- `.env` - Environment variables (not tracked)
- `.env.example` - Environment variables template

Follow a TDD workflow: write failing tests first, then implement code until they pass.
