import { z } from "zod";

export const CreateApiKeySchema = z.object({
  workspaceId: z.string().uuid(),
  actorId: z.string(),
  label: z.string().min(1).max(100),
  expiresAtISO: z.string().datetime().optional(),
});

export type CreateApiKeyDTO = z.infer<typeof CreateApiKeySchema>;
