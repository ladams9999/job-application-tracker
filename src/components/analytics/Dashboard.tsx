
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useApplicationsQuery } from "@/hooks/useApplicationQueries";
import { normalizeAppError } from "@/lib/appError";
import AppErrorPanel from "@/components/error/AppErrorPanel";
import { dashboardCardDefinitions } from "@/components/analytics/dashboardCardConfig";
import { getDashboardMetrics } from "@/services/dashboardMetrics";
import { Link } from "react-router-dom";


const Dashboard = () => {
  const { data: applications = [], isLoading, error, refetch } = useApplicationsQuery();

  if (isLoading) return <div>Loading...</div>;
  if (error) {
    return (
      <AppErrorPanel
        error={normalizeAppError(error, { operation: "load dashboard" })}
        primaryAction={{
          label: "Retry dashboard",
          onClick: () => {
            void refetch();
          },
        }}
        secondaryAction={{
          label: "Reload page",
          onClick: () => {
            window.location.reload();
          },
        }}
      />
    );
  }

  const metrics = getDashboardMetrics(applications);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Your job application progress
        </p>
      </div>

      {/* Stats Cards */}
      <div className="flex flex-wrap gap-6">
        {dashboardCardDefinitions.map((card) => (
          <Link key={card.id} to={card.to} className="block">
            <Card className="rounded-xl border-none shadow-md w-60 flex flex-col items-center justify-center transition-shadow hover:shadow-lg">
              <CardHeader className="w-full flex flex-col items-center justify-center space-y-0 pb-2">
                <CardTitle className="text-sm font-bold text-center font-sans">
                  {card.title}
                </CardTitle>
                <p className="text-muted-foreground text-xs text-center">
                  {card.description}
                </p>
              </CardHeader>
              <CardContent className="w-full flex flex-col items-center justify-center">
                <div className="text-2xl font-bold text-center font-sans">
                  {metrics[card.metricKey]}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
