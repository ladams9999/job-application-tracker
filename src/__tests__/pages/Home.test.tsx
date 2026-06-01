import { render, screen, within } from "@testing-library/react";

import Home from "@/pages/Home";
import { useApplicationsQuery } from "@/hooks/useApplicationQueries";
import type { JobApplication } from "@/types";

jest.mock("@/components/analytics/Dashboard", () => () => <div>Dashboard</div>);
jest.mock("@/hooks/useApplicationQueries");

const mockUseApplicationsQuery = useApplicationsQuery as jest.MockedFunction<
  typeof useApplicationsQuery
>;

const buildApplication = (
  overrides: Partial<JobApplication> = {},
): JobApplication => ({
  id: "application-1",
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

describe("Home", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers().setSystemTime(new Date("2026-06-15T12:00:00.000Z"));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("shows only active applications sorted by most recent activity", () => {
    mockUseApplicationsQuery.mockReturnValue({
      data: [
        buildApplication({
          id: "second-most-recent",
          company: "Bravo",
          status: "interview",
          createdAt: "2026-06-02T12:00:00.000Z",
          updatedAt: "2026-06-10T12:00:00.000Z",
        }),
        buildApplication({
          id: "dormant",
          company: "Dormant Co",
          createdAt: "2026-04-01T12:00:00.000Z",
          updatedAt: "2026-04-05T12:00:00.000Z",
        }),
        buildApplication({
          id: "most-recent",
          company: "Acme",
          status: "offer",
          createdAt: "2026-06-03T12:00:00.000Z",
          updatedAt: "2026-06-12T12:00:00.000Z",
        }),
        buildApplication({
          id: "closed",
          company: "Closed Co",
          status: "withdrawn",
          createdAt: "2026-06-04T12:00:00.000Z",
          updatedAt: "2026-06-13T12:00:00.000Z",
        }),
      ],
      error: null,
      isLoading: false,
      refetch: jest.fn(),
    } as ReturnType<typeof useApplicationsQuery>);

    render(<Home />);

    expect(screen.getByRole("heading", { name: "Active Applications" })).toBeInTheDocument();

    const items = within(
      screen.getByRole("list", { name: "Active applications" }),
    ).getAllByRole("listitem");

    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent("Acme");
    expect(items[1]).toHaveTextContent("Bravo");
    expect(screen.queryByText("Dormant Co")).not.toBeInTheDocument();
    expect(screen.queryByText("Closed Co")).not.toBeInTheDocument();
  });

  it("renders a reasonable empty state when no active applications match", () => {
    mockUseApplicationsQuery.mockReturnValue({
      data: [
        buildApplication({
          id: "dormant",
          company: "Dormant Co",
          createdAt: "2026-04-01T12:00:00.000Z",
          updatedAt: "2026-04-05T12:00:00.000Z",
        }),
      ],
      error: null,
      isLoading: false,
      refetch: jest.fn(),
    } as ReturnType<typeof useApplicationsQuery>);

    render(<Home />);

    expect(screen.getByText("No active applications right now.")).toBeInTheDocument();
  });
});
