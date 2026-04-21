import { describe, expect, it } from "vitest";

import { Database } from "./Database";

describe("Database", () => {
  it("initializes a default schema when properties are omitted", () => {
    const database = Database.create({
      workspaceId: "workspace-1",
      accountId: "account-1",
      title: "需求資料庫",
      createdByUserId: "user-1",
    });

    expect(database.getSnapshot().properties).toHaveLength(1);
    expect(database.getSnapshot().properties[0]).toMatchObject({
      name: "名稱",
      type: "text",
    });
    expect(database.getSnapshot().parentPageId).toBeNull();
  });

  it("rejects duplicate property names even when ids differ", () => {
    const database = Database.create({
      workspaceId: "workspace-1",
      accountId: "account-1",
      title: "需求資料庫",
      createdByUserId: "user-1",
    });

    expect(() =>
      database.addProperty({
        id: "property-2",
        name: "名稱",
        type: "text",
      }),
    ).toThrow(/already exists/);
  });
});
