import { describe, expect, it } from "vitest";

import { parseLocalDatetimeInput, toLocalDatetimeInputValue } from "./workspace-schedule-datetime";

describe("WorkspaceScheduleSection datetime helpers", () => {
  it("formats date values to datetime-local input format", () => {
    const value = toLocalDatetimeInputValue(new Date(2026, 3, 21, 8, 5));
    expect(value).toBe("2026-04-21T08:05");
  });

  it("converts datetime-local input into ISO string", () => {
    const input = "2026-04-21T08:05";
    const expectedISO = new Date(input).toISOString();
    expect(parseLocalDatetimeInput(input)).toBe(expectedISO);
  });

  it("returns null for invalid datetime-local input", () => {
    expect(parseLocalDatetimeInput("invalid-datetime")).toBeNull();
  });
});
