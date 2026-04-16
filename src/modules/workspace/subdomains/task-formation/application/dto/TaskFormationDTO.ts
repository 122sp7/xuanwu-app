import { z } from "zod";

export const CreateTaskFormationJobSchema = z.object({
  workspaceId: z.string().uuid(),
  actorId: z.string(),
  correlationId: z.string(),
  knowledgePageIds: z.array(z.string()).min(1),
});

export type CreateTaskFormationJobDTO = z.infer<typeof CreateTaskFormationJobSchema>;
