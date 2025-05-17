
import { ApplicationStatus } from "./index";

export type { ApplicationStatus } from "./index";

export interface FormValues {
  company: string;
  jobTitle: string;
  jobDescription: string;
  dateApplied: Date;
  status: ApplicationStatus;
  notes?: string;
  isAnonymous: boolean;
  source: string;
  recruiter?: string;
  recruitingFirm?: string;
}

export interface PreviousEntryData {
  companies: string[];
  jobTitles: string[];
  sources: string[];
}
