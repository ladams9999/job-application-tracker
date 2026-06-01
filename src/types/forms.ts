
import { ApplicationStatus } from "./index";

export type { ApplicationStatus } from "./index";

export interface FormValues {
  company: string;
  jobTitle: string;
  jobDescription: string;
  dateApplied: Date;
  status: ApplicationStatus;
  notes?: string;
  source: string;
  recruiter?: string;
  recruitingFirm?: string;
  contactEmail?: string;
  contactPhone?: string;
  applicationUrl?: string;
}

export interface PreviousEntryData {
  companies: string[];
  jobTitles: string[];
  sources: string[];
}

export interface PreviousEntryDataInput {
  companies?: string[] | null;
  jobTitles?: string[] | null;
  sources?: string[] | null;
}
