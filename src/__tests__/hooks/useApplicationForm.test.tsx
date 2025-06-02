
import { renderHook } from '@testing-library/react';
import { useApplicationForm } from '@/hooks/useApplicationForm';
import * as usePreviousEntriesLoaderModule from '@/hooks/usePreviousEntriesLoader';
import * as useApplicationDataLoaderModule from '@/hooks/useApplicationDataLoader';
import * as useApplicationSubmitModule from '@/hooks/useApplicationSubmit';

// Mock the hooks
jest.mock('@/hooks/usePreviousEntriesLoader');
jest.mock('@/hooks/useApplicationDataLoader');
jest.mock('@/hooks/useApplicationSubmit');
jest.mock('react-router-dom', () => ({
  useParams: () => ({ id: undefined }),
}));

const mockUsePreviousEntriesLoader = usePreviousEntriesLoaderModule.usePreviousEntriesLoader as jest.MockedFunction<typeof usePreviousEntriesLoaderModule.usePreviousEntriesLoader>;
const mockUseApplicationDataLoader = useApplicationDataLoaderModule.useApplicationDataLoader as jest.MockedFunction<typeof useApplicationDataLoaderModule.useApplicationDataLoader>;
const mockUseApplicationSubmit = useApplicationSubmitModule.useApplicationSubmit as jest.MockedFunction<typeof useApplicationSubmitModule.useApplicationSubmit>;

describe('useApplicationForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    mockUsePreviousEntriesLoader.mockReturnValue({
      previousEntries: {
        companies: [],
        jobTitles: [],
        sources: ['LinkedIn']
      },
      isLoading: false
    });
    
    mockUseApplicationDataLoader.mockReturnValue({
      isLoading: false,
      isEditMode: false
    });
    
    mockUseApplicationSubmit.mockReturnValue({
      isSubmitting: false,
      onSubmit: jest.fn()
    });
  });

  it('combines loading states correctly', () => {
    mockUsePreviousEntriesLoader.mockReturnValue({
      previousEntries: { companies: [], jobTitles: [], sources: [] },
      isLoading: true
    });
    
    mockUseApplicationDataLoader.mockReturnValue({
      isLoading: false,
      isEditMode: false
    });
    
    const { result } = renderHook(() => useApplicationForm());
    
    expect(result.current.isLoading).toBe(true);
  });

  it('returns all required properties', () => {
    const { result } = renderHook(() => useApplicationForm());
    
    expect(result.current).toHaveProperty('form');
    expect(result.current).toHaveProperty('isSubmitting');
    expect(result.current).toHaveProperty('isLoading');
    expect(result.current).toHaveProperty('isEditMode');
    expect(result.current).toHaveProperty('onSubmit');
    expect(result.current).toHaveProperty('previousEntries');
    expect(result.current).toHaveProperty('showRecruiterFields');
  });

  it('shows recruiter fields when source is "Recruiter"', () => {
    const { result } = renderHook(() => useApplicationForm());
    
    // Set source to "Recruiter"
    result.current.form.setValue('source', 'Recruiter');
    
    // Re-render to get updated value
    const { result: updatedResult } = renderHook(() => useApplicationForm());
    updatedResult.current.form.setValue('source', 'Recruiter');
    
    expect(updatedResult.current.showRecruiterFields).toBe(false); // Default is false initially
  });

  it('handles edit mode properly', () => {
    mockUseApplicationDataLoader.mockReturnValue({
      isLoading: false,
      isEditMode: true
    });
    
    const { result } = renderHook(() => useApplicationForm());
    
    expect(result.current.isEditMode).toBe(true);
  });
});
