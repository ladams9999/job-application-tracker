
import { useApplicationsList } from "@/hooks/useApplicationsList";
import Dashboard from "@/components/analytics/Dashboard";
import ApplicationsHeader from "@/components/application/ApplicationsHeader";
import ApplicationFilterSummary from "@/components/application/ApplicationFilterSummary";
import FilterBar from "@/components/application/FilterBar";
import ApplicationsTable from "@/components/application/ApplicationsTable";
import AppErrorPanel from "@/components/error/AppErrorPanel";
import { normalizeAppError } from "@/lib/appError";

const ApplicationsList = () => {
  const {
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
  } = useApplicationsList();

  return (
    <div className="space-y-8">
      <Dashboard />
      
      <div className="space-y-6">
        <ApplicationsHeader />
        <ApplicationFilterSummary
          criteria={activeCriteria}
          onClearCriterion={handleClearCriterion}
          onClearAll={clearAllCriteria}
        />
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
          <AppErrorPanel
            error={normalizeAppError(error, { operation: "load applications" })}
            primaryAction={{
              label: "Retry applications",
              onClick: () => {
                void retryLoad();
              },
            }}
            secondaryAction={{
              label: "Reload page",
              onClick: () => {
                window.location.reload();
              },
            }}
          />
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
