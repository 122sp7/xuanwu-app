import { z } from "zod";

export const idSchema = z.string().uuid();

// Note: .default() fills missing fields during .parse(). Use .optional() instead
// if you need strict validation without automatic default injection.
export const paginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
});

export const taskSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  status: z.enum(["todo", "in_progress", "done"]),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type TaskSchemaType = z.infer<typeof taskSchema>;
