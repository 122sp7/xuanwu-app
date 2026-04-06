import { describe, expect, it } from "vitest";

import { cn, formatDate, generateId } from "./index";

describe("shared-utils", () => {
  it("formats dates as YYYY-MM-DD", () => {
    expect(formatDate(new Date("2026-04-06T15:20:30.000Z"))).toBe("2026-04-06");
  });

  it("merges tailwind class conflicts deterministically", () => {
    expect(cn("px-2", ["text-sm", undefined], "px-4")).toBe("text-sm px-4");
  });

  it("generates UUID-shaped ids", () => {
    expect(generateId()).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
  });
});