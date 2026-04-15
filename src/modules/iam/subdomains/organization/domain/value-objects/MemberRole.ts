import { z } from "@lib-zod";

export const MEMBER_ROLES = ["Owner", "Admin", "Member", "Guest"] as const;
export const MemberRoleSchema = z.enum(MEMBER_ROLES);
export type MemberRole = z.infer<typeof MemberRoleSchema>;

const ROLE_RANK: Record<MemberRole, number> = { Owner: 4, Admin: 3, Member: 2, Guest: 1 };

export function createMemberRole(raw: string): MemberRole {
  return MemberRoleSchema.parse(raw);
}

export function canManageRole(managerRole: MemberRole, targetRole: MemberRole): boolean {
  if (managerRole === "Owner") return targetRole !== "Owner";
  return ROLE_RANK[managerRole] > ROLE_RANK[targetRole];
}
