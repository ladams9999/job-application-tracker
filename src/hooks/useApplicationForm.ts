
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "@/components/ui/sonner";
import { ApplicationStatus, FormValues } from "@/types/forms";
import { addApplication, updateApplication, getAllApplications } from "@/services/applicationService";

export const formSchema = z.object({
  company: z.string().min(1, { message: "Company name is required" }),
  jobTitle: z.string().min(1, { message: "Job title is required" }),
  jobDescription: z.string(),
  dateApplied: z.date({
    required_error: "Date applied is required",
  }),
  status: z.enum(["applied", "interview", "offer", "rejected", "withdrawn"] as const),
  notes: z.string().optional(),
  isAnonymous: z.boolean().default(false),
});

export const useApplicationForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      company: "",
      jobTitle: "",
      jobDescription: "",
      status: "applied" as ApplicationStatus,
      notes: "",
      isAnonymous: false,
    },
  });

  // Load application data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      setIsLoading(true);
      const applications = getAllApplications();
      const application = applications.find(app => app.id === id);
      
      if (application) {
        // Check if it's an anonymous application
        const isAnonymous = application.company === "Anonymous";
        
        form.reset({
          company: application.company,
          jobTitle: application.jobTitle,
          jobDescription: application.jobDescription,
          dateApplied: new Date(application.dateApplied),
          status: application.status,
          notes: application.notes || "",
          isAnonymous: isAnonymous,
        });
      } else {
        toast.error("Application not found");
        navigate("/applications");
      }
      setIsLoading(false);
    }
  }, [id, isEditMode, form, navigate]);

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

  return {
    form,
    isSubmitting,
    isLoading,
    isEditMode,
    onSubmit
  };
};
