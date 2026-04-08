import { z } from "@lib-zod";

export const WorkspaceNameSchema = z
  .string()
  .trim()
  .min(1, "Workspace name is required")
  .max(80, "Workspace name must be 80 characters or less")
  .brand<"WorkspaceName">();

export type WorkspaceName = z.infer<typeof WorkspaceNameSchema>;
export type WorkspaceNameInput = z.input<typeof WorkspaceNameSchema>;

export function createWorkspaceName(value: WorkspaceNameInput): WorkspaceName {
  return WorkspaceNameSchema.parse(value);
}

export function workspaceNameEquals(left: WorkspaceName, right: WorkspaceName): boolean {
  return left === right;
}