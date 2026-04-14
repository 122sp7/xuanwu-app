"use server";

/**
 * Workspace Server Actions — thin adapter: Next.js Server Actions → Input Port.
 *
 * After each successful command, records an audit entry via the audit subdomain.
 */

import type { CommandResult } from "@shared-types";
import type {
  CreateWorkspaceCommand,
  UpdateWorkspaceSettingsCommand,
  Capability,
  WorkspaceGrant,
  WorkspaceLocation,
} from "../contracts";
import { workspaceCommandPort } from "../runtime";
import { recordWorkspaceAuditEntry, type RecordAuditEntryInput } from "../../subdomains/audit/api";

async function recordAudit(input: RecordAuditEntryInput): Promise<void> {
  try {
    await recordWorkspaceAuditEntry(input);
  } catch {
    // Audit recording is best-effort — do not fail the primary command.
    if (process.env.NODE_ENV !== "production") {
      console.warn("[workspace.command] Audit recording failed for", input.action);
    }
  }
}

export async function createWorkspace(command: CreateWorkspaceCommand): Promise<CommandResult> {
  const result = await workspaceCommandPort.createWorkspace(command);
  if (result.success) {
    await recordAudit({
      workspaceId: result.aggregateId,
      actorId: command.creatorUserId ?? command.accountId,
      action: "create",
      resourceType: "workspace",
      resourceId: result.aggregateId,
      severity: "medium",
      detail: `Workspace "${command.name}" created`,
      source: "workspace",
    });
  }
  return result;
}

export async function createWorkspaceWithCapabilities(
  command: CreateWorkspaceCommand,
  capabilities: Capability[],
): Promise<CommandResult> {
  const result = await workspaceCommandPort.createWorkspaceWithCapabilities(command, capabilities);
  if (result.success) {
    await recordAudit({
      workspaceId: result.aggregateId,
      actorId: command.creatorUserId ?? command.accountId,
      action: "create",
      resourceType: "workspace",
      resourceId: result.aggregateId,
      severity: "medium",
      detail: `Workspace "${command.name}" created with ${capabilities.length} capabilities`,
      source: "workspace",
    });
  }
  return result;
}

export async function updateWorkspaceSettings(
  command: UpdateWorkspaceSettingsCommand,
): Promise<CommandResult> {
  const result = await workspaceCommandPort.updateWorkspaceSettings(command);
  if (result.success) {
    await recordAudit({
      workspaceId: command.workspaceId,
      actorId: command.accountId,
      action: "update",
      resourceType: "workspace",
      resourceId: command.workspaceId,
      severity: "low",
      detail: "Workspace settings updated",
      source: "workspace",
    });
  }
  return result;
}

export async function deleteWorkspace(workspaceId: string): Promise<CommandResult> {
  const result = await workspaceCommandPort.deleteWorkspace(workspaceId);
  if (result.success) {
    await recordAudit({
      workspaceId,
      actorId: "system",
      action: "delete",
      resourceType: "workspace",
      resourceId: workspaceId,
      severity: "high",
      detail: `Workspace ${workspaceId} deleted`,
      source: "workspace",
    });
  }
  return result;
}

export async function mountCapabilities(
  workspaceId: string,
  capabilities: Capability[],
): Promise<CommandResult> {
  const result = await workspaceCommandPort.mountCapabilities(workspaceId, capabilities);
  if (result.success) {
    await recordAudit({
      workspaceId,
      actorId: "system",
      action: "update",
      resourceType: "workspace",
      resourceId: workspaceId,
      severity: "low",
      detail: `${capabilities.length} capabilities mounted`,
      source: "workspace",
    });
  }
  return result;
}

export async function authorizeWorkspaceTeam(
  workspaceId: string,
  teamId: string,
): Promise<CommandResult> {
  const result = await workspaceCommandPort.authorizeWorkspaceTeam(workspaceId, teamId);
  if (result.success) {
    await recordAudit({
      workspaceId,
      actorId: "system",
      action: "update",
      resourceType: "workspace",
      resourceId: workspaceId,
      severity: "medium",
      detail: `Team ${teamId} authorized`,
      source: "workspace",
    });
  }
  return result;
}

export async function grantIndividualWorkspaceAccess(
  workspaceId: string,
  grant: WorkspaceGrant,
): Promise<CommandResult> {
  const result = await workspaceCommandPort.grantIndividualWorkspaceAccess(workspaceId, grant);
  if (result.success) {
    await recordAudit({
      workspaceId,
      actorId: grant.userId ?? "system",
      action: "update",
      resourceType: "workspace",
      resourceId: workspaceId,
      severity: "medium",
      detail: `Individual access granted: role=${grant.role ?? "member"}`,
      source: "workspace",
    });
  }
  return result;
}

export async function createWorkspaceLocation(
  workspaceId: string,
  location: Omit<WorkspaceLocation, "locationId">,
): Promise<CommandResult> {
  const result = await workspaceCommandPort.createWorkspaceLocation(workspaceId, location);
  if (result.success) {
    await recordAudit({
      workspaceId,
      actorId: "system",
      action: "create",
      resourceType: "workspace-location",
      resourceId: result.aggregateId,
      severity: "low",
      detail: `Location "${location.label}" created`,
      source: "workspace",
    });
  }
  return result;
}
