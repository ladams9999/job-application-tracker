
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { UseFormReturn } from "react-hook-form";
import { toast } from "@/components/ui/sonner";
import { FormValues } from "@/types/forms";
import { parseDateOnly } from "@/lib/date";
import { useApplicationQuery } from "@/hooks/useApplicationQueries";

export const useApplicationDataLoader = (
  id: string | undefined, 
  form: UseFormReturn<FormValues>
) => {
  const navigate = useNavigate();
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

  useEffect(() => {
    if (!isEditMode || !applicationQuery.isError) {
      return;
    }

    toast.error("Failed to load application");
    navigate("/applications");
  }, [applicationQuery.isError, isEditMode, navigate]);

  return { isLoading: applicationQuery.isLoading, isEditMode };
};
