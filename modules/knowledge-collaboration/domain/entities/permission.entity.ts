export type PermissionLevel = "view" | "comment" | "edit" | "full";

export interface Permission {
  id: string;
  subjectId: string;
  subjectType: "page" | "article" | "database";
  workspaceId: string;
  accountId: string;
  principalId: string;
  principalType: "user" | "team";
  level: PermissionLevel;
  grantedByUserId: string;
  grantedAtISO: string;
  expiresAtISO: string | null;
}
