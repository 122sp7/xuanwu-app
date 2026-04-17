import { z } from "zod";

export const EmailSchema = z.string().email().brand("Email");
export type Email = z.infer<typeof EmailSchema>;

export function createEmail(raw: string): Email {
  return EmailSchema.parse(raw);
}

export function unsafeEmail(raw: string): Email {
  return raw as Email;
}
