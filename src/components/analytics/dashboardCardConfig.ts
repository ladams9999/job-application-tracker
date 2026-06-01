import type { DashboardMetrics } from "@/services/dashboardMetrics";

export interface DashboardCardDefinition {
  id: string;
  title: string;
  description: string;
  metricKey: keyof DashboardMetrics;
  to: string;
}

export const dashboardCardDefinitions: DashboardCardDefinition[] = [
  {
    id: "this-week",
    title: "This Week",
    description: "Since Sunday",
    metricKey: "weeklyApplications",
    to: "/applications?view=this-week",
  },
  {
    id: "active",
    title: "Active",
    description: "In last two weeks",
    metricKey: "activeApplications",
    to: "/applications?view=active",
  },
  {
    id: "dormant",
    title: "Dormant",
    description: "No activity for 30 days",
    metricKey: "dormantApplications",
    to: "/applications?view=dormant",
  },
  {
    id: "silent",
    title: "Silent",
    description: "No activity",
    metricKey: "silentApplications",
    to: "/applications?view=silent",
  },
  {
    id: "total",
    title: "Total",
    description: "All applications",
    metricKey: "totalApplications",
    to: "/applications",
  },
];
