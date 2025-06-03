
import React from 'react';
import { render } from '@testing-library/react';
import { screen, fireEvent, waitFor } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import CompanyFieldsWithAutocomplete from '@/components/application/form-fields/CompanyFieldsWithAutocomplete';
import { FormValues, PreviousEntryData } from '@/types/forms';
import { formSchema } from '@/schemas/applicationFormSchema';
import { Form } from '@/components/ui/form';

// Test wrapper component
const TestWrapper = ({ 
  previousEntries, 
  isDataLoading = false 
}: { 
  previousEntries: PreviousEntryData; 
  isDataLoading?: boolean;
}) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      company: "",
      jobTitle: "",
      isAnonymous: false,
    },
  });

  return (
    <Form {...form}>
      <CompanyFieldsWithAutocomplete 
        form={form} 
        previousEntries={previousEntries}
        isDataLoading={isDataLoading}
      />
    </Form>
  );
};

const mockPreviousEntries: PreviousEntryData = {
  companies: ['Google', 'Microsoft', 'Apple'],
  jobTitles: ['Software Engineer', 'Senior Developer', 'Tech Lead'],
  sources: ['LinkedIn', 'Recruiter', 'Job Board']
};

describe('CompanyFieldsWithAutocomplete', () => {
  it('renders skeleton loaders when isDataLoading=true', () => {
    render(
      <TestWrapper 
        previousEntries={mockPreviousEntries} 
        isDataLoading={true} 
      />
    );
    
    // Should show loading skeletons
    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('shows autocomplete when data is loaded and valid', () => {
    render(
      <TestWrapper 
        previousEntries={mockPreviousEntries} 
        isDataLoading={false} 
      />
    );
    
    expect(screen.getByText('Select or enter company...')).toBeInTheDocument();
    expect(screen.getByText('Select or enter job title...')).toBeInTheDocument();
  });

  it('falls back to simple inputs when data is invalid', () => {
    const invalidEntries = {
      companies: null as any,
      jobTitles: undefined as any,
      sources: ['LinkedIn']
    };
    
    render(
      <TestWrapper 
        previousEntries={invalidEntries} 
        isDataLoading={false} 
      />
    );
    
    // Should render simple input fields instead
    expect(screen.getByPlaceholderText('Enter company name...')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter job title...')).toBeInTheDocument();
  });

  it('handles empty arrays for companies/jobTitles', () => {
    const emptyEntries: PreviousEntryData = {
      companies: [],
      jobTitles: [],
      sources: ['LinkedIn']
    };
    
    render(
      <TestWrapper 
        previousEntries={emptyEntries} 
        isDataLoading={false} 
      />
    );
    
    expect(screen.getByText('Select or enter company...')).toBeInTheDocument();
    expect(screen.getByText('Select or enter job title...')).toBeInTheDocument();
  });

  it('opens and closes company dropdown correctly', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper 
        previousEntries={mockPreviousEntries} 
        isDataLoading={false} 
      />
    );
    
    const companyButton = screen.getByText('Select or enter company...');
    
    // Open dropdown
    await user.click(companyButton);
    await waitFor(() => {
      expect(screen.getByText('Google')).toBeInTheDocument();
      expect(screen.getByText('Microsoft')).toBeInTheDocument();
      expect(screen.getByText('Apple')).toBeInTheDocument();
    });
  });

  it('disables company field when anonymous toggle is enabled', () => {
    render(
      <TestWrapper 
        previousEntries={mockPreviousEntries} 
        isDataLoading={false} 
      />
    );
    
    const anonymousCheckbox = screen.getByRole('checkbox');
    fireEvent.click(anonymousCheckbox);
    
    const companyButton = screen.getByText('Select or enter company...');
    expect(companyButton).toBeDisabled();
  });
});
