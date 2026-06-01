export type AppErrorCategory =
  | "supabase-unavailable"
  | "app-config"
  | "missing-record"
  | "invalid-record-data"
  | "unknown";

export interface AppErrorContext {
  operation?: string;
  recordId?: string;
  fieldName?: string;
  rawValue?: unknown;
}

export interface AppError extends AppErrorContext {
  category: AppErrorCategory;
  summary: string;
  technicalMessage: string;
  retryable: boolean;
}

type ErrorLike = Record<string, unknown>;

const SUPABASE_CONFIGURATION_MESSAGE =
  "Missing Supabase environment variables. Please check your .env file.";

const isObject = (value: unknown): value is ErrorLike =>
  typeof value === "object" && value !== null;

const getStringProperty = (value: unknown, key: string): string | undefined => {
  if (!isObject(value)) {
    return undefined;
  }

  const property = value[key];
  return typeof property === "string" ? property : undefined;
};

const getNumericProperty = (value: unknown, key: string): number | undefined => {
  if (!isObject(value)) {
    return undefined;
  }

  const property = value[key];
  return typeof property === "number" ? property : undefined;
};

const withContext = (appError: AppError, context: AppErrorContext): AppError => ({
  ...appError,
  operation: context.operation ?? appError.operation,
  recordId: context.recordId ?? appError.recordId,
  fieldName: context.fieldName ?? appError.fieldName,
  rawValue: context.rawValue ?? appError.rawValue,
});

export class InvalidRecordDataError extends Error {
  readonly operation?: string;
  readonly recordId?: string;
  readonly fieldName?: string;
  readonly rawValue?: unknown;

  constructor(message: string, context: AppErrorContext = {}) {
    super(message);
    this.name = "InvalidRecordDataError";
    this.operation = context.operation;
    this.recordId = context.recordId;
    this.fieldName = context.fieldName;
    this.rawValue = context.rawValue;
  }
}

export const isAppError = (value: unknown): value is AppError => {
  if (!isObject(value)) {
    return false;
  }

  return (
    typeof value.category === "string" &&
    typeof value.summary === "string" &&
    typeof value.technicalMessage === "string" &&
    typeof value.retryable === "boolean"
  );
};

export const getTechnicalErrorMessage = (error: unknown): string => {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (typeof error === "string" && error.trim()) {
    return error;
  }

  const directMessage = getStringProperty(error, "message");
  if (directMessage) {
    return directMessage;
  }

  return "An unexpected error occurred.";
};

const isSupabaseConfigError = (technicalMessage: string) =>
  technicalMessage === SUPABASE_CONFIGURATION_MESSAGE;

const isMissingRecordError = (error: unknown, technicalMessage: string) => {
  const code = getStringProperty(error, "code");
  const details = getStringProperty(error, "details");

  if (code === "PGRST116") {
    return true;
  }

  if (/application( record)? not found/i.test(technicalMessage)) {
    return true;
  }

  return /0 rows/i.test(details ?? "");
};

const isSupabaseUnavailableError = (error: unknown, technicalMessage: string) => {
  const status = getNumericProperty(error, "status");
  const code = getStringProperty(error, "code");
  const name = getStringProperty(error, "name");
  const combinedText = `${technicalMessage} ${code ?? ""} ${name ?? ""}`;

  if (typeof status === "number" && status >= 500) {
    return true;
  }

  if (code === "ECONNREFUSED") {
    return true;
  }

  return /(failed to fetch|fetch failed|network ?error|load failed|service unavailable)/i.test(
    combinedText,
  );
};

export const normalizeAppError = (
  error: unknown,
  context: AppErrorContext = {},
): AppError => {
  if (isAppError(error)) {
    return withContext(error, context);
  }

  if (error instanceof InvalidRecordDataError) {
    return {
      category: "invalid-record-data",
      summary: "Problem with application record",
      technicalMessage: error.message,
      retryable: false,
      operation: error.operation ?? context.operation,
      recordId: error.recordId ?? context.recordId,
      fieldName: error.fieldName ?? context.fieldName,
      rawValue: error.rawValue ?? context.rawValue,
    };
  }

  const technicalMessage = getTechnicalErrorMessage(error);

  if (isSupabaseConfigError(technicalMessage)) {
    return {
      category: "app-config",
      summary: "Supabase configuration is missing",
      technicalMessage,
      retryable: false,
      ...context,
    };
  }

  if (isMissingRecordError(error, technicalMessage)) {
    return {
      category: "missing-record",
      summary: "Application record not found",
      technicalMessage,
      retryable: false,
      ...context,
    };
  }

  if (isSupabaseUnavailableError(error, technicalMessage)) {
    return {
      category: "supabase-unavailable",
      summary: "Supabase is unavailable",
      technicalMessage,
      retryable: true,
      ...context,
    };
  }

  return {
    category: "unknown",
    summary: "Unexpected application error",
    technicalMessage,
    retryable: false,
    ...context,
  };
};
