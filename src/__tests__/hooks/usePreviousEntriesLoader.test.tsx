
import { renderHook, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { usePreviousEntriesLoader } from '@/hooks/usePreviousEntriesLoader';
import * as applicationService from '@/services/applicationService';

// Mock the applicationService
const mockGetSuggestions = applicationService.getSuggestions as jest.MockedFunction<typeof applicationService.getSuggestions>;

jest.mock('@/services/applicationService', () => ({
  getSuggestions: jest.fn(),
}));

describe('usePreviousEntriesLoader', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should load suggestions successfully', async () => {
    const mockSuggestions = {
      companies: ['Google', 'Microsoft'],
      jobTitles: ['Developer', 'Engineer'],
      sources: ['LinkedIn', 'Recruiter']
    };

    mockGetSuggestions.mockResolvedValue(mockSuggestions);

    const { result } = renderHook(() => usePreviousEntriesLoader());

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.previousEntries).toEqual(mockSuggestions);
    expect(mockGetSuggestions).toHaveBeenCalledTimes(1);
  });

  it('should handle errors gracefully', async () => {
    mockGetSuggestions.mockRejectedValue(new Error('API Error'));

    const { result } = renderHook(() => usePreviousEntriesLoader());

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
  });

  it('should handle invalid data from API', async () => {
    const invalidSuggestions = {
      companies: null,
      jobTitles: undefined,
      sources: null
    };

    mockGetSuggestions.mockResolvedValue(invalidSuggestions);

    const { result } = renderHook(() => usePreviousEntriesLoader());

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
    const suggestionsWithEmptySources = {
      companies: ['Google'],
      jobTitles: ['Developer'],
      sources: []
    };

    mockGetSuggestions.mockResolvedValue(suggestionsWithEmptySources);

    const { result } = renderHook(() => usePreviousEntriesLoader());

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
