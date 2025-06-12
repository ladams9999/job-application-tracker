
import { renderHook, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useApplicationForm } from '@/hooks/useApplicationForm';
import * as usePreviousEntriesLoader from '@/hooks/usePreviousEntriesLoader';
import * as useApplicationDataLoader from '@/hooks/useApplicationDataLoader';
import * as useApplicationSubmit from '@/hooks/useApplicationSubmit';

// Mock the hooks
const mockUsePreviousEntriesLoader = usePreviousEntriesLoader.usePreviousEntriesLoader as jest.MockedFunction<typeof usePreviousEntriesLoader.usePreviousEntriesLoader>;
const mockUseApplicationDataLoader = useApplicationDataLoader.useApplicationDataLoader as jest.MockedFunction<typeof useApplicationDataLoader.useApplicationDataLoader>;
const mockUseApplicationSubmit = useApplicationSubmit.useApplicationSubmit as jest.MockedFunction<typeof useApplicationSubmit.useApplicationSubmit>;

jest.mock('@/hooks/usePreviousEntriesLoader');
jest.mock('@/hooks/useApplicationDataLoader');
jest.mock('@/hooks/useApplicationSubmit');
jest.mock('react-router-dom', () => ({
  useParams: () => ({ id: undefined }),
}));

describe('useApplicationForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Default mock implementations
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

  it('should return form state correctly', () => {
    const { result } = renderHook(() => useApplicationForm());

    expect(result.current.form).toBeDefined();
    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isEditMode).toBe(false);
    expect(result.current.onSubmit).toBeDefined();
    expect(result.current.previousEntries).toBeDefined();
    expect(result.current.showRecruiterFields).toBe(false);
  });

  it('should show recruiter fields when source is Recruiter', () => {
    const { result } = renderHook(() => useApplicationForm());

    // Set the source to "Recruiter" and trigger a re-render
    act(() => {
      result.current.form.setValue('source', 'Recruiter');
    });

    expect(result.current.showRecruiterFields).toBe(true);
  });

  it('should handle loading states correctly', () => {
    mockUsePreviousEntriesLoader.mockReturnValue({
      previousEntries: {
        companies: [],
        jobTitles: [],
        sources: []
      },
      isLoading: true
    });
    
    mockUseApplicationDataLoader.mockReturnValue({
      isLoading: true,
      isEditMode: false
    });

    const { result } = renderHook(() => useApplicationForm());

    expect(result.current.isLoading).toBe(true);
  });

  it('should handle edit mode correctly', () => {
    mockUseApplicationDataLoader.mockReturnValue({
      isLoading: false,
      isEditMode: true
    });

    const { result } = renderHook(() => useApplicationForm());

    expect(result.current.isEditMode).toBe(true);
  });
});
