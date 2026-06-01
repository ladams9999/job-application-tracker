
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useApplicationsQuery } from "@/hooks/useApplicationQueries";


const Dashboard = () => {
  const { data: applications = [], isLoading, error } = useApplicationsQuery();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading dashboard data.</div>;

  const totalApplications = applications?.length || 0;

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
          Your job application progress
        </p>
      </div>

      {/* Stats Cards */}
      <div className="flex flex-wrap gap-6">
        <Card className="rounded-xl border-none shadow-md w-60 flex flex-col items-center justify-center">
          <CardHeader className="w-full flex flex-col items-center justify-center space-y-0 pb-2">
            <CardTitle className="text-sm font-bold text-center font-sans">This Week</CardTitle>
            <p className="text-muted-foreground text-xs text-center">Since Sunday</p>
          </CardHeader>
          <CardContent className="w-full flex flex-col items-center justify-center">
            <div className="text-2xl font-bold text-center font-sans">{weeklyApplications}</div>
          </CardContent>
        </Card>

        <Card className="rounded-xl border-none shadow-md w-60 flex flex-col items-center justify-center">
          <CardHeader className="w-full flex flex-col items-center justify-center space-y-0 pb-2">
            <CardTitle className="text-sm font-bold text-center font-sans">Active</CardTitle>
            <p className="text-muted-foreground text-xs text-center">In last two weeks</p>
          </CardHeader>
          <CardContent className="w-full flex flex-col items-center justify-center">
            <div className="text-2xl font-bold text-center font-sans">{activeApplications}</div>
          </CardContent>
        </Card>

        <Card className="rounded-xl border-none shadow-md w-60 flex flex-col items-center justify-center">
          <CardHeader className="w-full flex flex-col items-center justify-center space-y-0 pb-2">
            <CardTitle className="text-sm font-bold text-center font-sans">Dormant</CardTitle>
            <p className="text-muted-foreground text-xs text-center">No activity for 30 days</p>
          </CardHeader>
          <CardContent className="w-full flex flex-col items-center justify-center">
            <div className="text-2xl font-bold text-center font-sans">{dormantApplications}</div>
          </CardContent>
        </Card>

        <Card className="rounded-xl border-none shadow-md w-60 flex flex-col items-center justify-center">
          <CardHeader className="w-full flex flex-col items-center justify-center space-y-0 pb-2">
            <CardTitle className="text-sm font-bold text-center font-sans">Silent</CardTitle>
            <p className="text-muted-foreground text-xs text-center">No activity</p>
          </CardHeader>
          <CardContent className="w-full flex flex-col items-center justify-center">
            <div className="text-2xl font-bold text-center font-sans">{silentApplications}</div>
          </CardContent>
        </Card>

        <Card className="rounded-xl border-none shadow-md w-60 flex flex-col items-center justify-center">
          <CardHeader className="w-full flex flex-col items-center justify-center space-y-0 pb-2">
            <CardTitle className="text-sm font-bold text-center font-sans">Total</CardTitle>
            <p className="text-muted-foreground text-xs text-center">All applications</p>
          </CardHeader>
          <CardContent className="w-full flex flex-col items-center justify-center">
            <div className="text-2xl font-bold text-center font-sans">{totalApplications}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
