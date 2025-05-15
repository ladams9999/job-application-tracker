
export interface JobApplication {
  id: string;
  company: string;
  jobTitle: string;
  jobDescription: string;
  dateApplied: string;
  status: ApplicationStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type ApplicationStatus = 'applied' | 'interview' | 'offer' | 'rejected' | 'withdrawn';

export interface ApplicationFilter {
  search: string;
  status: ApplicationStatus | 'all';
  sortBy: 'dateApplied' | 'company' | 'jobTitle' | 'status';
  sortDirection: 'asc' | 'desc';
}
