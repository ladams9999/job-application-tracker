
import { useState, useEffect } from "react";
import { JobApplication, ApplicationFilter } from "@/types";
import { getAllApplications, deleteApplication, filterApplications } from "@/services/applicationService";

export const useApplicationsData = (filter: ApplicationFilter) => {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<JobApplication[]>([]);

  useEffect(() => {
    loadApplications();
  }, []);

  useEffect(() => {
    const filtered = filterApplications(applications, filter);
    setFilteredApplications(filtered);
  }, [applications, filter]);

  const loadApplications = () => {
    const data = getAllApplications();
    setApplications(data);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteApplication(id);
      loadApplications();
    } catch (error) {
      console.error("Error deleting application:", error);
    }
  };

  return {
    filteredApplications,
    handleDelete,
  };
};
