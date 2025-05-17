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
        if (!applications || applications.length === 0) {
          // If no applications exist, keep the default values
          return;
        }

        const companies = [...new Set(applications.map(app => app.company || "").filter(Boolean))];
        const jobTitles = [...new Set(applications.map(app => app.jobTitle || "").filter(Boolean))];
        const sourcesList = [...new Set(applications.map(app => app.source || "").filter(Boolean))]
          .concat(["LinkedIn", "Recruiter", "Job Board", "Company Website", "Other"]);
        
        setPreviousEntries({
          companies,
          jobTitles,
          sources: [...new Set(sourcesList)], // Remove duplicates
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
