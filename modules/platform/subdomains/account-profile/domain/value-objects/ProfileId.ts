import { z } from "@lib-zod";

export const ProfileIdSchema = z.string().min(1).brand("ProfileId");
export type ProfileId = z.infer<typeof ProfileIdSchema>;

export function createProfileId(raw: string): ProfileId {
  return ProfileIdSchema.parse(raw);
}
