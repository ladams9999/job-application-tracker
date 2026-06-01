
import { useApplicationFilters } from "./useApplicationFilters";
import { useApplicationsData } from "./useApplicationsData";

export const useApplicationsList = () => {
  const {
    filter,
    activeCriteria,
    handleSearchChange,
    handleStatusChange,
    handleSortChange,
    clearSearchCriterion,
    clearStatusCriterion,
    clearViewCriterion,
    clearAllCriteria,
  } = useApplicationFilters();
  const { filteredApplications, isLoading, error, retryLoad, handleDelete } = useApplicationsData(filter);

  const handleClearCriterion = (id: "search" | "status" | "view") => {
    switch (id) {
      case "search":
        clearSearchCriterion();
        break;
      case "status":
        clearStatusCriterion();
        break;
      case "view":
        clearViewCriterion();
        break;
      default:
        break;
    }
  };

  return {
    filteredApplications,
    isLoading,
    error,
    retryLoad,
    filter,
    activeCriteria,
    handleSearchChange,
    handleStatusChange,
    handleSortChange,
    handleClearCriterion,
    clearAllCriteria,
    handleDelete,
  };
};
