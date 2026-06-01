
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "@/types/forms";
import { parseDateOnly } from "@/lib/date";
import { useApplicationQuery } from "@/hooks/useApplicationQueries";
import { normalizeAppError } from "@/lib/appError";

export const useApplicationDataLoader = (
  id: string | undefined, 
  form: UseFormReturn<FormValues>
) => {
  const location = useLocation();
  const isEditMode = !!id;
  const applicationQuery = useApplicationQuery(id);

  // Reset form to defaults when switching to add mode or when route changes
  useEffect(() => {
    if (!isEditMode && location.pathname === "/add") {
      form.reset({
        company: "",
        jobTitle: "",
        jobDescription: "",
        status: "applied",
        notes: "",
        dateApplied: new Date(),
        source: "LinkedIn",
        recruiter: "",
        recruitingFirm: "",
        contactEmail: "",
        contactPhone: "",
        applicationUrl: "",
      });
    }
  }, [isEditMode, location.pathname, form]);

  useEffect(() => {
    if (!applicationQuery.data) {
      return;
    }
    const application = applicationQuery.data;

    form.reset({
      company: application.company || "",
      jobTitle: application.jobTitle || "",
      jobDescription: application.jobDescription || "",
      dateApplied: parseDateOnly(application.dateApplied),
      status: application.status,
      notes: application.notes || "",
      source: application.source || "LinkedIn",
      recruiter: application.recruiter || "",
      recruitingFirm: application.recruitingFirm || "",
      contactEmail: application.contactEmail || "",
      contactPhone: application.contactPhone || "",
      applicationUrl: application.applicationUrl || "",
    });
  }, [applicationQuery.data, form]);

  const loadError =
    isEditMode && applicationQuery.error
      ? normalizeAppError(applicationQuery.error, {
          operation: "load application",
          recordId: id,
        })
      : null;

  return {
    isLoading: applicationQuery.isLoading,
    isEditMode,
    loadError,
    retryLoad: applicationQuery.refetch,
  };
};
