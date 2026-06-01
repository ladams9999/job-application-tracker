# Pending Tasks

## 1. Remove or fully ship the dormant company autocomplete path

- `ApplicationForm.tsx` hardcodes `enableAutocomplete = false`, so `CompanyFieldsWithAutocomplete` and its fallback/error-boundary complexity are never used in production
- Keeping an always-off feature path increases maintenance cost and test surface without user benefit
- Decide whether the company/job-title autocomplete should be supported now; then either wire it in intentionally or delete the dead path

**Verifiable outcome:** no permanently disabled autocomplete flag remains, and the production form only contains behavior the app actually supports

## 2. Modernize routing and navigation primitives

- The root route redirects with `useEffect` + `navigate` instead of using declarative routing
- `NotFound` logs expected 404 navigation to the console and uses a plain anchor tag, causing a full page reload back to the app
- The mobile layout also shows a standalone dashboard icon that is not an actionable navigation item

**Verifiable outcome:** redirects and links use idiomatic React Router primitives, expected 404s no longer spam the console, and mobile navigation only shows clear actionable items
