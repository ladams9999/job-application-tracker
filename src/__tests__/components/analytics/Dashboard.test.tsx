import { render, screen } from "@testing-library/react";

import Dashboard from "@/components/analytics/Dashboard";
import type { AppError } from "@/lib/appError";
import { useApplicationsQuery } from "@/hooks/useApplicationQueries";

jest.mock("@/hooks/useApplicationQueries");

const mockUseApplicationsQuery = useApplicationsQuery as jest.MockedFunction<
  typeof useApplicationsQuery
>;

describe("Dashboard", () => {
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

    render(<Dashboard />);

    expect(screen.getByRole("heading", { name: "Supabase is unavailable" })).toBeInTheDocument();
    expect(screen.getByText("load dashboard")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Retry dashboard" })).toBeInTheDocument();
  });
});
