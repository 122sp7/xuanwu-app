import { z } from "@lib-zod";

export const BlockIdSchema = z.string().uuid().brand("BlockId");
export type BlockId = z.infer<typeof BlockIdSchema>;

export function createBlockId(id: string): BlockId {
  return BlockIdSchema.parse(id);
}

export function unsafeBlockId(id: string): BlockId {
  return id as BlockId;
}
