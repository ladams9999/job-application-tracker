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
  
  useEffect(() => {
    const loadPreviousEntries = async () => {
      try {
        const suggestions = await getSuggestions();
        console.log("Loaded suggestions:", suggestions);
        
        setPreviousEntries({
          companies: Array.isArray(suggestions.companies) ? suggestions.companies : [],
          jobTitles: Array.isArray(suggestions.jobTitles) ? suggestions.jobTitles : [],
          sources: Array.isArray(suggestions.sources) && suggestions.sources.length > 0 
            ? suggestions.sources 
            : DEFAULT_ENTRIES.sources,
        });
      } catch (error) {
        console.error('Error loading previous entries:', error);
        // Keep the default values on error - don't set to undefined
        setPreviousEntries(DEFAULT_ENTRIES);
      }
    };
    
    loadPreviousEntries();
  }, []);

  return previousEntries;
};
