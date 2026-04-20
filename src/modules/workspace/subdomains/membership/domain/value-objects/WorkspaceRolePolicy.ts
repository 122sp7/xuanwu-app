import type { MemberRole } from "../entities/WorkspaceMember";

export const WORKSPACE_MEMBERSHIP_ACTIONS = [
  "workspace.membership.read",
  "workspace.membership.add",
  "workspace.membership.change_role",
  "workspace.membership.remove",
] as const;

export type WorkspaceMembershipAction = typeof WORKSPACE_MEMBERSHIP_ACTIONS[number];

const DEFAULT_ROLE_ACTION_MATRIX: Readonly<Record<MemberRole, readonly WorkspaceMembershipAction[]>> = {
  owner: WORKSPACE_MEMBERSHIP_ACTIONS,
  admin: ["workspace.membership.read", "workspace.membership.add", "workspace.membership.change_role", "workspace.membership.remove"],
  member: ["workspace.membership.read"],
  guest: [],
};

export class WorkspaceRolePolicy {
  constructor(
    private readonly roleActionMatrix: Readonly<Record<MemberRole, readonly WorkspaceMembershipAction[]>> = DEFAULT_ROLE_ACTION_MATRIX,
  ) {}

  can(role: MemberRole, action: WorkspaceMembershipAction): boolean {
    return this.roleActionMatrix[role].includes(action);
  }

  canChangeRole(actorRole: MemberRole, targetRole: MemberRole, nextRole: MemberRole): boolean {
    if (!this.can(actorRole, "workspace.membership.change_role")) return false;
    if (actorRole === "owner") return true;
    if (targetRole === "owner") return false;
    return nextRole !== "owner";
  }

  canRemove(actorRole: MemberRole, targetRole: MemberRole): boolean {
    if (!this.can(actorRole, "workspace.membership.remove")) return false;
    if (actorRole === "owner") return true;
    return targetRole !== "owner";
  }
}
