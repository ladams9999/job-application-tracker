import { X } from "lucide-react";

import type { ApplicationFilterCriterion } from "@/hooks/useApplicationFilters";
import { Button } from "@/components/ui/button";

interface ApplicationFilterSummaryProps {
  criteria: ApplicationFilterCriterion[];
  onClearCriterion: (id: ApplicationFilterCriterion["id"]) => void;
  onClearAll: () => void;
}

const ApplicationFilterSummary = ({
  criteria,
  onClearCriterion,
  onClearAll,
}: ApplicationFilterSummaryProps) => {
  if (criteria.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-lg border bg-muted/30 px-4 py-3">
      <p className="text-sm font-medium text-foreground">Filtering by:</p>

      <div className="flex flex-wrap items-center gap-2">
        {criteria.map((criterion) => (
          <div
            key={criterion.id}
            className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-sm"
          >
            <span className="text-muted-foreground">{criterion.label}:</span>
            <span className="font-medium text-foreground">{criterion.value}</span>
            <button
              type="button"
              className="rounded-full text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              onClick={() => onClearCriterion(criterion.id)}
              aria-label={`Clear ${criterion.label.toLowerCase()} filter`}
            >
              <X size={12} />
            </button>
          </div>
        ))}
      </div>

      {criteria.length > 1 ? (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-auto px-2 py-1 text-sm"
          onClick={onClearAll}
        >
          Clear all
        </Button>
      ) : null}
    </div>
  );
};

export default ApplicationFilterSummary;
