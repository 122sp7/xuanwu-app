import { z } from "zod";
import { DEMAND_PRIORITIES } from "../../domain/entities/WorkDemand";

export const CreateWorkDemandSchema = z.object({
  workspaceId: z.string().uuid(),
  accountId: z.string(),
  requesterId: z.string(),
  title: z.string().min(1).max(200),
  description: z.string(),
  priority: z.enum(DEMAND_PRIORITIES),
  scheduledAt: z.string().datetime(),
});

export type CreateWorkDemandDTO = z.infer<typeof CreateWorkDemandSchema>;
