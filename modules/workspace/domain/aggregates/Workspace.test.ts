import { describe, expect, it } from "vitest";

import { Workspace } from "./Workspace";

describe("Workspace aggregate", () => {
  it("creates a workspace with canonical defaults", () => {
    const workspace = Workspace.create({
      name: "  Demo Workspace  ",
      accountId: "  account-1  ",
      accountType: "organization",
    });

    const snapshot = workspace.toSnapshot();

    expect(snapshot.name).toBe("Demo Workspace");
    expect(snapshot.accountId).toBe("account-1");
    expect(snapshot.accountType).toBe("organization");
    expect(snapshot.lifecycleState).toBe("preparatory");
    expect(snapshot.visibility).toBe("visible");
    expect(snapshot.capabilities).toEqual([]);
    expect(snapshot.grants).toEqual([]);
    expect(snapshot.teamIds).toEqual([]);
  });

  it("enforces canonical lifecycle transitions", () => {
    const workspace = Workspace.create({
      name: "Demo Workspace",
      accountId: "account-1",
      accountType: "user",
    });

    workspace.activate();
    workspace.stop();

    expect(workspace.lifecycleState).toBe("stopped");
  });

  it("rejects invalid lifecycle transitions", () => {
    const workspace = Workspace.create({
      name: "Demo Workspace",
      accountId: "account-1",
      accountType: "user",
    });

    expect(() => workspace.stop()).toThrow(
      "Invalid workspace lifecycle transition: preparatory -> stopped",
    );
  });

  it("applies settings through aggregate rules", () => {
    const workspace = Workspace.create({
      name: "Demo Workspace",
      accountId: "account-1",
      accountType: "organization",
    });

    workspace.applySettings({
      name: "  Renamed Workspace  ",
      lifecycleState: "active",
      visibility: "hidden",
      address: {
        street: " 1 Infinite Loop ",
        city: "Cupertino",
        state: "CA",
        postalCode: "95014",
        country: "USA",
      },
      personnel: {
        managerId: "manager-1",
        customRoles: [
          {
            roleId: "ops",
            roleName: "Operations",
            role: "ops-manager",
          },
        ],
      },
    });

    const snapshot = workspace.toSnapshot();

    expect(snapshot.name).toBe("Renamed Workspace");
    expect(snapshot.lifecycleState).toBe("active");
    expect(snapshot.visibility).toBe("hidden");
    expect(snapshot.address?.street).toBe("1 Infinite Loop");
    expect(snapshot.personnel?.managerId).toBe("manager-1");
    expect(snapshot.personnel?.customRoles?.[0]?.roleName).toBe("Operations");
  });
});