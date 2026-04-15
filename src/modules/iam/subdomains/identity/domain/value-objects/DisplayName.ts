import { z } from "@lib-zod";

export const DisplayNameSchema = z.string().min(1).max(100).trim().brand("DisplayName");
export type DisplayName = z.infer<typeof DisplayNameSchema>;

export function createDisplayName(raw: string): DisplayName {
  return DisplayNameSchema.parse(raw);
}
