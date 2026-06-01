# Job Application Tracker

A Vite + React + TypeScript app for tracking job applications. The app talks directly to Supabase from the browser, so you need a Supabase project before you can run it locally.

## Requirements

- Node.js `v20.19.4`
- npm
- A Supabase project

## 1. Install dependencies

```sh
npm install
```

## 2. Create the Supabase schema

Create a new Supabase project, then open the **SQL Editor** and run this script:

```sql
create extension if not exists pgcrypto;

do $$
begin
  create type public.application_status as enum (
    'applied',
    'interview',
    'offer',
    'rejected',
    'withdrawn'
  );
exception
  when duplicate_object then null;
end $$;

create table if not exists public.job_applications (
  id uuid primary key default gen_random_uuid(),
  company text not null,
  job_title text not null,
  job_description text not null,
  date_applied date not null,
  status public.application_status not null default 'applied',
  notes text,
  source text,
  recruiter text,
  recruiting_firm text,
  contact_email text,
  contact_phone text,
  application_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_job_applications_updated_at on public.job_applications;

create trigger set_job_applications_updated_at
before update on public.job_applications
for each row
execute function public.set_updated_at();

alter table public.job_applications enable row level security;

drop policy if exists "job_applications_select" on public.job_applications;
drop policy if exists "job_applications_insert" on public.job_applications;
drop policy if exists "job_applications_update" on public.job_applications;
drop policy if exists "job_applications_delete" on public.job_applications;

create policy "job_applications_select"
on public.job_applications
for select
to anon, authenticated
using (true);

create policy "job_applications_insert"
on public.job_applications
for insert
to anon, authenticated
with check (true);

create policy "job_applications_update"
on public.job_applications
for update
to anon, authenticated
using (true)
with check (true);

create policy "job_applications_delete"
on public.job_applications
for delete
to anon, authenticated
using (true);
```

**Note:** the app does not have user authentication yet. These policies make the table writable from the browser with your Supabase publishable key, so use a personal/dev Supabase project.

## 3. Create your `.env` file

Copy the example file:

```sh
cp .env.example .env
```

Then fill in the values from **Supabase Dashboard -> Settings -> API**:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
SERVER_PORT=8080
```

`SERVER_PORT` is optional. If you omit it, Vite defaults to `8080` in this project.

## 4. Start the app

```sh
npm run dev
```

Then open the local URL shown by Vite.

## Optional: Supabase keep-alive script

If you want to keep a free-tier Supabase project from going inactive, this repo includes a portable keep-alive script.

### Configuration

The script uses either:

- `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY`, or
- `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`

If both are present, it prefers the dedicated `SUPABASE_*` variables.

### Run it manually

```sh
npm run supabase:keepalive
```

The script performs a small read against `public.job_applications` and:

- exits `0` on success
- exits `1` on HTTP/network/response failure
- exits `2` when required configuration is missing

### Run it from a scheduler

Any scheduler can invoke it as long as the machine has:

- this repo checked out
- dependencies installed with `npm install`
- the required environment variables available

Use the same command:

```sh
npm run supabase:keepalive
```

Schedule it more often than your Supabase plan's inactivity window. Keep the schedule modest rather than pinging excessively.

## Useful commands

```sh
npm run build
npm run lint
npm run supabase:keepalive
npx jest --runInBand
```
