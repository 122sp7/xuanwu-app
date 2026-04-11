import { z } from "@lib-zod";

export const FeatureKeySchema = z
  .string()
  .min(1)
  .regex(/^[a-z][a-z0-9_:.\-]*$/, "FeatureKey must be lowercase dot/colon/hyphen separated")
  .brand("FeatureKey");
export type FeatureKey = z.infer<typeof FeatureKeySchema>;

export function createFeatureKey(raw: string): FeatureKey {
  return FeatureKeySchema.parse(raw);
}
