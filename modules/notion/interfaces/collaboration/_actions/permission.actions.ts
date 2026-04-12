"use server";

/**
 * Module: notion/subdomains/collaboration
 * Layer: interfaces/_actions
 * Purpose: Permission aggregate server actions — grant, revoke.
 */

import { commandFailureFrom, type CommandResult } from "@shared-types";
import { makePermissionRepo } from "../composition/repositories";
import { GrantPermissionUseCase, RevokePermissionUseCase } from "../../../subdomains/collaboration/application/use-cases/PermissionUseCases";
import type { GrantPermissionDto, RevokePermissionDto } from "../../../subdomains/collaboration/application/dto/CollaborationDto";

export async function grantPermission(input: GrantPermissionDto): Promise<CommandResult> {
  try {
    return await new GrantPermissionUseCase(makePermissionRepo()).execute(input);
  } catch (err) {
    return commandFailureFrom("PERMISSION_GRANT_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function revokePermission(input: RevokePermissionDto): Promise<CommandResult> {
  try {
    return await new RevokePermissionUseCase(makePermissionRepo()).execute(input);
  } catch (err) {
    return commandFailureFrom("PERMISSION_REVOKE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}
