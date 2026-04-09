/**
 * ContentAssetPublishedEvent
 *
 * Event type: "content.asset_published"
 * Owner:      application layer (content)
 *
 * When emitted:
 *   A content asset entered published state.
 *
 * Core payload fields:
 *   assetId, publicationState, publishedAt
 *
 * Envelope fields (standard for all platform events):
 *   type, aggregateType, aggregateId, contextId,
 *   occurredAt (ISO 8601), version, correlationId, causationId, actorId, payload
 *
 * @see docs/domain-events.md — 發出事件
 * @see domain/events/index.ts — event type constant: CONTENT_ASSET_PUBLISHED_EVENT_TYPE
 */

// TODO: implement ContentAssetPublishedEvent payload type and factory function
