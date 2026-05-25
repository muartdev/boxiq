export function getLocalDateString(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function parseDateString(dateStr: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function getDaysDiff(d1Str: string, d2Str: string): number {
  const d1 = parseDateString(d1Str);
  const d2 = parseDateString(d2Str);
  const oneDay = 24 * 60 * 60 * 1000;
  const utc1 = Date.UTC(d1.getFullYear(), d1.getMonth(), d1.getDate());
  const utc2 = Date.UTC(d2.getFullYear(), d2.getMonth(), d2.getDate());
  return Math.round((utc2 - utc1) / oneDay);
}

export function areDatesConsecutive(d1Str: string, d2Str: string): boolean {
  return getDaysDiff(d1Str, d2Str) === 1;
}
