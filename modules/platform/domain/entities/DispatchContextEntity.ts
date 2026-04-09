/**
 * DispatchContextEntity — Entity
 *
 * Tracks the state of a single delivery attempt for a workflow trigger or
 * notification dispatch. Records attempt count, last failure code, and
 * correlation identifiers for traceability.
 *
 * Key attributes:
 *   dispatchId       — unique dispatch attempt identifier
 *   contractId       — IntegrationContractId of originating contract (nullable for notifications)
 *   triggerKey       — workflow trigger key or notification template key
 *   attemptCount     — number of delivery attempts so far
 *   lastFailureCode  — most recent failure code (nullable if no failures)
 *   correlationId    — CorrelationContext correlation chain identifier
 *   causationId      — event or command that caused this dispatch
 *
 * Invariants:
 *   - attemptCount must be >= 0
 *   - If attemptCount > 0 and status is failed, lastFailureCode must be non-null
 *
 * Used by: WorkflowDispatchPolicy, NotificationRoutingPolicy domain services
 * @see docs/aggregates.md — 子實體與值物件
 */

// TODO: implement DispatchContextEntity interface / class
