import type { WorkspaceEntity, WorkspaceGrant } from "../api/contracts";

export interface WorkspaceCustomRoleDraft {
  readonly roleId: string;
  readonly roleName: string;
  readonly role: string;
}

export interface WorkspaceSettingsDraft {
  readonly name: string;
  readonly visibility: WorkspaceEntity["visibility"];
  readonly lifecycleState: WorkspaceEntity["lifecycleState"];
  readonly street: string;
  readonly city: string;
  readonly state: string;
  readonly postalCode: string;
  readonly country: string;
  readonly details: string;
  readonly managerId: string;
  readonly supervisorId: string;
  readonly safetyOfficerId: string;
  readonly customRoles: WorkspaceCustomRoleDraft[];
}

export function createWorkspaceCustomRoleDraft(): WorkspaceCustomRoleDraft {
  return {
    roleId: crypto.randomUUID(),
    roleName: "",
    role: "",
  };
}

export function createSettingsDraft(workspace: WorkspaceEntity): WorkspaceSettingsDraft {
  return {
    name: workspace.name,
    visibility: workspace.visibility,
    lifecycleState: workspace.lifecycleState,
    street: workspace.address?.street ?? "",
    city: workspace.address?.city ?? "",
    state: workspace.address?.state ?? "",
    postalCode: workspace.address?.postalCode ?? "",
    country: workspace.address?.country ?? "",
    details: workspace.address?.details ?? "",
    managerId: workspace.personnel?.managerId ?? "",
    supervisorId: workspace.personnel?.supervisorId ?? "",
    safetyOfficerId: workspace.personnel?.safetyOfficerId ?? "",
    customRoles: workspace.personnel?.customRoles?.map((entry) => ({
      roleId: entry.roleId,
      roleName: entry.roleName,
      role: entry.role,
    })) ?? [],
  };
}

export function describeGrant(grant: WorkspaceGrant): string {
  if (grant.teamId) {
    return "Team grant";
  }

  if (grant.userId) {
    return "User grant";
  }

  return "Unscoped grant";
}