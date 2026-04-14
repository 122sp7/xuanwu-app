import { z } from "@lib-zod";

export const EntitlementIdSchema = z.string().min(1).brand("EntitlementId");
export type EntitlementId = z.infer<typeof EntitlementIdSchema>;

export function createEntitlementId(raw: string): EntitlementId {
  return EntitlementIdSchema.parse(raw);
}
