import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { JobApplication, ApplicationStatus } from "@/types";
import { getAllApplications } from "@/services/applicationService";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const Dashboard = () => {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    applied: 0,
    interview: 0,
    offer: 0,
    rejected: 0,
    withdrawn: 0,
  });

  useEffect(() => {
    const loadApplications = async () => {
      try {
        setIsLoading(true);
        const data = await getAllApplications();
        setApplications(data);
        
        // Calculate stats
        const stats = {
          total: data.length,
          applied: data.filter(app => app.status === 'applied').length,
          interview: data.filter(app => app.status === 'interview').length,
          offer: data.filter(app => app.status === 'offer').length,
          rejected: data.filter(app => app.status === 'rejected').length,
          withdrawn: data.filter(app => app.status === 'withdrawn').length,
        };
        
        setStats(stats);
      } catch (error) {
        console.error("Error loading applications:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadApplications();
  }, []);

  // Calculate recent applications
  const recentApplications = [...applications]
    .sort((a, b) => new Date(b.dateApplied).getTime() - new Date(a.dateApplied).getTime())
    .slice(0, 5);

  const getStatusColor = (status: ApplicationStatus) => {
    const colors = {
      applied: "bg-blue-100 text-blue-800",
      interview: "bg-yellow-100 text-yellow-800",
      offer: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      withdrawn: "bg-gray-100 text-gray-800",
    };
    return colors[status];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-lg text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Link to="/add">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Application
          </Button>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Interviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.interview}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Offers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.offer}</div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Applications</CardTitle>
        </CardHeader>
        <CardContent>
          {recentApplications.length > 0 ? (
            <div className="space-y-4">
              {recentApplications.map((application) => (
                <div key={application.id} className="flex justify-between items-center border-b pb-3">
                  <div>
                    <h3 className="font-medium">{application.jobTitle}</h3>
                    <p className="text-sm text-muted-foreground">{application.company}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">
                      {formatDate(application.dateApplied)}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                      {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <p>No applications yet.</p>
              <Link to="/add" className="text-primary font-medium hover:underline mt-2 inline-block">
                Add your first application
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
