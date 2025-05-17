
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import { FormValues } from "@/types/forms";
import { addApplication, updateApplication } from "@/services/applicationService";

export const useApplicationSubmit = (id: string | undefined) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const isEditMode = !!id;

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      
      // If anonymous is selected, use "Anonymous" as the company name
      const companyName = data.isAnonymous ? "Anonymous" : data.company;
      
      if (isEditMode && id) {
        await updateApplication({
          id,
          company: companyName,
          jobTitle: data.jobTitle,
          jobDescription: data.jobDescription,
          dateApplied: data.dateApplied.toISOString(),
          status: data.status,
          notes: data.notes,
          source: data.source,
          recruiter: data.source === "Recruiter" ? data.recruiter : undefined,
          recruitingFirm: data.source === "Recruiter" ? data.recruitingFirm : undefined,
          createdAt: "", // These will be preserved by updateApplication
          updatedAt: "",
        });
        toast.success("Application successfully updated!");
      } else {
        await addApplication({
          company: companyName,
          jobTitle: data.jobTitle,
          jobDescription: data.jobDescription,
          dateApplied: data.dateApplied.toISOString(),
          status: data.status,
          notes: data.notes,
          source: data.source,
          recruiter: data.source === "Recruiter" ? data.recruiter : undefined,
          recruitingFirm: data.source === "Recruiter" ? data.recruitingFirm : undefined,
        });
        toast.success("Application successfully added!");
      }
      
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
