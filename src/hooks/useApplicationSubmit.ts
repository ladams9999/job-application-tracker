
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/sonner";
import { FormValues } from "@/types/forms";
import { addApplication, updateApplication } from "@/services/applicationService";
import { formatDateOnlyForStorage } from "@/lib/date";
import { applicationQueryKeys } from "@/hooks/useApplicationQueries";

export const useApplicationSubmit = (id: string | undefined) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditMode = !!id;

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      
      if (isEditMode && id) {
        await updateApplication({
          id,
          company: data.company,
          jobTitle: data.jobTitle,
          jobDescription: data.jobDescription,
          dateApplied: formatDateOnlyForStorage(data.dateApplied),
          status: data.status,
          notes: data.notes,
          source: data.source,
          recruiter: data.source === "Recruiter" ? data.recruiter : undefined,
          recruitingFirm: data.source === "Recruiter" ? data.recruitingFirm : undefined,
          contactEmail: data.contactEmail,
          contactPhone: data.contactPhone,
          applicationUrl: data.applicationUrl,
          createdAt: "", // These will be preserved by updateApplication
          updatedAt: "",
        });
      } else {
        await addApplication({
          company: data.company,
          jobTitle: data.jobTitle,
          jobDescription: data.jobDescription,
          dateApplied: formatDateOnlyForStorage(data.dateApplied),
          status: data.status,
          notes: data.notes,
          source: data.source,
          recruiter: data.source === "Recruiter" ? data.recruiter : undefined,
          recruitingFirm: data.source === "Recruiter" ? data.recruitingFirm : undefined,
          contactEmail: data.contactEmail,
          contactPhone: data.contactPhone,
          applicationUrl: data.applicationUrl,
        });
      }

      await queryClient.invalidateQueries({ queryKey: applicationQueryKeys.all });
       
      navigate("/applications");
    } catch (error) {
      console.error("Error saving application:", error);
      toast.error(isEditMode ? "Failed to update application" : "Failed to add application");
    } finally {
      setIsSubmitting(false);
    }
  };

  return { isSubmitting, onSubmit };
};
