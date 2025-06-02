
import { renderHook, waitFor } from '@testing-library/react';
import { usePreviousEntriesLoader } from '@/hooks/usePreviousEntriesLoader';
import * as applicationService from '@/services/applicationService';

// Mock the service
jest.mock('@/services/applicationService');
const mockedGetSuggestions = applicationService.getSuggestions as jest.MockedFunction<typeof applicationService.getSuggestions>;

describe('usePreviousEntriesLoader', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns loading state initially', () => {
    mockedGetSuggestions.mockImplementation(() => new Promise(() => {})); // Never resolves
    
    const { result } = renderHook(() => usePreviousEntriesLoader());
    
    expect(result.current.isLoading).toBe(true);
    expect(result.current.previousEntries).toEqual({
      companies: [],
      jobTitles: [],
      sources: ["LinkedIn", "Recruiter", "Job Board", "Company Website", "Other"],
    });
  });

  it('fetches suggestions from API and sets loading to false', async () => {
    const mockSuggestions = {
      companies: ['Google', 'Microsoft'],
      jobTitles: ['Developer', 'Engineer'],
      sources: ['LinkedIn', 'Custom Source']
    };
    
    mockedGetSuggestions.mockResolvedValue(mockSuggestions);
    
    const { result } = renderHook(() => usePreviousEntriesLoader());
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    expect(result.current.previousEntries).toEqual(mockSuggestions);
    expect(mockedGetSuggestions).toHaveBeenCalledTimes(1);
  });

  it('returns default data on API failure', async () => {
    mockedGetSuggestions.mockRejectedValue(new Error('API Error'));
    
    const { result } = renderHook(() => usePreviousEntriesLoader());
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    expect(result.current.previousEntries).toEqual({
      companies: [],
      jobTitles: [],
      sources: ["LinkedIn", "Recruiter", "Job Board", "Company Website", "Other"],
    });
  });

  it('handles malformed API responses', async () => {
    const malformedResponse = {
      companies: null,
      jobTitles: 'not an array',
      sources: undefined
    };
    
    mockedGetSuggestions.mockResolvedValue(malformedResponse as any);
    
    const { result } = renderHook(() => usePreviousEntriesLoader());
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    expect(result.current.previousEntries).toEqual({
      companies: [],
      jobTitles: [],
      sources: ["LinkedIn", "Recruiter", "Job Board", "Company Website", "Other"],
    });
  });

  it('provides fallback for missing sources', async () => {
    const responseWithoutSources = {
      companies: ['Google'],
      jobTitles: ['Developer'],
      sources: []
    };
    
    mockedGetSuggestions.mockResolvedValue(responseWithoutSources);
    
    const { result } = renderHook(() => usePreviousEntriesLoader());
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    expect(result.current.previousEntries.sources).toEqual([
      "LinkedIn", "Recruiter", "Job Board", "Company Website", "Other"
    ]);
  });
});
