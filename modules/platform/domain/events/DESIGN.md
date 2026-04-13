# Platform Domain Events — Design Intent

> **Status**: This file preserves the design intent for platform domain events that
> have not yet been implemented. Event type constants are defined in `index.ts`.
> When implementing an event, create its payload type and factory function in a new
> `.ts` file and remove the corresponding entry from this document.
>
> **Format**: All event discriminants use kebab-case: `<context>.<action-in-kebab>`.
> **Envelope**: All events share the `PlatformDomainEvent<TPayload>` envelope interface.

## Common Envelope Fields

All platform domain events include:

| Field | Type | Description |
|-------|------|-------------|
| `type` | string (literal) | Event discriminant |
| `aggregateType` | string | Aggregate that emitted the event |
| `aggregateId` | string | Aggregate instance ID |
| `contextId` | string | Platform context scope |
| `occurredAt` | string (ISO 8601) | Timestamp |
| `version` | number | Event schema version |
| `correlationId` | string? | Correlation trace |
| `causationId` | string? | Causing event/command |
| `actorId` | string? | Actor who triggered |
| `payload` | TPayload | Event-specific data |

---

## AnalyticsEventRecordedEvent

- **Event type**: `analytics.event-recorded`
- **Owner**: application layer (analytics)
- **When emitted**: An analytics event was recorded and aggregated.
- **Core payload fields**: `eventName, metricRef, subjectRef`

---

## AuditSignalRecordedEvent

- **Event type**: `audit.signal-recorded`
- **Owner**: application layer (audit-log)
- **When emitted**: An immutable audit signal was written.
- **Core payload fields**: `signalType, severity, subjectRef`

---

## BackgroundJobEnqueuedEvent

- **Event type**: `background-job.enqueued`
- **Owner**: application layer (background-job)
- **When emitted**: A background job was submitted to the queue.
- **Core payload fields**: `jobId, jobType, scheduleAt`

---

## CompliancePolicyVerifiedEvent

- **Event type**: `compliance.policy-verified`
- **Owner**: application layer (compliance)
- **When emitted**: A compliance policy check passed or was updated.
- **Core payload fields**: `policyRef, verificationResult, effectivePeriod`

---

## ConfigProfileAppliedEvent

- **Event type**: `config.profile-applied`
- **Owner**: PlatformContext (orchestration)
- **When emitted**: A configuration profile was successfully applied.
- **Core payload fields**: `configurationProfileRef, changedKeys`

---

## ContentAssetPublishedEvent

- **Event type**: `content.asset-published`
- **Owner**: application layer (content)
- **When emitted**: A content asset entered published state.
- **Core payload fields**: `assetId, publicationState, publishedAt`

---

## IntegrationContractRegisteredEvent

- **Event type**: `integration.contract-registered`
- **Owner**: IntegrationContract
- **When emitted**: An integration contract became active or was updated.
- **Core payload fields**: `integrationContractId, protocol, endpointRef`

---

## IntegrationDeliveryFailedEvent

- **Event type**: `integration.delivery-failed`
- **Owner**: IntegrationContract
- **When emitted**: An external delivery attempt failed.
- **Core payload fields**: `integrationContractId, deliveryAttempt, failureCode`

---

## NotificationDispatchRequestedEvent

- **Event type**: `notification.dispatch-requested`
- **Owner**: application layer (notification)
- **When emitted**: A notification dispatch request was created.
- **Core payload fields**: `channel, recipientRef, templateKey`

---

## ObservabilitySignalEmittedEvent

- **Event type**: `observability.signal-emitted`
- **Owner**: application layer (observability)
- **When emitted**: A metric, trace, or alert signal was emitted.
- **Core payload fields**: `signalName, signalLevel, sourceRef`

---

## OnboardingFlowCompletedEvent

- **Event type**: `onboarding.flow-completed`
- **Owner**: application layer (onboarding)
- **When emitted**: A new subject completed the primary onboarding flow.
- **Core payload fields**: `onboardingId, subjectRef, completedSteps`

