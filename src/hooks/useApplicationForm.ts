
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "react-router-dom";
import { FormValues } from "@/types/forms";
import { formSchema } from "@/schemas/applicationFormSchema";
import { usePreviousEntriesLoader } from "@/hooks/usePreviousEntriesLoader";
import { useApplicationDataLoader } from "@/hooks/useApplicationDataLoader";
import { useApplicationSubmit } from "@/hooks/useApplicationSubmit";

export { formSchema } from "@/schemas/applicationFormSchema";

export const useApplicationForm = () => {
  const { id } = useParams<{ id: string }>();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      company: "",
      jobTitle: "",
      jobDescription: "",
      status: "applied",
      notes: "",
      isAnonymous: false,
      dateApplied: new Date(), // Default to current date
      source: "LinkedIn", // Default source
      recruiter: "",
      recruitingFirm: "",
    },
  });

  // Watch the source field to conditionally show recruiter fields
  const source = form.watch("source") || "LinkedIn";
  
  const previousEntries = usePreviousEntriesLoader();
  const { isLoading, isEditMode } = useApplicationDataLoader(id, form);
  const { isSubmitting, onSubmit } = useApplicationSubmit(id);

  return {
    form,
    isSubmitting,
    isLoading,
    isEditMode,
    onSubmit,
    previousEntries,
    showRecruiterFields: source === "Recruiter"
  };
};
