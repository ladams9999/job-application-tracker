
import { FC } from "react";
import { UseFormReturn } from "react-hook-form";
import { FormValues, PreviousEntryData } from "@/types/forms";
import CompanyFields from "./form-fields/CompanyFields";
import JobDescriptionField from "./form-fields/JobDescriptionField";
import ApplicationDateAndStatusFields from "./form-fields/ApplicationDateAndStatusFields";
import SourceField from "./form-fields/SourceField";
import RecruiterFields from "./form-fields/RecruiterFields";
import NotesField from "./form-fields/NotesField";

interface ApplicationFormFieldsProps {
  form: UseFormReturn<FormValues>;
  previousEntries?: PreviousEntryData;
  showRecruiterFields?: boolean;
}

const ApplicationFormFields: FC<ApplicationFormFieldsProps> = ({ 
  form, 
  previousEntries, 
  showRecruiterFields = false 
}) => {
  // Ensure previousEntries properties are always arrays even if undefined
  const safeEntries: PreviousEntryData = {
    companies: Array.isArray(previousEntries?.companies) ? previousEntries.companies : [],
    jobTitles: Array.isArray(previousEntries?.jobTitles) ? previousEntries.jobTitles : [],
    sources: Array.isArray(previousEntries?.sources) ? previousEntries.sources : ["LinkedIn", "Recruiter", "Job Board", "Company Website", "Other"]
  };

  return (
    <>
      <CompanyFields form={form} previousEntries={safeEntries} />
      
      <JobDescriptionField form={form} />
      
      <ApplicationDateAndStatusFields form={form} />
      
      <SourceField form={form} sources={safeEntries.sources} />

      {showRecruiterFields && <RecruiterFields form={form} />}
      
      <NotesField form={form} />
    </>
  );
};

export default ApplicationFormFields;
