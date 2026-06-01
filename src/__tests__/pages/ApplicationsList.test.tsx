import { render, screen } from "@testing-library/react";
import type { ApplicationFilterCriterion } from "@/hooks/useApplicationFilters";

import ApplicationsList from "@/pages/ApplicationsList";
import type { AppError } from "@/lib/appError";
import { useApplicationsList } from "@/hooks/useApplicationsList";

jest.mock("@/hooks/useApplicationsList");
jest.mock("@/components/analytics/Dashboard", () => () => <div>Dashboard</div>);
jest.mock("@/components/application/ApplicationsHeader", () => () => <div>Header</div>);
jest.mock("@/components/application/FilterBar", () => () => <div>Filter bar</div>);
jest.mock("@/components/application/ApplicationsTable", () => () => <div>Applications table</div>);

const mockUseApplicationsList = useApplicationsList as jest.MockedFunction<
  typeof useApplicationsList
>;

const buildUseApplicationsListResult = (
  overrides: Partial<ReturnType<typeof useApplicationsList>> = {},
): ReturnType<typeof useApplicationsList> => ({
  filteredApplications: [],
  isLoading: false,
  error: null,
  retryLoad: jest.fn(),
  filter: {
    search: "",
    status: "all",
    sortBy: "dateApplied",
    sortDirection: "desc",
    view: "all",
  },
  activeCriteria: [],
  handleSearchChange: jest.fn(),
  handleStatusChange: jest.fn(),
  handleSortChange: jest.fn(),
  handleClearCriterion: jest.fn(),
  clearAllCriteria: jest.fn(),
  handleDelete: jest.fn(),
  ...overrides,
});

describe("ApplicationsList", () => {
  it("renders the filter summary between the header and filter bar when criteria are active", () => {
    const activeCriteria: ApplicationFilterCriterion[] = [
      { id: "search", label: "Search", value: "acme" },
      { id: "view", label: "View", value: "Active" },
    ];

    mockUseApplicationsList.mockReturnValue(
      buildUseApplicationsListResult({
        activeCriteria,
      }),
    );

    render(<ApplicationsList />);

    const header = screen.getByText("Header");
    const summary = screen.getByText("Filtering by:");
    const filterBar = screen.getByText("Filter bar");

    expect(header.compareDocumentPosition(summary)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(summary.compareDocumentPosition(filterBar)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(screen.getByText("Search:")).toBeInTheDocument();
    expect(screen.getByText("acme")).toBeInTheDocument();
    expect(screen.getByText("View:")).toBeInTheDocument();
    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it("keeps the existing loading state intact", () => {
    mockUseApplicationsList.mockReturnValue(
      buildUseApplicationsListResult({
        isLoading: true,
      }),
    );

    render(<ApplicationsList />);

    expect(screen.getByText("Loading applications...")).toBeInTheDocument();
    expect(screen.queryByText("Applications table")).not.toBeInTheDocument();
  });

  it("renders a structured error panel instead of generic text", () => {
    const error: AppError = {
      category: "supabase-unavailable",
      summary: "Supabase is unavailable",
      technicalMessage: "Failed to fetch",
      retryable: true,
      operation: "load applications",
    };

    mockUseApplicationsList.mockReturnValue(
      buildUseApplicationsListResult({
        error,
      }),
    );

    render(<ApplicationsList />);

    expect(screen.getByRole("heading", { name: "Supabase is unavailable" })).toBeInTheDocument();
    expect(screen.getByText("Failed to fetch")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Retry applications" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Reload page" })).toBeInTheDocument();
  });
});
