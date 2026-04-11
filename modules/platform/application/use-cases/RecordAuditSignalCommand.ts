/**
 * RecordAuditSignalCommand
 *
 * Command: RecordAuditSignal
 * Purpose: Writes a decision or behavior as an immutable audit signal.
 *
 * Typical payload fields:
 *   contextId, signalType, severity
 *
 * Handled by:  RecordAuditSignalService
 * Output ports: AuditSignalStore, DomainEventPublisher
 *
 * Result: PlatformCommandResult (ok, code, message, metadata)
 *
 * @see docs/application-services.md — Command-oriented Services
 */

// TODO: implement RecordAuditSignalCommand command payload type
