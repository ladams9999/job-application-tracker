import { render, screen } from "@testing-library/react";

import ApplicationForm from "@/pages/ApplicationForm";
import type { AppError } from "@/lib/appError";
import { useApplicationForm } from "@/hooks/useApplicationForm";

jest.mock("@/hooks/useApplicationForm");
jest.mock("react-router-dom", () => ({
  useParams: () => ({ id: "existing-id" }),
}));

const mockUseApplicationForm = useApplicationForm as jest.MockedFunction<
  typeof useApplicationForm
>;

describe("ApplicationForm", () => {
  it("renders the structured load error instead of the edit form", () => {
    const error: AppError = {
      category: "missing-record",
      summary: "Application record not found",
      technicalMessage: "Application not found",
      retryable: false,
      operation: "load application",
      recordId: "existing-id",
    };

    mockUseApplicationForm.mockReturnValue({
      form: {} as ReturnType<typeof useApplicationForm>["form"],
      isSubmitting: false,
      isLoading: false,
      isEditMode: true,
      loadError: error,
      retryLoad: jest.fn(),
      onSubmit: jest.fn(),
      previousEntries: {
        companies: [],
        jobTitles: [],
        sources: ["LinkedIn"],
      },
      showRecruiterFields: false,
    });

    render(<ApplicationForm />);

    expect(screen.getByRole("heading", { name: "Application record not found" })).toBeInTheDocument();
    expect(screen.getByText("existing-id")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Retry load" })).toBeInTheDocument();
    expect(screen.queryByText("Job Details")).not.toBeInTheDocument();
  });
});
