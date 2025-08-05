
import { useApplicationsList } from "@/hooks/useApplicationsList";
import Dashboard from "@/components/analytics/Dashboard";
import ApplicationsHeader from "@/components/application/ApplicationsHeader";
import FilterBar from "@/components/application/FilterBar";
import ApplicationsTable from "@/components/application/ApplicationsTable";

const ApplicationsList = () => {
  const {
    filteredApplications,
    filter,
    handleSearchChange,
    handleStatusChange,
    handleSortChange,
    handleDelete,
  } = useApplicationsList();

  return (
    <div className="space-y-8">
      <Dashboard />
      
      <div className="space-y-6">
        <ApplicationsHeader />
        <FilterBar 
          filter={filter}
          onSearchChange={handleSearchChange}
          onStatusChange={handleStatusChange}
        />
        <ApplicationsTable 
          applications={filteredApplications}
          filter={filter}
          onSortChange={handleSortChange}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default ApplicationsList;
