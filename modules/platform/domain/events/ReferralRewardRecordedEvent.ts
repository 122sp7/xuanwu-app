/**
 * ReferralRewardRecordedEvent
 *
 * Event type: "referral.reward_recorded"
 * Owner:      application layer (referral)
 *
 * When emitted:
 *   A referral reward was calculated and recorded.
 *
 * Core payload fields:
 *   referralId, rewardType, rewardAmount
 *
 * Envelope fields (standard for all platform events):
 *   type, aggregateType, aggregateId, contextId,
 *   occurredAt (ISO 8601), version, correlationId, causationId, actorId, payload
 *
 * @see docs/domain-events.md — 發出事件
 * @see domain/events/index.ts — event type constant: REFERRAL_REWARD_RECORDED_EVENT_TYPE
 */

// TODO: implement ReferralRewardRecordedEvent payload type and factory function
