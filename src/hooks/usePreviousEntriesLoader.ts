import { useState, useEffect } from "react";
import { PreviousEntryData } from "@/types/forms";
import { getSuggestions } from "@/services/applicationService";

export const usePreviousEntriesLoader = () => {
  const [previousEntries, setPreviousEntries] = useState<PreviousEntryData>({
    companies: [],
    jobTitles: [],
    sources: ["LinkedIn", "Recruiter", "Job Board", "Company Website", "Other"],
  });
  
  useEffect(() => {
    const loadPreviousEntries = async () => {
      try {
        const suggestions = await getSuggestions();
        console.log("Loaded suggestions:", suggestions);
        
        setPreviousEntries({
          companies: suggestions.companies || [],
          jobTitles: suggestions.jobTitles || [],
          sources: suggestions.sources.length > 0 
            ? suggestions.sources 
            : ["LinkedIn", "Recruiter", "Job Board", "Company Website", "Other"],
        });
      } catch (error) {
        console.error('Error loading previous entries:', error);
        // Keep the default values on error
      }
    };
    
    loadPreviousEntries();
  }, []);

  return previousEntries;
};
