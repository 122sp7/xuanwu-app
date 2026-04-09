/**
 * createPolicyConflictError — Error Factory
 *
 * Creates a typed domain error for the case where the PolicyCatalog
 * contains rules that produce a contradictory decision for the same subject/resource.
 *
 * Error fields:
 *   code          — "POLICY_CONFLICT"
 *   conflictingRuleIds — list of ruleIds that conflict
 *   contextId         — the platform scope
 *   catalogRevision   — the revision where the conflict was detected
 *
 * @see shared/constants/PlatformErrorCodeConstants.ts
 * @see domain/services/PermissionResolutionService.ts
 */

// TODO: implement createPolicyConflictError factory function
