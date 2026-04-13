/**
 * PlatformCommandResult — Shared Command Result DTO
 *
 * The uniform envelope returned by every command handler in the platform module.
 * Driving adapters (web, CLI) map this to their own protocol-level response —
 * they must not invent new result shapes for platform commands.
 *
 * Fields:
 *   ok        — true if command succeeded, false if it failed
 *   code      — machine-readable outcome code (e.g., "ENTITLEMENT_DENIED", "POLICY_CONFLICT")
 *   message   — human-readable description (optional, primarily for debugging)
 *   metadata  — additional key-value data for downstream audit or tracing (optional)
 *
 * Usage rules:
 *   - Errors are expressed as ok=false + code, never as thrown exceptions at the port boundary
 *   - code should map to a value in shared/constants/PlatformErrorCodeConstants.ts
 *
 * @see application/dto/index.ts
 * @see shared/constants/PlatformErrorCodeConstants.ts
 * @see docs/application-services.md — Command Result
 */

// TODO: implement PlatformCommandResult DTO interface (re-export or extend from application/dto/index.ts)
