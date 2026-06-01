import type { DashboardMetrics } from "@/services/dashboardMetrics";

export interface DashboardCardDefinition {
  id: string;
  title: string;
  description: string;
  metricKey: keyof DashboardMetrics;
}

export const dashboardCardDefinitions: DashboardCardDefinition[] = [
  {
    id: "this-week",
    title: "This Week",
    description: "Since Sunday",
    metricKey: "weeklyApplications",
  },
  {
    id: "active",
    title: "Active",
    description: "In last two weeks",
    metricKey: "activeApplications",
  },
  {
    id: "dormant",
    title: "Dormant",
    description: "No activity for 30 days",
    metricKey: "dormantApplications",
  },
  {
    id: "silent",
    title: "Silent",
    description: "No activity",
    metricKey: "silentApplications",
  },
  {
    id: "total",
    title: "Total",
    description: "All applications",
    metricKey: "totalApplications",
  },
];
