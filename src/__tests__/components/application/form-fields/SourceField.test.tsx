import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import SourceField from '@/components/application/form-fields/SourceField';
import { FormValues } from '@/types/forms';
import { formSchema } from '@/schemas/applicationFormSchema';

// Test wrapper component
const TestWrapper = ({ 
  sources = ["LinkedIn", "Recruiter", "Job Board"],
  defaultValue = "LinkedIn"
}: { 
  sources?: string[];
  defaultValue?: string;
}) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      company: "Test Company",
      jobTitle: "Software Developer", 
      jobDescription: "A great job",
      status: "applied",
      notes: "",
      dateApplied: new Date(),
      source: defaultValue,
      recruiter: "",
      recruitingFirm: "",
      contactEmail: "",
      contactPhone: "",
      applicationUrl: "",
    },
  });

  return (
    <Form {...form}>
      <SourceField form={form} sources={sources} />
    </Form>
  );
};

describe('SourceField', () => {
  it('renders with source label', () => {
    render(<TestWrapper />);
    
    expect(screen.getByLabelText('Source')).toBeInTheDocument();
  });

  it('renders as combobox for source selection', () => {
    render(<TestWrapper />);
    
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('displays current source value in button', () => {
    render(<TestWrapper defaultValue="Recruiter" />);
    
    expect(screen.getByText('Recruiter')).toBeInTheDocument();
  });

  it('renders with default sources when no sources provided', () => {
    render(<TestWrapper sources={[]} />);
    
    // Should still render the field
    expect(screen.getByLabelText('Source')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('accepts custom sources list', () => {
    const customSources = ["GitHub", "Twitter", "Custom Source"];
    render(<TestWrapper sources={customSources} />);
    
    // Should render without errors
    expect(screen.getByLabelText('Source')).toBeInTheDocument();
  });
});
