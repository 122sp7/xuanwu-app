import { describe, expect, it } from "vitest";

import { buildSourceUploadPath } from "./source-storage-path";

describe("buildSourceUploadPath", () => {
  it("stores uploads under workspace-scoped sources prefix so storage triggers do not auto-parse", () => {
    expect(buildSourceUploadPath({
      accountId: "acct-1",
      workspaceId: "ws-1",
      filename: "4508422688-F14P8 42.9.pdf",
      uuid: "uuid-1",
    })).toBe("workspaces/ws-1/sources/acct-1/uuid-1-4508422688-F14P8_42.9.pdf");
  });
});
