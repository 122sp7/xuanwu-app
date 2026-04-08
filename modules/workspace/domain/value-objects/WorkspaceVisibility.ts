import { z } from "@lib-zod";

export const WORKSPACE_VISIBILITIES = ["visible", "hidden"] as const;

export const WorkspaceVisibilitySchema = z.enum(WORKSPACE_VISIBILITIES);

export type WorkspaceVisibility = z.infer<typeof WorkspaceVisibilitySchema>;
export type WorkspaceVisibilityInput = z.input<typeof WorkspaceVisibilitySchema>;

export function createWorkspaceVisibility(
  value: WorkspaceVisibilityInput,
): WorkspaceVisibility {
  return WorkspaceVisibilitySchema.parse(value);
}

export function isWorkspaceVisible(visibility: WorkspaceVisibility): boolean {
  return visibility === "visible";
}