/**
 * get-policy-catalog-view — use case.
 *
 * Query:   GetPolicyCatalogView
 * Purpose: Returns the active policy version and rule summary.
 *
 * Input fields:
 *   contextId
 *
 * Orchestration steps:
 *   1. Query PolicyCatalogViewRepository
 *   2. Return PolicyCatalogView read model
 *
 * Output ports:
 *   PolicyCatalogViewRepository
 *
 * Returns: PolicyCatalogView read model (never adapter-native type)
 *
 * @see docs/application-services.md
 * @see ports/input/index.ts — PlatformQueryPort
 */

// TODO: implement GetPolicyCatalogViewUseCase
