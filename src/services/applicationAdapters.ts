import { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";
import { JobApplication } from "@/types";
import { normalizeStoredDateValue } from "@/lib/date";

export interface ApplicationMutationRequest {
  company: string;
  jobTitle: string;
  jobDescription: string;
  dateApplied: string;
  status: "applied" | "interview" | "offer" | "rejected" | "withdrawn";
  notes?: string;
  source: string;
  recruiter?: string;
  recruitingFirm?: string;
  contactEmail?: string;
  contactPhone?: string;
  applicationUrl?: string;
}

export type CreateApplicationRequest = ApplicationMutationRequest;
export type UpdateApplicationRequest = ApplicationMutationRequest;

type JobApplicationRow = Tables<"job_applications">;
type JobApplicationInsert = TablesInsert<"job_applications">;
type JobApplicationUpdate = TablesUpdate<"job_applications">;

type ApplicationRequestSource = Pick<
  JobApplication,
  | "company"
  | "jobTitle"
  | "jobDescription"
  | "dateApplied"
  | "status"
  | "notes"
  | "source"
  | "recruiter"
  | "recruitingFirm"
  | "contactEmail"
  | "contactPhone"
  | "applicationUrl"
>;

const toNullableString = (value?: string) => value || null;

export const mapApplicationRow = (row: JobApplicationRow): JobApplication => ({
  id: row.id,
  company: row.company,
  jobTitle: row.job_title,
  jobDescription: row.job_description,
  dateApplied: normalizeStoredDateValue(row.date_applied),
  status: row.status,
  notes: row.notes || "",
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  source: row.source || "",
  recruiter: row.recruiter || "",
  recruitingFirm: row.recruiting_firm || "",
  contactEmail: row.contact_email || "",
  contactPhone: row.contact_phone || "",
  applicationUrl: row.application_url || "",
});

export const buildApplicationRequest = (
  application: ApplicationRequestSource,
): ApplicationMutationRequest => ({
  company: application.company,
  jobTitle: application.jobTitle,
  jobDescription: application.jobDescription,
  dateApplied: application.dateApplied,
  status: application.status,
  notes: application.notes,
  source: application.source || "LinkedIn",
  recruiter: application.recruiter,
  recruitingFirm: application.recruitingFirm,
  contactEmail: application.contactEmail,
  contactPhone: application.contactPhone,
  applicationUrl: application.applicationUrl,
});

const buildApplicationPayload = (data: ApplicationMutationRequest) => ({
  company: data.company,
  job_title: data.jobTitle,
  job_description: data.jobDescription,
  date_applied: data.dateApplied,
  status: data.status,
  notes: toNullableString(data.notes),
  source: data.source,
  recruiter: toNullableString(data.recruiter),
  recruiting_firm: toNullableString(data.recruitingFirm),
  contact_email: toNullableString(data.contactEmail),
  contact_phone: toNullableString(data.contactPhone),
  application_url: toNullableString(data.applicationUrl),
});

export const buildCreateApplicationPayload = (
  data: CreateApplicationRequest,
): JobApplicationInsert => buildApplicationPayload(data);

export const buildUpdateApplicationPayload = (
  data: UpdateApplicationRequest,
): JobApplicationUpdate => buildApplicationPayload(data);
