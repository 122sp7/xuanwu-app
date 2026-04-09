# platform

> **Domain Type:** Generic Subdomain (Platform Infrastructure)  
> **Module:** `modules/platform/`  
> **Authoritative docs:** [`modules/platform/docs/`](../../../modules/platform/docs/)

## Boundary

- **Responsible for:**
  - Subject governance — `identity`, `account`, `account-profile`, `organization`
  - Policy and security — `access-control`, `security-policy`, `platform-config`, `feature-flag`, `onboarding`, `compliance`
  - Commercial and entitlement — `billing`, `subscription`, `referral`
  - Process and delivery — `workflow`, `notification`, `integration`, `background-job`
  - Content and search — `content`, `search`
  - Evidence and diagnostics — `audit-log`, `observability`, `analytics`, `support`
  - Platform capability enablement via `PlatformContext` aggregate
  - Versioned policy governance via `PolicyCatalog` aggregate

- **Not responsible for:**
  - Business domain knowledge content lifecycle → `knowledge`, `knowledge-base`
  - Workspace collaboration semantics → `workspace`
  - AI conversation and Q&A → `notebook`
  - RAG ingestion details → `ai`
  - Domain-specific business rules outside platform governance

## Published Language

- **Commands (representative, per subdomain):**
  - `CreateAccount` / `UpdateAccountProfile`
  - `EnableFeatureFlag` / `DisableFeatureFlag`
  - `CreateSubscription` / `ChangeSubscriptionPlan`
  - `TriggerNotification`
  - `SubmitAuditSignal`
  - `EnablePlatformCapability`

- **Queries (representative, per subdomain):**
  - `GetAccountProfile`
  - `GetSubscriptionPlan` / `GetEntitlement`
  - `ListAuditLogs`
  - `GetFeatureFlagState`
  - `GetPlatformCapabilities`

- **Events (representative, per subdomain):**
  - `platform.account_created`
  - `platform.subscription_changed`
  - `platform.policy_updated`
  - `platform.feature_flag_toggled`
  - `platform.capability_enabled`
  - See [`modules/platform/docs/domain-events.md`](../../../modules/platform/docs/domain-events.md) for the full 21-event inventory.

## Upstream / Downstream

- **Upstream:**
  - External integrations (ACL) — partner and external API boundaries translated via `integration` subdomain adapters
  - Observability and config systems (Shared Kernel) — telemetry and runtime configuration signals

- **Downstream:**
  - `knowledge`, `workspace`, `notebook`, `knowledge-base`, `source`, and all other business contexts — conform to platform identity, subscription entitlement, and feature-flag policies
  - `audit-log` and `observability` receive signals from all other platform subdomains

- **Relationship types:**
  - `platform → business contexts` (knowledge, workspace, etc.): Published Language / Conformist
  - `external systems → platform integration`: ACL
  - `platform-config ↔ observability`: Shared Kernel

## Context Rules

1. Keep domain model isolated from external model leakage.
2. Expose only stable contracts via published language.
3. Record boundary changes in `docs/context-map.md` and ADRs.
4. Subdomain inventory is **closed by default** — new subdomains require documented boundary rationale before addition.
5. `domain/` must remain framework-free; no Firebase SDK, HTTP clients, or monitoring SDKs.
6. Cross-subdomain collaboration uses published language and ports, not direct adapter-to-adapter calls.
7. Dependency direction: `adapters/ → application/ → domain/ ← infrastructure/`.
