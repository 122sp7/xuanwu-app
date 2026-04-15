import { commandSuccess, commandFailureFrom, type CommandResult } from "@shared-types";
import type { TokenRefreshRepository } from "../../domain/repositories/TokenRefreshRepository";
import type { TokenRefreshReason } from "../../domain/entities/TokenRefreshSignal";

export class EmitTokenRefreshSignalUseCase {
  constructor(private readonly tokenRefreshRepo: TokenRefreshRepository) {}

  async execute(accountId: string, reason: TokenRefreshReason, traceId?: string): Promise<CommandResult> {
    if (!/^[\w-]+$/.test(accountId)) {
      return commandFailureFrom(
        "TOKEN_REFRESH_INVALID_ACCOUNT_ID",
        `accountId '${accountId}' is not a valid Firestore document ID`,
      );
    }
    try {
      await this.tokenRefreshRepo.emit({
        accountId,
        reason,
        issuedAt: new Date().toISOString(),
        ...(traceId ? { traceId } : {}),
      });
      return commandSuccess(accountId, 0);
    } catch (err) {
      return commandFailureFrom(
        "TOKEN_REFRESH_EMIT_FAILED",
        err instanceof Error ? err.message : "Failed to emit token refresh signal",
      );
    }
  }
}
