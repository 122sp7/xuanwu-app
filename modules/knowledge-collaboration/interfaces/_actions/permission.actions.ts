"use server";

/**
 * Module: knowledge-collaboration
 * Layer: interfaces/_actions
 * Purpose: Permission Aggregate Server Actions — grant, revoke.
 * Comment actions: see comment.actions.ts
 * Version actions: see version.actions.ts
 */

import { commandFailureFrom, type CommandResult } from "@shared-types";
import {
  GrantPermissionUseCase,
  RevokePermissionUseCase,
} from "../../application/use-cases/permission.use-cases";
import { FirebasePermissionRepository } from "../../infrastructure/firebase/FirebasePermissionRepository";
import type {
  GrantPermissionDto,
  RevokePermissionDto,
} from "../../application/dto/knowledge-collaboration.dto";

function makePermissionRepo() { return new FirebasePermissionRepository(); }

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
