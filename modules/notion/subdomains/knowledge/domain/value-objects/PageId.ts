import { z } from "@lib-zod";

export const PageIdSchema = z.string().uuid().brand("PageId");
export type PageId = z.infer<typeof PageIdSchema>;

export function createPageId(id: string): PageId {
  return PageIdSchema.parse(id);
}

export function unsafePageId(id: string): PageId {
  return id as PageId;
}
