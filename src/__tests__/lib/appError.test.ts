import {
  InvalidRecordDataError,
  normalizeAppError,
  type AppError,
} from "@/lib/appError";

describe("appError", () => {
  it("classifies missing Supabase configuration errors", () => {
    expect(
      normalizeAppError(
        new Error("Missing Supabase environment variables. Please check your .env file."),
        { operation: "initialize supabase client" },
      ),
    ).toEqual<AppError>({
      category: "app-config",
      summary: "Supabase configuration is missing",
      technicalMessage:
        "Missing Supabase environment variables. Please check your .env file.",
      retryable: false,
      operation: "initialize supabase client",
    });
  });

  it("classifies missing-record Supabase responses", () => {
    expect(
      normalizeAppError(
        {
          code: "PGRST116",
          message: "JSON object requested, multiple (or no) rows returned",
          details: "The result contains 0 rows",
        },
        { operation: "load application", recordId: "app-42" },
      ),
    ).toEqual<AppError>({
      category: "missing-record",
      summary: "Application record not found",
      technicalMessage: "JSON object requested, multiple (or no) rows returned",
      retryable: false,
      operation: "load application",
      recordId: "app-42",
    });
  });

  it("classifies invalid record data errors with record context", () => {
    expect(
      normalizeAppError(
        new InvalidRecordDataError("Invalid date-only value: 2026-13-99", {
          operation: "map application row",
          recordId: "app-1",
          fieldName: "date_applied",
          rawValue: "2026-13-99",
        }),
      ),
    ).toEqual<AppError>({
      category: "invalid-record-data",
      summary: "Problem with application record",
      technicalMessage: "Invalid date-only value: 2026-13-99",
      retryable: false,
      operation: "map application row",
      recordId: "app-1",
      fieldName: "date_applied",
      rawValue: "2026-13-99",
    });
  });

  it("classifies transient fetch failures as Supabase unavailable", () => {
    expect(
      normalizeAppError(new TypeError("Failed to fetch"), {
        operation: "load applications",
      }),
    ).toEqual<AppError>({
      category: "supabase-unavailable",
      summary: "Supabase is unavailable",
      technicalMessage: "Failed to fetch",
      retryable: true,
      operation: "load applications",
    });
  });

  it("falls back to an unknown application error", () => {
    expect(normalizeAppError("Boom")).toEqual<AppError>({
      category: "unknown",
      summary: "Unexpected application error",
      technicalMessage: "Boom",
      retryable: false,
    });
  });
});
