import { beforeEach, describe, expect, it, vi } from "vitest";

const createDatabaseExecute = vi.fn();
const findByWorkspaceId = vi.fn();

vi.mock("../../outbound/firebase-composition", () => ({
  createClientNotionDatabaseUseCases: () => ({
    createDatabase: { execute: createDatabaseExecute },
    findByWorkspaceId,
  }),
}));

import { createDatabaseAction } from "./database-actions";

describe("createDatabaseAction", () => {
  beforeEach(() => {
    createDatabaseExecute.mockReset();
    createDatabaseExecute.mockResolvedValue({ ok: true });
    findByWorkspaceId.mockReset();
  });

  it("forwards optional description and explicit creator", async () => {
    await createDatabaseAction({
      workspaceId: "00000000-0000-4000-8000-000000000001",
      accountId: "account-1",
      name: "資料庫 A",
      description: "測試描述",
      createdByUserId: "user-1",
    });

    expect(createDatabaseExecute).toHaveBeenCalledWith(
      expect.objectContaining({
        workspaceId: "00000000-0000-4000-8000-000000000001",
        accountId: "account-1",
        title: "資料庫 A",
        description: "測試描述",
        createdByUserId: "user-1",
      }),
    );
  });

  it("falls back creator to accountId when creator is omitted", async () => {
    await createDatabaseAction({
      workspaceId: "00000000-0000-4000-8000-000000000002",
      accountId: "account-2",
      name: "資料庫 B",
    });

    expect(createDatabaseExecute).toHaveBeenCalledWith(
      expect.objectContaining({
        accountId: "account-2",
        createdByUserId: "account-2",
      }),
    );
  });
});
