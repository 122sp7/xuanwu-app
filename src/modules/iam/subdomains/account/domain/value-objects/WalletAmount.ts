import { z } from "zod";

export const WalletAmountSchema = z.number().positive().brand("WalletAmount");
export type WalletAmount = z.infer<typeof WalletAmountSchema>;

export function createWalletAmount(raw: number): WalletAmount {
  return WalletAmountSchema.parse(raw);
}
