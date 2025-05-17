
import { useState } from "react";
import { ApplicationFilter, ApplicationStatus } from "@/types";

export const useApplicationFilters = () => {
  const [filter, setFilter] = useState<ApplicationFilter>({
    search: "",
    status: "all",
    sortBy: "dateApplied",
    sortDirection: "desc",
  });

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

  return {
    filter,
    handleSearchChange,
    handleStatusChange,
    handleSortChange,
  };
};
