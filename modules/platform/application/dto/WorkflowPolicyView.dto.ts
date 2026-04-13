/**
 * WorkflowPolicyView — Read Model DTO
 *
 * A read-only projection of the workflow policy for a specific trigger key.
 *
 * Fields:
 *   contextId   — owning platform scope identifier
 *   triggerKey  — workflow trigger key
 *   enabled     — whether the trigger is currently enabled by policy
 *   ruleRef     — reference to the underlying PolicyRule (for audit linkage)
 *   decisionAt  — ISO 8601 timestamp of the last policy evaluation
 *
 * Produced by: GetWorkflowPolicyViewHandler
 *
 * @see application/handlers/GetWorkflowPolicyViewHandler.ts
 * @see ports/output/index.ts — WorkflowPolicyRepository
 * @see docs/application-services.md — Query DTOs
 */

// TODO: implement WorkflowPolicyView DTO interface
