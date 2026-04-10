/**
 * CorrelationContext — Shared Type
 *
 * Carries correlation and causation identifiers through the platform's
 * event chain for distributed tracing and audit.
 *
 * Fields:
 *   correlationId — string UUID; shared across all events in a single user action chain
 *   causationId   — string UUID; the eventId or commandId that directly caused this event
 *   actorId       — the authenticated subject identifier (user, service account)
 *   sessionId     — optional browser session identifier (for web-originated commands)
 *
 * Conventions:
 *   - Passed through application service method signatures, not via global context
 *   - All published events must include correlationId and causationId
 *   - Do not store CorrelationContext in aggregates; it is a transport concern
 *
 * @see shared/utils/buildCorrelationId.ts
 * @see shared/utils/buildCausationId.ts
 * @see docs/ubiquitous-language.md — 關聯上下文
 */

// TODO: implement CorrelationContext type interface
