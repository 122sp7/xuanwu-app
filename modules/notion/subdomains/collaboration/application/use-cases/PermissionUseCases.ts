/**
 * Module: notion/subdomains/collaboration
 * Layer: application/use-cases
 * Aggregate: Permission
 */

import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { IPermissionRepository } from "../../domain/repositories/IPermissionRepository";
import {
  GrantPermissionSchema, type GrantPermissionDto,
  RevokePermissionSchema, type RevokePermissionDto,
} from "../dto/CollaborationDto";

export class GrantPermissionUseCase {
  constructor(private readonly repo: IPermissionRepository) {}

  async execute(input: GrantPermissionDto): Promise<CommandResult> {
    const parsed = GrantPermissionSchema.safeParse(input);
    if (!parsed.success) return commandFailureFrom("PERMISSION_INVALID_INPUT", parsed.error.message);
    const { accountId, workspaceId, subjectId, subjectType, principalId, principalType, level, grantedByUserId, expiresAtISO, linkToken } = parsed.data;
    const permission = await this.repo.grant({
      subjectId, subjectType, workspaceId, accountId, principalId, principalType,
      level, grantedByUserId,
      expiresAtISO: expiresAtISO ?? null,
      linkToken: linkToken ?? null,
    });
    return commandSuccess(permission.id, Date.now());
  }
}

export class RevokePermissionUseCase {
  constructor(private readonly repo: IPermissionRepository) {}

  async execute(input: RevokePermissionDto): Promise<CommandResult> {
    const parsed = RevokePermissionSchema.safeParse(input);
    if (!parsed.success) return commandFailureFrom("PERMISSION_INVALID_INPUT", parsed.error.message);
    await this.repo.revoke(parsed.data.accountId, parsed.data.id);
    return commandSuccess(parsed.data.id, Date.now());
  }
}
