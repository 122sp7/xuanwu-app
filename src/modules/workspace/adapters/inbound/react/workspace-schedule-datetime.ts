export function toLocalDatetimeInputValue(date: Date): string {
  const pad = (value: number): string => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function parseLocalDatetimeInput(value: string): string | null {
  const matched = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(value);
  if (!matched) {
    return null;
  }
  const [, year, month, day, hour, minute] = matched;
  const y = Number(year);
  const m = Number(month);
  const d = Number(day);
  const h = Number(hour);
  const min = Number(minute);
  const utcProbe = new Date(Date.UTC(y, m - 1, d, h, min));
  if (
    utcProbe.getUTCFullYear() !== y ||
    utcProbe.getUTCMonth() !== m - 1 ||
    utcProbe.getUTCDate() !== d ||
    utcProbe.getUTCHours() !== h ||
    utcProbe.getUTCMinutes() !== min
  ) {
    return null;
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }
  return parsed.toISOString();
}
