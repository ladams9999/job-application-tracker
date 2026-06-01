import { render, screen } from "@testing-library/react";

import AppErrorBoundary from "@/components/error/AppErrorBoundary";

describe("AppErrorBoundary", () => {
  const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

  afterEach(() => {
    consoleErrorSpy.mockClear();
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  it("renders the fallback screen when a child throws during render", () => {
    const ThrowingComponent = () => {
      throw new Error("Boom during render");
    };

    render(
      <AppErrorBoundary>
        <ThrowingComponent />
      </AppErrorBoundary>,
    );

    expect(screen.getByRole("heading", { name: "Unexpected application error" })).toBeInTheDocument();
    expect(screen.getByText("Boom during render")).toBeInTheDocument();
    expect(screen.getByText("render application")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Reload page" })).toBeInTheDocument();
  });
});
