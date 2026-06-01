-- Add a persisted sample application for Home page development.
INSERT INTO public.job_applications (
  id,
  company,
  job_title,
  job_description,
  date_applied,
  status,
  notes,
  source,
  recruiter,
  recruiting_firm,
  contact_email,
  contact_phone,
  application_url,
  created_at,
  updated_at
)
VALUES (
  '0d8dfe36-7ebe-4683-a57b-8d6aeccfc0a2',
  'Home Page Sample Company',
  'Frontend Engineer (Sample)',
  'Persisted sample application used to exercise the Home dashboard and active applications list during development.',
  CURRENT_DATE,
  'applied',
  'Seeded sample record for Home page development.',
  'Company Website',
  NULL,
  NULL,
  'sample@example.com',
  '555-0100',
  'https://example.com/sample-home-application',
  timezone('utc', now()),
  timezone('utc', now())
)
ON CONFLICT (id) DO NOTHING;
