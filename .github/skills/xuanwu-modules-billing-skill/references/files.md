# Files

## File: docs/structure/contexts/billing/bounded-contexts.md
```markdown
# Billing

## Domain Role

billing 是 commercial bounded context。它擁有 subscription 與 entitlement 的商業語義，並把結果輸出為 capability signal。

## Ownership Rules

- 擁有 billing、subscription、entitlement、referral。
- 不擁有 identity 與 access decision 正典語言。
- 不擁有 workspace、knowledge 或 notebook aggregate。
```

## File: docs/structure/contexts/billing/context-map.md
```markdown
# Billing

## Relationships

| Upstream | Downstream | Published Language |
|---|---|---|
| iam | billing | actor reference、tenant scope、access policy baseline |
| billing | workspace | entitlement signal、subscription capability signal |
| billing | notion | entitlement signal、subscription capability signal |
| billing | notebooklm | entitlement signal、subscription capability signal |

## Notes

- billing 向下游提供 capability signal，不暴露內部商業 aggregate。
```

## File: docs/structure/contexts/billing/subdomains.md
```markdown
# Billing

## Baseline Subdomains

| Subdomain | Responsibility |
|---|---|
| billing | 計費狀態、費率與財務證據 |
| subscription | 方案、配額與續期治理 |
| entitlement | 有效權益與功能可用性統一解算 |
| referral | 推薦關係與獎勵追蹤 |

## Recommended Gap Subdomains

| Subdomain | Responsibility |
|---|---|
| pricing | 價格模型與方案矩陣治理 |
| invoice | 帳單、請款與對帳流程 |
| quota-policy | 可量化配額與商業限制規則 |
```

## File: docs/structure/contexts/billing/ubiquitous-language.md
```markdown
# Billing

## Canonical Terms

| Term | Meaning |
|---|---|
| Subscription | 方案、配額與續期狀態 |
| Entitlement | 綜合商業規則後的有效權益 |
| BillingEvent | 財務計價或收費事實 |
| Referral | 推薦關係與獎勵追蹤 |

## Avoid

- 不用 Plan 混稱 Subscription 與 Entitlement。
- 不把 feature flag 當成 entitlement 正典語義。
```

## File: src/modules/billing/index.ts
```typescript
/**
 * Billing Module — public API surface.
 * All cross-module consumers must import from here only.
 */
⋮----
// entitlement
⋮----
// subscription
⋮----
// usage-metering
```

## File: src/modules/billing/orchestration/index.ts
```typescript
// billing — orchestration layer
// Cross-subdomain composition and facade lives here.
// TODO: implement BillingFacade if needed.
```

## File: src/modules/billing/shared/errors/index.ts
```typescript
// billing shared/errors placeholder
```

## File: src/modules/billing/shared/events/index.ts
```typescript
// billing shared/events placeholder
```

## File: src/modules/billing/shared/index.ts
```typescript

```

## File: src/modules/billing/shared/types/index.ts
```typescript
// billing shared/types placeholder
```

## File: src/modules/billing/subdomains/entitlement/adapters/inbound/http/EntitlementController.ts
```typescript
import type { CommandResult } from '../../../../../../shared';
import {
  GrantEntitlementUseCase,
  SuspendEntitlementUseCase,
  RevokeEntitlementUseCase,
  CheckFeatureEntitlementUseCase,
} from '../../../application/use-cases/EntitlementUseCases';
import type { EntitlementGrantRepository } from '../../../domain/repositories/EntitlementGrantRepository';
⋮----
export class EntitlementController {
⋮----
constructor(repo: EntitlementGrantRepository)
⋮----
async handleGrant(body: {
    contextId: string;
    featureKey: string;
    quota?: number | null;
    expiresAt?: string | null;
}): Promise<CommandResult>
⋮----
async handleSuspend(entitlementId: string): Promise<CommandResult>
⋮----
async handleRevoke(entitlementId: string): Promise<CommandResult>
⋮----
async handleCheck(contextId: string, featureKey: string): Promise<CommandResult>
```

## File: src/modules/billing/subdomains/entitlement/adapters/inbound/index.ts
```typescript
// entitlement — inbound adapters placeholder
// TODO: export server actions / route handlers
```

## File: src/modules/billing/subdomains/entitlement/adapters/index.ts
```typescript
// outbound
⋮----
// inbound
```

## File: src/modules/billing/subdomains/entitlement/adapters/outbound/firestore/FirestoreEntitlementGrantRepository.ts
```typescript
import type { EntitlementGrantSnapshot } from '../../../domain/entities/EntitlementGrant';
import type { EntitlementGrantRepository } from '../../../domain/repositories/EntitlementGrantRepository';
⋮----
export interface FirestoreLike {
  get(collection: string, id: string): Promise<Record<string, unknown> | null>;
  set(collection: string, id: string, data: Record<string, unknown>): Promise<void>;
  delete(collection: string, id: string): Promise<void>;
}
⋮----
get(collection: string, id: string): Promise<Record<string, unknown> | null>;
set(collection: string, id: string, data: Record<string, unknown>): Promise<void>;
delete(collection: string, id: string): Promise<void>;
⋮----
export class FirestoreEntitlementGrantRepository implements EntitlementGrantRepository {
⋮----
constructor(private readonly db: FirestoreLike)
⋮----
async findById(id: string): Promise<EntitlementGrantSnapshot | null>
⋮----
async findByContextId(_contextId: string): Promise<EntitlementGrantSnapshot[]>
⋮----
async findActiveByContextAndFeature(
    _contextId: string,
    _featureKey: string,
): Promise<EntitlementGrantSnapshot | null>
⋮----
async save(snapshot: EntitlementGrantSnapshot): Promise<void>
⋮----
async update(snapshot: EntitlementGrantSnapshot): Promise<void>
```

