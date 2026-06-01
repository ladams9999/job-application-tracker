
import { renderHook, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { usePreviousEntriesLoader } from '@/hooks/usePreviousEntriesLoader';
import { applicationsApi } from '@/services/applicationsApi';
import { createQueryClientWrapper } from '@/test-utils/queryClient';

const mockGetSuggestions = applicationsApi.getSuggestions as jest.MockedFunction<typeof applicationsApi.getSuggestions>;

jest.mock('@/services/applicationsApi', () => ({
  applicationsApi: {
    getSuggestions: jest.fn(),
  },
}));

describe('usePreviousEntriesLoader', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should load suggestions successfully', async () => {
    const wrapper = createQueryClientWrapper();
    const mockSuggestions = {
      companies: ['Google', 'Microsoft'],
      jobTitles: ['Developer', 'Engineer'],
      sources: ['LinkedIn', 'Recruiter']
    };

    mockGetSuggestions.mockResolvedValue(mockSuggestions);

    const { result } = renderHook(() => usePreviousEntriesLoader(), { wrapper });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.previousEntries).toEqual(mockSuggestions);
    expect(mockGetSuggestions).toHaveBeenCalledTimes(1);
  });

  it('should handle errors gracefully', async () => {
    const wrapper = createQueryClientWrapper();
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    try {
      mockGetSuggestions.mockRejectedValue(new Error('API Error'));

      const { result } = renderHook(() => usePreviousEntriesLoader(), { wrapper });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Should return default values on error
      expect(result.current.previousEntries).toEqual({
        companies: [],
        jobTitles: [],
        sources: ["LinkedIn", "Recruiter", "Job Board", "Company Website", "Other"],
      });
    } finally {
      consoleErrorSpy.mockRestore();
    }
  });

  it('should handle invalid data from API', async () => {
    const wrapper = createQueryClientWrapper();
    const invalidSuggestions = {
      companies: null,
      jobTitles: undefined,
      sources: null
    };

    mockGetSuggestions.mockResolvedValue(invalidSuggestions);

    const { result } = renderHook(() => usePreviousEntriesLoader(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Should convert invalid data to safe defaults
    expect(result.current.previousEntries).toEqual({
      companies: [],
      jobTitles: [],
      sources: ["LinkedIn", "Recruiter", "Job Board", "Company Website", "Other"],
    });
  });

  it('should handle empty sources array', async () => {
    const wrapper = createQueryClientWrapper();
    const suggestionsWithEmptySources = {
      companies: ['Google'],
      jobTitles: ['Developer'],
      sources: []
    };

    mockGetSuggestions.mockResolvedValue(suggestionsWithEmptySources);

    const { result } = renderHook(() => usePreviousEntriesLoader(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Should use default sources when sources array is empty
    expect(result.current.previousEntries).toEqual({
      companies: ['Google'],
      jobTitles: ['Developer'],
      sources: ["LinkedIn", "Recruiter", "Job Board", "Company Website", "Other"],
    });
  });
});
