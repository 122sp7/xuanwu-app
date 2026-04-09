/**
 * WorkflowTriggerFiredEvent
 *
 * Event type: "workflow.trigger_fired"
 * Owner:      application layer (workflow)
 *
 * When emitted:
 *   A workflow trigger was successfully emitted.
 *
 * Core payload fields:
 *   triggerKey, triggeredBy, triggeredAt
 *
 * Envelope fields (standard for all platform events):
 *   type, aggregateType, aggregateId, contextId,
 *   occurredAt (ISO 8601), version, correlationId, causationId, actorId, payload
 *
 * @see docs/domain-events.md — 發出事件
 * @see domain/events/index.ts — event type constant: WORKFLOW_TRIGGER_FIRED_EVENT_TYPE
 */

// TODO: implement WorkflowTriggerFiredEvent payload type and factory function
