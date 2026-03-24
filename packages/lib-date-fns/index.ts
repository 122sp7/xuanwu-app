/**
 * @module libs/date-fns
 * Thin wrapper for date-fns v4.
 *
 * Provides a single import path for the most commonly used date utility
 * functions in the project.  All exports are pure functions (no side effects),
 * safe to import from Server Components, Client Components, and utilities.
 *
 * Usage:
 *   import { format, parseISO, formatDistanceToNow } from "@/libs/date-fns";
 *   const label = formatDistanceToNow(new Date(timestamp), { addSuffix: true });
 */

// ── Formatting ─────────────────────────────────────────────────────────────
export {
  format,
  formatDistance,
  formatDistanceStrict,
  formatDistanceToNow,
  formatDistanceToNowStrict,
  formatDuration,
  formatISO,
  formatISO9075,
  formatRelative,
  formatRFC3339,
  formatRFC7231,
} from "date-fns";

// ── Parsing ────────────────────────────────────────────────────────────────
export { parse, parseISO, parseJSON } from "date-fns";

// ── Arithmetic – add ───────────────────────────────────────────────────────
export {
  add,
  addDays,
  addHours,
  addMinutes,
  addSeconds,
  addMonths,
  addYears,
  addWeeks,
  addBusinessDays,
} from "date-fns";

// ── Arithmetic – subtract ──────────────────────────────────────────────────
export {
  sub,
  subDays,
  subHours,
  subMinutes,
  subSeconds,
  subMonths,
  subYears,
  subWeeks,
} from "date-fns";

// ── Comparison ─────────────────────────────────────────────────────────────
export {
  compareAsc,
  compareDesc,
  isAfter,
  isBefore,
  isEqual,
  isValid,
  isSameDay,
  isSameMonth,
  isSameYear,
  isToday,
  isTomorrow,
  isYesterday,
  isWeekend,
  isFuture,
  isPast,
} from "date-fns";

// ── Difference ─────────────────────────────────────────────────────────────
export {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
  differenceInMonths,
  differenceInYears,
  differenceInWeeks,
  differenceInMilliseconds,
  differenceInCalendarDays,
} from "date-fns";

// ── Start / End of interval ────────────────────────────────────────────────
export {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  startOfHour,
  endOfHour,
} from "date-fns";

// ── Getters ────────────────────────────────────────────────────────────────
export {
  getDay,
  getDayOfYear,
  getDaysInMonth,
  getHours,
  getMinutes,
  getMonth,
  getSeconds,
  getTime,
  getUnixTime,
  getYear,
} from "date-fns";

// ── Utilities ──────────────────────────────────────────────────────────────
export { constructNow, fromUnixTime, toDate, min, max, clamp, eachDayOfInterval } from "date-fns";

// ── Types ──────────────────────────────────────────────────────────────────
export type { Duration, Interval, FormatOptions } from "date-fns";