## File: src/modules/billing/subdomains/entitlement/adapters/outbound/index.ts
```typescript
// entitlement — outbound adapters placeholder
// TODO: export Firestore repositories, external clients
```

## File: src/modules/billing/subdomains/entitlement/application/dto/EntitlementDTO.ts
```typescript
import type { EntitlementGrantSnapshot } from '../../domain/entities/EntitlementGrant';
⋮----
export type EntitlementGrantView = Readonly<EntitlementGrantSnapshot>;
⋮----
export interface EntitlementSignal {
  readonly contextId: string;
  readonly activeFeatures: string[];
  readonly grants: EntitlementGrantView[];
}
```

## File: src/modules/billing/subdomains/entitlement/application/index.ts
```typescript
// use-cases
⋮----
// dto
⋮----
// ports outbound
```

## File: src/modules/billing/subdomains/entitlement/application/ports/outbound/EntitlementRepositoryPort.ts
```typescript
import type { EntitlementGrantRepository } from '../../../domain/repositories/EntitlementGrantRepository';
⋮----
export type EntitlementRepositoryPort = EntitlementGrantRepository;
```

## File: src/modules/billing/subdomains/entitlement/application/use-cases/EntitlementUseCases.ts
```typescript
import { v4 as uuid } from 'uuid';
import { commandSuccess, commandFailureFrom, type CommandResult } from '../../../../../shared';
import { EntitlementGrant } from '../../domain/entities/EntitlementGrant';
import type { EntitlementGrantRepository } from '../../domain/repositories/EntitlementGrantRepository';
⋮----
export class GrantEntitlementUseCase {
⋮----
constructor(private readonly repo: EntitlementGrantRepository)
⋮----
async execute(input: {
    contextId: string;
    featureKey: string;
    quota?: number | null;
    expiresAt?: string | null;
}): Promise<CommandResult>
⋮----
export class SuspendEntitlementUseCase {
⋮----
async execute(entitlementId: string): Promise<CommandResult>
⋮----
export class RevokeEntitlementUseCase {
⋮----
export class ResolveEntitlementsUseCase {
⋮----
async execute(contextId: string): Promise<CommandResult>
⋮----
export class CheckFeatureEntitlementUseCase {
⋮----
async execute(contextId: string, featureKey: string): Promise<CommandResult>
```

## File: src/modules/billing/subdomains/entitlement/domain/entities/EntitlementGrant.ts
```typescript
import { v4 as uuid } from 'uuid';
import type { EntitlementGrantDomainEventType } from '../events/EntitlementGrantDomainEvent';
import { createEntitlementId } from '../value-objects/EntitlementId';
import { canSuspend, canRevoke } from '../value-objects/EntitlementStatus';
import type { EntitlementStatus } from '../value-objects/EntitlementStatus';
⋮----
export interface EntitlementGrantSnapshot {
  readonly id: string;
  readonly contextId: string;
  readonly featureKey: string;
  readonly quota: number | null;
  readonly status: EntitlementStatus;
  readonly grantedAt: string;
  readonly expiresAt: string | null;
  readonly updatedAtISO: string;
}
⋮----
export interface CreateEntitlementGrantInput {
  readonly contextId: string;
  readonly featureKey: string;
  readonly quota?: number | null;
  readonly expiresAt?: string | null;
}
⋮----
export class EntitlementGrant {
⋮----
private constructor(private _props: EntitlementGrantSnapshot)
⋮----
static create(id: string, input: CreateEntitlementGrantInput): EntitlementGrant
⋮----
static reconstitute(snapshot: EntitlementGrantSnapshot): EntitlementGrant
⋮----
suspend(): void
⋮----
revoke(): void
⋮----
expire(): void
⋮----
get id(): string
get contextId(): string
get featureKey(): string
get quota(): number | null
get status(): EntitlementStatus
get grantedAt(): string
get expiresAt(): string | null
get isActive(): boolean
⋮----
getSnapshot(): Readonly<EntitlementGrantSnapshot>
⋮----
pullDomainEvents(): EntitlementGrantDomainEventType[]
```

## File: src/modules/billing/subdomains/entitlement/domain/events/EntitlementGrantDomainEvent.ts
```typescript
export interface EntitlementGrantDomainEvent {
  readonly eventId: string;
  readonly occurredAt: string;
  readonly type: string;
  readonly payload: object;
}
⋮----
export interface EntitlementGrantedEvent extends EntitlementGrantDomainEvent {
  readonly type: 'platform.entitlement.granted';
  readonly payload: {
    readonly entitlementId: string;
    readonly contextId: string;
    readonly featureKey: string;
    readonly quota: number | null;
  };
}
⋮----
export interface EntitlementSuspendedEvent extends EntitlementGrantDomainEvent {
  readonly type: 'platform.entitlement.suspended';
  readonly payload: {
    readonly entitlementId: string;
    readonly contextId: string;
  };
}
⋮----
export interface EntitlementRevokedEvent extends EntitlementGrantDomainEvent {
  readonly type: 'platform.entitlement.revoked';
  readonly payload: {
    readonly entitlementId: string;
    readonly contextId: string;
  };
}
⋮----
export interface EntitlementExpiredEvent extends EntitlementGrantDomainEvent {
  readonly type: 'platform.entitlement.expired';
  readonly payload: {
    readonly entitlementId: string;
    readonly contextId: string;
  };
}
⋮----
export type EntitlementGrantDomainEventType =
  | EntitlementGrantedEvent
  | EntitlementSuspendedEvent
  | EntitlementRevokedEvent
  | EntitlementExpiredEvent;
```

