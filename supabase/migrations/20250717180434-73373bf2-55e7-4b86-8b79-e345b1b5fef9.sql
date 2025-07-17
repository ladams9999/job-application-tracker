
-- Add missing contact fields to job_applications table
ALTER TABLE public.job_applications 
ADD COLUMN IF NOT EXISTS contact_email text,
ADD COLUMN IF NOT EXISTS contact_phone text,
ADD COLUMN IF NOT EXISTS application_url text;
