
import { FC } from "react";
import { UseFormReturn } from "react-hook-form";
import { FormValues, PreviousEntryData } from "@/types/forms";
import CompanyFields from "./form-fields/CompanyFields";
import CompanyFieldsWithAutocomplete from "./form-fields/CompanyFieldsWithAutocomplete";
import ErrorBoundary from "./form-fields/ErrorBoundary";
import JobDescriptionField from "./form-fields/JobDescriptionField";
import ApplicationDateAndStatusFields from "./form-fields/ApplicationDateAndStatusFields";
import SourceField from "./form-fields/SourceField";
import RecruiterFields from "./form-fields/RecruiterFields";
import NotesField from "./form-fields/NotesField";

interface ApplicationFormFieldsProps {
  form: UseFormReturn<FormValues>;
  previousEntries?: PreviousEntryData;
  showRecruiterFields?: boolean;
  isDataLoading?: boolean;
  enableAutocomplete?: boolean;
}

const DEFAULT_ENTRIES: PreviousEntryData = {
  companies: [],
  jobTitles: [],
  sources: ["LinkedIn", "Recruiter", "Job Board", "Company Website", "Other"]
};

const ApplicationFormFields: FC<ApplicationFormFieldsProps> = ({ 
  form, 
  previousEntries, 
  showRecruiterFields = false,
  isDataLoading = false,
  enableAutocomplete = false
}) => {
  // Ensure previousEntries properties are always valid objects with arrays
  const safeEntries: PreviousEntryData = {
    companies: Array.isArray(previousEntries?.companies) ? previousEntries.companies : DEFAULT_ENTRIES.companies,
    jobTitles: Array.isArray(previousEntries?.jobTitles) ? previousEntries.jobTitles : DEFAULT_ENTRIES.jobTitles,
    sources: Array.isArray(previousEntries?.sources) && previousEntries.sources.length > 0 
      ? previousEntries.sources 
      : DEFAULT_ENTRIES.sources
  };

  console.log("ApplicationFormFields render:", { enableAutocomplete, isDataLoading, safeEntries });

  return (
    <>
      <ErrorBoundary
        fallback={<CompanyFields form={form} previousEntries={safeEntries} />}
        onError={(error) => console.error("CompanyFields error:", error)}
      >
        {enableAutocomplete ? (
          <CompanyFieldsWithAutocomplete 
            form={form} 
            previousEntries={safeEntries}
            isDataLoading={isDataLoading}
          />
        ) : (
          <CompanyFields form={form} previousEntries={safeEntries} />
        )}
      </ErrorBoundary>
      
      <JobDescriptionField form={form} />
      
      <ApplicationDateAndStatusFields form={form} />
      
      <SourceField form={form} sources={safeEntries.sources} />

      {showRecruiterFields && <RecruiterFields form={form} />}
      
      <NotesField form={form} />
    </>
  );
};

export default ApplicationFormFields;