## File: src/modules/billing/subdomains/entitlement/domain/index.ts
```typescript
// entities
⋮----
// value-objects
⋮----
// events
⋮----
// repositories
```

## File: src/modules/billing/subdomains/entitlement/domain/repositories/EntitlementGrantRepository.ts
```typescript
import type { EntitlementGrantSnapshot } from '../entities/EntitlementGrant';
⋮----
export interface EntitlementGrantRepository {
  findById(id: string): Promise<EntitlementGrantSnapshot | null>;
  findByContextId(contextId: string): Promise<EntitlementGrantSnapshot[]>;
  findActiveByContextAndFeature(
    contextId: string,
    featureKey: string,
  ): Promise<EntitlementGrantSnapshot | null>;
  save(snapshot: EntitlementGrantSnapshot): Promise<void>;
  update(snapshot: EntitlementGrantSnapshot): Promise<void>;
}
⋮----
findById(id: string): Promise<EntitlementGrantSnapshot | null>;
findByContextId(contextId: string): Promise<EntitlementGrantSnapshot[]>;
findActiveByContextAndFeature(
    contextId: string,
    featureKey: string,
  ): Promise<EntitlementGrantSnapshot | null>;
save(snapshot: EntitlementGrantSnapshot): Promise<void>;
update(snapshot: EntitlementGrantSnapshot): Promise<void>;
```

## File: src/modules/billing/subdomains/entitlement/domain/value-objects/EntitlementId.ts
```typescript
import { z } from 'zod';
⋮----
export type EntitlementId = z.infer<typeof EntitlementIdSchema>;
⋮----
export function createEntitlementId(raw: string): EntitlementId
```

## File: src/modules/billing/subdomains/entitlement/domain/value-objects/EntitlementStatus.ts
```typescript
export type EntitlementStatus = (typeof ENTITLEMENT_STATUSES)[number];
⋮----
export function canSuspend(status: EntitlementStatus): boolean
⋮----
export function canRevoke(status: EntitlementStatus): boolean
⋮----
export function isActiveStatus(status: EntitlementStatus): boolean
```

## File: src/modules/billing/subdomains/entitlement/domain/value-objects/FeatureKey.ts
```typescript
import { z } from 'zod';
⋮----
export type FeatureKey = z.infer<typeof FeatureKeySchema>;
⋮----
export function createFeatureKey(raw: string): FeatureKey
```

## File: src/modules/billing/subdomains/subscription/adapters/inbound/http/SubscriptionController.ts
```typescript
import type { CommandResult } from '../../../../../../shared';
import {
  ActivateSubscriptionUseCase,
  CancelSubscriptionUseCase,
  RenewSubscriptionUseCase,
  GetActiveSubscriptionUseCase,
  MarkSubscriptionPastDueUseCase,
} from '../../../application/use-cases/SubscriptionUseCases';
import type { SubscriptionRepository } from '../../../domain/repositories/SubscriptionRepository';
import type { BillingCycle } from '../../../domain/value-objects/BillingCycle';
⋮----
export class SubscriptionController {
⋮----
constructor(repo: SubscriptionRepository)
⋮----
async handleActivate(body: {
    contextId: string;
    planCode: string;
    billingCycle: BillingCycle;
    currentPeriodEnd?: string | null;
}): Promise<CommandResult>
⋮----
async handleCancel(subscriptionId: string): Promise<CommandResult>
⋮----
async handleRenew(subscriptionId: string, newPeriodEnd: string): Promise<CommandResult>
⋮----
async handleGetActive(contextId: string): Promise<CommandResult>
⋮----
async handleMarkPastDue(subscriptionId: string): Promise<CommandResult>
```

## File: src/modules/billing/subdomains/subscription/adapters/inbound/index.ts
```typescript

```

## File: src/modules/billing/subdomains/subscription/adapters/index.ts
```typescript
// outbound
⋮----
// inbound
```

## File: src/modules/billing/subdomains/subscription/adapters/outbound/firestore/FirestoreSubscriptionRepository.ts
```typescript
import type { SubscriptionSnapshot } from '../../../domain/entities/Subscription';
import type { SubscriptionRepository } from '../../../domain/repositories/SubscriptionRepository';
⋮----
export interface FirestoreLike {
  get(collection: string, id: string): Promise<Record<string, unknown> | null>;
  set(collection: string, id: string, data: Record<string, unknown>): Promise<void>;
  delete(collection: string, id: string): Promise<void>;
}
⋮----
get(collection: string, id: string): Promise<Record<string, unknown> | null>;
set(collection: string, id: string, data: Record<string, unknown>): Promise<void>;
delete(collection: string, id: string): Promise<void>;
⋮----
export class FirestoreSubscriptionRepository implements SubscriptionRepository {
⋮----
constructor(private readonly db: FirestoreLike)
⋮----
async findById(id: string): Promise<SubscriptionSnapshot | null>
⋮----
async findActiveByContextId(_contextId: string): Promise<SubscriptionSnapshot | null>
⋮----
async findByContextId(_contextId: string): Promise<SubscriptionSnapshot[]>
⋮----
async save(snapshot: SubscriptionSnapshot): Promise<void>
⋮----
async update(snapshot: SubscriptionSnapshot): Promise<void>
```

