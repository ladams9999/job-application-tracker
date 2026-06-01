import { act, renderHook } from "@testing-library/react";
import type { ChangeEvent } from "react";

import {
  getApplicationFilterFromSearch,
  useApplicationFilters,
} from "@/hooks/useApplicationFilters";

let mockSearch = "";

jest.mock("react-router-dom", () => ({
  useLocation: () => ({
    pathname: "/applications",
    search: mockSearch,
  }),
}));

describe("useApplicationFilters", () => {
  beforeEach(() => {
    mockSearch = "";
  });

  it("hydrates the applications filter from query parameters", () => {
    mockSearch =
      "?view=active&status=interview&search=acme&sortBy=company&sortDirection=asc";

    const { result } = renderHook(() => useApplicationFilters());

    expect(result.current.filter).toEqual({
      search: "acme",
      status: "interview",
      sortBy: "company",
      sortDirection: "asc",
      view: "active",
    });
  });

  it("falls back to safe defaults when query parameters are invalid", () => {
    expect(
      getApplicationFilterFromSearch(
        "?view=invalid&status=nope&sortBy=createdAt&sortDirection=sideways",
      ),
    ).toEqual({
      search: "",
      status: "all",
      sortBy: "dateApplied",
      sortDirection: "desc",
      view: "all",
    });
  });

  it("preserves manual filter updates after the initial URL hydration", () => {
    mockSearch = "?view=active&search=acme";

    const { result } = renderHook(() => useApplicationFilters());

    act(() => {
      result.current.handleSearchChange({
        target: { value: "globex" },
      } as ChangeEvent<HTMLInputElement>);
      result.current.handleStatusChange("offer");
      result.current.handleSortChange("company");
    });

    expect(result.current.filter).toEqual({
      search: "globex",
      status: "offer",
      sortBy: "company",
      sortDirection: "asc",
      view: "active",
    });
  });
});
