export function toLocalDatetimeInputValue(date: Date): string {
  const pad = (value: number): string => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function parseLocalDatetimeInput(value: string): string | null {
  const matched = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(value);
  if (!matched) {
    return null;
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }
  if (toLocalDatetimeInputValue(parsed) !== value) {
    return null;
  }
  return parsed.toISOString();
}
