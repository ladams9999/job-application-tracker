import { render, screen, within } from "@testing-library/react";
import type { ReactNode } from "react";

import Dashboard from "@/components/analytics/Dashboard";
import type { AppError } from "@/lib/appError";
import { useApplicationsQuery } from "@/hooks/useApplicationQueries";
import type { JobApplication } from "@/types";

jest.mock("@/hooks/useApplicationQueries");
jest.mock("react-router-dom", () => ({
  Link: ({
    to,
    children,
    ...props
  }: {
    to: string;
    children: ReactNode;
  }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}));

const mockUseApplicationsQuery = useApplicationsQuery as jest.MockedFunction<
  typeof useApplicationsQuery
>;

const renderDashboard = () => render(<Dashboard />);

describe("Dashboard", () => {
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

  it("renders structured diagnostics when the dashboard query fails", () => {
    const error: AppError = {
      category: "supabase-unavailable",
      summary: "Supabase is unavailable",
      technicalMessage: "Failed to fetch",
      retryable: true,
      operation: "load applications",
    };

    mockUseApplicationsQuery.mockReturnValue({
      data: undefined,
      error,
      isLoading: false,
      refetch: jest.fn(),
    } as ReturnType<typeof useApplicationsQuery>);

    renderDashboard();

    expect(screen.getByRole("heading", { name: "Supabase is unavailable" })).toBeInTheDocument();
    expect(screen.getByText("load dashboard")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Retry dashboard" })).toBeInTheDocument();
  });

  it("renders the same dashboard counts from the shared selectors", () => {
    jest.useFakeTimers().setSystemTime(new Date("2026-06-15T12:00:00.000Z"));

    mockUseApplicationsQuery.mockReturnValue({
      data: [
        buildApplication({
          id: "weekly-active",
          createdAt: "2026-06-14T12:00:00.000Z",
          updatedAt: "2026-06-14T12:00:00.000Z",
        }),
        buildApplication({
          id: "active-not-weekly",
          status: "interview",
          createdAt: "2026-06-01T12:00:00.000Z",
          updatedAt: "2026-06-10T12:00:00.000Z",
        }),
        buildApplication({
          id: "dormant",
          createdAt: "2026-05-01T12:00:00.000Z",
          updatedAt: "2026-05-05T12:00:00.000Z",
        }),
        buildApplication({
          id: "silent-closed",
          status: "withdrawn",
          createdAt: "2026-06-02T12:00:00.000Z",
          updatedAt: "2026-06-02T12:00:00.000Z",
        }),
      ],
      error: null,
      isLoading: false,
      refetch: jest.fn(),
    } as ReturnType<typeof useApplicationsQuery>);

    renderDashboard();

    expect(screen.getByText("This Week")).toBeInTheDocument();
    expect(screen.getByText("Active")).toBeInTheDocument();
    expect(screen.getByText("Dormant")).toBeInTheDocument();
    expect(screen.getByText("Silent")).toBeInTheDocument();
    expect(screen.getByText("Total")).toBeInTheDocument();

    expect(
      within(screen.getByText("This Week").closest(".rounded-xl") as HTMLElement).getByText("1"),
    ).toBeInTheDocument();
    expect(
      within(screen.getByText("Active").closest(".rounded-xl") as HTMLElement).getByText("2"),
    ).toBeInTheDocument();
    expect(
      within(screen.getByText("Dormant").closest(".rounded-xl") as HTMLElement).getByText("1"),
    ).toBeInTheDocument();
    expect(
      within(screen.getByText("Silent").closest(".rounded-xl") as HTMLElement).getByText("2"),
    ).toBeInTheDocument();
    expect(
      within(screen.getByText("Total").closest(".rounded-xl") as HTMLElement).getByText("4"),
    ).toBeInTheDocument();

    jest.useRealTimers();
  });

  it("renders the expected deep-link targets for supported cards", () => {
    mockUseApplicationsQuery.mockReturnValue({
      data: [],
      error: null,
      isLoading: false,
      refetch: jest.fn(),
    } as ReturnType<typeof useApplicationsQuery>);

    renderDashboard();

    expect(screen.getByText("This Week").closest("a")).toHaveAttribute(
      "href",
      "/applications?view=this-week",
    );
    expect(screen.getByText("Active").closest("a")).toHaveAttribute(
      "href",
      "/applications?view=active",
    );
    expect(screen.getByText("Dormant").closest("a")).toHaveAttribute(
      "href",
      "/applications?view=dormant",
    );
    expect(screen.getByText("Silent").closest("a")).toHaveAttribute(
      "href",
      "/applications?view=silent",
    );
    expect(screen.getByText("Total").closest("a")).toHaveAttribute(
      "href",
      "/applications",
    );
  });
});
