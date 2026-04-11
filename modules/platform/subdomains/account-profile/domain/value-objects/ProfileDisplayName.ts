import { z } from "@lib-zod";

export const ProfileDisplayNameSchema = z
  .string()
  .min(1)
  .max(100)
  .trim()
  .brand("ProfileDisplayName");
export type ProfileDisplayName = z.infer<typeof ProfileDisplayNameSchema>;

export function createProfileDisplayName(raw: string): ProfileDisplayName {
  return ProfileDisplayNameSchema.parse(raw);
}