## File: src/modules/billing/subdomains/subscription/adapters/outbound/index.ts
```typescript

```

## File: src/modules/billing/subdomains/subscription/application/dto/SubscriptionDTO.ts
```typescript
import type { SubscriptionSnapshot } from '../../domain/entities/Subscription';
⋮----
export type SubscriptionView = Readonly<SubscriptionSnapshot>;
⋮----
export interface SubscriptionSummary {
  readonly contextId: string;
  readonly planCode: string;
  readonly status: string;
  readonly isActive: boolean;
  readonly currentPeriodEnd: string | null;
}
```

## File: src/modules/billing/subdomains/subscription/application/index.ts
```typescript
// use-cases
⋮----
// dto
⋮----
// ports outbound
```

## File: src/modules/billing/subdomains/subscription/application/ports/outbound/SubscriptionRepositoryPort.ts
```typescript
import type { SubscriptionRepository } from '../../../domain/repositories/SubscriptionRepository';
⋮----
export type SubscriptionRepositoryPort = SubscriptionRepository;
```

## File: src/modules/billing/subdomains/subscription/application/use-cases/SubscriptionUseCases.ts
```typescript
import { v4 as uuid } from 'uuid';
import { commandSuccess, commandFailureFrom, type CommandResult } from '../../../../../shared';
import { Subscription } from '../../domain/entities/Subscription';
import type { SubscriptionRepository } from '../../domain/repositories/SubscriptionRepository';
import type { BillingCycle } from '../../domain/value-objects/BillingCycle';
⋮----
export class ActivateSubscriptionUseCase {
⋮----
constructor(private readonly repo: SubscriptionRepository)
⋮----
async execute(input: {
    contextId: string;
    planCode: string;
    billingCycle: BillingCycle;
    currentPeriodEnd?: string | null;
}): Promise<CommandResult>
⋮----
export class CancelSubscriptionUseCase {
⋮----
async execute(subscriptionId: string): Promise<CommandResult>
⋮----
export class RenewSubscriptionUseCase {
⋮----
async execute(subscriptionId: string, newPeriodEnd: string): Promise<CommandResult>
⋮----
export class GetActiveSubscriptionUseCase {
⋮----
async execute(contextId: string): Promise<CommandResult>
⋮----
export class MarkSubscriptionPastDueUseCase {
```

## File: src/modules/billing/subdomains/subscription/domain/entities/Subscription.ts
```typescript
import { v4 as uuid } from 'uuid';
import type { SubscriptionDomainEventType } from '../events/SubscriptionDomainEvent';
import { createSubscriptionId } from '../value-objects/SubscriptionId';
import { canCancel, canRenew } from '../value-objects/SubscriptionStatus';
import type { SubscriptionStatus } from '../value-objects/SubscriptionStatus';
import type { BillingCycle } from '../value-objects/BillingCycle';
⋮----
export interface SubscriptionSnapshot {
  readonly id: string;
  readonly contextId: string;
  readonly planCode: string;
  readonly billingCycle: BillingCycle;
  readonly status: SubscriptionStatus;
  readonly currentPeriodStart: string;
  readonly currentPeriodEnd: string | null;
  readonly cancelledAt: string | null;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}
⋮----
export interface CreateSubscriptionInput {
  readonly contextId: string;
  readonly planCode: string;
  readonly billingCycle: BillingCycle;
  readonly currentPeriodStart?: string;
  readonly currentPeriodEnd?: string | null;
}
⋮----
export class Subscription {
⋮----
private constructor(private _props: SubscriptionSnapshot)
⋮----
static create(id: string, input: CreateSubscriptionInput): Subscription
⋮----
static reconstitute(snapshot: SubscriptionSnapshot): Subscription
⋮----
cancel(): void
⋮----
renew(newPeriodEnd: string): void
⋮----
markPastDue(): void
⋮----
expire(): void
⋮----
get id(): string
get contextId(): string
get planCode(): string
get billingCycle(): BillingCycle
get status(): SubscriptionStatus
get currentPeriodEnd(): string | null
get cancelledAt(): string | null
get isActive(): boolean
⋮----
getSnapshot(): Readonly<SubscriptionSnapshot>
⋮----
pullDomainEvents(): SubscriptionDomainEventType[]
```

## File: src/modules/billing/subdomains/subscription/domain/events/SubscriptionDomainEvent.ts
```typescript
import type { BillingCycle } from '../value-objects/BillingCycle';
⋮----
export interface SubscriptionDomainEvent {
  readonly eventId: string;
  readonly occurredAt: string;
  readonly type: string;
  readonly payload: object;
}
⋮----
export interface SubscriptionActivatedEvent extends SubscriptionDomainEvent {
  readonly type: 'platform.subscription.activated';
  readonly payload: {
    readonly subscriptionId: string;
    readonly contextId: string;
    readonly planCode: string;
    readonly billingCycle: BillingCycle;
  };
}
⋮----
export interface SubscriptionCancelledEvent extends SubscriptionDomainEvent {
  readonly type: 'platform.subscription.cancelled';
  readonly payload: { readonly subscriptionId: string; readonly contextId: string };
}
⋮----
export interface SubscriptionRenewedEvent extends SubscriptionDomainEvent {
  readonly type: 'platform.subscription.renewed';
  readonly payload: {
    readonly subscriptionId: string;
    readonly contextId: string;
    readonly newPeriodEnd: string;
  };
}
⋮----
export interface SubscriptionPastDueEvent extends SubscriptionDomainEvent {
  readonly type: 'platform.subscription.past_due';
  readonly payload: { readonly subscriptionId: string; readonly contextId: string };
}
⋮----
export interface SubscriptionExpiredEvent extends SubscriptionDomainEvent {
  readonly type: 'platform.subscription.expired';
  readonly payload: { readonly subscriptionId: string; readonly contextId: string };
}
⋮----
export type SubscriptionDomainEventType =
  | SubscriptionActivatedEvent
  | SubscriptionCancelledEvent
  | SubscriptionRenewedEvent
  | SubscriptionPastDueEvent
  | SubscriptionExpiredEvent;
```

