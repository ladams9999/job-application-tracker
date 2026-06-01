
import { useApplicationsList } from "@/hooks/useApplicationsList";
import Dashboard from "@/components/analytics/Dashboard";
import ApplicationsHeader from "@/components/application/ApplicationsHeader";
import FilterBar from "@/components/application/FilterBar";
import ApplicationsTable from "@/components/application/ApplicationsTable";

const ApplicationsList = () => {
  const {
    filteredApplications,
    isLoading,
    error,
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
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <p className="text-muted-foreground">Loading applications...</p>
          </div>
        ) : error ? (
          <div className="rounded-md border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
            Failed to load applications.
          </div>
        ) : (
          <ApplicationsTable 
            applications={filteredApplications}
            filter={filter}
            onSortChange={handleSortChange}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
};

export default ApplicationsList;
