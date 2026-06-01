# Pending Tasks

## 1. Modernize routing and navigation primitives

- The root route redirects with `useEffect` + `navigate` instead of using declarative routing
- `NotFound` logs expected 404 navigation to the console and uses a plain anchor tag, causing a full page reload back to the app
- The mobile layout also shows a standalone dashboard icon that is not an actionable navigation item

**Verifiable outcome:** redirects and links use idiomatic React Router primitives, expected 404s no longer spam the console, and mobile navigation only shows clear actionable items