## File: src/modules/billing/subdomains/subscription/domain/index.ts
```typescript
// entities
⋮----
// value-objects
⋮----
// events
⋮----
// repositories
```

## File: src/modules/billing/subdomains/subscription/domain/repositories/SubscriptionRepository.ts
```typescript
import type { SubscriptionSnapshot } from '../entities/Subscription';
⋮----
export interface SubscriptionRepository {
  findById(id: string): Promise<SubscriptionSnapshot | null>;
  findActiveByContextId(contextId: string): Promise<SubscriptionSnapshot | null>;
  findByContextId(contextId: string): Promise<SubscriptionSnapshot[]>;
  save(snapshot: SubscriptionSnapshot): Promise<void>;
  update(snapshot: SubscriptionSnapshot): Promise<void>;
}
⋮----
findById(id: string): Promise<SubscriptionSnapshot | null>;
findActiveByContextId(contextId: string): Promise<SubscriptionSnapshot | null>;
findByContextId(contextId: string): Promise<SubscriptionSnapshot[]>;
save(snapshot: SubscriptionSnapshot): Promise<void>;
update(snapshot: SubscriptionSnapshot): Promise<void>;
```

## File: src/modules/billing/subdomains/subscription/domain/value-objects/BillingCycle.ts
```typescript
export type BillingCycle = 'monthly' | 'annual' | 'lifetime';
⋮----
export function cycleMonths(cycle: BillingCycle): number | null
⋮----
return null; // lifetime
```

## File: src/modules/billing/subdomains/subscription/domain/value-objects/PlanCode.ts
```typescript
import { z } from 'zod';
⋮----
export type PlanCodeLiteral = (typeof PLAN_CODES)[number];
⋮----
export type PlanCode = z.infer<typeof PlanCodeSchema>;
⋮----
export function createPlanCode(raw: string): PlanCode
```

## File: src/modules/billing/subdomains/subscription/domain/value-objects/SubscriptionId.ts
```typescript
import { z } from 'zod';
⋮----
export type SubscriptionId = z.infer<typeof SubscriptionIdSchema>;
⋮----
export function createSubscriptionId(raw: string): SubscriptionId
```

## File: src/modules/billing/subdomains/subscription/domain/value-objects/SubscriptionStatus.ts
```typescript
export type SubscriptionStatus = (typeof SUBSCRIPTION_STATUSES)[number];
⋮----
export function canCancel(status: SubscriptionStatus): boolean
⋮----
export function canRenew(status: SubscriptionStatus): boolean
⋮----
export function isActive(status: SubscriptionStatus): boolean
```

## File: src/modules/billing/subdomains/usage-metering/adapters/inbound/index.ts
```typescript
// usage-metering — adapters/inbound placeholder
// TODO: export inbound adapters (HTTP handlers, action wrappers)
```

## File: src/modules/billing/subdomains/usage-metering/adapters/index.ts
```typescript
// usage-metering — adapters aggregate
```

## File: src/modules/billing/subdomains/usage-metering/adapters/outbound/index.ts
```typescript
// usage-metering — adapters/outbound placeholder
// TODO: export outbound adapters (repository implementations, external services)
```

## File: src/modules/billing/subdomains/usage-metering/adapters/outbound/memory/InMemoryUsageRecordRepository.ts
```typescript
import type { UsageRecordSnapshot, UsageUnit } from "../../../domain/entities/UsageRecord";
import type { UsageRecordRepository, UsageQuery } from "../../../domain/repositories/UsageRecordRepository";
⋮----
export class InMemoryUsageRecordRepository implements UsageRecordRepository {
⋮----
async save(snapshot: UsageRecordSnapshot): Promise<void>
⋮----
async findById(id: string): Promise<UsageRecordSnapshot | null>
⋮----
async query(params: UsageQuery): Promise<UsageRecordSnapshot[]>
⋮----
async sumQuantity(featureKey: string, contextId: string, fromDate?: string, toDate?: string): Promise<number>
```

## File: src/modules/billing/subdomains/usage-metering/application/index.ts
```typescript
// usage-metering — application layer placeholder
// TODO: export use-cases, DTOs, application services
```

## File: src/modules/billing/subdomains/usage-metering/application/use-cases/UsageMeteringUseCases.ts
```typescript
import { commandSuccess, commandFailureFrom, type CommandResult } from "../../../../../shared";
import { UsageRecord, type RecordUsageInput } from "../../domain/entities/UsageRecord";
import type { UsageRecordRepository, UsageQuery } from "../../domain/repositories/UsageRecordRepository";
⋮----
export class RecordUsageUseCase {
⋮----
constructor(private readonly repo: UsageRecordRepository)
⋮----
async execute(input: RecordUsageInput): Promise<CommandResult>
⋮----
export class QueryUsageUseCase {
⋮----
async execute(params: UsageQuery)
⋮----
export class GetUsageSummaryUseCase {
⋮----
async execute(input: {
    featureKey: string;
    contextId: string;
    fromDate?: string;
    toDate?: string;
}): Promise<number>
```

