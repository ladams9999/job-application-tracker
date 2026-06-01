import { type ReactNode } from "react";

import { type AppError } from "@/lib/appError";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ErrorAction {
  label: string;
  onClick: () => void;
}

interface AppErrorPanelProps {
  error: AppError;
  variant?: "panel" | "screen";
  primaryAction?: ErrorAction;
  secondaryAction?: ErrorAction;
  className?: string;
}

const formatRawValue = (value: unknown): string => {
  if (typeof value === "string") {
    return value;
  }

  if (value === undefined) {
    return "undefined";
  }

  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
};

const DetailRow = ({ label, children }: { label: string; children: ReactNode }) => (
  <div className="grid gap-1 sm:grid-cols-[140px_1fr] sm:gap-3">
    <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
    <dd className="text-sm text-foreground">{children}</dd>
  </div>
);

const categoryLabels: Record<AppError["category"], string> = {
  "supabase-unavailable": "Supabase unavailable",
  "app-config": "Configuration problem",
  "missing-record": "Missing record",
  "invalid-record-data": "Invalid record data",
  unknown: "Unknown error",
};

const content = (
  error: AppError,
  primaryAction?: ErrorAction,
  secondaryAction?: ErrorAction,
) => (
  <Card className="w-full max-w-3xl border-destructive/30 shadow-md">
    <CardHeader>
      <CardDescription>{categoryLabels[error.category]}</CardDescription>
      <CardTitle>{error.summary}</CardTitle>
      <CardDescription>
        The app hit an unexpected problem and could not finish this view.
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <dl className="space-y-3">
        <DetailRow label="Technical message">{error.technicalMessage}</DetailRow>
        {error.operation ? <DetailRow label="Operation">{error.operation}</DetailRow> : null}
        {error.recordId ? <DetailRow label="Record ID">{error.recordId}</DetailRow> : null}
        {error.fieldName ? <DetailRow label="Field">{error.fieldName}</DetailRow> : null}
        {error.rawValue !== undefined ? (
          <DetailRow label="Raw value">
            <pre className="overflow-x-auto rounded-md bg-muted p-3 text-xs leading-5 text-foreground">
              {formatRawValue(error.rawValue)}
            </pre>
          </DetailRow>
        ) : null}
        <DetailRow label="Retryable">{error.retryable ? "Yes" : "No"}</DetailRow>
      </dl>
    </CardContent>
    {primaryAction || secondaryAction ? (
      <CardFooter className="flex flex-wrap gap-3">
        {primaryAction ? (
          <Button onClick={primaryAction.onClick}>{primaryAction.label}</Button>
        ) : null}
        {secondaryAction ? (
          <Button variant="outline" onClick={secondaryAction.onClick}>
            {secondaryAction.label}
          </Button>
        ) : null}
      </CardFooter>
    ) : null}
  </Card>
);

const AppErrorPanel = ({
  error,
  variant = "panel",
  primaryAction,
  secondaryAction,
  className,
}: AppErrorPanelProps) => {
  if (variant === "screen") {
    return (
      <div
        className={cn(
          "flex min-h-screen items-center justify-center bg-background px-4 py-10",
          className,
        )}
      >
        {content(error, primaryAction, secondaryAction)}
      </div>
    );
  }

  return <div className={cn("mx-auto w-full max-w-3xl", className)}>{content(error, primaryAction, secondaryAction)}</div>;
};

export default AppErrorPanel;
