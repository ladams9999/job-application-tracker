import { render, screen } from "@testing-library/react";

import AppErrorPanel from "@/components/error/AppErrorPanel";
import type { AppError } from "@/lib/appError";

describe("AppErrorPanel", () => {
  it("renders Supabase availability diagnostics", () => {
    const error: AppError = {
      category: "supabase-unavailable",
      summary: "Supabase is unavailable",
      technicalMessage: "Failed to fetch",
      retryable: true,
      operation: "load applications",
    };

    render(<AppErrorPanel error={error} />);

    expect(screen.getByText("Supabase unavailable")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Supabase is unavailable" })).toBeInTheDocument();
    expect(screen.getByText("Failed to fetch")).toBeInTheDocument();
    expect(screen.getByText("load applications")).toBeInTheDocument();
    expect(screen.getByText("Yes")).toBeInTheDocument();
  });

  it("renders record diagnostics including the raw failing value", () => {
    const error: AppError = {
      category: "invalid-record-data",
      summary: "Problem with application record",
      technicalMessage: "Invalid date-only value: 2026-13-99",
      retryable: false,
      operation: "map application row",
      recordId: "app-123",
      fieldName: "date_applied",
      rawValue: "2026-13-99",
    };

    render(<AppErrorPanel error={error} variant="screen" />);

    expect(screen.getByText("Invalid record data")).toBeInTheDocument();
    expect(screen.getByText("map application row")).toBeInTheDocument();
    expect(screen.getByText("app-123")).toBeInTheDocument();
    expect(screen.getByText("date_applied")).toBeInTheDocument();
    expect(screen.getByText("2026-13-99")).toBeInTheDocument();
    expect(screen.getByText("No")).toBeInTheDocument();
  });
});
