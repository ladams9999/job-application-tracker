
import { useApplicationFilters } from "./useApplicationFilters";
import { useApplicationsData } from "./useApplicationsData";

export const useApplicationsList = () => {
  const { filter, handleSearchChange, handleStatusChange, handleSortChange } = useApplicationFilters();
  const { filteredApplications, handleDelete } = useApplicationsData(filter);

  return {
    filteredApplications,
    filter,
    handleSearchChange,
    handleStatusChange,
    handleSortChange,
    handleDelete,
  };
};
