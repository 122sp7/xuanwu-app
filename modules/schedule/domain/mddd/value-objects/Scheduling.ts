export interface AvailabilityWindow {
  readonly startAtISO: string;
  readonly endAtISO: string;
}

export interface Availability {
  readonly accountUserId: string;
  readonly windows: readonly AvailabilityWindow[];
  readonly maxConcurrentAssignments: number;
  readonly maxLoadPerPeriod: number;
}

export interface CalendarSlot {
  readonly startAtISO: string;
  readonly endAtISO: string;
  readonly timezone: string;
  readonly slotType: "planned" | "reserved" | "active";
}

export function hasValidCalendarSlotRange(slot: CalendarSlot): boolean {
  const start = Date.parse(slot.startAtISO);
  const end = Date.parse(slot.endAtISO);
  return !Number.isNaN(start) && !Number.isNaN(end) && start < end;
}

export interface Constraint {
  readonly type: string;
  readonly value: string | number | boolean;
  readonly scope: "request" | "task" | "assignment" | "schedule";
}

export interface Preference {
  readonly type: string;
  readonly weight: number;
  readonly value: string;
}

export interface MatchGap {
  readonly code: string;
  readonly detail: string;
}
