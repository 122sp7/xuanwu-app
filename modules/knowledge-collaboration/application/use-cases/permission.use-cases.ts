/**
 * Module: knowledge-collaboration
 * Layer: application/use-cases
 * Permission use cases: GrantPermission, RevokePermission, ListPermissionsBySubject
 */

import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { Permission } from "../../domain/entities/permission.entity";
import type { IPermissionRepository } from "../../domain/repositories/IPermissionRepository";
import {
  GrantPermissionSchema, type GrantPermissionDto,
  RevokePermissionSchema, type RevokePermissionDto,
} from "../dto/knowledge-collaboration.dto";

export class GrantPermissionUseCase {
  constructor(private readonly repo: IPermissionRepository) {}

  async execute(input: GrantPermissionDto): Promise<CommandResult> {
    const parsed = GrantPermissionSchema.safeParse(input);
    if (!parsed.success) {
      return commandFailureFrom("PERMISSION_INVALID_INPUT", parsed.error.message);
    }
    const { accountId, workspaceId, subjectId, subjectType, principalId, principalType, level, grantedByUserId, expiresAtISO } = parsed.data;
    const permission = await this.repo.grant({
      accountId, workspaceId, subjectId, subjectType,
      principalId, principalType, level, grantedByUserId,
      expiresAtISO: expiresAtISO ?? null,
    });
    return commandSuccess(permission.id, Date.now());
  }
}

export class RevokePermissionUseCase {
  constructor(private readonly repo: IPermissionRepository) {}

  async execute(input: RevokePermissionDto): Promise<CommandResult> {
    const parsed = RevokePermissionSchema.safeParse(input);
    if (!parsed.success) {
      return commandFailureFrom("PERMISSION_INVALID_INPUT", parsed.error.message);
    }
    await this.repo.revoke(parsed.data.accountId, parsed.data.id);
    return commandSuccess(parsed.data.id, Date.now());
  }
}

export class ListPermissionsBySubjectUseCase {
  constructor(private readonly repo: IPermissionRepository) {}

  async execute(accountId: string, subjectId: string): Promise<Permission[]> {
    return this.repo.listBySubject(accountId, subjectId);
  }
}
