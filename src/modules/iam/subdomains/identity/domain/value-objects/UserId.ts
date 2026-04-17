import { z } from "zod";

export const UserIdSchema = z.string().min(1).brand("UserId");
export type UserId = z.infer<typeof UserIdSchema>;

export function createUserId(raw: string): UserId {
  return UserIdSchema.parse(raw);
}

export function unsafeUserId(raw: string): UserId {
  return raw as UserId;
}
