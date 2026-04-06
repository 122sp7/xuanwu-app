export type PermissionLevel = "view" | "comment" | "edit" | "full";

/**
 * "user"   — specific workspace member
 * "team"   — workspace team/group
 * "public" — anyone, no authentication required (enforces "view" level)
 * "link"   — anyone with the opaque share-link token
 */
export type PrincipalType = "user" | "team" | "public" | "link";

export interface Permission {
  id: string;
  subjectId: string;
  subjectType: "page" | "article" | "database";
  workspaceId: string;
  accountId: string;
  principalId: string;
  principalType: PrincipalType;
  level: PermissionLevel;
  grantedByUserId: string;
  grantedAtISO: string;
  expiresAtISO: string | null;
  /**
   * Opaque token for link-based sharing. Only meaningful when principalType = "link".
   * Null for user/team/public grants.
   */
  linkToken: string | null;
}
