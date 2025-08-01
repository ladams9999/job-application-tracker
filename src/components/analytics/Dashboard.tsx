
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { JobApplication, ApplicationStatus } from "@/types";
import { getAllApplications } from "@/services/applicationService";
import { Badge } from "@/components/ui/badge";


const Dashboard = () => {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadApplications = async () => {
      try {
        setIsLoading(true);
        const data = await getAllApplications();
        setApplications(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    loadApplications();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const totalApplications = applications?.length || 0;
  const statusCounts = applications?.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {} as Record<ApplicationStatus, number>) || {};

  const getStartOfWeek = () => {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day;
    const sunday = new Date(now.setDate(diff));
    sunday.setHours(0, 0, 0, 0);
    return sunday;
  };

  const startOfWeek = getStartOfWeek();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);  
  const twoWeeksAgo = new Date();
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

  const weeklyApplications = applications?.filter(app => {
    const createdDate = new Date(app.createdAt);
    return createdDate >= startOfWeek;
  }).length || 0;

  const activeApplications = applications?.filter(app => {
    const createdDate = new Date(app.createdAt);
    const updatedDate = new Date(app.updatedAt || app.createdAt);
    const recentActivity = createdDate >= twoWeeksAgo || updatedDate >= twoWeeksAgo;
    const notClosed = app.status !== "rejected" && app.status !== "withdrawn";
    return recentActivity && notClosed;
  }).length || 0;
  
  const dormantApplications = applications?.filter(app => {
    const lastUpdate = new Date(app.updatedAt || app.createdAt);
    return lastUpdate < thirtyDaysAgo;
  }).length || 0;

  const silentApplications = applications?.filter(app => 
    app.createdAt === app.updatedAt || !app.updatedAt
  ).length || 0;

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
            <CardTitle className="text-sm font-medium">Applications This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{weeklyApplications}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeApplications}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dormant</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dormantApplications}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Silent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{silentApplications}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalApplications}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
