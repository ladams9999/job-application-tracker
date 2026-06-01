import { extractUniqueValues, filterApplicationsBySearch } from '@/services/applicationQueryUtils';
import type { JobApplication } from '@/types';

const buildApplication = (overrides: Partial<JobApplication> = {}): JobApplication => ({
  id: 'app-1',
  company: 'Acme, Inc.',
  jobTitle: 'Frontend Engineer (React)',
  jobDescription: 'Build UI features',
  dateApplied: '2026-06-01',
  status: 'applied',
  notes: '',
  createdAt: '2026-06-01T12:00:00.000Z',
  updatedAt: '2026-06-01T12:00:00.000Z',
  source: 'LinkedIn',
  recruiter: '',
  recruitingFirm: '',
  contactEmail: '',
  contactPhone: '',
  applicationUrl: '',
  ...overrides,
});

describe('applicationQueryUtils', () => {
  it('matches search text literally even with punctuation-heavy input', () => {
    const applications = [
      buildApplication(),
      buildApplication({
        id: 'app-2',
        company: 'Example Corp',
        jobTitle: 'Backend Engineer',
      }),
    ];

    expect(filterApplicationsBySearch(applications, 'Acme, Inc.')).toEqual([applications[0]]);
    expect(filterApplicationsBySearch(applications, 'Frontend Engineer (React)')).toEqual([
      applications[0],
    ]);
    expect(filterApplicationsBySearch(applications, 'missing')).toEqual([]);
  });

  it('deduplicates extracted suggestion values and skips blank entries', () => {
    const rows = [
      { company: 'Acme' },
      { company: 'Acme' },
      { company: '  Example Corp  ' },
      { company: '' },
      { company: null },
    ];

    expect(extractUniqueValues(rows, (row) => row.company)).toEqual(['Acme', 'Example Corp']);
  });
});
