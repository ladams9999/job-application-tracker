import { TextDecoder, TextEncoder } from "util";

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as typeof global.TextDecoder;

jest.mock("react-router-dom", () => jest.requireActual("react-router-dom"));
jest.mock("@/components/analytics/Dashboard", () => () => <div>Dashboard</div>);
jest.mock("@/hooks/useApplicationQueries", () => ({
  useApplicationsQuery: () => ({
    data: [],
    error: null,
    isLoading: false,
    refetch: jest.fn(),
  }),
}));

import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import { AppRoutes } from "@/App";

describe("AppRoutes", () => {
  it("renders Home at the root route instead of redirecting to Applications", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <AppRoutes />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("heading", {
        name: "Home",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.queryByText("Header")).not.toBeInTheDocument();
  });
});
