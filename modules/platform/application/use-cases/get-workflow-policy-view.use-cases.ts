/**
 * get-workflow-policy-view — use case.
 *
 * Query:   GetWorkflowPolicyView
 * Purpose: Returns the workflow policy corresponding to a trigger key.
 *
 * Input fields:
 *   contextId, triggerKey
 *
 * Orchestration steps:
 *   1. Query WorkflowPolicyRepository for trigger key
 *   2. Cross-reference with PolicyCatalogViewRepository
 *   3. Return WorkflowPolicyView read model
 *
 * Output ports:
 *   WorkflowPolicyRepository, PolicyCatalogViewRepository
 *
 * Returns: WorkflowPolicyView read model (never adapter-native type)
 *
 * @see docs/application-services.md
 * @see ports/input/index.ts — PlatformQueryPort
 */

// TODO: implement GetWorkflowPolicyViewUseCase
