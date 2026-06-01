import { renderHook, waitFor } from '@testing-library/react';
import type { UseFormReturn } from 'react-hook-form';
import { useApplicationDataLoader } from '@/hooks/useApplicationDataLoader';
import type { FormValues } from '@/types/forms';
import { applicationsApi } from '@/services/applicationsApi';
import { formatDateOnlyForStorage } from '@/lib/date';
import { createQueryClientWrapper } from '@/test-utils/queryClient';

const mockNavigate = jest.fn();
const mockReset = jest.fn();

jest.mock('@/services/applicationsApi', () => ({
  applicationsApi: {
    getApplication: jest.fn(),
  },
}));

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useLocation: () => ({ pathname: '/edit/existing-id' }),
}));

const mockGetApplication = applicationsApi.getApplication as jest.MockedFunction<typeof applicationsApi.getApplication>;

describe('useApplicationDataLoader', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('loads a stored date-only value without changing the calendar day', async () => {
    const wrapper = createQueryClientWrapper();
    mockGetApplication.mockResolvedValue({
      id: 'existing-id',
      company: 'Acme',
      jobTitle: 'Frontend Engineer',
      jobDescription: 'Build UI features',
      dateApplied: '2026-06-01',
      status: 'applied',
      notes: 'Existing application',
      source: 'LinkedIn',
      recruiter: '',
      recruitingFirm: '',
      contactEmail: 'recruiter@example.com',
      contactPhone: '555-0100',
      applicationUrl: 'https://example.com/jobs/123',
      createdAt: '2026-06-01T12:00:00.000Z',
      updatedAt: '2026-06-02T12:00:00.000Z',
    });

    const form = {
      reset: mockReset,
    } as unknown as UseFormReturn<FormValues>;

    renderHook(() => useApplicationDataLoader('existing-id', form), { wrapper });

    await waitFor(() => {
      expect(mockGetApplication).toHaveBeenCalledWith('existing-id');
      expect(mockReset).toHaveBeenCalledTimes(1);
    });

    const resetArg = mockReset.mock.calls[0][0] as FormValues;
    expect(formatDateOnlyForStorage(resetArg.dateApplied)).toBe('2026-06-01');
    expect(resetArg.contactEmail).toBe('recruiter@example.com');
    expect(resetArg.contactPhone).toBe('555-0100');
    expect(resetArg.applicationUrl).toBe('https://example.com/jobs/123');
  });
});
