
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useApplicationsData } from "@/hooks/useApplicationsData";
import { ApplicationStatus } from "@/types/forms";
import { Badge } from "@/components/ui/badge";

const Dashboard = () => {
  const { applications, isLoading, error } = useApplicationsData();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const totalApplications = applications?.length || 0;
  const statusCounts = applications?.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {} as Record<ApplicationStatus, number>) || {};

  const recentApplications = applications?.slice(0, 5) || [];

  const pendingApplications = applications?.filter(app => 
    app.status === "applied" || app.status === "interview"
  ).length || 0;

  // Status display mapping that matches our database enum
  const statusLabels: Record<ApplicationStatus, string> = {
    applied: "Applied",
    interview: "Interview",
    offer: "Offer",
    rejected: "Rejected",
    withdrawn: "Withdrawn"
  };

  const statusColors: Record<ApplicationStatus, string> = {
    applied: "bg-blue-100 text-blue-800",
    interview: "bg-yellow-100 text-yellow-800", 
    offer: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    withdrawn: "bg-gray-100 text-gray-800"
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Track your job application progress
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalApplications}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingApplications}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Interviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.interview || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Offers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.offer || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Applications */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Applications</CardTitle>
          <CardDescription>
            Your most recent job applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentApplications.map((app) => (
              <div key={app.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{app.jobTitle}</p>
                  <p className="text-sm text-muted-foreground">{app.company}</p>
                </div>
                <Badge className={statusColors[app.status]}>
                  {statusLabels[app.status]}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
