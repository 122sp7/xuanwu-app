<!-- Purpose: Subdomain scaffold overview for platform 'feature-flag'. -->

# Feature Flag Subdomain

## Overview

The **Feature Flag** subdomain manages feature toggles, release gates, and gradual rollout strategies across Xuanwu. It enables safe feature experimentation, canary deployments, and user-targeted feature activation without redeployment.

## Core Responsibility

- **Feature Toggle Management**: Define, store, and version feature flags with metadata
- **Evaluation Logic**: Determine feature visibility based on user context, tenant, or deployment environment
- **Gradual Rollout**: Support percentage-based, user-segment, and time-window rollouts
- **Real-time Updates**: Propagate flag changes without service restart
- **Audit Trail**: Track flag changes, modifications, and deployment history

## Strategic Classification

| Aspect | Classification |
|--------|----------------|
| Domain Type | Generic Subdomain (platform enabler) |
| Business Value | Risk reduction, faster iterations, safer deployments |
| Ownership | Platform (cross-cutting infrastructure) |

## Key Concepts

| Concept | Definition |
|---------|-----------|
| **Feature Flag** | Aggregate root representing a named toggle with rules and visibility metadata |
| **Flag Rule** | Value object encoding a condition (user segment, percentage, date range, environment) |
| **Flag State** | Value object capturing enabled/disabled status and rollout metadata |
| **Rollout Strategy** | Value object defining distribution (percentage, users, time-window, geo, tenant) |
| **Flag Changed** | Domain event fired when flag state or rules are modified |

## Bounded Context Interactions

| Interaction | Direction | Protocol |
|-------------|-----------|----------|
| **platform.access-control** | Consumes | Checks feature availability via flag rules |
| **platform.observability** | Publishes to | Logs flag evaluations and rollout metrics |
| **workspace** | Consumes | Gate workspace features by flag |
| **notion** | Consumes | Gate knowledge content features by flag |

## Public API (modules/platform/subdomains/feature-flag/api)

```typescript
// Flag evaluation
export { EvaluateFeatureFlagUseCase } from "./application/use-cases/evaluate-feature-flag.use-case";
export { type FeatureFlag } from "./domain/entities/FeatureFlag";

// Flag management (admin)
export { UpsertFeatureFlagUseCase } from "./application/use-cases/upsert-feature-flag.use-case";
export { DeleteFeatureFlagUseCase } from "./application/use-cases/delete-feature-flag.use-case";

// Contracts
export type { IFeatureFlagRepository } from "./domain/repositories/FeatureFlagRepository";
```

## Implementation Status

| Layer | Status | Notes |
|-------|--------|-------|
| Domain | ✅ Planned | Aggregate, value objects, repository interface |
| Application | ✅ Planned | Use cases for evaluation, upsert, delete |
| Infrastructure | ✅ Planned | Firebase Realtime Database or Firestore-backed repository |
| Interfaces | ✅ Planned | Admin dashboard, API routes for flag CRUD |

## Validation

- `npm run test` — Unit tests for flag evaluation logic and rule merging
- `npm run lint` — Type safety and boundary compliance
- Manual testing: Create flag → Evaluate under different contexts → Verify rollout

## Related Documentation

- [Feature Flag Aggregates](./aggregates.md)
- [Feature Flag Event Map](./domain-events.md)
- [Feature Flag Context Map](./context-map.md)
