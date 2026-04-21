import { describe, expect, it } from "vitest";

import { listShellRailCatalogItems } from "./shell-navigation-catalog";

describe("listShellRailCatalogItems", () => {
  it("shows settings after permissions for organization accounts", () => {
    const itemIds = listShellRailCatalogItems(true).map((item) => item.id);

    const permissionsIndex = itemIds.indexOf("org-permissions");
    const settingsIndex = itemIds.indexOf("org-settings");

    expect(permissionsIndex).toBeGreaterThanOrEqual(0);
    expect(settingsIndex).toBe(permissionsIndex + 1);
  });

  it("hides organization-specific rail items for personal accounts", () => {
    const itemIds = listShellRailCatalogItems(false).map((item) => item.id);

    expect(itemIds).toEqual(["workspace", "dashboard"]);
    expect(itemIds).not.toContain("org-settings");
  });
});
