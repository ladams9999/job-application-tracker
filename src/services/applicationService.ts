
import { JobApplication, ApplicationFilter } from "@/types";
import { toast } from "@/components/ui/sonner";

// LocalStorage key
const STORAGE_KEY = 'job-applications';

// Get all job applications from localStorage
export const getAllApplications = (): JobApplication[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting applications:', error);
    return [];
  }
};

// Add a new job application
export const addApplication = (application: Omit<JobApplication, 'id' | 'createdAt' | 'updatedAt'>): JobApplication => {
  try {
    const applications = getAllApplications();
    const now = new Date().toISOString();
    
    const newApplication: JobApplication = {
      ...application,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    
    applications.push(newApplication);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
    toast.success("Application successfully added");
    return newApplication;
  } catch (error) {
    console.error('Error adding application:', error);
    toast.error("Failed to add application");
    throw error;
  }
};

// Update an existing job application
export const updateApplication = (application: JobApplication): JobApplication => {
  try {
    const applications = getAllApplications();
    const index = applications.findIndex(app => app.id === application.id);
    
    if (index === -1) {
      throw new Error('Application not found');
    }
    
    const updatedApplication = {
      ...application,
      updatedAt: new Date().toISOString(),
    };
    
    applications[index] = updatedApplication;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
    toast.success("Application successfully updated");
    return updatedApplication;
  } catch (error) {
    console.error('Error updating application:', error);
    toast.error("Failed to update application");
    throw error;
  }
};

// Delete a job application
export const deleteApplication = (id: string): boolean => {
  try {
    const applications = getAllApplications();
    const updatedApplications = applications.filter(app => app.id !== id);
    
    if (applications.length === updatedApplications.length) {
      throw new Error('Application not found');
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedApplications));
    toast.success("Application successfully deleted");
    return true;
  } catch (error) {
    console.error('Error deleting application:', error);
    toast.error("Failed to delete application");
    throw error;
  }
};

// Filter and sort applications
export const filterApplications = (applications: JobApplication[], filter: ApplicationFilter): JobApplication[] => {
  let filtered = [...applications];
  
  // Filter by search term
  if (filter.search) {
    const searchTerm = filter.search.toLowerCase();
    filtered = filtered.filter(app => 
      app.company.toLowerCase().includes(searchTerm) || 
      app.jobTitle.toLowerCase().includes(searchTerm) ||
      app.jobDescription.toLowerCase().includes(searchTerm)
    );
  }
  
  // Filter by status
  if (filter.status !== 'all') {
    filtered = filtered.filter(app => app.status === filter.status);
  }
  
  // Sort by selected field
  filtered.sort((a, b) => {
    const aValue = a[filter.sortBy];
    const bValue = b[filter.sortBy];
    
    if (filter.sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });
  
  return filtered;
};
