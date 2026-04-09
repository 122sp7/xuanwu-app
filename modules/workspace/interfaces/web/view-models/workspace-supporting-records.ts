import type { WorkspaceEntity } from "../../api/contracts";

export interface WorkspacePersonnelEntry {
  label: string;
  value: string;
}

export interface WorkspaceRoleAssignment {
  id: string;
  roleName: string;
  role: string;
}

export interface WorkspaceGovernanceSummary {
  capabilityCount: number;
  teamCount: number;
  locationCount: number;
  grantCount: number;
}

export function getWorkspaceAddressLines(
  workspace: Pick<WorkspaceEntity, "address">,
): string[] {
  if (!workspace.address) {
    return [];
  }

  const { street, city, state, postalCode, country, details } = workspace.address;
  return [
    street,
    [city, state, postalCode].filter(Boolean).join(", "),
    country,
    details,
  ].filter((line): line is string => Boolean(line));
}

export function getWorkspaceRoleAssignments(
  workspace: Pick<WorkspaceEntity, "personnel">,
): WorkspaceRoleAssignment[] {
  return [
    { id: "manager", roleName: "Manager", role: workspace.personnel?.managerId ?? "" },
    { id: "supervisor", roleName: "Supervisor", role: workspace.personnel?.supervisorId ?? "" },
    {
      id: "safety-officer",
      roleName: "Safety officer",
      role: workspace.personnel?.safetyOfficerId ?? "",
    },
    ...((workspace.personnel?.customRoles ?? []).map((entry) => ({
      id: entry.roleId,
      roleName: entry.roleName,
      role: entry.role,
    }))),
  ];
}

export function getWorkspacePersonnelEntries(
  workspace: Pick<WorkspaceEntity, "personnel">,
): WorkspacePersonnelEntry[] {
  return getWorkspaceRoleAssignments(workspace)
    .filter((entry) => Boolean(entry.role))
    .map((entry) => ({
      label: entry.roleName,
      value: entry.role,
    }));
}

export function getWorkspaceGovernanceSummary(
  workspace: Pick<WorkspaceEntity, "capabilities" | "teamIds" | "locations" | "grants">,
): WorkspaceGovernanceSummary {
  return {
    capabilityCount: workspace.capabilities.length,
    teamCount: workspace.teamIds.length,
    locationCount: workspace.locations?.length ?? 0,
    grantCount: workspace.grants.length,
  };
}