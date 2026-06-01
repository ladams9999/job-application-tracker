import { supabase } from "@/integrations/supabase/client";
import { applicationsApi } from "@/services/applicationsApi";
import type { Tables } from "@/integrations/supabase/types";

describe("applicationsApi", () => {
  const mockFrom = supabase.from as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("normalizes malformed record data with operation and field context", async () => {
    const mockSingle = jest.fn().mockResolvedValue({
      data: {
        id: "app-bad",
        company: "Acme",
        job_title: "Frontend Engineer",
        job_description: "Build UI features",
        date_applied: "not-a-date",
        status: "applied",
        notes: null,
        created_at: "2026-06-01T12:00:00.000Z",
        updated_at: "2026-06-02T12:00:00.000Z",
        source: null,
        recruiter: null,
        recruiting_firm: null,
        contact_email: null,
        contact_phone: null,
        application_url: null,
      } satisfies Tables<"job_applications">,
      error: null,
    });
    const mockEq = jest.fn().mockReturnValue({ single: mockSingle });
    const mockSelect = jest.fn().mockReturnValue({ eq: mockEq });

    mockFrom.mockReturnValue({
      select: mockSelect,
    });

    await expect(applicationsApi.getApplication("app-bad")).rejects.toMatchObject({
      category: "invalid-record-data",
      summary: "Problem with application record",
      technicalMessage: "Invalid date-only value: not-a-date",
      retryable: false,
      operation: "load application",
      recordId: "app-bad",
      fieldName: "date_applied",
      rawValue: "not-a-date",
    });
  });
});
