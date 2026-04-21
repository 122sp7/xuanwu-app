import { describe, expect, it } from "vitest";

import { parseLocalDatetimeInput, toLocalDatetimeInputValue } from "./workspace-schedule-datetime";

describe("WorkspaceScheduleSection datetime helpers", () => {
  it("formats date values to datetime-local input format", () => {
    const value = toLocalDatetimeInputValue(new Date(2000, 0, 2, 8, 5));
    expect(value).toBe("2000-01-02T08:05");
  });

  it("converts datetime-local input into ISO string", () => {
    const input = "2000-01-02T08:05";
    const expectedISO = new Date(input).toISOString();
    expect(parseLocalDatetimeInput(input)).toBe(expectedISO);
  });

  it("returns null for invalid datetime-local input", () => {
    expect(parseLocalDatetimeInput("invalid-datetime")).toBeNull();
    expect(parseLocalDatetimeInput("2000-02-30T08:05")).toBeNull();
  });
});
