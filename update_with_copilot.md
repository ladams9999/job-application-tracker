This branch updates the supabase env var name from VITE_SUPABASE_ANON_KEY to VITE_SUPABASE_PUBLISHABLE_KEY and updates docs. 

Files changed:
- src/integrations/supabase/client.ts
- .env.example
- README.md
- AGENTS.md

This change is backwards compatible if users set both variables; default looks for `VITE_SUPABASE_PUBLISHABLE_KEY` now.