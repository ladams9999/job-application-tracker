
import { useState, useEffect } from "react";
import { PreviousEntryData } from "@/types/forms";
import { getSuggestions } from "@/services/applicationService";

const DEFAULT_ENTRIES: PreviousEntryData = {
  companies: [],
  jobTitles: [],
  sources: ["LinkedIn", "Recruiter", "Job Board", "Company Website", "Other"],
};

export const usePreviousEntriesLoader = () => {
  const [previousEntries, setPreviousEntries] = useState<PreviousEntryData>(DEFAULT_ENTRIES);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadPreviousEntries = async () => {
      try {
        setIsLoading(true);
        const suggestions = await getSuggestions();
        console.log("Loaded suggestions:", suggestions);
        
        // Ensure we always have valid arrays
        const safeEntries: PreviousEntryData = {
          companies: Array.isArray(suggestions?.companies) ? suggestions.companies : [],
          jobTitles: Array.isArray(suggestions?.jobTitles) ? suggestions.jobTitles : [],
          sources: Array.isArray(suggestions?.sources) && suggestions.sources.length > 0 
            ? suggestions.sources 
            : DEFAULT_ENTRIES.sources,
        };
        
        setPreviousEntries(safeEntries);
      } catch (error) {
        console.error('Error loading previous entries:', error);
        // Keep the default values on error - don't set to undefined
        setPreviousEntries(DEFAULT_ENTRIES);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPreviousEntries();
  }, []);

  return { previousEntries, isLoading };
};
