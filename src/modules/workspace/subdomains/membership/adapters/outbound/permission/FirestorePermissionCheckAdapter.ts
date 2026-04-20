import type { PermissionCheckInput, PermissionCheckPort } from "../../../application/ports/PermissionCheckPort";
import type { WorkspaceMemberRepository } from "../../../domain/repositories/WorkspaceMemberRepository";
import { WorkspaceRolePolicy, type WorkspaceMembershipAction } from "../../../domain/value-objects/WorkspaceRolePolicy";
import type { FirestoreLike } from "../firestore/FirestoreMemberRepository";

interface AccessPolicyRecord {
  readonly action: string;
  readonly effect: "allow" | "deny";
  readonly isActive?: boolean;
}

export class FirestorePermissionCheckAdapter implements PermissionCheckPort {
  private readonly rolePolicy = new WorkspaceRolePolicy();
  private readonly accessPolicyCollection = "workspace_access_policies";

  constructor(
    private readonly memberRepo: WorkspaceMemberRepository,
    private readonly db?: FirestoreLike,
  ) {}

  async can(input: PermissionCheckInput): Promise<boolean> {
    const actorMembership = await this.memberRepo.findByActorAndWorkspace(input.actorId, input.workspaceId);
    if (!actorMembership || actorMembership.status !== "active") {
      return false;
    }

    const dynamicDecision = await this.resolveDynamicDecision(input);
    if (dynamicDecision !== null) {
      return dynamicDecision;
    }

    if (input.action === "workspace.membership.change_role" && input.targetMemberRole && input.nextRole) {
      return this.rolePolicy.canChangeRole(actorMembership.role, input.targetMemberRole, input.nextRole);
    }

    if (input.action === "workspace.membership.remove" && input.targetMemberRole) {
      return this.rolePolicy.canRemove(actorMembership.role, input.targetMemberRole);
    }

    return this.rolePolicy.can(actorMembership.role, input.action);
  }

  private async resolveDynamicDecision(input: PermissionCheckInput): Promise<boolean | null> {
    if (!this.db) return null;

    const [actorPolicies, wildcardPolicies] = await Promise.all([
      this.db.query(this.accessPolicyCollection, [
        { field: "workspaceId", op: "==", value: input.workspaceId },
        { field: "subjectActorId", op: "==", value: input.actorId },
      ]),
      this.db.query(this.accessPolicyCollection, [
        { field: "workspaceId", op: "==", value: input.workspaceId },
        { field: "subjectActorId", op: "==", value: "*" },
      ]),
    ]);

    const matchingPolicies = [...actorPolicies, ...wildcardPolicies]
      .map((record) => this.toAccessPolicyRecord(record))
      .filter((record): record is AccessPolicyRecord => record !== null)
      .filter((record) => this.matchesAction(record.action, input.action))
      .filter((record) => record.isActive ?? true);

    const hasDeny = matchingPolicies.some((record) => record.effect === "deny");
    if (hasDeny) return false;

    const hasAllow = matchingPolicies.some((record) => record.effect === "allow");
    if (hasAllow) return true;

    return null;
  }

  private toAccessPolicyRecord(record: Record<string, unknown>): AccessPolicyRecord | null {
    const action = record.action;
    const effect = record.effect;
    const isActive = record.isActive;
    if (typeof action !== "string") return null;
    if (effect !== "allow" && effect !== "deny") return null;
    if (isActive !== undefined && typeof isActive !== "boolean") return null;
    return { action, effect, isActive };
  }

  private matchesAction(policyAction: string, action: WorkspaceMembershipAction): boolean {
    return policyAction === action || policyAction === "*" || policyAction === "workspace.membership.*";
  }
}
