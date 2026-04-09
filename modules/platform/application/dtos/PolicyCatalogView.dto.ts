/**
 * PolicyCatalogView — Read Model DTO
 *
 * A read-only projection of the active PolicyCatalog for a platform scope.
 *
 * Fields:
 *   contextId             — owning platform scope identifier
 *   revision              — current revision number
 *   permissionRuleCount   — count of active permission rules
 *   workflowRuleCount     — count of active workflow rules
 *   notificationRuleCount — count of active notification rules
 *   auditRuleCount        — count of active audit rules
 *   publishedAt           — ISO 8601 timestamp of catalog publication
 *
 * Produced by: GetPolicyCatalogViewHandler
 * Consumed by: api/contracts.ts surface, driving adapters
 *
 * @see application/handlers/GetPolicyCatalogViewHandler.ts
 * @see ports/output/index.ts — PolicyCatalogViewRepository
 * @see docs/application-services.md — Query DTOs
 */

// TODO: implement PolicyCatalogView DTO interface
