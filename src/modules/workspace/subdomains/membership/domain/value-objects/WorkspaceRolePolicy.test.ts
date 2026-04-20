import { describe, expect, it } from "vitest";
import { WorkspaceRolePolicy } from "./WorkspaceRolePolicy";

describe("WorkspaceRolePolicy", () => {
  const policy = new WorkspaceRolePolicy();

  it("allows owner to manage membership actions", () => {
    expect(policy.can("owner", "workspace.membership.add")).toBe(true);
    expect(policy.can("owner", "workspace.membership.change_role")).toBe(true);
    expect(policy.can("owner", "workspace.membership.remove")).toBe(true);
  });

  it("prevents member role from escalating permissions", () => {
    expect(policy.can("member", "workspace.membership.add")).toBe(false);
    expect(policy.canChangeRole("member", "member", "admin")).toBe(false);
    expect(policy.canRemove("member", "admin")).toBe(false);
  });

  it("prevents non-owner from modifying owner role", () => {
    expect(policy.canChangeRole("admin", "owner", "member")).toBe(false);
    expect(policy.canChangeRole("admin", "member", "owner")).toBe(false);
    expect(policy.canRemove("admin", "owner")).toBe(false);
  });
});
