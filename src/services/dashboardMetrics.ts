import type { DashboardApplicationView, JobApplication } from "@/types";

export interface DashboardMetrics {
  totalApplications: number;
  weeklyApplications: number;
  activeApplications: number;
  dormantApplications: number;
  silentApplications: number;
}

export const getMostRecentActivityDate = (application: JobApplication): Date =>
  new Date(application.updatedAt || application.createdAt);

export const isActiveApplication = (
  application: JobApplication,
  now: Date = new Date(),
): boolean => {
  const twoWeeksAgo = new Date(now);
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

  const notClosed =
    application.status !== "rejected" && application.status !== "withdrawn";

  return notClosed && getMostRecentActivityDate(application) >= twoWeeksAgo;
};

export const sortByMostRecentActivity = (
  applications: JobApplication[],
): JobApplication[] =>
  [...applications].sort(
    (left, right) =>
      getMostRecentActivityDate(right).getTime() -
      getMostRecentActivityDate(left).getTime(),
  );

const getStartOfWeek = (now: Date): Date => {
  const startOfWeek = new Date(now);
  const day = startOfWeek.getDay();
  startOfWeek.setDate(startOfWeek.getDate() - day);
  startOfWeek.setHours(0, 0, 0, 0);
  return startOfWeek;
};

const getThirtyDaysAgo = (now: Date): Date => {
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  return thirtyDaysAgo;
};

export const filterApplicationsByDashboardView = (
  applications: JobApplication[],
  view: DashboardApplicationView,
  now: Date = new Date(),
): JobApplication[] => {
  if (view === "all") {
    return applications;
  }

  const startOfWeek = getStartOfWeek(now);
  const thirtyDaysAgo = getThirtyDaysAgo(now);

  return applications.filter((application) => {
    switch (view) {
      case "this-week":
        return new Date(application.createdAt) >= startOfWeek;
      case "active":
        return isActiveApplication(application, now);
      case "dormant":
        return getMostRecentActivityDate(application) < thirtyDaysAgo;
      case "silent":
        return application.createdAt === application.updatedAt || !application.updatedAt;
      default:
        return true;
    }
  });
};

export const getDashboardMetrics = (
  applications: JobApplication[],
  now: Date = new Date(),
): DashboardMetrics => {
  const startOfWeek = getStartOfWeek(now);
  const thirtyDaysAgo = getThirtyDaysAgo(now);

  return {
    totalApplications: applications.length,
    weeklyApplications: applications.filter(
      (application) => new Date(application.createdAt) >= startOfWeek,
    ).length,
    activeApplications: applications.filter((application) =>
      isActiveApplication(application, now),
    ).length,
    dormantApplications: applications.filter(
      (application) => getMostRecentActivityDate(application) < thirtyDaysAgo,
    ).length,
    silentApplications: applications.filter(
      (application) =>
        application.createdAt === application.updatedAt || !application.updatedAt,
    ).length,
  };
};
