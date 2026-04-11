/**
 * record-audit-signal — use case.
 *
 * Command:  RecordAuditSignal
 * Purpose:  Writes a decision or behavior as an immutable audit signal.
 *
 * Payload fields:
 *   contextId, signalType, severity
 *
 * Orchestration steps:
 *   1. Classify signal via AuditClassificationService domain service
 *   2. Write immutable record via AuditSignalStore
 *   3. Publish AuditSignalRecordedEvent via DomainEventPublisher
 *   4. Return PlatformCommandResult
 *
 * Output ports:
 *   AuditSignalStore, DomainEventPublisher
 *
 * Returns: PlatformCommandResult (ok, code, message, metadata)
 *
 * @see docs/application-services.md
 * @see ports/input/index.ts — PlatformCommandPort
 */

// TODO: implement RecordAuditSignalUseCase
