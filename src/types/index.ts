
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
  source?: string;
  recruiter?: string;
  recruitingFirm?: string;
  contactEmail?: string;
  contactPhone?: string;
  applicationUrl?: string;
}

export type ApplicationStatus =
  | 'applied'
  | 'interview'
  | 'offer'
  | 'rejected'
  | 'withdrawn';

export type DashboardApplicationView =
  | 'all'
  | 'this-week'
  | 'active'
  | 'dormant'
  | 'silent';

export interface ApplicationFilter {
  search: string;
  status: ApplicationStatus | 'all';
  sortBy: 'dateApplied' | 'company' | 'jobTitle' | 'status';
  sortDirection: 'asc' | 'desc';
  view: DashboardApplicationView;
}
