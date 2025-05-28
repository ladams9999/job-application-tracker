
import { JobApplication, ApplicationFilter } from "@/types";
import { supabase } from "@/integrations/supabase/client";

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

// Applications API functions using Supabase
export const applicationsApi = {
  // Get all applications with filtering and pagination
  getApplications: async (filter?: ApplicationFilter): Promise<ApplicationsResponse> => {
    try {
      let query = supabase
        .from('job_applications')
        .select('*');

      // Apply search filter
      if (filter?.search) {
        query = query.or(`company.ilike.%${filter.search}%,job_title.ilike.%${filter.search}%`);
      }

      // Apply status filter
      if (filter?.status && filter.status !== 'all') {
        query = query.eq('status', filter.status);
      }

      // Apply sorting
      if (filter?.sortBy) {
        const column = filter.sortBy === 'dateApplied' ? 'date_applied' : 
                      filter.sortBy === 'jobTitle' ? 'job_title' : filter.sortBy;
        const ascending = filter.sortDirection === 'asc';
        query = query.order(column, { ascending });
      } else {
        // Default sort by created_at descending
        query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching applications:', error);
        throw error;
      }

      // Transform data to match JobApplication interface
      const applications: JobApplication[] = (data || []).map(app => ({
        id: app.id,
        company: app.company,
        jobTitle: app.job_title,
        jobDescription: app.job_description,
        dateApplied: app.date_applied,
        status: app.status,
        notes: app.notes || '',
        createdAt: app.created_at,
        updatedAt: app.updated_at,
        source: app.source || '',
        recruiter: app.recruiter || '',
        recruitingFirm: app.recruiting_firm || '',
      }));

      return {
        applications,
        total: applications.length,
        hasMore: false,
      };
    } catch (error) {
      console.error('Error in getApplications:', error);
      throw error;
    }
  },

  // Get single application by ID
  getApplication: async (id: string): Promise<JobApplication> => {
    try {
      const { data, error } = await supabase
        .from('job_applications')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching application:', error);
        throw error;
      }

      if (!data) {
        throw new Error('Application not found');
      }

      // Transform data to match JobApplication interface
      return {
        id: data.id,
        company: data.company,
        jobTitle: data.job_title,
        jobDescription: data.job_description,
        dateApplied: data.date_applied,
        status: data.status,
        notes: data.notes || '',
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        source: data.source || '',
        recruiter: data.recruiter || '',
        recruitingFirm: data.recruiting_firm || '',
      };
    } catch (error) {
      console.error('Error in getApplication:', error);
      throw error;
    }
  },

  // Create new application
  createApplication: async (data: CreateApplicationRequest): Promise<JobApplication> => {
    try {
      const { data: result, error } = await supabase
        .from('job_applications')
        .insert({
          company: data.company,
          job_title: data.jobTitle,
          job_description: data.jobDescription,
          date_applied: data.dateApplied,
          status: data.status,
          notes: data.notes || null,
          source: data.source,
          recruiter: data.recruiter || null,
          recruiting_firm: data.recruitingFirm || null,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating application:', error);
        throw error;
      }

      if (!result) {
        throw new Error('Failed to create application');
      }

      // Transform data to match JobApplication interface
      return {
        id: result.id,
        company: result.company,
        jobTitle: result.job_title,
        jobDescription: result.job_description,
        dateApplied: result.date_applied,
        status: result.status,
        notes: result.notes || '',
        createdAt: result.created_at,
        updatedAt: result.updated_at,
        source: result.source || '',
        recruiter: result.recruiter || '',
        recruitingFirm: result.recruiting_firm || '',
      };
    } catch (error) {
      console.error('Error in createApplication:', error);
      throw error;
    }
  },

  // Update existing application
  updateApplication: async (id: string, data: UpdateApplicationRequest): Promise<JobApplication> => {
    try {
      const { data: result, error } = await supabase
        .from('job_applications')
        .update({
          company: data.company,
          job_title: data.jobTitle,
          job_description: data.jobDescription,
          date_applied: data.dateApplied,
          status: data.status,
          notes: data.notes || null,
          source: data.source,
          recruiter: data.recruiter || null,
          recruiting_firm: data.recruitingFirm || null,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating application:', error);
        throw error;
      }

      if (!result) {
        throw new Error('Failed to update application');
      }

      // Transform data to match JobApplication interface
      return {
        id: result.id,
        company: result.company,
        jobTitle: result.job_title,
        jobDescription: result.job_description,
        dateApplied: result.date_applied,
        status: result.status,
        notes: result.notes || '',
        createdAt: result.created_at,
        updatedAt: result.updated_at,
        source: result.source || '',
        recruiter: result.recruiter || '',
        recruitingFirm: result.recruiting_firm || '',
      };
    } catch (error) {
      console.error('Error in updateApplication:', error);
      throw error;
    }
  },

  // Delete application
  deleteApplication: async (id: string): Promise<{ success: boolean }> => {
    try {
      const { error } = await supabase
        .from('job_applications')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting application:', error);
        throw error;
      }

      return { success: true };
    } catch (error) {
      console.error('Error in deleteApplication:', error);
      throw error;
    }
  },

  // Get suggestions for form fields
  getSuggestions: async (): Promise<SuggestionsResponse> => {
    try {
      // Get distinct companies
      const { data: companiesData, error: companiesError } = await supabase
        .from('job_applications')
        .select('company')
        .neq('company', 'Anonymous');

      if (companiesError) {
        console.error('Error fetching companies:', companiesError);
      }

      // Get distinct job titles
      const { data: jobTitlesData, error: jobTitlesError } = await supabase
        .from('job_applications')
        .select('job_title');

      if (jobTitlesError) {
        console.error('Error fetching job titles:', jobTitlesError);
      }

      // Get distinct sources
      const { data: sourcesData, error: sourcesError } = await supabase
        .from('job_applications')
        .select('source')
        .not('source', 'is', null);

      if (sourcesError) {
        console.error('Error fetching sources:', sourcesError);
      }

      // Extract unique values
      const companies = [...new Set((companiesData || []).map(item => item.company))];
      const jobTitles = [...new Set((jobTitlesData || []).map(item => item.job_title))];
      const sources = [...new Set((sourcesData || []).map(item => item.source))];

      // Add default sources if none exist
      const defaultSources = ["LinkedIn", "Recruiter", "Job Board", "Company Website", "Other"];
      const allSources = sources.length > 0 ? sources : defaultSources;

      return {
        companies,
        jobTitles,
        sources: allSources,
      };
    } catch (error) {
      console.error('Error in getSuggestions:', error);
      // Return fallback data
      return {
        companies: [],
        jobTitles: [],
        sources: ["LinkedIn", "Recruiter", "Job Board", "Company Website", "Other"],
      };
    }
  },

  // Get application statistics
  getStats: async (): Promise<StatsResponse> => {
    try {
      // Get total count
      const { count: totalApplications, error: countError } = await supabase
        .from('job_applications')
        .select('*', { count: 'exact', head: true });

      if (countError) {
        console.error('Error fetching total count:', countError);
        throw countError;
      }

      // Get status counts
      const { data: statusData, error: statusError } = await supabase
        .from('job_applications')
        .select('status');

      if (statusError) {
        console.error('Error fetching status data:', statusError);
        throw statusError;
      }

      // Calculate status counts
      const statusCounts: Record<string, number> = {};
      (statusData || []).forEach(item => {
        const status = item.status;
        statusCounts[status] = (statusCounts[status] || 0) + 1;
      });

      return {
        totalApplications: totalApplications || 0,
        statusCounts,
      };
    } catch (error) {
      console.error('Error in getStats:', error);
      throw error;
    }
  },
};
