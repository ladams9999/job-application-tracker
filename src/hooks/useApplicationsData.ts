
import { useState, useEffect } from "react";
import { JobApplication, ApplicationFilter } from "@/types";
import { applicationsApi } from "@/services/applicationsApi";
import { deleteApplication } from "@/services/applicationService";

export const useApplicationsData = (filter: ApplicationFilter) => {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<JobApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadApplications();
  }, [filter]);

  const loadApplications = async () => {
    try {
      setIsLoading(true);
      const response = await applicationsApi.getApplications(filter);
      setApplications(response.applications);
      setFilteredApplications(response.applications);
    } catch (error) {
      console.error("Error loading applications:", error);
      setApplications([]);
      setFilteredApplications([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteApplication(id);
      await loadApplications(); // Reload data after deletion
    } catch (error) {
      console.error("Error deleting application:", error);
    }
  };

  return {
    filteredApplications,
    isLoading,
    handleDelete,
  };
};
