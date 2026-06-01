import { JobApplication } from "@/types";

export const SUGGESTION_QUERY_LIMIT = 200;

export const filterApplicationsBySearch = (
  applications: JobApplication[],
  search: string,
): JobApplication[] => {
  const normalizedSearch = search.trim().toLocaleLowerCase();

  if (!normalizedSearch) {
    return applications;
  }

  return applications.filter((application) => {
    const company = application.company.toLocaleLowerCase();
    const jobTitle = application.jobTitle.toLocaleLowerCase();

    return company.includes(normalizedSearch) || jobTitle.includes(normalizedSearch);
  });
};

export const extractUniqueValues = <T>(
  rows: T[] | null,
  getValue: (row: T) => string | null | undefined,
): string[] => {
  const uniqueValues = new Set<string>();

  for (const row of rows ?? []) {
    const value = getValue(row)?.trim();

    if (value) {
      uniqueValues.add(value);
    }
  }

  return [...uniqueValues];
};
