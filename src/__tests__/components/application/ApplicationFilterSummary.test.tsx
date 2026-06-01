import { fireEvent, render, screen } from "@testing-library/react";

import ApplicationFilterSummary from "@/components/application/ApplicationFilterSummary";
import type { ApplicationFilterCriterion } from "@/hooks/useApplicationFilters";

const criteria: ApplicationFilterCriterion[] = [
  { id: "search", label: "Search", value: "acme" },
  { id: "status", label: "Status", value: "Interview" },
  { id: "view", label: "View", value: "Active" },
];

describe("ApplicationFilterSummary", () => {
  it("renders the active criteria with per-chip clear actions and a clear-all button", () => {
    const onClearCriterion = jest.fn();
    const onClearAll = jest.fn();

    render(
      <ApplicationFilterSummary
        criteria={criteria}
        onClearCriterion={onClearCriterion}
        onClearAll={onClearAll}
      />,
    );

    expect(screen.getByText("Filtering by:")).toBeInTheDocument();
    expect(screen.getByText("Search:")).toBeInTheDocument();
    expect(screen.getByText("acme")).toBeInTheDocument();
    expect(screen.getByText("Status:")).toBeInTheDocument();
    expect(screen.getByText("Interview")).toBeInTheDocument();
    expect(screen.getByText("View:")).toBeInTheDocument();
    expect(screen.getByText("Active")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Clear search filter" }));
    fireEvent.click(screen.getByRole("button", { name: "Clear status filter" }));
    fireEvent.click(screen.getByRole("button", { name: "Clear view filter" }));
    fireEvent.click(screen.getByRole("button", { name: "Clear all" }));

    expect(onClearCriterion).toHaveBeenNthCalledWith(1, "search");
    expect(onClearCriterion).toHaveBeenNthCalledWith(2, "status");
    expect(onClearCriterion).toHaveBeenNthCalledWith(3, "view");
    expect(onClearAll).toHaveBeenCalledTimes(1);
  });

  it("renders nothing when there are no active criteria", () => {
    const { container } = render(
      <ApplicationFilterSummary
        criteria={[]}
        onClearCriterion={jest.fn()}
        onClearAll={jest.fn()}
      />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("omits the clear-all action when only one criterion is active", () => {
    render(
      <ApplicationFilterSummary
        criteria={[criteria[0]]}
        onClearCriterion={jest.fn()}
        onClearAll={jest.fn()}
      />,
    );

    expect(screen.queryByRole("button", { name: "Clear all" })).not.toBeInTheDocument();
  });
});