## File: src/modules/billing/subdomains/usage-metering/domain/entities/UsageRecord.ts
```typescript
import { z } from "zod";
import { v4 as uuid } from "uuid";
⋮----
export type UsageRecordId = z.infer<typeof UsageRecordIdSchema>;
⋮----
export type UsageUnit = z.infer<typeof UsageUnitSchema>;
⋮----
export interface UsageRecordSnapshot {
  readonly id: string;
  readonly contextId: string;
  readonly featureKey: string;
  readonly quantity: number;
  readonly unit: UsageUnit;
  readonly metadata?: Record<string, unknown>;
  readonly recordedAtISO: string;
}
⋮----
export interface RecordUsageInput {
  readonly contextId: string;
  readonly featureKey: string;
  readonly quantity: number;
  readonly unit: UsageUnit;
  readonly metadata?: Record<string, unknown>;
}
⋮----
export class UsageRecord {
⋮----
private constructor(private readonly _props: UsageRecordSnapshot)
⋮----
static record(input: RecordUsageInput): UsageRecord
⋮----
static reconstitute(snapshot: UsageRecordSnapshot): UsageRecord
⋮----
get id(): string
get contextId(): string
get featureKey(): string
get quantity(): number
get unit(): UsageUnit
get recordedAtISO(): string
⋮----
getSnapshot(): Readonly<UsageRecordSnapshot>
```

## File: src/modules/billing/subdomains/usage-metering/domain/index.ts
```typescript
// usage-metering — domain layer placeholder
// TODO: export entities, value-objects, repositories, events, services
```

## File: src/modules/billing/subdomains/usage-metering/domain/repositories/UsageRecordRepository.ts
```typescript
import type { UsageRecordSnapshot, UsageUnit } from "../entities/UsageRecord";
⋮----
export interface UsageQuery {
  readonly contextId?: string;
  readonly featureKey?: string;
  readonly unit?: UsageUnit;
  readonly fromDate?: string;
  readonly toDate?: string;
  readonly limit?: number;
}
⋮----
export interface UsageRecordRepository {
  save(snapshot: UsageRecordSnapshot): Promise<void>;
  findById(id: string): Promise<UsageRecordSnapshot | null>;
  query(params: UsageQuery): Promise<UsageRecordSnapshot[]>;
  sumQuantity(featureKey: string, contextId: string, fromDate?: string, toDate?: string): Promise<number>;
}
⋮----
save(snapshot: UsageRecordSnapshot): Promise<void>;
findById(id: string): Promise<UsageRecordSnapshot | null>;
query(params: UsageQuery): Promise<UsageRecordSnapshot[]>;
sumQuantity(featureKey: string, contextId: string, fromDate?: string, toDate?: string): Promise<number>;
```

## File: docs/structure/contexts/billing/README.md
```markdown
# Billing Context

本 README 在本次重切作業下，定義 commercial lifecycle 的主域邊界。

## Purpose

billing 是商業與權益治理主域。它負責 billing event、subscription、entitlement 與 referral，為 workspace、notion、notebooklm 等主域提供 capability signal。

## Context Summary

| Aspect | Summary |
|---|---|
| Primary Role | 商業生命週期與有效權益解算 |
| Upstream Dependency | iam 的 actor、tenant、access policy |
| Downstream Consumers | workspace、notion、notebooklm |
| Core Principle | 提供商業能力訊號，不接管內容或協作正典 |

## Document Network

- [AGENTS.md](./AGENTS.md)
- [bounded-contexts.md](./bounded-contexts.md)
- [context-map.md](./context-map.md)
- [subdomains.md](./subdomains.md)
- [ubiquitous-language.md](./ubiquitous-language.md)
- [README.md](../../../README.md)
- [architecture-overview.md](../../system/architecture-overview.md)
- [integration-guidelines.md](../../system/integration-guidelines.md)
```

## File: src/modules/billing/AGENTS.md
```markdown
# billing Agent Rules

## ROLE

- The agent MUST treat billing as the owner of subscription, entitlement, and usage-governance behavior.
- The agent MUST keep billing focused on commercial capability and access outcomes.

## DOMAIN BOUNDARIES

- The agent MUST keep subscription and entitlement ownership in billing.
- The agent MUST NOT move identity, account, or organization ownership into billing.
- The agent MUST expose billing capability through [index.ts](index.ts).

## TOOL USAGE

- The agent MUST validate subdomain path references before edits.
- The agent MUST keep entitlement and subscription terminology aligned with strategic docs.
- The agent MUST scope billing edits to billing-owned behavior and docs.

## EXECUTION FLOW

- The agent MUST follow this order:
	1. Read [../AGENTS.md](../AGENTS.md).
	2. Read this file and [README.md](README.md).
	3. Select the owning billing subdomain.
	4. Apply bounded changes.
	5. Validate links and documentation consistency.

## DATA CONTRACT

- The agent MUST keep billing contract names explicit and stable.
- The agent MUST keep subdomain indexes synchronized with actual directories.
- The agent MUST keep command and capability wording aligned with public boundaries.

## CONSTRAINTS

- The agent MUST NOT place IAM or workspace governance rules in billing.
- The agent MUST NOT bypass module index boundaries for cross-module consumption.
- The agent MUST NOT duplicate strategic ownership text beyond routing needs.

## ERROR HANDLING

- The agent MUST report stale links, missing subdomain docs, or ownership ambiguity.
- The agent MUST stop and ask for direction if a change implies schema-version or ownership drift.

## CONSISTENCY

- The agent MUST keep AGENTS focused on routing and behavioral rules.
- The agent MUST keep README focused on human-readable overview.
- The agent MUST keep naming aligned with billing terms in strategic docs.

## SECURITY

- The agent MUST avoid exposing sensitive billing data examples.
- The agent MUST preserve explicit permission and entitlement boundaries in docs.

## Route Here When

- You update subscription, entitlement, or usage-metering behavior or docs.
- You need the billing module boundary or subdomain routing contract.

## Route Elsewhere When

- Identity, session, account, or organization concerns: [../iam/AGENTS.md](../iam/AGENTS.md)
- Route composition and app-level orchestration: [../../app/AGENTS.md](../../app/AGENTS.md)

## Quick Links

- Pair: [README.md](README.md)
- Parent: [../AGENTS.md](../AGENTS.md)
- Public boundary: [index.ts](index.ts)
- Strategic authority: [../../../docs/README.md](../../../docs/README.md)
```

