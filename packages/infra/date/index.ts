/**
 * @module infra/date
 * Date manipulation utilities via date-fns v4.
 *
 * All exports are pure functions — no side effects, fully tree-shakeable.
 * Import only what you need; bundler will eliminate unused functions.
 *
 * Alias: @infra/date
 */

// ─── Parsing & Formatting ─────────────────────────────────────────────────────

export {
  format,
  parse,
  parseISO,
  formatISO,
  formatDistanceToNow,
  formatDistance,
  formatRelative,
} from "date-fns";

// ─── Validation ───────────────────────────────────────────────────────────────

export { isValid, isDate } from "date-fns";

// ─── Arithmetic ───────────────────────────────────────────────────────────────

export {
  addDays,
  subDays,
  addWeeks,
  subWeeks,
  addMonths,
  subMonths,
  addYears,
  subYears,
  addHours,
  subHours,
  addMinutes,
  subMinutes,
} from "date-fns";

// ─── Boundary Helpers ─────────────────────────────────────────────────────────

export {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
} from "date-fns";

// ─── Comparison ───────────────────────────────────────────────────────────────

export { isBefore, isAfter, isEqual, compareAsc, compareDesc } from "date-fns";

// ─── Difference ───────────────────────────────────────────────────────────────

export {
  differenceInDays,
  differenceInWeeks,
  differenceInMonths,
  differenceInYears,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
} from "date-fns";

// ─── Extractors ───────────────────────────────────────────────────────────────

export {
  getYear,
  getMonth,
  getDate,
  getDay,
  getHours,
  getMinutes,
  getSeconds,
} from "date-fns";

// ─── Setters ──────────────────────────────────────────────────────────────────

export {
  setYear,
  setMonth,
  setDate,
  setHours,
  setMinutes,
  setSeconds,
} from "date-fns";

// ─── Types ────────────────────────────────────────────────────────────────────

export type { Locale } from "date-fns";
