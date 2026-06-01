
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  ApplicationFilter,
  ApplicationStatus,
  DashboardApplicationView,
} from "@/types";

const DEFAULT_FILTER: ApplicationFilter = {
  search: "",
  status: "all",
  sortBy: "dateApplied",
  sortDirection: "desc",
  view: "all",
};

const VALID_STATUSES = new Set<ApplicationStatus>([
  "applied",
  "interview",
  "offer",
  "rejected",
  "withdrawn",
]);
const VALID_SORT_FIELDS = new Set<ApplicationFilter["sortBy"]>([
  "dateApplied",
  "company",
  "jobTitle",
  "status",
]);
const VALID_SORT_DIRECTIONS = new Set<ApplicationFilter["sortDirection"]>([
  "asc",
  "desc",
]);
const VALID_VIEWS = new Set<DashboardApplicationView>([
  "all",
  "this-week",
  "active",
  "dormant",
  "silent",
]);

export const getApplicationFilterFromSearch = (
  search: string,
): ApplicationFilter => {
  const searchParams = new URLSearchParams(search);
  const status = searchParams.get("status");
  const sortBy = searchParams.get("sortBy");
  const sortDirection = searchParams.get("sortDirection");
  const view = searchParams.get("view");

  return {
    search: searchParams.get("search") ?? DEFAULT_FILTER.search,
    status:
      status === "all" || (status !== null && VALID_STATUSES.has(status as ApplicationStatus))
        ? (status as ApplicationFilter["status"])
        : DEFAULT_FILTER.status,
    sortBy:
      sortBy !== null && VALID_SORT_FIELDS.has(sortBy as ApplicationFilter["sortBy"])
        ? (sortBy as ApplicationFilter["sortBy"])
        : DEFAULT_FILTER.sortBy,
    sortDirection:
      sortDirection !== null &&
      VALID_SORT_DIRECTIONS.has(sortDirection as ApplicationFilter["sortDirection"])
        ? (sortDirection as ApplicationFilter["sortDirection"])
        : DEFAULT_FILTER.sortDirection,
    view:
      view !== null && VALID_VIEWS.has(view as DashboardApplicationView)
        ? (view as DashboardApplicationView)
        : DEFAULT_FILTER.view,
  };
};

export const useApplicationFilters = () => {
  const location = useLocation();
  const [filter, setFilter] = useState<ApplicationFilter>(() =>
    getApplicationFilterFromSearch(location.search),
  );

  useEffect(() => {
    setFilter(getApplicationFilterFromSearch(location.search));
  }, [location.search]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter((currentFilter) => ({
      ...currentFilter,
      search: e.target.value,
    }));
  };

  const handleStatusChange = (value: string) => {
    setFilter((currentFilter) => ({
      ...currentFilter,
      status: value as ApplicationStatus | "all",
    }));
  };

  const handleSortChange = (field: "dateApplied" | "company" | "jobTitle" | "status") => {
    setFilter((currentFilter) =>
      currentFilter.sortBy === field
        ? {
            ...currentFilter,
            sortDirection: currentFilter.sortDirection === "asc" ? "desc" : "asc",
          }
        : {
            ...currentFilter,
            sortBy: field,
            sortDirection: "asc",
          },
    );
  };

  return {
    filter,
    handleSearchChange,
    handleStatusChange,
    handleSortChange,
  };
};