## File: src/modules/billing/README.md
```markdown
# billing

## PURPOSE

billing 模組負責商業能力治理，涵蓋 subscription、entitlement 與 usage-metering。
它定義可用能力、商業限制與相關下游輸出。

## GETTING STARTED

先閱讀：

1. [AGENTS.md](AGENTS.md)
2. [../AGENTS.md](../AGENTS.md)
3. [../../../docs/README.md](../../../docs/README.md)

## ARCHITECTURE

billing 以 entitlement、subscription、usage-metering 三個子域切分。
跨模組消費應透過 [index.ts](index.ts) 進入，不直接依賴內部實作。

## PROJECT STRUCTURE

- [subdomains/entitlement](subdomains/entitlement)
- [subdomains/subscription](subdomains/subscription)
- [subdomains/usage-metering](subdomains/usage-metering)

## DEVELOPMENT RULES

- MUST keep billing as commercial capability owner.
- MUST keep cross-module consumption behind [index.ts](index.ts).
- MUST keep entitlement and subscription terminology explicit.
- MUST avoid leaking IAM or workspace ownership into billing.

## AI INTEGRATION

billing 可提供 entitlement 或 usage signal 給 AI 與其他模組使用。
若 AI 流程依賴 billing capability，應透過明確契約整合，不直接耦合內部模型。

## DOCUMENTATION

- Routing/rules: [AGENTS.md](AGENTS.md)
- Parent modules index: [../README.md](../README.md)
- Strategic authority: [../../../docs/README.md](../../../docs/README.md)

## USABILITY

- 新開發者可在 5 分鐘內理解 billing 的三個子域入口。
- 可在 3 分鐘內判斷變更屬於 entitlement、subscription 或 usage-metering。
```

## File: src/modules/billing/subdomains/entitlement/AGENTS.md
```markdown
# entitlement Subdomain Agent Rules

## ROLE

- The agent MUST treat entitlement as the billing subdomain for effective capability access outcomes.
- The agent MUST keep entitlement documentation aligned with billing ownership.

## DOMAIN BOUNDARIES

- The agent MUST keep entitlement inside the billing bounded context.
- The agent MUST route cross-module consumption through [../../index.ts](../../index.ts).

## TOOL USAGE

- The agent MUST keep links valid and workspace-relative.
- The agent MUST keep edits scoped to this subdomain and its pair document.

## EXECUTION FLOW

- The agent MUST read [../../AGENTS.md](../../AGENTS.md) before broad changes.
- The agent MUST update [README.md](README.md) with this file when ownership text changes.

## DATA CONTRACT

- The agent MUST keep entitlement terminology explicit and stable.

## CONSTRAINTS

- The agent MUST NOT move subscription or IAM ownership into this subdomain.

## Route Here When

- You document or adjust entitlement-specific behavior and boundaries.

## Route Elsewhere When

- Subscription lifecycle changes: [../subscription/AGENTS.md](../subscription/AGENTS.md)
- Billing root concerns: [../../AGENTS.md](../../AGENTS.md)
```

## File: src/modules/billing/subdomains/entitlement/README.md
```markdown
# entitlement

## PURPOSE

entitlement 子域負責表達有效功能權益與可用能力結果。

## GETTING STARTED

先閱讀：

1. [AGENTS.md](AGENTS.md)
2. [../../README.md](../../README.md)
3. [../../../../../../docs/README.md](../../../../../../docs/README.md)

## ARCHITECTURE

此子域隸屬 billing，負責 capability outcome 的本地語言。

## PROJECT STRUCTURE

- [AGENTS.md](AGENTS.md)

## DEVELOPMENT RULES

- MUST keep entitlement semantics explicit.
- MUST route cross-module access through [../../index.ts](../../index.ts).

## DOCUMENTATION

- Parent: [../../README.md](../../README.md)
- Strategic authority: [../../../../../../docs/README.md](../../../../../../docs/README.md)

## USABILITY

- 開發者可快速定位 billing 中的 entitlement 邊界。
```

