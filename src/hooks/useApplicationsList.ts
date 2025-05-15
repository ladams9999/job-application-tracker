
import { useState, useEffect } from "react";
import { JobApplication, ApplicationFilter, ApplicationStatus } from "@/types";
import { getAllApplications, deleteApplication, filterApplications } from "@/services/applicationService";

export const useApplicationsList = () => {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<JobApplication[]>([]);
  const [filter, setFilter] = useState<ApplicationFilter>({
    search: "",
    status: "all",
    sortBy: "dateApplied",
    sortDirection: "desc",
  });

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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter({ ...filter, search: e.target.value });
  };

  const handleStatusChange = (value: string) => {
    setFilter({ ...filter, status: value as ApplicationStatus | "all" });
  };

  const handleSortChange = (field: "dateApplied" | "company" | "jobTitle" | "status") => {
    if (filter.sortBy === field) {
      setFilter({
        ...filter,
        sortDirection: filter.sortDirection === "asc" ? "desc" : "asc",
      });
    } else {
      setFilter({
        ...filter,
        sortBy: field,
        sortDirection: "asc",
      });
    }
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
    filter,
    handleSearchChange,
    handleStatusChange,
    handleSortChange,
    handleDelete,
  };
};
