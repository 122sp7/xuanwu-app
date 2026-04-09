/**
 * BackgroundJobEnqueuedEvent
 *
 * Event type: "background-job.enqueued"
 * Owner:      application layer (background-job)
 *
 * When emitted:
 *   A background job was submitted to the queue.
 *
 * Core payload fields:
 *   jobId, jobType, scheduleAt
 *
 * Envelope fields (standard for all platform events):
 *   type, aggregateType, aggregateId, contextId,
 *   occurredAt (ISO 8601), version, correlationId, causationId, actorId, payload
 *
 * @see docs/domain-events.md — 發出事件
 * @see domain/events/index.ts — event type constant: BACKGROUND_JOB_ENQUEUED_EVENT_TYPE
 */

// TODO: implement BackgroundJobEnqueuedEvent payload type and factory function
