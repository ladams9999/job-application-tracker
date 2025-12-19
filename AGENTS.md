# AGENT INSTRUCTIONS

## Environment Setup
- **Node.js**: v20.19.4 (installed via nvm - load with `export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"`)
- **npm**: v10.8.2
- **Git remote**: `github` (NOT `origin`) - points to `git@github.com:ladams9999/job-application-tracker.git`

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
  - `VITE_SUPABASE_PUBLISHABLE_KEY`: Supabase anonymous key
  - `SERVER_PORT`: Development server port (default: 8080)
- **Setup**: `cp .env.example .env` and edit with actual values

## Recent Major Changes
- **Source Field Enhancement**: Added custom source entry capability with combobox UI - users can select existing sources or type new custom sources
- **Form Validation**: Made Contact Email field truly optional - accepts empty strings, valid emails, or any text (e.g., "Ask HR")
- **Port Configuration**: Fixed Vite dev server to properly read SERVER_PORT from .env file using loadEnv()
- **Environment Configuration**: Added .env support with Supabase and server port configuration
- **Security Fixes**: Removed `lovable-tagger` dependency and upgraded vite to v7.0.5 (resolved all npm audit vulnerabilities)
- **Node.js Upgrade**: Updated from v18.19.0 to v20.19.4 via nvm to meet React Router v7.7.0 requirements
- **Documentation**: Updated README.md and AGENTS.md with comprehensive setup instructions

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
- **React** 18.3.1 - UI framework with React Router v7.7.0
- **TypeScript** v5.8.3 - Type safety
- **Tailwind CSS** v3.4.17 - Utility-first CSS framework
- **Radix UI** - Headless UI components (comprehensive component library)
- **shadcn/ui** - Re-usable UI components built on Radix UI
- **Supabase** v2.52.0 - Backend as a service
- **React Hook Form** v7.60.0 - Form handling with Zod validation
- **TanStack Query** v5.83.0 - Server state management
- **Jest** v30.0.4 - Testing framework
- **React Testing Library** v16.3.0 - Component testing utilities

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
  - `src/components/` - React components (UI library based on shadcn/ui)
  - `src/integrations/supabase/` - Supabase configuration and client setup
  - `src/hooks/` - Custom React hooks
  - `src/lib/` - Utility functions and shared logic
- `dist/` - Production build output (generated)
- `node_modules/` - Dependencies (generated)
- `.env` - Environment variables (not tracked by git)
- `.env.example` - Environment variables template
- `package.json` - Project dependencies and scripts
- `vite.config.ts` - Vite configuration with environment loading
- `tailwind.config.js` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration

## Development Workflow
1. Always load nvm environment first: `export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"`
2. Use `git remote` name `github` for push/pull operations
3. Environment variables are in `.env` (use `.env.example` as template)
4. Test changes with `npm run build` before committing
5. Follow TDD: write failing tests first, then implement code until they pass

## Verification Commands
```sh
# Verify Node.js environment
node --version  # Should show v20.19.4
npm --version   # Should show v10.8.2

# Check git configuration
git remote -v   # Remote is 'github', NOT 'origin'

# Verify project health
npm run build   # Should build successfully
npm audit       # Should show 0 vulnerabilities
```
