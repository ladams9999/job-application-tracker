# Unified Product Requirements Document (PRD): Personal Job Application Tracker

## 1. Product Overview

### 1.1 Product Name
Personal Job Application Tracker

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

---

## 3. Features

### 3.1 MVP Features (Version 1.0)

#### 3.1.1 Job Application Entry

**Fields:**
- Company Name (required, allow "Unknown")
- Job Title (required)
- Job Description (required)
- Source / Where Found (required; supports predefined options and custom entry)
- Date Applied (required, cannot be in future)
- Application Status (required; predefined options: "Applied", "Under Review", "Interview Scheduled", "Interviewed", "Offer", "Rejected", "Withdrawn" + custom entry)
- Notes (optional, free text)
- Agency / Recruiter (optional)
- Contact Email (optional, accepts any text including emails or contact notes)
- Contact Phone (optional)
- Application URL (optional, valid URL)

**Field Behavior:**
- Autocomplete support for: Company Name, Job Title, Source, Agency/Recruiter
- Real-time validation for all applicable fields

#### 3.1.2 Job Application Listing

- Display all applications in a responsive table or card layout
- Show: Company, Title, Status, Date Applied, Date Modified
- Sort by: Date Modified (default), Company, Job Title, Status, Date Applied
- Filter by: Status, Company, Date Range
- Search by: Company, Job Title, Notes
- Pagination (20 per page)
- Quick status update dropdown (supports custom status)

#### 3.1.3 Application Updates

- Edit any field of an application
- Update application status via dropdown (predefined + custom)
- General notes field (timestamped notes may be added in future versions)
- Soft delete applications (marked as deleted, not removed from DB)
- View deleted applications in "Archived" section with restore option

### 3.2 Data Persistence

- SQLite database with local file persistence
- CRUD support via backend API
- Automatic timestamps for creation and update
- Indexing for performance

### 3.3 User Interface

- Responsive UI (mobile and desktop)
- Navigation bar: "Add Application", "View Applications"
- Clean form layout with grouped fields
- Collapsible section for additional details
- Auto-save for long forms
- Success/error notifications
- Expandable text areas for Job Description and Notes

---

## 4. Technical Requirements

### 4.1 Frontend

- React (with Hooks)
- Component-based architecture
- Form validation (e.g., React Hook Form or Formik)
- Routing (e.g., React Router)
- Styling with Tailwind CSS or CSS Modules

### 4.2 Backend

- Node.js (Express)
- REST API endpoints:
  - `POST /applications`
  - `GET /applications`
  - `PUT /applications/:id`
  - `DELETE /applications/:id` (soft delete)
  - `GET /applications/archived`
  - `PUT /applications/:id/restore`
  - `GET /autocomplete/:field`

### 4.3 Local Development Environment

- `.env` for configuration
- Node LTS version
- Dockerfile and docker-compose (optional, for later deployment)

### 4.4 Testing

- TDD methodology
- Unit tests for all backend and frontend components
- Integration tests for user workflows
- Tools: Jest, React Testing Library, Supertest
- Minimum 80% test coverage

---

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

---

## 7. Risks and Mitigations

- **Scope Creep**: Strict MVP definition, backlog tracking
- **Data Loss**: Auto-save, backups
- **Security (SSO)**: Deferred until SSO implemented
- **Test Gaps**: Enforce TDD + regular coverage review
- **Performance**: Indexing, pagination
- **Data Entry Fatigue**: Smart defaults, UI/UX simplification

---

## 8. Appendix

### 8.1 Technology Stack
- **Frontend**: React 18+, React Router, Axios, Tailwind CSS or MUI
- **Backend**: Node.js 18+, Express.js, SQLite3, cors, helmet
- **Testing**: Jest, React Testing Library, Supertest
- **Dev Tools**: ESLint, Prettier, Nodemon, Concurrently

### 8.2 Database Schema
```sql
CREATE TABLE applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_name TEXT NOT NULL CHECK(company_name <> ''),
    job_title TEXT NOT NULL CHECK(job_title <> ''),
    job_description TEXT NOT NULL CHECK(job_description <> ''),
    source TEXT,
    date_applied TEXT NOT NULL,
    status TEXT NOT NULL,
    notes TEXT,
    agency TEXT,
    contact_email TEXT,
    contact_phone TEXT,
    application_url TEXT,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_applications_company ON applications(company_name);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_date_applied ON applications(date_applied);
CREATE INDEX idx_applications_updated_at ON applications(updated_at);
CREATE INDEX idx_applications_is_deleted ON applications(is_deleted);
```

### 8.3 File Structure
```
job-tracker/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── tests/
├── server/                 # Node.js backend
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── tests/
├── database/              # SQLite DB and migrations
└── docs/                  # Documentation
```

