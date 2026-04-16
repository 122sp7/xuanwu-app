import { z } from 'zod';

export const SubscriptionIdSchema = z.string().min(1).brand('SubscriptionId');
export type SubscriptionId = z.infer<typeof SubscriptionIdSchema>;

export function createSubscriptionId(raw: string): SubscriptionId {
  return SubscriptionIdSchema.parse(raw);
}
