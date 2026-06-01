# Project Plan for job-application-tracker

An application to record and maintain job applications

## MVP

MVP is done

- Page to add and update application info
- Page to list application info
- Persist data to database

## Additional Features

- A cron script to use supabase to keep it from being paused.
- Review and improve existing code
- Improve UI and fix bogs
- Add additional datastore options
- Page to manage reruiter info

- Change to or add UUIDs (v7?) for identifiers exposed outside the database.
- multiuser support is postponed, but consider implementing an SSO/login to auth with 3rd party services..  
- AI/LLM support is postponed.

## Current Product Direction

### Product Vision

Build a practical, user-friendly job application tracker that helps an individual job seeker record applications, manage follow-up information, and review progress without unnecessary complexity.

## Current Goals

### Goal 0: Add portable Supabase keep-alive automation

Build a script or small tool that can be run by an external scheduler from this machine or another machine to perform a safe Supabase keep-alive operation.

**Objectives**
- Use a scheduler-agnostic script rather than tying the solution to one machine-specific scheduler
- Define a simple, verifiable keep-alive operation against Supabase
- Keep configuration and credentials manageable through environment variables or documented setup
- Document how the script is intended to be scheduled externally
- Verify the script reports success and failure clearly

### Goal 1: Stabilize and polish the current application

Focus first on improving reliability and usability in the features that already exist.

**Objectives**
- Review and improve existing code
- Improve UI and fix bugs
- Strengthen tests around current workflows
- Keep documentation aligned with the shipped implementation

### Goal 2: Complete the core tracking experience

Add the next features that most directly improve day-to-day use of the tracker.

**Objectives**
- Expand recruiter and contact management
- Improve notes and follow-up workflow
- Make the dashboard and list views more useful for active job searches

## Planned Feature Roadmap

The items below are grouped into achievable features and listed in expected work order.

### Phase 1: Supabase keep-alive automation

1. Define the keep-alive operation and success criteria
2. Implement a portable script or tool that can be run by an external scheduler
3. Add configuration and setup documentation for local and cross-machine use
4. Validate the script against the target Supabase project

### Phase 2: Quality, UX, and maintainability

1. Review and improve existing code structure
2. Fix current bugs and rough UI edges
3. Improve validation, error states, and empty states
4. Strengthen automated test coverage for key user workflows
5. Keep agent and user documentation current

### Phase 3: Recruiter and contact management

1. Add a page to manage recruiter information
2. Support reusable recruiter/contact records where appropriate
3. Improve recruiter-related fields and workflows in the application form
4. Add follow-up-oriented information such as communication notes or reminders

### Phase 4: Better application workflow features

1. Improve dashboard usefulness with clearer analytics and summaries
2. Add timestamped notes or richer activity/history tracking
3. Improve search, filter, and sorting options as needed
4. Revisit delete/archive behavior and decide whether soft delete is needed

### Phase 5: Operations and deployment support

1. Improve environment, deployment, and maintenance documentation
2. Review backup/export needs for data safety

### Phase 6: Data model and integration preparation

1. Evaluate additional datastore options only if they solve a clear need
2. Change to or add UUIDs for identifiers exposed outside the database
3. Preserve compatibility between application code, migrations, and generated Supabase types

## Deferred / Postponed Work

These remain intentionally out of near-term scope.

### Authentication and multi-user support

- Multi-user support is postponed
- If revisited later, prefer a clear authentication strategy such as SSO/login with third-party providers
- Any multi-user work should include user-specific data isolation and session management

### AI / LLM features

- AI/LLM support is postponed
- Potential future areas:
  - resume and cover letter prompt assistance
  - job description analysis
  - application insights and follow-up suggestions

### Additional long-range enhancements

- Document upload and management
- Calendar and email integration
- Export to PDF or spreadsheet formats
- Mobile-specific experience

## Success Criteria for Upcoming Work

- Current application workflows remain stable while enhancements are added
- Add, edit, list, search, and filter continue to work reliably
- New features are delivered in small, testable increments
- Documentation stays consistent with the actual implementation
- The product remains simple and fast for a single-user job-search workflow

## Risks and Mitigations

- **Scope creep**: Keep work ordered by user value and ship in small increments
- **Code quality drift**: Prioritize refactoring and tests before adding large new features
- **Documentation drift**: Update implementation-facing and user-facing docs with each meaningful feature change
- **Data model churn**: Coordinate any schema changes with migrations and generated types
- **Postponed auth complexity**: Avoid designing current features around multi-user assumptions until that work is actually scheduled
