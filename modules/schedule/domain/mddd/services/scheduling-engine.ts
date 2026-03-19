import type { Schedule } from "../entities/Schedule";
import type { Availability, CalendarSlot } from "../value-objects/Scheduling";

const ACTIVE_SCHEDULE_STATUSES = ["planned", "reserved", "active"] as const;

function overlaps(a: CalendarSlot, b: CalendarSlot): boolean {
  const aStart = Date.parse(a.startAtISO);
  const aEnd = Date.parse(a.endAtISO);
  const bStart = Date.parse(b.startAtISO);
  const bEnd = Date.parse(b.endAtISO);

  return aStart < bEnd && bStart < aEnd;
}

function isValidTimeRange(startISO: string, endISO: string): boolean {
  const start = Date.parse(startISO);
  const end = Date.parse(endISO);
  return !Number.isNaN(start) && !Number.isNaN(end) && start < end;
}

export function isSlotWithinAvailability(slot: CalendarSlot, availability: Availability): boolean {
  if (!isValidTimeRange(slot.startAtISO, slot.endAtISO)) {
    return false;
  }

  return availability.windows.some((window) => {
    if (!isValidTimeRange(window.startAtISO, window.endAtISO)) {
      return false;
    }

    const slotStart = Date.parse(slot.startAtISO);
    const slotEnd = Date.parse(slot.endAtISO);
    const windowStart = Date.parse(window.startAtISO);
    const windowEnd = Date.parse(window.endAtISO);

    return slotStart >= windowStart && slotEnd <= windowEnd;
  });
}

export function detectScheduleConflicts(
  slot: CalendarSlot,
  schedules: readonly Schedule[],
  assigneeAccountUserId: string,
): readonly Schedule[] {
  return schedules.filter(
    (schedule) =>
      schedule.assigneeAccountUserId === assigneeAccountUserId &&
      ACTIVE_SCHEDULE_STATUSES.includes(schedule.status) &&
      overlaps(slot, schedule.calendarSlot),
  );
}

export function canAllocateSchedule(
  params: {
    readonly slot: CalendarSlot;
    readonly availability: Availability;
    readonly schedules: readonly Schedule[];
    readonly assigneeAccountUserId: string;
    readonly existingLoadUnits: number;
    readonly nextLoadUnits: number;
  },
): { readonly allowed: boolean; readonly reason?: string } {
  const { slot, availability, schedules, assigneeAccountUserId, existingLoadUnits, nextLoadUnits } = params;

  if (!isSlotWithinAvailability(slot, availability)) {
    return { allowed: false, reason: "outside_availability" };
  }

  const conflicts = detectScheduleConflicts(slot, schedules, assigneeAccountUserId);
  if (conflicts.length > 0) {
    return { allowed: false, reason: "schedule_conflict" };
  }

  if (existingLoadUnits + nextLoadUnits > availability.maxLoadPerPeriod) {
    return { allowed: false, reason: "load_over_capacity" };
  }

  return { allowed: true };
}
