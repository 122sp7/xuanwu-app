import { z } from "@lib-zod";

export const ACCOUNT_TYPES = ["user", "organization"] as const;
export type AccountType = (typeof ACCOUNT_TYPES)[number];

export const AccountTypeSchema = z.enum(ACCOUNT_TYPES);

export function createAccountType(raw: string): AccountType {
	return AccountTypeSchema.parse(raw);
}
