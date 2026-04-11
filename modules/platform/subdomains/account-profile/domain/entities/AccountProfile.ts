import { z } from "@lib-zod";

export const AccountProfileIdSchema = z.string().min(1).brand("AccountProfileId");
export type AccountProfileId = z.infer<typeof AccountProfileIdSchema>;

export const AccountProfileThemeSchema = z.object({
  primary: z.string().min(1),
  background: z.string().min(1),
  accent: z.string().min(1),
});
export type AccountProfileTheme = z.infer<typeof AccountProfileThemeSchema>;

export const AccountProfileSchema = z.object({
  id: AccountProfileIdSchema,
  displayName: z.string().min(1),
  email: z.string().email().optional(),
  photoURL: z.string().min(1).optional(),
  bio: z.string().min(1).optional(),
  theme: AccountProfileThemeSchema.optional(),
});
export type AccountProfile = z.infer<typeof AccountProfileSchema>;

export const UpdateAccountProfileInputSchema = z
  .object({
    displayName: z.string().min(1).optional(),
    bio: z.string().min(1).optional(),
    photoURL: z.string().min(1).optional(),
    theme: AccountProfileThemeSchema.optional(),
  })
  .refine((input) => Object.keys(input).length > 0, {
    message: "At least one profile field is required",
  });
export type UpdateAccountProfileInput = z.infer<typeof UpdateAccountProfileInputSchema>;

export function createAccountProfileId(raw: string): AccountProfileId {
  return AccountProfileIdSchema.parse(raw);
}

export function createAccountProfile(raw: AccountProfile): AccountProfile {
  return AccountProfileSchema.parse(raw);
}

export function createUpdateAccountProfileInput(
  raw: UpdateAccountProfileInput,
): UpdateAccountProfileInput {
  return UpdateAccountProfileInputSchema.parse(raw);
}
