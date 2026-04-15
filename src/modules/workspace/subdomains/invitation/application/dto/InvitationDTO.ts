import { z } from "@lib-zod";

export const CreateInvitationSchema = z.object({
  workspaceId: z.string().uuid(),
  invitedEmail: z.string().email(),
  invitedByActorId: z.string(),
  role: z.string().min(1),
  expiresAtISO: z.string().datetime(),
});

export type CreateInvitationDTO = z.infer<typeof CreateInvitationSchema>;
