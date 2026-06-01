import { act, renderHook } from "@testing-library/react";
import type { ChangeEvent } from "react";

import {
  getApplicationFilterFromSearch,
  useApplicationFilters,
} from "@/hooks/useApplicationFilters";

let mockSearch = "";
const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  useLocation: () => ({
    pathname: "/applications",
    search: mockSearch,
  }),
  useNavigate: () => mockNavigate,
}));

describe("useApplicationFilters", () => {
  beforeEach(() => {
    mockSearch = "";
    mockNavigate.mockReset();
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
    expect(result.current.activeCriteria).toEqual([
      { id: "search", label: "Search", value: "acme" },
      { id: "status", label: "Status", value: "Interview" },
      { id: "view", label: "View", value: "Active" },
    ]);
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
    expect(result.current.activeCriteria).toEqual([
      { id: "search", label: "Search", value: "globex" },
      { id: "status", label: "Status", value: "Offer" },
      { id: "view", label: "View", value: "Active" },
    ]);
  });

  it("clears an individual criterion and preserves the remaining URL-backed params", () => {
    mockSearch =
      "?view=active&status=interview&search=acme&sortBy=company&sortDirection=asc";

    const { result } = renderHook(() => useApplicationFilters());

    act(() => {
      result.current.clearSearchCriterion();
    });

    expect(result.current.filter).toEqual({
      search: "",
      status: "interview",
      sortBy: "company",
      sortDirection: "asc",
      view: "active",
    });
    expect(result.current.activeCriteria).toEqual([
      { id: "status", label: "Status", value: "Interview" },
      { id: "view", label: "View", value: "Active" },
    ]);
    expect(mockNavigate).toHaveBeenCalledWith(
      {
        pathname: "/applications",
        search: "?status=interview&sortBy=company&sortDirection=asc&view=active",
      },
      { replace: true },
    );
  });

  it("clears all active criteria while preserving sort state", () => {
    mockSearch =
      "?view=dormant&status=offer&search=globex&sortBy=company&sortDirection=asc";

    const { result } = renderHook(() => useApplicationFilters());

    act(() => {
      result.current.clearAllCriteria();
    });

    expect(result.current.filter).toEqual({
      search: "",
      status: "all",
      sortBy: "company",
      sortDirection: "asc",
      view: "all",
    });
    expect(result.current.activeCriteria).toEqual([]);
    expect(mockNavigate).toHaveBeenCalledWith(
      {
        pathname: "/applications",
        search: "?sortBy=company&sortDirection=asc",
      },
      { replace: true },
    );
  });
});
