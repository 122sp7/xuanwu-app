import { z } from "zod";

export const AccountIdSchema = z.string().min(1).brand("AccountId");
export type AccountId = z.infer<typeof AccountIdSchema>;

export function createAccountId(raw: string): AccountId {
  return AccountIdSchema.parse(raw);
}
