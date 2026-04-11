/**
 * EmitObservabilitySignalCommand
 *
 * Command: EmitObservabilitySignal
 * Purpose: Emits metrics / trace / alert signals.
 *
 * Typical payload fields:
 *   contextId, signalName, signalLevel, sourceRef
 *
 * Handled by:  EmitObservabilitySignalService
 * Output ports: ObservabilitySink, AuditSignalStore
 *
 * Result: PlatformCommandResult (ok, code, message, metadata)
 *
 * @see docs/application-services.md — Command-oriented Services
 */

// TODO: implement EmitObservabilitySignalCommand command payload type
