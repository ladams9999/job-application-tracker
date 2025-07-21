import { formSchema } from '@/schemas/applicationFormSchema';
import { z } from 'zod';

describe('Contact Email Validation', () => {
  const createTestData = (contactEmail?: string) => ({
    company: 'Test Company',
    jobTitle: 'Software Developer',
    jobDescription: 'A great job',
    dateApplied: new Date('2025-01-15'),
    status: 'applied' as const,
    notes: 'Some notes',
    source: 'LinkedIn',
    recruiter: '',
    recruitingFirm: '',
    contactEmail,
    contactPhone: '',
    applicationUrl: '', // Test that empty strings work for URLs too
  });

  it('should accept empty string for contact email', () => {
    const data = createTestData('');
    const result = formSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it('should accept undefined for contact email', () => {
    const data = createTestData(undefined);
    const result = formSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it('should accept valid email addresses', () => {
    const data = createTestData('john.doe@example.com');
    const result = formSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it('should accept non-email text for contact email', () => {
    const data = createTestData('Ask HR department');
    const result = formSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it('should accept contact instructions in email field', () => {
    const data = createTestData('Contact through LinkedIn');
    const result = formSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it('should accept partial or malformed emails', () => {
    const data = createTestData('john@');
    const result = formSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it('should accept phone numbers in email field', () => {
    const data = createTestData('555-1234');
    const result = formSchema.safeParse(data);
    expect(result.success).toBe(true);
  });
});
