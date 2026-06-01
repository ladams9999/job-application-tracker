import { format } from "date-fns";

const DATE_ONLY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const STORED_DATE_PREFIX_PATTERN = /^(\d{4})-(\d{2})-(\d{2})(?:$|[T\s])/;

export const normalizeStoredDateValue = (value: string): string => {
  const trimmedValue = value.trim();
  const timestampMatch = STORED_DATE_PREFIX_PATTERN.exec(trimmedValue);

  if (timestampMatch) {
    const [, year, month, day] = timestampMatch;
    return `${year}-${month}-${day}`;
  }

  throw new Error(`Invalid date-only value: ${value}`);
};

export const formatDateOnlyForStorage = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const parseDateOnly = (value: string): Date => {
  const normalizedValue = normalizeStoredDateValue(value);
  const match = DATE_ONLY_PATTERN.exec(normalizedValue);

  if (!match) {
    throw new Error(`Invalid date-only value: ${value}`);
  }

  const [, year, month, day] = match;

  return new Date(Number(year), Number(month) - 1, Number(day));
};

export const formatStoredDateForDisplay = (value: string): string => {
  return format(parseDateOnly(value), "P");
};
