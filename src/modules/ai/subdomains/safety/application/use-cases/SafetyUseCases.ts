import type { ContentSafetyPort, ContentSafetyInput, SafetyCheckResult } from "../../domain/entities/SafetyCheckResult";

export interface CheckContentSafetyResult {
  readonly ok: boolean;
  readonly result?: SafetyCheckResult;
  readonly error?: string;
}

export class CheckContentSafetyUseCase {
  constructor(private readonly safetyPort: ContentSafetyPort) {}

  async execute(input: ContentSafetyInput): Promise<CheckContentSafetyResult> {
    try {
      const result = await this.safetyPort.check(input);
      return { ok: true, result };
    } catch (err) {
      return {
        ok: false,
        error: err instanceof Error ? err.message : "Safety check failed",
      };
    }
  }
}

export class AssertContentSafeUseCase {
  constructor(private readonly safetyPort: ContentSafetyPort) {}

  /** Resolves normally when safe; throws when blocked or flagged. */
  async execute(input: ContentSafetyInput): Promise<SafetyCheckResult> {
    const result = await this.safetyPort.check(input);
    if (result.overallVerdict === "blocked") {
      throw new Error(`Content blocked by safety policy: ${result.reason ?? "policy violation"}`);
    }
    return result;
  }
}
