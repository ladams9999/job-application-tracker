import { useQuery } from "@tanstack/react-query";
import { applicationsApi } from "@/services/applicationsApi";
import { ApplicationFilter } from "@/types";
import { PreviousEntryData } from "@/types/forms";

const DEFAULT_SUGGESTIONS: PreviousEntryData = {
  companies: [],
  jobTitles: [],
  sources: ["LinkedIn", "Recruiter", "Job Board", "Company Website", "Other"],
};

export const applicationQueryKeys = {
  all: ["applications"] as const,
  list: (filter?: ApplicationFilter) => ["applications", "list", filter ?? null] as const,
  detail: (id: string) => ["applications", "detail", id] as const,
  suggestions: ["applications", "suggestions"] as const,
};

export const sanitizeSuggestions = (
  suggestions?: Partial<PreviousEntryData> | null,
): PreviousEntryData => ({
  companies: Array.isArray(suggestions?.companies) ? suggestions.companies : [],
  jobTitles: Array.isArray(suggestions?.jobTitles) ? suggestions.jobTitles : [],
  sources:
    Array.isArray(suggestions?.sources) && suggestions.sources.length > 0
      ? suggestions.sources
      : DEFAULT_SUGGESTIONS.sources,
});

export const useApplicationsQuery = (filter?: ApplicationFilter) => {
  return useQuery({
    queryKey: applicationQueryKeys.list(filter),
    queryFn: async () => {
      const response = await applicationsApi.getApplications(filter);
      return response.applications;
    },
  });
};

export const useApplicationQuery = (id: string | undefined) => {
  return useQuery({
    queryKey: applicationQueryKeys.detail(id ?? "new"),
    queryFn: () => applicationsApi.getApplication(id!),
    enabled: Boolean(id),
  });
};

export const useSuggestionsQuery = () => {
  return useQuery({
    queryKey: applicationQueryKeys.suggestions,
    queryFn: async () => sanitizeSuggestions(await applicationsApi.getSuggestions()),
  });
};

export { DEFAULT_SUGGESTIONS };
