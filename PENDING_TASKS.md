# Pending Tasks

## 1. Harden search and suggestion queries

- `getApplications` interpolates raw search text into a PostgREST `.or(...)` filter string, which is fragile for punctuation-heavy input
- `getSuggestions` currently reads whole columns and deduplicates client-side, which will not scale well as the table grows
- Tighten query construction for arbitrary user input and replace broad scans with a more bounded query strategy

**Verifiable outcome:** search works reliably with arbitrary input characters, and suggestion loading avoids full-table fetch patterns

## 2. Remove or fully ship the dormant company autocomplete path

- `ApplicationForm.tsx` hardcodes `enableAutocomplete = false`, so `CompanyFieldsWithAutocomplete` and its fallback/error-boundary complexity are never used in production
- Keeping an always-off feature path increases maintenance cost and test surface without user benefit
- Decide whether the company/job-title autocomplete should be supported now; then either wire it in intentionally or delete the dead path

**Verifiable outcome:** no permanently disabled autocomplete flag remains, and the production form only contains behavior the app actually supports

## 3. Modernize routing and navigation primitives

- The root route redirects with `useEffect` + `navigate` instead of using declarative routing
- `NotFound` logs expected 404 navigation to the console and uses a plain anchor tag, causing a full page reload back to the app
- The mobile layout also shows a standalone dashboard icon that is not an actionable navigation item

**Verifiable outcome:** redirects and links use idiomatic React Router primitives, expected 404s no longer spam the console, and mobile navigation only shows clear actionable items
