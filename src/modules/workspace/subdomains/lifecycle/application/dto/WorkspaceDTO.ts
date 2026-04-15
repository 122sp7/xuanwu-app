import { z } from "@lib-zod";

export const CreateWorkspaceInputSchema = z.object({
  accountId: z.string(),
  accountType: z.enum(["user", "organization"]),
  name: z.string().min(1).max(100),
  visibility: z.enum(["private", "internal", "public"]).optional(),
  photoURL: z.string().url().optional(),
});

export const UpdateWorkspaceSettingsSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  visibility: z.enum(["private", "internal", "public"]).optional(),
  photoURL: z.string().url().nullable().optional(),
});

export type CreateWorkspaceDTO = z.infer<typeof CreateWorkspaceInputSchema>;
export type UpdateWorkspaceSettingsDTO = z.infer<typeof UpdateWorkspaceSettingsSchema>;
