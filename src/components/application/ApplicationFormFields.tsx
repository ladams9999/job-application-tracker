
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
  sources: ["LinkedIn", "Recruiter", "Job Board", "Company Website", "Other"],
};

const ApplicationFormFields: FC<ApplicationFormFieldsProps> = ({ 
  form, 
  previousEntries, 
  showRecruiterFields = false,
  isDataLoading = false,
  enableAutocomplete = false
}) => {
  // Only sanitize the sources array so CompanyFieldsWithAutocomplete can
  // determine if it should fall back to simple inputs when the companies or
  // jobTitles arrays are invalid. This preserves `null`/`undefined` values for
  // those fields passed in from the loader.
  const safeSources = Array.isArray(previousEntries?.sources) && previousEntries.sources.length > 0
    ? previousEntries.sources
    : DEFAULT_ENTRIES.sources;

  const fallbackEntries = DEFAULT_ENTRIES;

  // Use the original previousEntries for the autocomplete component.  It may be
  // undefined or contain invalid data which allows the component to gracefully
  // render simple inputs instead of autocomplete fields when appropriate.
  const autocompleteEntries = previousEntries as any;

  console.log("ApplicationFormFields render:", {
    enableAutocomplete,
    isDataLoading,
    previousEntries,
  });

  return (
    <>
      <ErrorBoundary
        fallback={<CompanyFields form={form} previousEntries={fallbackEntries} />}
        onError={(error) => console.error("CompanyFields error:", error)}
      >
        {enableAutocomplete ? (
          <CompanyFieldsWithAutocomplete
            form={form}
            previousEntries={autocompleteEntries}
            isDataLoading={isDataLoading}
          />
        ) : (
          <CompanyFields form={form} previousEntries={fallbackEntries} />
        )}
      </ErrorBoundary>
      
      <JobDescriptionField form={form} />
      
      <ApplicationDateAndStatusFields form={form} />
      
      <SourceField form={form} sources={safeSources} />

      {showRecruiterFields && <RecruiterFields form={form} />}
      
      <NotesField form={form} />
    </>
  );
};

export default ApplicationFormFields;
