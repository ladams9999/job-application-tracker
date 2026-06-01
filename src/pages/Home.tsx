import { format } from "date-fns";

import Dashboard from "@/components/analytics/Dashboard";
import AppErrorPanel from "@/components/error/AppErrorPanel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useApplicationsQuery } from "@/hooks/useApplicationQueries";
import { normalizeAppError } from "@/lib/appError";
import {
  filterApplicationsByDashboardView,
  getMostRecentActivityDate,
  sortByMostRecentActivity,
} from "@/services/dashboardMetrics";

const Home = () => {
  const { data: applications = [], isLoading, error, refetch } = useApplicationsQuery();
  const activeApplications = sortByMostRecentActivity(
    filterApplicationsByDashboardView(applications, "active"),
  );

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Home</h2>
        <p className="text-muted-foreground">
          Review your dashboard before diving into the full applications list.
        </p>
      </div>

      <Dashboard />

      <section className="space-y-4" aria-labelledby="active-applications-heading">
        <div>
          <h3
            id="active-applications-heading"
            className="text-2xl font-semibold tracking-tight"
          >
            Active Applications
          </h3>
          <p className="text-muted-foreground">
            Applications with activity in the last two weeks, sorted from most recent to least recent.
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center rounded-md border p-6">
            <p className="text-muted-foreground">Loading active applications...</p>
          </div>
        ) : error ? (
          <AppErrorPanel
            error={normalizeAppError(error, { operation: "load home applications" })}
            primaryAction={{
              label: "Retry active applications",
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
        ) : activeApplications.length > 0 ? (
          <ul className="grid gap-4" aria-label="Active applications">
            {activeApplications.map((application) => (
              <li key={application.id}>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">
                      {application.company}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {application.jobTitle}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-muted-foreground">
                    <p>
                      Status: <span className="font-medium text-foreground">{application.status}</span>
                    </p>
                    <p>
                      Last activity:{" "}
                      <span className="font-medium text-foreground">
                        {format(getMostRecentActivityDate(application), "MMMM d, yyyy")}
                      </span>
                    </p>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        ) : (
          <div className="rounded-md border p-6 text-muted-foreground">
            No active applications right now.
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
