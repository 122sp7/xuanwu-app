import { describe, expect, it } from "vitest";

import { createAddress, formatAddress } from "./Address";
import {
  createWorkspaceLifecycleState,
  isTerminalWorkspaceLifecycleState,
} from "./WorkspaceLifecycleState";
import { createWorkspaceName } from "./WorkspaceName";
import { createWorkspaceVisibility } from "./WorkspaceVisibility";

describe("workspace value objects", () => {
  it("normalizes and validates workspace names", () => {
    expect(createWorkspaceName("  Demo Workspace  ")).toBe("Demo Workspace");
    expect(() => createWorkspaceName("   ")).toThrow();
  });

  it("accepts only supported lifecycle states", () => {
    expect(createWorkspaceLifecycleState("active")).toBe("active");
    expect(isTerminalWorkspaceLifecycleState("stopped")).toBe(true);
    expect(() => createWorkspaceLifecycleState("archived" as never)).toThrow();
  });

  it("accepts only supported visibility values", () => {
    expect(createWorkspaceVisibility("visible")).toBe("visible");
    expect(() => createWorkspaceVisibility("private" as never)).toThrow();
  });

  it("creates frozen address snapshots and formats lines", () => {
    const address = createAddress({
      street: " 1 Infinite Loop ",
      city: "Cupertino",
      state: "CA",
      postalCode: "95014",
      country: "USA",
      details: "  Building A ",
    });

    expect(Object.isFrozen(address)).toBe(true);
    expect(formatAddress(address)).toEqual([
      "1 Infinite Loop",
      "Cupertino, CA, 95014",
      "USA",
      "Building A",
    ]);
  });
});