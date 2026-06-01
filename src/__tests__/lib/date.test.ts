import { formatDateOnlyForStorage, formatStoredDateForDisplay, parseDateOnly } from '@/lib/date';

describe('date utilities', () => {
  it('round-trips a stored date-only value without changing the calendar day', () => {
    const parsedDate = parseDateOnly('2026-06-01');

    expect(parsedDate.getFullYear()).toBe(2026);
    expect(parsedDate.getMonth()).toBe(5);
    expect(parsedDate.getDate()).toBe(1);
    expect(formatDateOnlyForStorage(parsedDate)).toBe('2026-06-01');
  });

  it('formats stored date-only values for display', () => {
    expect(formatStoredDateForDisplay('2026-06-01')).toBe('06/01/2026');
  });
});
