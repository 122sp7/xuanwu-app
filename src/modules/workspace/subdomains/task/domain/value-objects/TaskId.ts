import { z } from "@lib-zod";

export const TaskIdSchema = z.string().uuid().brand("TaskId");
export type TaskId = z.infer<typeof TaskIdSchema>;

export function createTaskId(raw: string): TaskId {
  return TaskIdSchema.parse(raw);
}
