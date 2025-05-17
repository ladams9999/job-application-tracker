import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "@/components/ui/sonner";
import { ApplicationStatus, FormValues, PreviousEntryData } from "@/types/forms";
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
  source: z.string().min(1, { message: "Source is required" }),
  recruiter: z.string().optional()
    .refine(val => {
      // When source is 'Recruiter', recruiter is required
      return true;
    }, { 
      message: "Recruiter name is required when source is Recruiter", 
    }),
  recruitingFirm: z.string().optional()
    .refine(val => {
      // When source is 'Recruiter', recruiting firm is required
      return true;
    }, {
      message: "Recruiting firm is required when source is Recruiter",
    })
}).refine((data) => {
  // When source is 'Recruiter', both recruiter and recruitingFirm must be provided
  if (data.source === "Recruiter") {
    return !!data.recruiter && !!data.recruitingFirm;
  }
  return true;
}, {
  message: "Recruiter and recruiting firm are required when source is Recruiter",
  path: ["recruiter"], // Show error on the recruiter field
});

export const useApplicationForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [previousEntries, setPreviousEntries] = useState<PreviousEntryData>({
    companies: [],
    jobTitles: [],
    sources: ["LinkedIn", "Recruiter", "Job Board", "Company Website", "Other"],
  });
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
      dateApplied: new Date(), // Default to current date
      source: "LinkedIn", // Default source
      recruiter: "",
      recruitingFirm: "",
    },
  });

  // Watch the source field to conditionally show recruiter fields
  const source = form.watch("source");
  
  // Load unique previous entries
  useEffect(() => {
    const loadPreviousEntries = () => {
      try {
        const applications = getAllApplications();
        if (!applications || applications.length === 0) {
          // If no applications exist, keep the default values
          return;
        }

        const companies = [...new Set(applications.map(app => app.company))];
        const jobTitles = [...new Set(applications.map(app => app.jobTitle))];
        const sourcesList = [...new Set(applications.map(app => app.source || ""))]
          .filter(Boolean)
          .concat(["LinkedIn", "Recruiter", "Job Board", "Company Website", "Other"]);
        
        setPreviousEntries({
          companies,
          jobTitles,
          sources: [...new Set(sourcesList)], // Remove duplicates
        });
      } catch (error) {
        console.error('Error loading previous entries:', error);
        // Keep the default values
      }
    };
    
    loadPreviousEntries();
  }, []);

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
          source: application.source || "LinkedIn",
          recruiter: application.recruiter || "",
          recruitingFirm: application.recruitingFirm || "",
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
