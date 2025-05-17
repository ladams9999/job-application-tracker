
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UseFormReturn } from "react-hook-form";
import { toast } from "@/components/ui/sonner";
import { FormValues } from "@/types/forms";
import { getAllApplications } from "@/services/applicationService";

export const useApplicationDataLoader = (
  id: string | undefined, 
  form: UseFormReturn<FormValues>
) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const isEditMode = !!id;

  useEffect(() => {
    if (isEditMode) {
      setIsLoading(true);
      try {
        const applications = getAllApplications();
        const application = applications.find(app => app.id === id);
        
        if (application) {
          // Check if it's an anonymous application
          const isAnonymous = application.company === "Anonymous";
          
          form.reset({
            company: application.company || "",
            jobTitle: application.jobTitle || "",
            jobDescription: application.jobDescription || "",
            dateApplied: new Date(application.dateApplied),
            status: application.status,
            notes: application.notes || "",
            isAnonymous: isAnonymous,
            source: application.source || "LinkedIn",
            recruiter: application.recruiter || "",
            recruitingFirm: application.recruitingFirm || "",
          });
        } else {
          toast.error("Application not found");
          navigate("/applications");
        }
      } catch (error) {
        console.error("Error loading application:", error);
        toast.error("Failed to load application");
        navigate("/applications");
      } finally {
        setIsLoading(false);
      }
    }
  }, [id, isEditMode, form, navigate]);

  return { isLoading, isEditMode };
};
