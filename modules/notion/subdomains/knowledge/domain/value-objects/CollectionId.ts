import { z } from "@lib-zod";

export const CollectionIdSchema = z.string().uuid().brand("CollectionId");
export type CollectionId = z.infer<typeof CollectionIdSchema>;

export function createCollectionId(id: string): CollectionId {
  return CollectionIdSchema.parse(id);
}

export function unsafeCollectionId(id: string): CollectionId {
  return id as CollectionId;
}
