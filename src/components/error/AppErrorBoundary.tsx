import { Component, type ErrorInfo, type ReactNode } from "react";

import { normalizeAppError, type AppError } from "@/lib/appError";
import AppErrorPanel from "@/components/error/AppErrorPanel";

interface AppErrorBoundaryProps {
  children: ReactNode;
}

interface AppErrorBoundaryState {
  appError: AppError | null;
}

class AppErrorBoundary extends Component<
  AppErrorBoundaryProps,
  AppErrorBoundaryState
> {
  state: AppErrorBoundaryState = {
    appError: null,
  };

  static getDerivedStateFromError(error: unknown): AppErrorBoundaryState {
    return {
      appError: normalizeAppError(error, { operation: "render application" }),
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Unhandled application error:", error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ appError: null });
  };

  private handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.appError) {
      return (
        <AppErrorPanel
          error={this.state.appError}
          variant="screen"
          primaryAction={
            this.state.appError.retryable
              ? {
                  label: "Try again",
                  onClick: this.handleRetry,
                }
              : undefined
          }
          secondaryAction={{
            label: "Reload page",
            onClick: this.handleReload,
          }}
        />
      );
    }

    return this.props.children;
  }
}

export default AppErrorBoundary;
