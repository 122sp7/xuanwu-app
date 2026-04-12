export interface OrganizationScope {
  readonly organizationId: string;
  readonly workspaceId?: string;
}

export function isWorkspaceScoped(scope: OrganizationScope): boolean {
  return typeof scope.workspaceId === "string" && scope.workspaceId.trim().length > 0;
}
