/**
 * PolicyRuleEntity — Entity
 *
 * A single evaluatable governance rule inside a PolicyCatalog aggregate.
 * Has its own identity (ruleId) within the catalog, but cannot exist outside one.
 *
 * Key attributes:
 *   ruleId     — unique within its catalog revision
 *   subject    — SubjectScope the rule applies to
 *   condition  — predicate expression (domain-typed, not SQL/CEL)
 *   effect     — "allow" | "deny" | "require"
 *   ruleType   — "permission" | "workflow" | "notification" | "audit"
 *   priority   — integer; lower value = higher priority
 *
 * Invariants:
 *   - Every rule must declare subject, condition, and effect
 *   - Two rules within the same catalog may not share the same ruleId
 *   - A rule with effect "require" is only valid for ruleType "audit"
 *
 * Owned by: PolicyCatalog aggregate
 * @see domain/aggregates/PolicyCatalog.ts
 * @see docs/aggregates.md — 子實體與值物件
 */

// TODO: implement PolicyRuleEntity interface / class
