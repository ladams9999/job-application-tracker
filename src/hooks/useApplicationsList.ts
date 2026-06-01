
import { useApplicationFilters } from "./useApplicationFilters";
import { useApplicationsData } from "./useApplicationsData";

export const useApplicationsList = () => {
  const { filter, handleSearchChange, handleStatusChange, handleSortChange } = useApplicationFilters();
  const { filteredApplications, isLoading, error, retryLoad, handleDelete } = useApplicationsData(filter);

  return {
    filteredApplications,
    isLoading,
    error,
    retryLoad,
    filter,
    handleSearchChange,
    handleStatusChange,
    handleSortChange,
    handleDelete,
  };
};
