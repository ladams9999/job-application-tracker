
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
}
