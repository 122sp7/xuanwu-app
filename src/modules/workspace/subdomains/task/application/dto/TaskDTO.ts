import { z } from "zod";
import { TASK_STATUSES } from "../../domain/value-objects/TaskStatus";

export const CreateTaskInputSchema = z.object({
  workspaceId: z.string().uuid(),
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  assigneeId: z.string().optional(),
  dueDateISO: z.string().datetime().optional(),
});

export const UpdateTaskInputSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().optional(),
  assigneeId: z.string().nullable().optional(),
  dueDateISO: z.string().datetime().nullable().optional(),
});

export const TransitionTaskInputSchema = z.object({
  taskId: z.string().uuid(),
  to: z.enum(TASK_STATUSES),
});

export type CreateTaskDTO = z.infer<typeof CreateTaskInputSchema>;
export type UpdateTaskDTO = z.infer<typeof UpdateTaskInputSchema>;
export type TransitionTaskDTO = z.infer<typeof TransitionTaskInputSchema>;
