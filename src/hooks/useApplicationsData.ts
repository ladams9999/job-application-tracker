
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApplicationFilter } from "@/types";
import { deleteApplication } from "@/services/applicationService";
import { applicationQueryKeys, useApplicationsQuery } from "@/hooks/useApplicationQueries";
import { filterApplicationsByDashboardView } from "@/services/dashboardMetrics";

export const useApplicationsData = (filter: ApplicationFilter) => {
  const queryClient = useQueryClient();
  const applicationsQuery = useApplicationsQuery(filter);
  const deleteMutation = useMutation({
    mutationFn: deleteApplication,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: applicationQueryKeys.all });
    },
  });

  const handleDelete = async (id: string) => {
    await deleteMutation.mutateAsync(id);
  };

  return {
    filteredApplications: filterApplicationsByDashboardView(
      applicationsQuery.data ?? [],
      filter.view,
    ),
    isLoading: applicationsQuery.isLoading,
    error: applicationsQuery.error,
    retryLoad: applicationsQuery.refetch,
    handleDelete,
  };
};
