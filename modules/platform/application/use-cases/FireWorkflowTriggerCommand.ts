/**
 * FireWorkflowTriggerCommand
 *
 * Command: FireWorkflowTrigger
 * Purpose: Emits a workflow trigger and delegates execution to downstream adapter.
 *
 * Typical payload fields:
 *   contextId, triggerKey, triggeredBy
 *
 * Handled by:  FireWorkflowTriggerService
 * Output ports: WorkflowPolicyRepository, WorkflowDispatcherPort, DomainEventPublisher
 *
 * Result: PlatformCommandResult (ok, code, message, metadata)
 *
 * @see docs/application-services.md — Command-oriented Services
 */

// TODO: implement FireWorkflowTriggerCommand command payload type
