# Job Application Tracker

Create an application to record job applications

Refer to `PROJECT_PLAN.md` for current goals of this project 

# Documentation

- **AGENTS.md**: General project info for agents
* **CLAUDE.md**: Should always just `Refer to AGENTS.md`
* **PENDING_TASKS.md**: Pending Tasks for this project
* **COMPLETED_TASKS.md**: Completed Tasks for this project
* **IMPLEMENTATION.md**: Implementation details for agents
* **PROJECT_PLAN.md**: Current goals of project
* **README.md**: This is for human readable documentation to use this project

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

