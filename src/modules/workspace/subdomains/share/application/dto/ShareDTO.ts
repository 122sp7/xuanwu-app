import { z } from "zod";
import { SHARE_SCOPES } from "../../domain/entities/WorkspaceShare";

export const GrantShareSchema = z.object({
  workspaceId: z.string().uuid(),
  grantedToId: z.string(),
  grantedToType: z.enum(["user", "team"]),
  scope: z.enum(SHARE_SCOPES),
  grantedByActorId: z.string(),
  expiresAtISO: z.string().datetime().optional(),
});

export type GrantShareDTO = z.infer<typeof GrantShareSchema>;
