import { z } from "zod";

export const ResourceRefSchema = z.object({
  resourceType: z.string().min(1),
  resourceId: z.string().min(1).optional(),
  workspaceId: z.string().min(1).optional(),
});
export type ResourceRef = z.infer<typeof ResourceRefSchema>;

export function createResourceRef(
  resourceType: string,
  resourceId?: string,
  workspaceId?: string,
): ResourceRef {
  return ResourceRefSchema.parse({ resourceType, resourceId, workspaceId });
}
