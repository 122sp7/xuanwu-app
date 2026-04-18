import { z } from "zod";

export const CreateTaskFormationJobSchema = z.object({
  workspaceId: z.string().uuid(),
  actorId: z.string(),
  correlationId: z.string(),
  knowledgePageIds: z.array(z.string()).min(1),
});

export type CreateTaskFormationJobDTO = z.infer<typeof CreateTaskFormationJobSchema>;

export const ExtractTaskCandidatesSchema = z.object({
  workspaceId: z.string().uuid(),
  actorId: z.string(),
  sourceType: z.enum(["rule", "ai"]),
  sourcePageIds: z.array(z.string()).min(1),
  sourceText: z.string().optional(),
});

export type ExtractTaskCandidatesDTO = z.infer<typeof ExtractTaskCandidatesSchema>;

export const ConfirmCandidatesSchema = z.object({
  jobId: z.string().uuid(),
  workspaceId: z.string().uuid(),
  actorId: z.string(),
  selectedIndices: z.array(z.number().int().min(0)).min(1),
});

export type ConfirmCandidatesDTO = z.infer<typeof ConfirmCandidatesSchema>;
