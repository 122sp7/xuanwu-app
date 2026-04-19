import { describe, expect, it } from "vitest";

import { resolveAccountScopedWorkspaceId } from "./account-scoped-workspace";
import type { WorkspaceEntity } from "./WorkspaceContext";

function buildWorkspace(
  id: string,
  name: string,
  accountId: string,
): WorkspaceEntity {
  return {
    id,
    accountId,
    accountType: "organization",
    name,
    lifecycleState: "active",
    visibility: "private",
    photoURL: null,
    createdAtISO: new Date(0).toISOString(),
    updatedAtISO: new Date(0).toISOString(),
  };
}

describe("resolveAccountScopedWorkspaceId", () => {
  it("returns active workspace when it belongs to the same account", () => {
    const workspaces: Record<string, WorkspaceEntity> = {
      wsA: buildWorkspace("wsA", "Alpha", "org-1"),
      wsB: buildWorkspace("wsB", "Beta", "org-1"),
    };
    expect(
      resolveAccountScopedWorkspaceId({
        accountId: "org-1",
        activeWorkspaceId: "wsB",
        workspaces,
      }),
    ).toBe("wsB");
  });

  it("falls back to first sorted workspace when active is missing or from another account", () => {
    const workspaces: Record<string, WorkspaceEntity> = {
      wsC: buildWorkspace("wsC", "Charlie", "org-1"),
      wsA: buildWorkspace("wsA", "Alpha", "org-1"),
      wsOther: buildWorkspace("wsOther", "Other", "org-2"),
    };
    expect(
      resolveAccountScopedWorkspaceId({
        accountId: "org-1",
        activeWorkspaceId: "wsOther",
        workspaces,
      }),
    ).toBe("wsA");
  });

  it("returns null when account has no workspaces", () => {
    expect(
      resolveAccountScopedWorkspaceId({
        accountId: "org-1",
        activeWorkspaceId: null,
        workspaces: {},
      }),
    ).toBeNull();
  });
});
