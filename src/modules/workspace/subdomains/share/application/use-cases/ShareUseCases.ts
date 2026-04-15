import { v4 as uuid } from "@lib-uuid";
import { commandSuccess, commandFailureFrom, type CommandResult } from "@shared-types";
import type { WorkspaceShareRepository } from "../../domain/repositories/WorkspaceShareRepository";
import { WorkspaceShare } from "../../domain/entities/WorkspaceShare";
import type { GrantShareInput } from "../../domain/entities/WorkspaceShare";

export class GrantWorkspaceShareUseCase {
  constructor(private readonly shareRepo: WorkspaceShareRepository) {}

  async execute(input: GrantShareInput): Promise<CommandResult> {
    try {
      const share = WorkspaceShare.grant(uuid(), input);
      await this.shareRepo.save(share.getSnapshot());
      return commandSuccess(share.id, Date.now());
    } catch (err) {
      return commandFailureFrom("SHARE_GRANT_FAILED", err instanceof Error ? err.message : "Failed to grant share.");
    }
  }
}

export class RevokeWorkspaceShareUseCase {
  constructor(private readonly shareRepo: WorkspaceShareRepository) {}

  async execute(shareId: string): Promise<CommandResult> {
    try {
      const existing = await this.shareRepo.findById(shareId);
      if (!existing) return commandFailureFrom("SHARE_NOT_FOUND", "Share not found.");
      await this.shareRepo.delete(shareId);
      return commandSuccess(shareId, Date.now());
    } catch (err) {
      return commandFailureFrom("SHARE_REVOKE_FAILED", err instanceof Error ? err.message : "Failed to revoke share.");
    }
  }
}
