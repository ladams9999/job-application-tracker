
import { FC } from "react";
import { UseFormReturn } from "react-hook-form";
import { FormValues, PreviousEntryData, PreviousEntryDataInput } from "@/types/forms";
import CompanyFields from "./form-fields/CompanyFields";
import JobDescriptionField from "./form-fields/JobDescriptionField";
import ApplicationDateAndStatusFields from "./form-fields/ApplicationDateAndStatusFields";
import SourceField from "./form-fields/SourceField";
import RecruiterFields from "./form-fields/RecruiterFields";
import NotesField from "./form-fields/NotesField";
import ContactFields from "./form-fields/ContactFields";

interface ApplicationFormFieldsProps {
  form: UseFormReturn<FormValues>;
  previousEntries?: PreviousEntryDataInput;
  showRecruiterFields?: boolean;
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
}) => {
  const safeSources = Array.isArray(previousEntries?.sources) && previousEntries.sources.length > 0
    ? previousEntries.sources
    : DEFAULT_ENTRIES.sources;

  return (
    <>
      <CompanyFields form={form} />
      
      <JobDescriptionField form={form} />
      
      <ApplicationDateAndStatusFields form={form} />
      
      <SourceField form={form} sources={safeSources} />

      {showRecruiterFields && <RecruiterFields form={form} />}

      <ContactFields form={form} />

      <NotesField form={form} />
    </>
  );
};

export default ApplicationFormFields;
