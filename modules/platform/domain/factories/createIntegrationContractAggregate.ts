/**
 * createIntegrationContractAggregate — Domain Factory
 *
 * Constructs a new IntegrationContract aggregate root from validated input.
 *
 * Responsibility:
 *   - Validate that protocol and authentication reference are compatible
 *   - Validate that subscribedSignals reference known event types
 *   - Set initial contractState to "draft"
 *   - Stamp IntegrationContractRegisteredEvent into the aggregate's event queue
 *
 * Used by: RegisterIntegrationContractHandler (application layer)
 *
 * @see domain/aggregates/IntegrationContract.ts
 * @see docs/aggregates.md — 聚合根工廠
 */

// TODO: implement createIntegrationContractAggregate factory function
