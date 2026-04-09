## Phase: impl
## Task: platform domain/events — full 21-event inventory
## Date: 2026-04-09

### Scope
- modules/platform/domain/events/index.ts expanded from 8 to 21 event type constants
- All events derived from modules/platform/docs/domain-events.md

### Decisions / Findings
- All event TYPE CONSTANTS live in domain/events (single source of truth)
- "Application-layer owned" events still get constants here; ownership only governs who emits them, not where the type string lives
- constants grouped by ownership: PlatformContext aggregate / PolicyCatalog / config orchestration / permission domain service / IntegrationContract / SubscriptionAgreement / application-layer

Added 13 new constants:
  PLATFORM_CAPABILITY_ENABLED_EVENT_TYPE    = "platform.capability_enabled"
  PLATFORM_CAPABILITY_DISABLED_EVENT_TYPE   = "platform.capability_disabled"
  CONFIG_PROFILE_APPLIED_EVENT_TYPE         = "config.profile_applied"
  PERMISSION_DECISION_RECORDED_EVENT_TYPE   = "permission.decision_recorded"
  INTEGRATION_DELIVERY_FAILED_EVENT_TYPE    = "integration.delivery_failed"
  ONBOARDING_FLOW_COMPLETED_EVENT_TYPE      = "onboarding.flow_completed"
  COMPLIANCE_POLICY_VERIFIED_EVENT_TYPE     = "compliance.policy_verified"
  REFERRAL_REWARD_RECORDED_EVENT_TYPE       = "referral.reward_recorded"
  BACKGROUND_JOB_ENQUEUED_EVENT_TYPE        = "background-job.enqueued"
  CONTENT_ASSET_PUBLISHED_EVENT_TYPE        = "content.asset_published"
  SEARCH_QUERY_EXECUTED_EVENT_TYPE          = "search.query_executed"
  ANALYTICS_EVENT_RECORDED_EVENT_TYPE       = "analytics.event_recorded"
  SUPPORT_TICKET_OPENED_EVENT_TYPE          = "support.ticket_opened"

Also added PLATFORM_DOMAIN_EVENT_TYPES catalogue array + PlatformDomainEventType alias

ports/output/index.ts — verified already contains all 6 non-repo output ports:
  AuditSignalStore, ObservabilitySink, AnalyticsSink, ExternalSystemGateway, JobQueuePort, SearchIndexPort

### Validation / Evidence
- get_errors: 0 errors on domain/events, ports/output, events/contracts, api/contracts
- npm run lint: 0 errors, 2 pre-existing warnings (source→workspace boundary, unrelated to platform)

### Deviations / Risks
- None

### Open Questions
- Subdomains level index derivation not yet done (23 subdomain each with domain/application/adapters layers)
