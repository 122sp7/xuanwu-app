import type { MemberRole } from "../../domain/entities/WorkspaceMember";
import type { WorkspaceMembershipAction } from "../../domain/value-objects/WorkspaceRolePolicy";

export interface PermissionCheckInput {
  readonly actorId: string;
  readonly workspaceId: string;
  readonly action: WorkspaceMembershipAction;
  readonly targetMemberRole?: MemberRole;
  readonly nextRole?: MemberRole;
}

export interface PermissionCheckPort {
  can(input: PermissionCheckInput): Promise<boolean>;
}
