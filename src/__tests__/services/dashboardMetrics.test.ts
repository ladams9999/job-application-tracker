import {
  getDashboardMetrics,
  getMostRecentActivityDate,
  isActiveApplication,
  sortByMostRecentActivity,
} from "@/services/dashboardMetrics";
import type { JobApplication } from "@/types";

const buildApplication = (
  overrides: Partial<JobApplication> = {},
): JobApplication => ({
  id: "app-1",
  company: "Acme",
  jobTitle: "Frontend Engineer",
  jobDescription: "Build UI features",
  dateApplied: "2026-06-01",
  status: "applied",
  notes: "",
  createdAt: "2026-06-01T12:00:00.000Z",
  updatedAt: "2026-06-01T12:00:00.000Z",
  source: "LinkedIn",
  recruiter: "",
  recruitingFirm: "",
  contactEmail: "",
  contactPhone: "",
  applicationUrl: "",
  ...overrides,
});

describe("dashboardMetrics", () => {
  const now = new Date("2026-06-15T12:00:00.000Z");

  it("matches the current active dashboard rule", () => {
    expect(
      isActiveApplication(
        buildApplication({
          id: "recent-open",
          status: "interview",
          updatedAt: "2026-06-10T12:00:00.000Z",
        }),
        now,
      ),
    ).toBe(true);

    expect(
      isActiveApplication(
        buildApplication({
          id: "recent-closed",
          status: "rejected",
          updatedAt: "2026-06-10T12:00:00.000Z",
        }),
        now,
      ),
    ).toBe(false);

    expect(
      isActiveApplication(
        buildApplication({
          id: "old-open",
          status: "applied",
          updatedAt: "2026-05-20T12:00:00.000Z",
        }),
        now,
      ),
    ).toBe(false);
  });

  it("sorts applications by most recent activity descending", () => {
    const applications = [
      buildApplication({
        id: "oldest",
        updatedAt: "2026-05-25T12:00:00.000Z",
      }),
      buildApplication({
        id: "newest",
        updatedAt: "2026-06-14T12:00:00.000Z",
      }),
      buildApplication({
        id: "middle",
        updatedAt: "2026-06-01T12:00:00.000Z",
      }),
    ];

    expect(sortByMostRecentActivity(applications).map(({ id }) => id)).toEqual([
      "newest",
      "middle",
      "oldest",
    ]);
  });

  it("uses updatedAt when computing most recent activity", () => {
    expect(
      getMostRecentActivityDate(
        buildApplication({
          createdAt: "2026-05-01T12:00:00.000Z",
          updatedAt: "2026-06-12T12:00:00.000Z",
        }),
      ).toISOString(),
    ).toBe("2026-06-12T12:00:00.000Z");
  });

  it("derives dashboard counts from shared selectors", () => {
    const applications = [
      buildApplication({
        id: "weekly-active",
        createdAt: "2026-06-14T12:00:00.000Z",
        updatedAt: "2026-06-14T12:00:00.000Z",
        status: "applied",
      }),
      buildApplication({
        id: "active-not-weekly",
        createdAt: "2026-06-01T12:00:00.000Z",
        updatedAt: "2026-06-10T12:00:00.000Z",
        status: "interview",
      }),
      buildApplication({
        id: "dormant",
        createdAt: "2026-05-01T12:00:00.000Z",
        updatedAt: "2026-05-05T12:00:00.000Z",
        status: "applied",
      }),
      buildApplication({
        id: "silent-closed",
        createdAt: "2026-06-02T12:00:00.000Z",
        updatedAt: "2026-06-02T12:00:00.000Z",
        status: "withdrawn",
      }),
    ];

    expect(getDashboardMetrics(applications, now)).toEqual({
      totalApplications: 4,
      weeklyApplications: 1,
      activeApplications: 2,
      dormantApplications: 1,
      silentApplications: 2,
    });
  });
});
