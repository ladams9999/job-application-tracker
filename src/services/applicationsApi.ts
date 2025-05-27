
import { JobApplication, ApplicationFilter } from "@/types";
import { apiClient } from "./api";

// Request/Response Types
export interface CreateApplicationRequest {
  company: string;
  jobTitle: string;
  jobDescription: string;
  dateApplied: string;
  status: 'applied' | 'interview' | 'offer' | 'rejected' | 'withdrawn';
  notes?: string;
  source: string;
  recruiter?: string;
  recruitingFirm?: string;
}

export interface UpdateApplicationRequest extends CreateApplicationRequest {}

export interface ApplicationsResponse {
  applications: JobApplication[];
  total: number;
  hasMore: boolean;
}

export interface SuggestionsResponse {
  companies: string[];
  jobTitles: string[];
  sources: string[];
}

export interface StatsResponse {
  totalApplications: number;
  statusCounts: Record<string, number>;
}

// Applications API functions
export const applicationsApi = {
  // Get all applications with filtering and pagination
  getApplications: async (filter?: ApplicationFilter): Promise<ApplicationsResponse> => {
    const params = new URLSearchParams();
    
    if (filter?.search) params.append('search', filter.search);
    if (filter?.status && filter.status !== 'all') params.append('status', filter.status);
    if (filter?.sortBy) params.append('sortBy', filter.sortBy);
    if (filter?.sortDirection) params.append('sortDirection', filter.sortDirection);
    
    const queryString = params.toString();
    const endpoint = queryString ? `/applications?${queryString}` : '/applications';
    
    return apiClient(endpoint);
  },

  // Get single application by ID
  getApplication: async (id: string): Promise<JobApplication> => {
    return apiClient(`/applications/${id}`);
  },

  // Create new application
  createApplication: async (data: CreateApplicationRequest): Promise<JobApplication> => {
    return apiClient('/applications', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Update existing application
  updateApplication: async (id: string, data: UpdateApplicationRequest): Promise<JobApplication> => {
    return apiClient(`/applications/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Delete application
  deleteApplication: async (id: string): Promise<{ success: boolean }> => {
    return apiClient(`/applications/${id}`, {
      method: 'DELETE',
    });
  },

  // Get suggestions for form fields
  getSuggestions: async (): Promise<SuggestionsResponse> => {
    return apiClient('/applications/suggestions');
  },

  // Get application statistics
  getStats: async (): Promise<StatsResponse> => {
    return apiClient('/applications/stats');
  },
};
