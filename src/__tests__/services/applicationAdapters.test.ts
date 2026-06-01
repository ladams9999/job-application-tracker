import {
  buildApplicationRequest,
  buildCreateApplicationPayload,
  buildUpdateApplicationPayload,
  mapApplicationRow,
} from '@/services/applicationAdapters';
import type { Tables } from '@/integrations/supabase/types';

describe('applicationAdapters', () => {
  it('maps a Supabase row into the UI model', () => {
    const row: Tables<'job_applications'> = {
      id: 'app-1',
      company: 'Acme',
      job_title: 'Frontend Engineer',
      job_description: 'Build UI features',
      date_applied: '2026-06-01',
      status: 'applied',
      notes: null,
      created_at: '2026-06-01T12:00:00.000Z',
      updated_at: '2026-06-02T12:00:00.000Z',
      source: null,
      recruiter: null,
      recruiting_firm: null,
      contact_email: null,
      contact_phone: null,
      application_url: null,
    };

    expect(mapApplicationRow(row)).toEqual({
      id: 'app-1',
      company: 'Acme',
      jobTitle: 'Frontend Engineer',
      jobDescription: 'Build UI features',
      dateApplied: '2026-06-01',
      status: 'applied',
      notes: '',
      createdAt: '2026-06-01T12:00:00.000Z',
      updatedAt: '2026-06-02T12:00:00.000Z',
      source: '',
      recruiter: '',
      recruitingFirm: '',
      contactEmail: '',
      contactPhone: '',
      applicationUrl: '',
    });
  });

  it('normalizes legacy timestamp date values from Supabase rows', () => {
    const row: Tables<'job_applications'> = {
      id: 'app-legacy',
      company: 'Legacy Co',
      job_title: 'Engineer',
      job_description: 'Handle migrations',
      date_applied: '2026-06-01T12:00:00.000Z',
      status: 'applied',
      notes: null,
      created_at: '2026-06-01T12:00:00.000Z',
      updated_at: '2026-06-02T12:00:00.000Z',
      source: null,
      recruiter: null,
      recruiting_firm: null,
      contact_email: null,
      contact_phone: null,
      application_url: null,
    };

    expect(mapApplicationRow(row).dateApplied).toBe('2026-06-01');
  });

  it('builds the shared application request shape with defaults', () => {
    expect(
      buildApplicationRequest({
        company: 'Acme',
        jobTitle: 'Frontend Engineer',
        jobDescription: 'Build UI features',
        dateApplied: '2026-06-01',
        status: 'applied',
        notes: '',
        source: '',
        recruiter: '',
        recruitingFirm: '',
        contactEmail: '',
        contactPhone: '',
        applicationUrl: '',
      }),
    ).toEqual({
      company: 'Acme',
      jobTitle: 'Frontend Engineer',
      jobDescription: 'Build UI features',
      dateApplied: '2026-06-01',
      status: 'applied',
      notes: '',
      source: 'LinkedIn',
      recruiter: '',
      recruitingFirm: '',
      contactEmail: '',
      contactPhone: '',
      applicationUrl: '',
    });
  });

  it('builds shared Supabase payloads for create and update', () => {
    const request = {
      company: 'Acme',
      jobTitle: 'Frontend Engineer',
      jobDescription: 'Build UI features',
      dateApplied: '2026-06-01',
      status: 'applied' as const,
      notes: '',
      source: 'LinkedIn',
      recruiter: '',
      recruitingFirm: '',
      contactEmail: 'recruiter@example.com',
      contactPhone: '',
      applicationUrl: '',
    };

    const expectedPayload = {
      company: 'Acme',
      job_title: 'Frontend Engineer',
      job_description: 'Build UI features',
      date_applied: '2026-06-01',
      status: 'applied',
      notes: null,
      source: 'LinkedIn',
      recruiter: null,
      recruiting_firm: null,
      contact_email: 'recruiter@example.com',
      contact_phone: null,
      application_url: null,
    };

    expect(buildCreateApplicationPayload(request)).toEqual(expectedPayload);
    expect(buildUpdateApplicationPayload(request)).toEqual(expectedPayload);
  });
});
