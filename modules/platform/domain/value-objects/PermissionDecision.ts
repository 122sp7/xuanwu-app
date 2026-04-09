/**
 * PermissionDecision — Value Object / Decision Object
 *
 * The outcome of a permission evaluation.
 * Possible outcomes: allow | deny | conditional_allow | escalate
 *
 * A PermissionDecision is always explicit — never a loose boolean.
 *
 * Used by: PermissionResolutionService, access-control subdomain
 * @see docs/aggregates.md — 主要值物件
 * @see docs/domain-services.md — 主要 Decision Objects
 */

// TODO: implement PermissionDecision value object / discriminated union
