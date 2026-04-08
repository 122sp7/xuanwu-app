export interface WorkspaceGrant {
  userId?: string;
  teamId?: string;
  role: string;
  protocol?: string;
}

export interface WorkspaceAccessPolicy {
  grants: WorkspaceGrant[];
  teamIds: string[];
}