/**
 * PermissionResolutionService — Domain Service
 *
 * Resolves a PermissionDecision based on subject scope, active policy catalog,
 * and resource descriptor.
 *
 * Inputs:  SubjectScope, PolicyCatalog, ResourceDescriptor
 * Returns: PermissionDecision (allow | deny | conditional_allow | escalate)
 *
 * Cross-aggregate rule: spans SubjectScope and PolicyCatalog.
 * Errors describe governance semantics: entitlement_denied, policy_conflict.
 *
 * @see docs/domain-services.md — Domain Services 清單
 * @see docs/ubiquitous-language.md — 權限決策
 */

// TODO: implement PermissionResolutionService domain service
