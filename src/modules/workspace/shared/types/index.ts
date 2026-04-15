export type WorkspaceId = string & { readonly __brand: "WorkspaceId" };
export type ActorId = string & { readonly __brand: "ActorId" };
export type MemberId = string & { readonly __brand: "MemberId" };

export interface WorkspaceReference {
  readonly workspaceId: string;
  readonly accountId: string;
  readonly name: string;
}

export interface WorkspaceScopeProps {
  readonly workspaceId: string;
  readonly accountId: string;
  readonly currentUserId?: string;
}
