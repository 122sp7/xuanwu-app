/**
 * PolicyCatalog — Aggregate Root
 *
 * Owns the versioned set of policies used to evaluate permissions, notifications,
 * workflows, and audit rules within a platform scope.
 * It is the domain's single source of truth for governance semantics —
 * not an adapter configuration container.
 *
 * Key attributes:
 *   policyCatalogId   — PolicyCatalogId
 *   contextId         — PlatformContextId (owning platform scope)
 *   permissionRules   — PolicyRule[] (access-control and authorization rules)
 *   workflowRules     — PolicyRule[] (trigger conditions and step rules)
 *   notificationRules — PolicyRule[] (notification routing and suppression rules)
 *   auditRules        — PolicyRule[] (decisions and behaviors that must be recorded)
 *   revision          — number (monotonically incrementing version number)
 *
 * Invariants:
 *   - Only one active catalog revision per contextId at any time
 *   - Every rule must have explicit subject, condition, and effect
 *   - Permission, workflow, notification, and audit rules must not create indeterminate conflicts
 *
 * Emits:
 *   policy.catalog-published
 *
 * @see docs/aggregates.md — 聚合根：PolicyCatalog
 * @see docs/domain-events.md
 */

// TODO: implement PolicyCatalog aggregate root class
