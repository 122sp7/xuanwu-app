/**
 * AccountProfile — Profile read-model / view of an Account aggregate.
 *
 * Represents the user-facing identity fields of an Account (displayName, email,
 * photoURL, bio, theme).  Owned by the account subdomain after the account-profile
 * subdomain was merged here.  The UpdateAccountProfileInput is the validated
 * command payload for profile mutations.
 *
 * Domain boundary: iam/account
 */

import { z } from "@lib-zod";

import type { AccountEntity } from "./Account";

// ── Value objects ─────────────────────────────────────────────────────────────

export const AccountProfileThemeSchema = z.object({
  primary: z.string().min(1),
  background: z.string().min(1),
  accent: z.string().min(1),
});
export type AccountProfileTheme = z.infer<typeof AccountProfileThemeSchema>;

// ── Profile read-model ────────────────────────────────────────────────────────

export const AccountProfileSchema = z.object({
  id: z.string().min(1),
  displayName: z.string().min(1),
  email: z.string().email().optional(),
  photoURL: z.string().min(1).optional(),
  bio: z.string().min(1).optional(),
  theme: AccountProfileThemeSchema.optional(),
});
export type AccountProfile = z.infer<typeof AccountProfileSchema>;

// ── Profile mutation command ──────────────────────────────────────────────────

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

// ── Factories / mappers ───────────────────────────────────────────────────────

/** Maps a broad AccountEntity to the focused profile read-model. */
export function accountEntityToProfile(entity: AccountEntity): AccountProfile {
  return {
    id: entity.id,
    displayName: (entity.name ?? "").trim() || "Unknown Actor",
    email: entity.email ?? undefined,
    photoURL: entity.photoURL ?? undefined,
    bio: entity.bio ?? undefined,
    theme: entity.theme ?? undefined,
  };
}

/** Parses and validates an update-profile command payload at the boundary. */
export function createUpdateAccountProfileInput(raw: unknown): UpdateAccountProfileInput {
  return UpdateAccountProfileInputSchema.parse(raw);
}
