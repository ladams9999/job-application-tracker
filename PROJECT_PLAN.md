# Project Plan for job-application-tracker

An application to record and maintain job applications

## MVP

MVP is done

- Page to add and update application info
- Page to list application info
- Persist data to database

## Additional Features

- Review and improve existing code
- Improve UI and fix bogs
- Add additional datastore options 

---
### 1.2 Product Vision
A comprehensive, user-friendly application that helps job seekers organize, track, and manage their job applications throughout their career journey, with intelligent features to streamline the application process.

### 1.3 Target Audience
- Individual job seekers
- Career changers
- Recent graduates
- Professionals actively seeking new opportunities

### 1.4 Development Context
- Single developer with AI assistant
- Test-Driven Development (TDD) following these steps:
  - Write a failing test that defines a desired improvement or new function
  - Write the minimum amount of code necessary to make the test pass
  - Refactor the code to acceptable standards
- Iterative development with clear MVP and future enhancements

---

## 2. Goals and Objectives

**Primary Goal:** Enable individuals to efficiently track and manage job applications in a secure, user-friendly environment.

**Objectives:**
- Record detailed information about each job application
- View, search, and filter applications
- Update existing applications
- Persist data locally via SQLite
- Design with extensibility for cloud storage, authentication, and AI features

### 4.4 Testing

- TDD methodology
- Unit tests for all backend and frontend components
- Integration tests for user workflows
- Tools: Jest, React Testing Library, Supertest
- Minimum 80% test coverage

## 5. Future Enhancements (Post-MVP)

### 5.1 Authentication & Multi-User Support
- SSO integration (GitHub, Google)
- User-specific data isolation
- Session management
- User profile management

### 5.2 External Persistence
- PostgreSQL or Supabase integration
- Cloud sync support
- Migration tools

### 5.3 Document Management
- Upload resume and cover letter
- Document versioning
- File type validation (PDF, DOC, DOCX)

### 5.4 Contact Management
- Recruiter contact storage
- Communication history
- Follow-up reminders

### 5.5 AI Integration
- LLM prompt generation for resumes and cover letters
- Job description analysis
- Resume tailoring
- Application insights and follow-up suggestions

### 5.6 Advanced Features
- Calendar and email integration
- Analytics dashboard
- Export to formats (PDF, Excel)
- Mobile app support
- Timestamped notes

---

## 6. Success Metrics

- User can successfully add, view, update, delete (soft) applications
- All required tests pass
- App loads < 2s; search/filter < 500ms
- Data persists across sessions
- Time to add application < 2 min
- Search/filter accuracy > 95%
- Zero data loss incidents
- Minimal learning curve


## 7. Risks and Mitigations

- **Scope Creep**: Strict MVP definition, backlog tracking
- **Data Loss**: Auto-save, backups
- **Security (SSO)**: Deferred until SSO implemented
- **Test Gaps**: Enforce TDD + regular coverage review
- **Performance**: Indexing, pagination
- **Data Entry Fatigue**: Smart defaults, UI/UX simplification
