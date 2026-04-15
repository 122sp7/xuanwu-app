import { z } from "@lib-zod";
import { MEMBER_ROLES } from "../../domain/entities/WorkspaceMember";

export const AddMemberInputSchema = z.object({
  workspaceId: z.string().uuid(),
  actorId: z.string(),
  role: z.enum(MEMBER_ROLES),
  displayName: z.string().min(1),
  email: z.string().email().optional(),
});

export const ChangeMemberRoleSchema = z.object({
  memberId: z.string().uuid(),
  role: z.enum(MEMBER_ROLES),
});

export type AddMemberDTO = z.infer<typeof AddMemberInputSchema>;
export type ChangeMemberRoleDTO = z.infer<typeof ChangeMemberRoleSchema>;
