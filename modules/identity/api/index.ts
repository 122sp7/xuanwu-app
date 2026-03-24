/**
 * identity 模組公開跨域 API。
 * 所有跨模組呼叫均需透過此檔案，禁止直接引用 identity 模組內部實作。
 */

import { FirebaseTokenRefreshRepository } from "../infrastructure/firebase/FirebaseTokenRefreshRepository";
import { EmitTokenRefreshSignalUseCase } from "../application/use-cases/token-refresh.use-cases";
import type { TokenRefreshReason } from "../domain/entities/TokenRefreshSignal";

// ─── DTO ──────────────────────────────────────────────────────────────────────

/** 發送 Token Refresh 訊號所需的輸入參數。 */
export interface EmitTokenRefreshSignalInput {
  accountId: string;
  reason: TokenRefreshReason;
  traceId?: string;
}

// ─── 內部單例 ──────────────────────────────────────────────────────────────────

const tokenRefreshRepo = new FirebaseTokenRefreshRepository();
const emitUseCase = new EmitTokenRefreshSignalUseCase(tokenRefreshRepo);

// ─── 公開 API Facade ──────────────────────────────────────────────────────────

export const identityApi = {
  /**
   * [S6] 發送 TOKEN_REFRESH_SIGNAL，通知前端重新整理 Custom Claims。
   * 應在角色或政策變更後呼叫。
   */
  async emitTokenRefreshSignal(input: EmitTokenRefreshSignalInput): Promise<void> {
    await emitUseCase.execute(input.accountId, input.reason, input.traceId);
  },
} as const;
