import { z } from "@lib-zod";

export const RecordActivitySchema = z.object({
  workspaceId: z.string().uuid(),
  actorId: z.string(),
  activityType: z.string().min(1),
  resourceType: z.string().min(1),
  resourceId: z.string(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export type RecordActivityDTO = z.infer<typeof RecordActivitySchema>;
