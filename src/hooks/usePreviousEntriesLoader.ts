
import { useState, useEffect } from "react";
import { PreviousEntryData } from "@/types/forms";
import { getAllApplications } from "@/services/applicationService";

export const usePreviousEntriesLoader = () => {
  const [previousEntries, setPreviousEntries] = useState<PreviousEntryData>({
    companies: [],
    jobTitles: [],
    sources: ["LinkedIn", "Recruiter", "Job Board", "Company Website", "Other"],
  });
  
  useEffect(() => {
    const loadPreviousEntries = () => {
      try {
        const applications = getAllApplications();
        console.log("Loaded applications:", applications);
        
        // Ensure applications is always an array
        if (!Array.isArray(applications)) {
          console.warn("Applications is not an array:", applications);
          return;
        }

        if (applications.length === 0) {
          console.log("No applications found, keeping default values");
          return;
        }

        // Filter out null/undefined values and ensure we have strings
        const companies = [...new Set(
          applications
            .map(app => app?.company)
            .filter(company => company && typeof company === 'string' && company.trim() !== '')
        )];
        
        const jobTitles = [...new Set(
          applications
            .map(app => app?.jobTitle)
            .filter(title => title && typeof title === 'string' && title.trim() !== '')
        )];
        
        const existingSources = applications
          .map(app => app?.source)
          .filter(source => source && typeof source === 'string' && source.trim() !== '');
        
        const allSources = [...new Set([
          ...existingSources,
          "LinkedIn", "Recruiter", "Job Board", "Company Website", "Other"
        ])];
        
        console.log("Processed data:", { companies, jobTitles, sources: allSources });
        
        setPreviousEntries({
          companies: companies || [],
          jobTitles: jobTitles || [],
          sources: allSources || ["LinkedIn", "Recruiter", "Job Board", "Company Website", "Other"],
        });
      } catch (error) {
        console.error('Error loading previous entries:', error);
        // Keep the default values
      }
    };
    
    loadPreviousEntries();
  }, []);

  return previousEntries;
};
