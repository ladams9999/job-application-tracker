
import { JobApplication, ApplicationFilter } from "@/types";
import { toast } from "@/components/ui/sonner";
import { applicationsApi, CreateApplicationRequest, UpdateApplicationRequest } from "./applicationsApi";

// Get all job applications from API
export const getAllApplications = async (): Promise<JobApplication[]> => {
  try {
    const response = await applicationsApi.getApplications();
    return response.applications;
  } catch (error) {
    console.error('Error getting applications:', error);
    toast.error("Failed to load applications");
    return [];
  }
};

// Add a new job application
export const addApplication = async (application: Omit<JobApplication, 'id' | 'createdAt' | 'updatedAt'>): Promise<JobApplication> => {
  try {
    const createRequest: CreateApplicationRequest = {
      company: application.company,
      jobTitle: application.jobTitle,
      jobDescription: application.jobDescription,
      dateApplied: application.dateApplied,
      status: application.status,
      notes: application.notes,
      source: application.source || "LinkedIn",
      recruiter: application.recruiter,
      recruitingFirm: application.recruitingFirm,
    };
    
    const newApplication = await applicationsApi.createApplication(createRequest);
    toast.success("Application successfully added");
    return newApplication;
  } catch (error) {
    console.error('Error adding application:', error);
    toast.error("Failed to add application");
    throw error;
  }
};

// Update an existing job application
export const updateApplication = async (application: JobApplication): Promise<JobApplication> => {
  try {
    const updateRequest: UpdateApplicationRequest = {
      company: application.company,
      jobTitle: application.jobTitle,
      jobDescription: application.jobDescription,
      dateApplied: application.dateApplied,
      status: application.status,
      notes: application.notes,
      source: application.source || "LinkedIn",
      recruiter: application.recruiter,
      recruitingFirm: application.recruitingFirm,
    };
    
    const updatedApplication = await applicationsApi.updateApplication(application.id, updateRequest);
    toast.success("Application successfully updated");
    return updatedApplication;
  } catch (error) {
    console.error('Error updating application:', error);
    toast.error("Failed to update application");
    throw error;
  }
};

// Delete a job application
export const deleteApplication = async (id: string): Promise<boolean> => {
  try {
    await applicationsApi.deleteApplication(id);
    toast.success("Application successfully deleted");
    return true;
  } catch (error) {
    console.error('Error deleting application:', error);
    toast.error("Failed to delete application");
    throw error;
  }
};

// Filter and sort applications (now handled by API)
export const filterApplications = (applications: JobApplication[], filter: ApplicationFilter): JobApplication[] => {
  // This function is now mainly for client-side filtering if needed
  // Most filtering should be done by the API
  return applications;
};

// Get suggestions for form autocomplete
export const getSuggestions = async () => {
  try {
    return await applicationsApi.getSuggestions();
  } catch (error) {
    console.error('Error getting suggestions:', error);
    // Return fallback data
    return {
      companies: [],
      jobTitles: [],
      sources: ["LinkedIn", "Recruiter", "Job Board", "Company Website", "Other"]
    };
  }
};
