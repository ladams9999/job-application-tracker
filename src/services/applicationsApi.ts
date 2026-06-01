import { JobApplication, ApplicationFilter } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { normalizeAppError, type AppErrorContext } from "@/lib/appError";
import {
  CreateApplicationRequest,
  UpdateApplicationRequest,
  buildCreateApplicationPayload,
  buildUpdateApplicationPayload,
  mapApplicationRow,
} from "./applicationAdapters";
import {
  SUGGESTION_QUERY_LIMIT,
  extractUniqueValues,
  filterApplicationsBySearch,
} from "./applicationQueryUtils";

type JobApplicationRow = Parameters<typeof mapApplicationRow>[0];

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

const mapApplicationRowWithContext = (
  row: JobApplicationRow,
  context: AppErrorContext,
): JobApplication => {
  try {
    return mapApplicationRow(row);
  } catch (error) {
    throw normalizeAppError(error, context);
  }
};

// Applications API functions using Supabase
export const applicationsApi = {
  // Get all applications with filtering and pagination
  getApplications: async (filter?: ApplicationFilter): Promise<ApplicationsResponse> => {
    try {
      let query = supabase
        .from('job_applications')
        .select('*');

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
      const applications = filterApplicationsBySearch(
        (data || []).map((row) =>
          mapApplicationRowWithContext(row, {
            operation: "load applications",
            recordId: row.id,
          }),
        ),
        filter?.search ?? "",
      );

      return {
        applications,
        total: applications.length,
        hasMore: false,
      };
    } catch (error) {
      console.error('Error in getApplications:', error);
      throw normalizeAppError(error, { operation: "load applications" });
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
        throw normalizeAppError(new Error('Application not found'), {
          operation: "load application",
          recordId: id,
        });
      }

      // Transform data to match JobApplication interface
      return mapApplicationRowWithContext(data, {
        operation: "load application",
        recordId: id,
      });
    } catch (error) {
      console.error('Error in getApplication:', error);
      throw normalizeAppError(error, {
        operation: "load application",
        recordId: id,
      });
    }
  },

  // Create new application
  createApplication: async (data: CreateApplicationRequest): Promise<JobApplication> => {
    try {
      const { data: result, error } = await supabase
        .from('job_applications')
        .insert(buildCreateApplicationPayload(data))
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
      return mapApplicationRowWithContext(result, {
        operation: "create application",
        recordId: result.id,
      });
    } catch (error) {
      console.error('Error in createApplication:', error);
      throw normalizeAppError(error, { operation: "create application" });
    }
  },

  // Update existing application
  updateApplication: async (id: string, data: UpdateApplicationRequest): Promise<JobApplication> => {
    try {
      const { data: result, error } = await supabase
        .from('job_applications')
        .update(buildUpdateApplicationPayload(data))
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
      return mapApplicationRowWithContext(result, {
        operation: "update application",
        recordId: id,
      });
    } catch (error) {
      console.error('Error in updateApplication:', error);
      throw normalizeAppError(error, {
        operation: "update application",
        recordId: id,
      });
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
      throw normalizeAppError(error, {
        operation: "delete application",
        recordId: id,
      });
    }
  },

  // Get suggestions for form fields
  getSuggestions: async (): Promise<SuggestionsResponse> => {
    try {
      // Get distinct companies
      const { data: companiesData, error: companiesError } = await supabase
        .from('job_applications')
        .select('company')
        .neq('company', 'Anonymous')
        .order('created_at', { ascending: false })
        .limit(SUGGESTION_QUERY_LIMIT);

      if (companiesError) {
        console.error('Error fetching companies:', companiesError);
      }

      // Get distinct job titles
      const { data: jobTitlesData, error: jobTitlesError } = await supabase
        .from('job_applications')
        .select('job_title')
        .order('created_at', { ascending: false })
        .limit(SUGGESTION_QUERY_LIMIT);

      if (jobTitlesError) {
        console.error('Error fetching job titles:', jobTitlesError);
      }

      // Get distinct sources
      const { data: sourcesData, error: sourcesError } = await supabase
        .from('job_applications')
        .select('source')
        .not('source', 'is', null)
        .order('created_at', { ascending: false })
        .limit(SUGGESTION_QUERY_LIMIT);

      if (sourcesError) {
        console.error('Error fetching sources:', sourcesError);
      }

      // Extract unique values
      const companies = extractUniqueValues(companiesData, (item) => item.company);
      const jobTitles = extractUniqueValues(jobTitlesData, (item) => item.job_title);
      const sources = extractUniqueValues(sourcesData, (item) => item.source);

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
      throw normalizeAppError(error, { operation: "load application stats" });
    }
  },
};
