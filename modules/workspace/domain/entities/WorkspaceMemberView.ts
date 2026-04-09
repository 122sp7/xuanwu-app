/**
 * Workspace member read models owned by the workspace domain language.
 */

export type WorkspaceMemberPresence = "active" | "away" | "offline" | "unknown";

export type WorkspaceMemberAccessSource = "owner" | "direct" | "team" | "personnel";

export interface WorkspaceMemberAccessChannel {
  readonly source: WorkspaceMemberAccessSource;
  readonly label: string;
  readonly role?: string;
  readonly protocol?: string;
  readonly teamId?: string;
}

export interface WorkspaceMemberView {
  readonly id: string;
  readonly displayName: string;
  readonly email?: string;
  readonly organizationRole?: string;
  readonly presence: WorkspaceMemberPresence;
  readonly isExternal: boolean;
  readonly accessChannels: WorkspaceMemberAccessChannel[];
}

