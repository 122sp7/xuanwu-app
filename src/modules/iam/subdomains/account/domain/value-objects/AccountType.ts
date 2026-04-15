import { z } from "@lib-zod";

export const ACCOUNT_TYPES = ["user", "organization"] as const;
export type AccountTypeValue = (typeof ACCOUNT_TYPES)[number];

export const AccountTypeSchema = z.enum(ACCOUNT_TYPES);

export function createAccountType(raw: string): AccountTypeValue {
  return AccountTypeSchema.parse(raw);
}