---

## PermissionDecisionRecordedEvent

- **Event type**: `permission.decision-recorded`
- **Owner**: application layer (permission service)
- **When emitted**: A traceable authorization decision was completed.
- **Core payload fields**: `decision, subjectRef, resourceRef`

---

## PlatformCapabilityDisabledEvent

- **Event type**: `platform.capability-disabled`
- **Owner**: PlatformContext
- **When emitted**: A capability was disabled in a platform scope.
- **Core payload fields**: `capabilityKey, reason`

---

## PlatformCapabilityEnabledEvent

- **Event type**: `platform.capability-enabled`
- **Owner**: PlatformContext
- **When emitted**: A capability was enabled in a platform scope.
- **Core payload fields**: `capabilityKey, entitlementRef`

---

## PlatformContextRegisteredEvent

- **Event type**: `platform.context-registered`
- **Owner**: PlatformContext
- **When emitted**: Platform scope creation is complete.
- **Core payload fields**: `subjectScope, lifecycleState`

---

## PolicyCatalogPublishedEvent

- **Event type**: `policy.catalog-published`
- **Owner**: PolicyCatalog
- **When emitted**: A new policy revision has taken effect.
- **Core payload fields**: `policyCatalogId, revision`

---

## ReferralRewardRecordedEvent

- **Event type**: `referral.reward-recorded`
- **Owner**: application layer (referral)
- **When emitted**: A referral reward was calculated and recorded.
- **Core payload fields**: `referralId, rewardType, rewardAmount`

---

## SearchQueryExecutedEvent

- **Event type**: `search.query-executed`
- **Owner**: application layer (search)
- **When emitted**: A search query was completed and produced results.
- **Core payload fields**: `queryId, queryText, resultCount`

---

## SubscriptionAgreementActivatedEvent

- **Event type**: `subscription.agreement-activated`
- **Owner**: SubscriptionAgreement
- **When emitted**: A subscription agreement entered active state.
- **Core payload fields**: `subscriptionAgreementId, planCode, validUntil`

---

## SupportTicketOpenedEvent

- **Event type**: `support.ticket-opened`
- **Owner**: application layer (support)
- **When emitted**: A support ticket was created.
- **Core payload fields**: `ticketId, priority, requesterRef`

---

## WorkflowTriggerFiredEvent

- **Event type**: `workflow.trigger-fired`
- **Owner**: application layer (workflow)
- **When emitted**: A workflow trigger was successfully emitted.
- **Core payload fields**: `triggerKey, triggeredBy, triggeredAt`

---


---

# Published Event Utilities — Design Intent

> These utilities are part of the event publishing pipeline. They should be
> implemented when the platform event bus becomes operational.

## buildPublishedEventEnvelope

Constructs the standard Published Language envelope for outgoing platform events.
Every event emitted to downstream consumers must pass through this builder to guarantee
envelope consistency (version, schemaVersion, producerRef, publishedAt).

Envelope fields added:
- `schemaVersion` — published language schema version (semver string)
- `producerRef` — platform module identifier
- `publishedAt` — ISO 8601 emission timestamp
- `correlationId` — from CorrelationContext (optional)
- `causationId` — from originating command or event

## publishSinglePlatformEvent

Publishes one platform domain event via the DomainEventPublisher output port
after building the standard published envelope.

Rules:
- Must call mapDomainEventToPublishedEvent before delegating to the port
- Must not swallow DomainEventPublisher errors; propagate to the application layer

## publishBatchPlatformEvents

Publishes multiple platform domain events in a single DomainEventPublisher call.
Used when a command produces more than one domain event.

Rules:
- Maps each event through buildPublishedEventEnvelope before dispatch
- Preserves event order (emitted in the same order they were collected from the aggregate)
- Must not publish a partial batch on failure; the caller decides retry strategy
