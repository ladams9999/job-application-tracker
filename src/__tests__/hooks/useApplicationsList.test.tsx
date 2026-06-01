import { renderHook } from "@testing-library/react";

import { useApplicationsList } from "@/hooks/useApplicationsList";
import { useApplicationsQuery } from "@/hooks/useApplicationQueries";
import { createQueryClientWrapper } from "@/test-utils/queryClient";
import type { JobApplication } from "@/types";

const mockDeleteApplication = jest.fn();
let mockSearch = "";
const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  useLocation: () => ({
    pathname: "/applications",
    search: mockSearch,
  }),
  useNavigate: () => mockNavigate,
}));

jest.mock("@/hooks/useApplicationQueries", () => ({
  applicationQueryKeys: {
    all: ["applications"],
  },
  useApplicationsQuery: jest.fn(),
}));

jest.mock("@/services/applicationService", () => ({
  deleteApplication: (...args: unknown[]) => mockDeleteApplication(...args),
}));

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

describe("useApplicationsList", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSearch = "";
    mockNavigate.mockReset();
    jest.useFakeTimers().setSystemTime(new Date("2026-06-15T12:00:00.000Z"));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("hydrates the dashboard view from the URL and preserves the fetched order within that subset", () => {
    mockSearch = "?view=active&sortBy=company&sortDirection=asc";

    mockUseApplicationsQuery.mockReturnValue({
      data: [
        buildApplication({
          id: "acme-active",
          company: "Acme",
          status: "interview",
          createdAt: "2026-06-10T12:00:00.000Z",
          updatedAt: "2026-06-12T12:00:00.000Z",
        }),
        buildApplication({
          id: "beta-dormant",
          company: "Beta",
          createdAt: "2026-04-10T12:00:00.000Z",
          updatedAt: "2026-04-12T12:00:00.000Z",
        }),
        buildApplication({
          id: "zeta-active",
          company: "Zeta",
          status: "offer",
          createdAt: "2026-06-05T12:00:00.000Z",
          updatedAt: "2026-06-11T12:00:00.000Z",
        }),
      ],
      error: null,
      isLoading: false,
      refetch: jest.fn(),
    } as ReturnType<typeof useApplicationsQuery>);

    const wrapper = createQueryClientWrapper();
    const { result } = renderHook(() => useApplicationsList(), { wrapper });

    expect(result.current.filter).toEqual({
      search: "",
      status: "all",
      sortBy: "company",
      sortDirection: "asc",
      view: "active",
    });
    expect(result.current.filteredApplications.map((application) => application.id)).toEqual([
      "acme-active",
      "zeta-active",
    ]);
  });
});
