import { describe, expect, it } from "vitest";

import { deriveSlugCandidate, isValidSlug } from "./slug-utils";

describe("slug-utils", () => {
  it("normalizes display names into slug candidates", () => {
    expect(deriveSlugCandidate("Hello__World / 測試")).toBe("hello-world");
  });

  it("caps slug candidates at 63 characters", () => {
    expect(deriveSlugCandidate("a".repeat(80))).toHaveLength(63);
  });

  it("accepts valid slugs and rejects malformed ones", () => {
    expect(isValidSlug("team-space-01")).toBe(true);
    expect(isValidSlug("ab")).toBe(false);
    expect(isValidSlug("-team-space")).toBe(false);
  });
});