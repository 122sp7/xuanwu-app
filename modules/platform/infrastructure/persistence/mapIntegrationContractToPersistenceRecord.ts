/**
 * mapIntegrationContractToPersistenceRecord — Persistence Mapper
 *
 * Serialises an IntegrationContract aggregate (including SignalSubscriptionEntities) into a persistence record.
 *
 * Rules:
 *   - All domain value objects must be serialised to primitives before writing
 *   - Domain entity sub-collections must be flattened or nested per storage contract
 *   - The inverse mapper (persistence record → aggregate) is the reconstitute factory
 *
 * Related:
 *   - domain/aggregates/IntegrationContract.ts — source aggregate
 *   - domain/factories/createIntegrationContractAggregate.ts — reconstitution path (inverse)
 *   - infrastructure/db/ — Firestore repository that calls this mapper
 *
 * @see docs/repositories.md — persistence record schema contract
 */

// TODO: implement mapIntegrationContractToPersistenceRecord serialisation function
