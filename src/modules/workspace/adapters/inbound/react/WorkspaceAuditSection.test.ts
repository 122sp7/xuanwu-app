import { describe, expect, it } from "vitest";

import { matchesAuditEventType } from "./workspace-audit-filter";
import type { AuditEntrySnapshot } from "../../../subdomains/audit/domain/entities/AuditEntry";

function buildEntry(partial: Partial<AuditEntrySnapshot>): AuditEntrySnapshot {
  return {
    id: "audit-1",
    workspaceId: "7f05822b-f49c-47ec-b9df-57680d2f0bfb",
    actorId: "actor-1",
    action: "create",
    resourceType: "task",
    resourceId: "resource-1",
    severity: "low",
    detail: "task created",
    source: "workspace",
    changes: [],
    recordedAtISO: new Date(0).toISOString(),
    ...partial,
  };
}

describe("matchesAuditEventType", () => {
  it("matches task entries for 任務 filter", () => {
    expect(matchesAuditEventType(buildEntry({ resourceType: "task" }), "任務")).toBe(true);
    expect(matchesAuditEventType(buildEntry({ resourceType: "member", detail: "member invited" }), "任務")).toBe(false);
  });

  it("matches setting entries by action/detail keywords for 設定 filter", () => {
    expect(matchesAuditEventType(buildEntry({ resourceType: "config" }), "設定")).toBe(true);
    expect(matchesAuditEventType(buildEntry({ detail: "setting updated" }), "設定")).toBe(true);
  });

  it("always matches all entries for 全部 filter", () => {
    expect(matchesAuditEventType(buildEntry({ resourceType: "document" }), "全部")).toBe(true);
  });
});
