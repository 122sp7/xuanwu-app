import { describe, expect, it } from "vitest";
import { FirestorePermissionCheckAdapter } from "./FirestorePermissionCheckAdapter";
import type { WorkspaceMemberSnapshot } from "../../../domain/entities/WorkspaceMember";
import type { WorkspaceMemberRepository } from "../../../domain/repositories/WorkspaceMemberRepository";
import type { FirestoreLike } from "../firestore/FirestoreMemberRepository";

class InMemoryWorkspaceMemberRepository implements WorkspaceMemberRepository {
  private readonly items = new Map<string, WorkspaceMemberSnapshot>();

  constructor(seed: WorkspaceMemberSnapshot[]) {
    seed.forEach((item) => this.items.set(item.id, item));
  }

  async findById(memberId: string): Promise<WorkspaceMemberSnapshot | null> {
    return this.items.get(memberId) ?? null;
  }

  async findByWorkspaceId(workspaceId: string): Promise<WorkspaceMemberSnapshot[]> {
    return [...this.items.values()].filter((item) => item.workspaceId === workspaceId);
  }

  async findByActorAndWorkspace(actorId: string, workspaceId: string): Promise<WorkspaceMemberSnapshot | null> {
    return [...this.items.values()].find((item) => item.actorId === actorId && item.workspaceId === workspaceId) ?? null;
  }

  async save(member: WorkspaceMemberSnapshot): Promise<void> {
    this.items.set(member.id, member);
  }

  async delete(memberId: string): Promise<void> {
    this.items.delete(memberId);
  }
}

class InMemoryFirestoreLike implements FirestoreLike {
  constructor(private readonly records: Record<string, Array<Record<string, unknown>>>) {}

  async get(_collection: string, _id: string): Promise<Record<string, unknown> | null> {
    return null;
  }

  async set(_collection: string, _id: string, _data: Record<string, unknown>): Promise<void> {}

  async delete(_collection: string, _id: string): Promise<void> {}

  async query(collection: string, filters: Array<{ field: string; op: string; value: unknown }>): Promise<Record<string, unknown>[]> {
    const collectionData = this.records[collection] ?? [];
    return collectionData.filter((record) =>
      filters.every((filter) => filter.op === "==" && record[filter.field] === filter.value),
    );
  }
}

const NOW = "2026-01-01T00:00:00.000Z";

function activeMember(role: WorkspaceMemberSnapshot["role"]): WorkspaceMemberSnapshot {
  return {
    id: "member-1",
    workspaceId: "workspace-1",
    actorId: "actor-1",
    role,
    status: "active",
    displayName: "Actor",
    email: "actor@example.com",
    joinedAtISO: NOW,
    updatedAtISO: NOW,
  };
}

describe("FirestorePermissionCheckAdapter dynamic policy resolution", () => {
  it("applies deny-precedence over allow", async () => {
    const repo = new InMemoryWorkspaceMemberRepository([activeMember("owner")]);
    const db = new InMemoryFirestoreLike({
      workspace_access_policies: [
        { workspaceId: "workspace-1", subjectActorId: "actor-1", action: "workspace.membership.add", effect: "allow", isActive: true },
        { workspaceId: "workspace-1", subjectActorId: "actor-1", action: "workspace.membership.add", effect: "deny", isActive: true },
      ],
    });
    const adapter = new FirestorePermissionCheckAdapter(repo, db);

    const result = await adapter.can({
      actorId: "actor-1",
      workspaceId: "workspace-1",
      action: "workspace.membership.add",
    });

    expect(result).toBe(false);
  });

  it("matches wildcard policies and ignores inactive entries", async () => {
    const repo = new InMemoryWorkspaceMemberRepository([activeMember("member")]);
    const db = new InMemoryFirestoreLike({
      workspace_access_policies: [
        { workspaceId: "workspace-1", subjectActorId: "actor-1", action: "workspace.membership.*", effect: "allow", isActive: true },
        { workspaceId: "workspace-1", subjectActorId: "actor-1", action: "*", effect: "deny", isActive: false },
      ],
    });
    const adapter = new FirestorePermissionCheckAdapter(repo, db);

    const result = await adapter.can({
      actorId: "actor-1",
      workspaceId: "workspace-1",
      action: "workspace.membership.change_role",
      targetMemberRole: "member",
      nextRole: "admin",
    });

    expect(result).toBe(true);
  });
});
