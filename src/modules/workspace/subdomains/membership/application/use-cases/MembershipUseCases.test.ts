import { describe, expect, it } from "vitest";
import { AddMemberUseCase, ChangeMemberRoleUseCase, RemoveMemberUseCase } from "./MembershipUseCases";
import type { WorkspaceMemberSnapshot } from "../../domain/entities/WorkspaceMember";
import type { WorkspaceMemberRepository } from "../../domain/repositories/WorkspaceMemberRepository";
import type { PermissionCheckInput, PermissionCheckPort } from "../ports/PermissionCheckPort";

class InMemoryWorkspaceMemberRepository implements WorkspaceMemberRepository {
  private readonly items = new Map<string, WorkspaceMemberSnapshot>();

  constructor(seed: WorkspaceMemberSnapshot[] = []) {
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

class InMemoryPermissionCheckPort implements PermissionCheckPort {
  constructor(private readonly checker: (input: PermissionCheckInput) => boolean) {}

  async can(input: PermissionCheckInput): Promise<boolean> {
    return this.checker(input);
  }
}

const NOW = "2026-01-01T00:00:00.000Z";

function createActiveMember(
  overrides: Partial<WorkspaceMemberSnapshot> & Pick<WorkspaceMemberSnapshot, "id" | "workspaceId" | "actorId">,
): WorkspaceMemberSnapshot {
  return {
    id: overrides.id,
    workspaceId: overrides.workspaceId,
    actorId: overrides.actorId,
    role: overrides.role ?? "member",
    status: "active",
    displayName: overrides.displayName ?? "Test Member",
    email: overrides.email ?? null,
    joinedAtISO: overrides.joinedAtISO ?? NOW,
    updatedAtISO: overrides.updatedAtISO ?? NOW,
  };
}

describe("Membership use case role guards", () => {
  it("blocks role change when permission check rejects the action", async () => {
    const repo = new InMemoryWorkspaceMemberRepository([
      createActiveMember({ id: "m-1", workspaceId: "w-1", actorId: "target-1", role: "member" }),
    ]);
    const permissionCheck = new InMemoryPermissionCheckPort(() => false);
    const useCase = new ChangeMemberRoleUseCase(repo, permissionCheck);

    const result = await useCase.execute("actor-1", "m-1", "admin");

    expect(result.success).toBe(false);
    expect(result.error.code).toBe("MEMBERSHIP_FORBIDDEN");
    const unchanged = await repo.findById("m-1");
    expect(unchanged?.role).toBe("member");
  });

  it("allows owner-level add/remove operations when permission check passes", async () => {
    const repo = new InMemoryWorkspaceMemberRepository([
      createActiveMember({ id: "m-owner", workspaceId: "w-1", actorId: "owner-1", role: "owner" }),
      createActiveMember({ id: "m-target", workspaceId: "w-1", actorId: "target-1", role: "member" }),
    ]);
    const permissionCheck = new InMemoryPermissionCheckPort((input) => input.actorId === "owner-1");

    const addUseCase = new AddMemberUseCase(repo, permissionCheck);
    const removeUseCase = new RemoveMemberUseCase(repo, permissionCheck);

    const addResult = await addUseCase.execute("owner-1", {
      workspaceId: "w-1",
      actorId: "new-member-1",
      role: "member",
      displayName: "New Member",
      email: "new-member@example.com",
    });
    expect(addResult.success).toBe(true);

    const removeResult = await removeUseCase.execute("owner-1", "m-target");
    expect(removeResult.success).toBe(true);
    const removed = await repo.findById("m-target");
    expect(removed?.status).toBe("removed");
  });
});
