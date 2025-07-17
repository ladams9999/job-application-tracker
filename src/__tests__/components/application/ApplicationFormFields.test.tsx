
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ApplicationFormFields from '@/components/application/ApplicationFormFields';
import { FormValues, PreviousEntryData } from '@/types/forms';
import { formSchema } from '@/schemas/applicationFormSchema';
import { Form } from '@/components/ui/form';

// Test wrapper component
const TestWrapper = ({ 
  previousEntries, 
  enableAutocomplete = false,
  isDataLoading = false,
  showRecruiterFields = false
}: { 
  previousEntries?: PreviousEntryData; 
  enableAutocomplete?: boolean;
  isDataLoading?: boolean;
  showRecruiterFields?: boolean;
}) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      company: "",
      jobTitle: "",
      jobDescription: "",
      status: "applied",
      notes: "",
      isAnonymous: false,
      dateApplied: new Date(),
      source: "LinkedIn",
      recruiter: "",
      recruitingFirm: "",
      contactEmail: "",
      contactPhone: "",
      applicationUrl: "",
    },
  });

  return (
    <Form {...form}>
      <ApplicationFormFields 
        form={form} 
        previousEntries={previousEntries}
        enableAutocomplete={enableAutocomplete}
        isDataLoading={isDataLoading}
        showRecruiterFields={showRecruiterFields}
      />
    </Form>
  );
};

const mockPreviousEntries: PreviousEntryData = {
  companies: ['Google', 'Microsoft'],
  jobTitles: ['Developer', 'Engineer'],
  sources: ['LinkedIn', 'Recruiter']
};

describe('ApplicationFormFields', () => {
  it('renders CompanyFields when enableAutocomplete=false', () => {
    render(
      <TestWrapper 
        previousEntries={mockPreviousEntries}
        enableAutocomplete={false}
      />
    );
    
    expect(screen.getByPlaceholderText('Enter company name...')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter job title...')).toBeInTheDocument();
  });

  it('renders CompanyFieldsWithAutocomplete when enableAutocomplete=true', () => {
    render(
      <TestWrapper 
        previousEntries={mockPreviousEntries}
        enableAutocomplete={true}
      />
    );
    
    expect(screen.getByText('Select or enter company...')).toBeInTheDocument();
    expect(screen.getByText('Select or enter job title...')).toBeInTheDocument();
  });

  it('handles undefined previousEntries gracefully', () => {
    render(
      <TestWrapper 
        previousEntries={undefined}
        enableAutocomplete={true}
      />
    );
    
    // Should still render without crashing
    expect(screen.getByLabelText('Company')).toBeInTheDocument();
    expect(screen.getByLabelText('Job Title')).toBeInTheDocument();
  });

  it('creates safe default arrays for missing data', () => {
    const incompletePreviousEntries = {
      companies: null as any,
      jobTitles: undefined as any,
      sources: [] as string[]
    };
    
    render(
      <TestWrapper 
        previousEntries={incompletePreviousEntries}
        enableAutocomplete={true}
      />
    );
    
    // Should render fallback to simple inputs
    expect(screen.getByPlaceholderText('Enter company name...')).toBeInTheDocument();
  });

  it('maintains default sources when missing', () => {
    const entriesWithoutSources = {
      companies: ['Google'],
      jobTitles: ['Developer'],
      sources: [] as string[]
    };
    
    render(
      <TestWrapper 
        previousEntries={entriesWithoutSources}
      />
    );
    
    // Should still render source field with default options
    expect(screen.getByLabelText('Source')).toBeInTheDocument();
  });

  it('renders all required form fields', () => {
    render(
      <TestWrapper 
        previousEntries={mockPreviousEntries}
      />
    );
    
    expect(screen.getByLabelText('Company')).toBeInTheDocument();
    expect(screen.getByLabelText('Job Title')).toBeInTheDocument();
    expect(screen.getByLabelText('Job Description')).toBeInTheDocument();
    expect(screen.getByLabelText('Date Applied')).toBeInTheDocument();
    expect(screen.getByLabelText('Status')).toBeInTheDocument();
    expect(screen.getByLabelText('Source')).toBeInTheDocument();
    expect(screen.getByLabelText('Notes')).toBeInTheDocument();
    expect(screen.getByLabelText('Contact Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Contact Phone')).toBeInTheDocument();
    expect(screen.getByLabelText('Application URL')).toBeInTheDocument();
  });

  it('conditionally shows recruiter fields', () => {
    render(
      <TestWrapper 
        previousEntries={mockPreviousEntries}
        showRecruiterFields={true}
      />
    );
    
    expect(screen.getByLabelText('Recruiter Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Recruiting Firm')).toBeInTheDocument();
  });

  it('hides recruiter fields by default', () => {
    render(
      <TestWrapper 
        previousEntries={mockPreviousEntries}
        showRecruiterFields={false}
      />
    );
    
    expect(screen.queryByLabelText('Recruiter Name')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Recruiting Firm')).not.toBeInTheDocument();
  });
});
