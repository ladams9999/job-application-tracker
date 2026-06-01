
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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

const VIEW_LABELS: Record<Exclude<DashboardApplicationView, "all">, string> = {
  "this-week": "This Week",
  active: "Active",
  dormant: "Dormant",
  silent: "Silent",
};

export interface ApplicationFilterCriterion {
  id: "search" | "status" | "view";
  label: string;
  value: string;
}

const buildSearchFromFilter = (filter: ApplicationFilter): string => {
  const searchParams = new URLSearchParams();

  const trimmedSearch = filter.search.trim();
  if (trimmedSearch) {
    searchParams.set("search", trimmedSearch);
  }

  if (filter.status !== DEFAULT_FILTER.status) {
    searchParams.set("status", filter.status);
  }

  if (filter.sortBy !== DEFAULT_FILTER.sortBy) {
    searchParams.set("sortBy", filter.sortBy);
  }

  if (filter.sortDirection !== DEFAULT_FILTER.sortDirection) {
    searchParams.set("sortDirection", filter.sortDirection);
  }

  if (filter.view !== DEFAULT_FILTER.view) {
    searchParams.set("view", filter.view);
  }

  const search = searchParams.toString();

  return search ? `?${search}` : "";
};

const formatStatusLabel = (status: ApplicationStatus): string =>
  status.charAt(0).toUpperCase() + status.slice(1);

const getActiveCriteria = (
  filter: ApplicationFilter,
): ApplicationFilterCriterion[] => {
  const criteria: ApplicationFilterCriterion[] = [];

  const trimmedSearch = filter.search.trim();
  if (trimmedSearch) {
    criteria.push({
      id: "search",
      label: "Search",
      value: trimmedSearch,
    });
  }

  if (filter.status !== DEFAULT_FILTER.status) {
    criteria.push({
      id: "status",
      label: "Status",
      value: formatStatusLabel(filter.status),
    });
  }

  if (filter.view !== DEFAULT_FILTER.view) {
    criteria.push({
      id: "view",
      label: "View",
      value: VIEW_LABELS[filter.view],
    });
  }

  return criteria;
};

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
  const navigate = useNavigate();
  const [filter, setFilter] = useState<ApplicationFilter>(() =>
    getApplicationFilterFromSearch(location.search),
  );

  useEffect(() => {
    setFilter(getApplicationFilterFromSearch(location.search));
  }, [location.search]);

  const activeCriteria = useMemo(() => getActiveCriteria(filter), [filter]);

  const updateFilter = (
    nextFilter: ApplicationFilter,
    syncLocation: boolean = false,
  ) => {
    setFilter(nextFilter);

    if (syncLocation) {
      navigate(
        {
          pathname: location.pathname,
          search: buildSearchFromFilter(nextFilter),
        },
        { replace: true },
      );
    }
  };

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

  const clearSearchCriterion = () => {
    updateFilter(
      {
        ...filter,
        search: DEFAULT_FILTER.search,
      },
      true,
    );
  };

  const clearStatusCriterion = () => {
    updateFilter(
      {
        ...filter,
        status: DEFAULT_FILTER.status,
      },
      true,
    );
  };

  const clearViewCriterion = () => {
    updateFilter(
      {
        ...filter,
        view: DEFAULT_FILTER.view,
      },
      true,
    );
  };

  const clearAllCriteria = () => {
    updateFilter(
      {
        ...filter,
        search: DEFAULT_FILTER.search,
        status: DEFAULT_FILTER.status,
        view: DEFAULT_FILTER.view,
      },
      true,
    );
  };

  return {
    filter,
    activeCriteria,
    handleSearchChange,
    handleStatusChange,
    handleSortChange,
    clearSearchCriterion,
    clearStatusCriterion,
    clearViewCriterion,
    clearAllCriteria,
  };
};
