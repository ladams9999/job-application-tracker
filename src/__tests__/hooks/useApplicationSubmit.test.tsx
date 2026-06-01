import { renderHook, act } from '@testing-library/react';
import { useApplicationSubmit } from '@/hooks/useApplicationSubmit';
import { addApplication, updateApplication } from '@/services/applicationService';
import { FormValues } from '@/types/forms';

const mockNavigate = jest.fn();

jest.mock('@/services/applicationService', () => ({
  addApplication: jest.fn(),
  updateApplication: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

const mockAddApplication = addApplication as jest.MockedFunction<typeof addApplication>;
const mockUpdateApplication = updateApplication as jest.MockedFunction<typeof updateApplication>;

const buildFormValues = (): FormValues => ({
  company: 'Acme',
  jobTitle: 'Frontend Engineer',
  jobDescription: 'Build UI features',
  dateApplied: new Date('2026-06-01T12:00:00.000Z'),
  status: 'applied',
  notes: 'Initial application',
  source: 'LinkedIn',
  recruiter: '',
  recruitingFirm: '',
  contactEmail: 'recruiter@example.com',
  contactPhone: '555-0100',
  applicationUrl: 'https://example.com/jobs/123',
});

describe('useApplicationSubmit', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAddApplication.mockResolvedValue({
      id: 'created-id',
      ...buildFormValues(),
      dateApplied: '2026-06-01',
      createdAt: '2026-06-01T12:00:00.000Z',
      updatedAt: '2026-06-01T12:00:00.000Z',
    });
    mockUpdateApplication.mockResolvedValue({
      id: 'existing-id',
      ...buildFormValues(),
      dateApplied: '2026-06-01',
      createdAt: '2026-06-01T12:00:00.000Z',
      updatedAt: '2026-06-01T12:00:00.000Z',
    });
  });

  it('submits contact fields when creating an application', async () => {
    const { result } = renderHook(() => useApplicationSubmit(undefined));
    const formValues = buildFormValues();

    await act(async () => {
      await result.current.onSubmit(formValues);
    });

    expect(mockAddApplication).toHaveBeenCalledWith({
      company: 'Acme',
      jobTitle: 'Frontend Engineer',
      jobDescription: 'Build UI features',
      dateApplied: '2026-06-01',
      status: 'applied',
      notes: 'Initial application',
      source: 'LinkedIn',
      recruiter: undefined,
      recruitingFirm: undefined,
      contactEmail: 'recruiter@example.com',
      contactPhone: '555-0100',
      applicationUrl: 'https://example.com/jobs/123',
    });
    expect(mockNavigate).toHaveBeenCalledWith('/applications');
  });

  it('submits and preserves contact fields when editing an application', async () => {
    const { result } = renderHook(() => useApplicationSubmit('existing-id'));
    const formValues = {
      ...buildFormValues(),
      source: 'Recruiter',
      recruiter: 'Jamie Recruiter',
      recruitingFirm: 'Search Partners',
    } satisfies FormValues;

    await act(async () => {
      await result.current.onSubmit(formValues);
    });

    expect(mockUpdateApplication).toHaveBeenCalledWith({
      id: 'existing-id',
      company: 'Acme',
      jobTitle: 'Frontend Engineer',
      jobDescription: 'Build UI features',
      dateApplied: '2026-06-01',
      status: 'applied',
      notes: 'Initial application',
      source: 'Recruiter',
      recruiter: 'Jamie Recruiter',
      recruitingFirm: 'Search Partners',
      contactEmail: 'recruiter@example.com',
      contactPhone: '555-0100',
      applicationUrl: 'https://example.com/jobs/123',
      createdAt: '',
      updatedAt: '',
    });
    expect(mockNavigate).toHaveBeenCalledWith('/applications');
  });
});
