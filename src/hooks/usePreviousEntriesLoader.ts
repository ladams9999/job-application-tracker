
import { DEFAULT_SUGGESTIONS, useSuggestionsQuery } from "@/hooks/useApplicationQueries";

export const usePreviousEntriesLoader = () => {
  const suggestionsQuery = useSuggestionsQuery();

  return {
    previousEntries: suggestionsQuery.data ?? DEFAULT_SUGGESTIONS,
    isLoading: suggestionsQuery.isLoading,
  };
};
