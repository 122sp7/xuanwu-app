import { describe, expect, it } from "vitest";

import { Page } from "./Page";

describe("Page", () => {
  it("stores lightweight summary and source context on creation", () => {
    const page = Page.create({
      accountId: "account-1",
      workspaceId: "workspace-1",
      title: "施工摘要",
      summary: "整理上傳文件後的任務摘要",
      sourceLabel: "來源文件 / 2026-04-21",
      createdByUserId: "user-1",
    });

    expect(page.getSnapshot()).toMatchObject({
      title: "施工摘要",
      summary: "整理上傳文件後的任務摘要",
      sourceLabel: "來源文件 / 2026-04-21",
    });
  });
});