## File: src/modules/billing/subdomains/subscription/AGENTS.md
```markdown
# subscription Subdomain Agent Rules

## ROLE

- The agent MUST treat subscription as the billing subdomain for plan lifecycle and commercial status.
- The agent MUST keep subscription documentation aligned with billing ownership.

## DOMAIN BOUNDARIES

- The agent MUST keep subscription inside the billing bounded context.
- The agent MUST route cross-module consumption through [../../index.ts](../../index.ts).

## TOOL USAGE

- The agent MUST keep links valid and workspace-relative.
- The agent MUST keep edits scoped to this subdomain and its pair document.

## EXECUTION FLOW

- The agent MUST read [../../AGENTS.md](../../AGENTS.md) before broad changes.
- The agent MUST update [README.md](README.md) with this file when ownership text changes.

## DATA CONTRACT

- The agent MUST keep subscription terminology explicit and stable.

## CONSTRAINTS

- The agent MUST NOT move entitlement, IAM, or workspace ownership into this subdomain.

## Route Here When

- You document or adjust subscription-specific behavior and boundaries.

## Route Elsewhere When

- Entitlement capability outcomes: [../entitlement/AGENTS.md](../entitlement/AGENTS.md)
- Billing root concerns: [../../AGENTS.md](../../AGENTS.md)
```

## File: src/modules/billing/subdomains/subscription/README.md
```markdown
# subscription

## PURPOSE

subscription 子域負責方案生命週期、商業狀態與續期相關語言。

## GETTING STARTED

先閱讀：

1. [AGENTS.md](AGENTS.md)
2. [../../README.md](../../README.md)
3. [../../../../../../docs/README.md](../../../../../../docs/README.md)

## ARCHITECTURE

此子域隸屬 billing，承接 commercial lifecycle 的本地能力。

## PROJECT STRUCTURE

- [AGENTS.md](AGENTS.md)

## DEVELOPMENT RULES

- MUST keep subscription lifecycle language explicit.
- MUST route cross-module access through [../../index.ts](../../index.ts).

## DOCUMENTATION

- Parent: [../../README.md](../../README.md)
- Strategic authority: [../../../../../../docs/README.md](../../../../../../docs/README.md)

## USABILITY

- 開發者可快速定位 billing 中的 subscription 邊界。
```

## File: src/modules/billing/subdomains/usage-metering/AGENTS.md
```markdown
# usage-metering Subdomain Agent Rules

## ROLE

- The agent MUST treat usage-metering as the billing subdomain for measuring usage relevant to commercial limits.
- The agent MUST keep usage-metering documentation aligned with billing ownership.

## DOMAIN BOUNDARIES

- The agent MUST keep usage-metering inside the billing bounded context.
- The agent MUST route cross-module consumption through [../../index.ts](../../index.ts).

## TOOL USAGE

- The agent MUST keep links valid and workspace-relative.
- The agent MUST keep edits scoped to this subdomain and its pair document.

## EXECUTION FLOW

- The agent MUST read [../../AGENTS.md](../../AGENTS.md) before broad changes.
- The agent MUST update [README.md](README.md) with this file when ownership text changes.

## DATA CONTRACT

- The agent MUST keep usage-metering terminology explicit and stable.

## CONSTRAINTS

- The agent MUST NOT move analytics or entitlement ownership into this subdomain.

## Route Here When

- You document or adjust usage-metering-specific behavior and boundaries.

## Route Elsewhere When

- Entitlement outcomes: [../entitlement/AGENTS.md](../entitlement/AGENTS.md)
- Billing root concerns: [../../AGENTS.md](../../AGENTS.md)
```

## File: src/modules/billing/subdomains/usage-metering/README.md
```markdown
# usage-metering

## PURPOSE

usage-metering 子域負責記錄與商業限制相關的使用量語言。

## GETTING STARTED

先閱讀：

1. [AGENTS.md](AGENTS.md)
2. [../../README.md](../../README.md)
3. [../../../../../../docs/README.md](../../../../../../docs/README.md)

## ARCHITECTURE

此子域隸屬 billing，承接 usage signal 與商業限制相關能力。

## PROJECT STRUCTURE

- [AGENTS.md](AGENTS.md)

## DEVELOPMENT RULES

- MUST keep usage-metering terminology explicit.
- MUST route cross-module access through [../../index.ts](../../index.ts).

## DOCUMENTATION

- Parent: [../../README.md](../../README.md)
- Strategic authority: [../../../../../../docs/README.md](../../../../../../docs/README.md)

## USABILITY

- 開發者可快速定位 billing 中的 usage-metering 邊界。
```

## File: docs/structure/contexts/billing/AGENTS.md
```markdown
# Billing Context Agent Rules

## ROLE

- The agent MUST treat this directory as the documentation authority for the billing context inside docs/structure/contexts.
- The agent MUST keep billing framed as commercial lifecycle and entitlement owner.

## DOMAIN BOUNDARIES

- The agent MUST preserve billing ownership for billing, subscription, entitlement, referral, pricing, invoice, and quota-policy.
- The agent MUST NOT let billing absorb identity or generic AI policy ownership.

## TOOL USAGE

- The agent MUST align context docs with strategic docs before local edits.
- The agent MUST keep cross-context references explicit and valid.

## EXECUTION FLOW

- The agent MUST identify whether the question is subscription, entitlement, billing state, or routing.
- The agent MUST update local context docs without competing with root strategic docs.

## CONSTRAINTS

- The agent MUST preserve billing as the source of entitlement signals.
- The agent MUST avoid implementation-level framework detail in context governance docs.

## Route Here When

- You document billing context ownership, boundaries, or cross-context routing.

## Route Elsewhere When

- Root strategic ownership decisions: [../../../README.md](../../../README.md)
```