/**
 * Module: event
 * Layer: domain/value-object
 * Purpose: Metadata value object for tracing and idempotent event handling.
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */
export interface EventMetadata {
  correlationId?: string
  causationId?: string
  actorId?: string
  organizationId?: string
  workspaceId?: string
  traceId?: string
}
