import { render, screen } from "@testing-library/react";

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

describe("ApplicationsList", () => {
  it("renders a structured error panel instead of generic text", () => {
    const error: AppError = {
      category: "supabase-unavailable",
      summary: "Supabase is unavailable",
      technicalMessage: "Failed to fetch",
      retryable: true,
      operation: "load applications",
    };

    mockUseApplicationsList.mockReturnValue({
      filteredApplications: [],
      isLoading: false,
      error,
      retryLoad: jest.fn(),
      filter: {
        search: "",
        status: "all",
        sortBy: "dateApplied",
        sortDirection: "desc",
        view: "all",
      },
      handleSearchChange: jest.fn(),
      handleStatusChange: jest.fn(),
      handleSortChange: jest.fn(),
      handleDelete: jest.fn(),
    });

    render(<ApplicationsList />);

    expect(screen.getByRole("heading", { name: "Supabase is unavailable" })).toBeInTheDocument();
    expect(screen.getByText("Failed to fetch")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Retry applications" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Reload page" })).toBeInTheDocument();
  });
});
