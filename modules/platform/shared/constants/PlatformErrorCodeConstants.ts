/**
 * PlatformErrorCodeConstants — Shared Constants
 *
 * String constants for all machine-readable error codes used in PlatformCommandResult.
 *
 * Codes:
 *   ENTITLEMENT_DENIED     — capability not allowed by current subscription plan
 *   POLICY_CONFLICT        — two or more policy rules produce a contradictory decision
 *   DELIVERY_NOT_ALLOWED   — integration or notification delivery was blocked by policy
 *   CONTRACT_NOT_ACTIVE    — integration contract is not in active state
 *   AGREEMENT_EXPIRED      — subscription agreement has expired
 *   CONTEXT_NOT_ACTIVE     — platform context is not in active state
 *   INVARIANT_VIOLATION    — aggregate invariant was violated
 *   UNKNOWN_ERROR          — unexpected error (fallback)
 *
 * @see application/dtos/PlatformCommandResult.dto.ts
 * @see adapters/web/mapPlatformResultToHttpResponse.ts
 */

// TODO: implement PlatformErrorCodeConstants as const object
