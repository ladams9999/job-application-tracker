
import { z } from "zod";

export const formSchema = z.object({
  company: z.string().min(1, { message: "Company name is required" }),
  jobTitle: z.string().min(1, { message: "Job title is required" }),
  jobDescription: z.string().min(1, { message: "Job description is required" }),
  dateApplied: z.date({
    required_error: "Date applied is required",
    invalid_type_error: "Please select a valid date",
  }).refine(date => date <= new Date(), {
    message: "Date cannot be in the future",
  }),
  status: z.enum([
    "applied",
    "interview", 
    "offer",
    "rejected",
    "withdrawn",
  ] as const),
  notes: z.string().optional(),
  source: z.string().min(1, { message: "Source is required" }),
  recruiter: z.string().optional()
    .refine(val => {
      // When source is 'Recruiter', recruiter is required
      return true;
    }, { 
      message: "Recruiter name is required when source is Recruiter", 
    }),
  recruitingFirm: z.string().optional()
    .refine(val => {
      // When source is 'Recruiter', recruiting firm is required
      return true;
    }, {
      message: "Recruiting firm is required when source is Recruiter",
    }),
  contactEmail: z.string().email({ message: "Invalid email" }).optional(),
  contactPhone: z.string().optional(),
  applicationUrl: z.string().url({ message: "Invalid URL" }).optional()
}).refine((data) => {
  // When source is 'Recruiter', both recruiter and recruitingFirm must be provided
  if (data.source === "Recruiter") {
    return !!data.recruiter && !!data.recruitingFirm;
  }
  return true;
}, {
  message: "Recruiter and recruiting firm are required when source is Recruiter",
  path: ["recruiter"], // Show error on the recruiter field
});
