# Files

## File: modules/platform/AGENT.md
````markdown
# Platform Agent

> Strategic agent documentation: [docs/contexts/platform/AGENT.md](../../docs/contexts/platform/AGENT.md)

## Mission

保護 platform 主域作為治理、身份、組織、權益、策略與營運支撐邊界。

## Route Here When

- 問題核心是 actor、organization、tenant、access、policy、entitlement 或商業權益。
- 問題核心是通知治理、背景任務、平台級搜尋、觀測與支援。
- 問題核心是共享 AI provider、模型政策、配額、安全護欄或下游主域共同消費的 AI capability。
- 問題需要提供其他主域共同消費的治理結果。

## Route Elsewhere When

- 工作區生命週期、成員關係、共享與存在感屬於 workspace。
- 知識內容建立、分類、關聯與發布屬於 notion。
- 對話、來源、retrieval、grounding、synthesis 屬於 notebooklm。

## Dependency Direction

```text
interfaces/ → application/ → domain/ ← infrastructure/
```

## Development Order (Strangler Pattern)

New features:
1. Define Domain (entities, value objects, aggregates, events)
2. Define Application (use cases, DTOs)
3. Define Ports (only if boundary isolation needed)
4. Implement Infrastructure (adapters, persistence)
5. Implement Interfaces (UI, actions, hooks)

Legacy migration:
1. Find a Use Case to extract
2. Build Domain model for that use case
3. Converge Application layer
4. Isolate legacy via Ports
5. Replace Infrastructure adapter
````

## File: modules/platform/api/contracts.ts
````typescript
/**
 * platform API contracts boundary.
 *
 * Keep the source of truth in application/domain and re-export here for API consumers.
 */

export * from "../application/dtos";
export type {
	PlatformContextView,
	PolicyCatalogView,
	SubscriptionEntitlementsView,
	WorkflowPolicyView,
} from "../domain/ports/output";
export * from "../domain/events";

// ── Identity session types ────────────────────────────────────────────────────
// AuthUser is the canonical projection of an authenticated identity subject.
// Platform/Identity BC owns this DTO; app/providers/auth-context re-exports it.

/** Minimal authenticated user record surfaced from identity auth state. */
export interface AuthUser {
	readonly id: string;
	readonly name: string;
	readonly email: string;
}

// ── Cross-cutting account context type ───────────────────────────────────────
// ActiveAccount is the union of an organization AccountEntity or a personal
// AuthUser. Owned by Platform BC; app/providers/app-context re-exports it.
import type { AccountEntity } from "../subdomains/account/api";
export type ActiveAccount = AccountEntity | AuthUser;
````

## File: modules/platform/api/facade.ts
````typescript
/**
 * platform API facade.
 */

import type {
	ActivateSubscriptionAgreementInput,
	ApplyConfigurationProfileInput,
	EmitObservabilitySignalInput,
	FireWorkflowTriggerInput,
	GetPlatformContextViewInput,
	GetPolicyCatalogViewInput,
	GetSubscriptionEntitlementsInput,
	GetWorkflowPolicyViewInput,
	ListEnabledCapabilitiesInput,
	PlatformCommandResult,
	PlatformContextView,
	PolicyCatalogView,
	PublishPolicyCatalogInput,
	RecordAuditSignalInput,
	RegisterIntegrationContractInput,
	RegisterPlatformContextInput,
	RequestNotificationDispatchInput,
	SubscriptionEntitlementsView,
	WorkflowPolicyView,
} from "./contracts";
import type { PlatformCommandPort, PlatformQueryPort } from "../domain/ports/input";

export interface PlatformFacade {
	registerPlatformContext(input: RegisterPlatformContextInput): Promise<PlatformCommandResult>;
	publishPolicyCatalog(input: PublishPolicyCatalogInput): Promise<PlatformCommandResult>;
	applyConfigurationProfile(input: ApplyConfigurationProfileInput): Promise<PlatformCommandResult>;
	registerIntegrationContract(input: RegisterIntegrationContractInput): Promise<PlatformCommandResult>;
	activateSubscriptionAgreement(input: ActivateSubscriptionAgreementInput): Promise<PlatformCommandResult>;
	fireWorkflowTrigger(input: FireWorkflowTriggerInput): Promise<PlatformCommandResult>;
	requestNotificationDispatch(input: RequestNotificationDispatchInput): Promise<PlatformCommandResult>;
	recordAuditSignal(input: RecordAuditSignalInput): Promise<PlatformCommandResult>;
	emitObservabilitySignal(input: EmitObservabilitySignalInput): Promise<PlatformCommandResult>;
	getPlatformContextView(input: GetPlatformContextViewInput): Promise<PlatformContextView>;
	listEnabledCapabilities(input: ListEnabledCapabilitiesInput): Promise<string[]>;
	getPolicyCatalogView(input: GetPolicyCatalogViewInput): Promise<PolicyCatalogView>;
	getSubscriptionEntitlements(input: GetSubscriptionEntitlementsInput): Promise<SubscriptionEntitlementsView>;
	getWorkflowPolicyView(input: GetWorkflowPolicyViewInput): Promise<WorkflowPolicyView>;
}

export function createPlatformFacade(ports: {
	commandPort: PlatformCommandPort;
	queryPort: PlatformQueryPort;
}): PlatformFacade {
	const { commandPort, queryPort } = ports;

	return {
		registerPlatformContext(input) {
			return commandPort.executeCommand({ name: "registerPlatformContext", payload: input });
		},
		publishPolicyCatalog(input) {
			return commandPort.executeCommand({ name: "publishPolicyCatalog", payload: input });
		},
		applyConfigurationProfile(input) {
			return commandPort.executeCommand({ name: "applyConfigurationProfile", payload: input });
		},
		registerIntegrationContract(input) {
			return commandPort.executeCommand({ name: "registerIntegrationContract", payload: input });
		},
		activateSubscriptionAgreement(input) {
			return commandPort.executeCommand({ name: "activateSubscriptionAgreement", payload: input });
		},
		fireWorkflowTrigger(input) {
			return commandPort.executeCommand({ name: "fireWorkflowTrigger", payload: input });
		},
		requestNotificationDispatch(input) {
			return commandPort.executeCommand({ name: "requestNotificationDispatch", payload: input });
		},
		recordAuditSignal(input) {
			return commandPort.executeCommand({ name: "recordAuditSignal", payload: input });
		},
		emitObservabilitySignal(input) {
			return commandPort.executeCommand({ name: "emitObservabilitySignal", payload: input });
		},
		getPlatformContextView(input) {
			return queryPort.executeQuery({ name: "getPlatformContextView", payload: input });
		},
		listEnabledCapabilities(input) {
			return queryPort.executeQuery({ name: "listEnabledCapabilities", payload: input });
		},
		getPolicyCatalogView(input) {
			return queryPort.executeQuery({ name: "getPolicyCatalogView", payload: input });
		},
		getSubscriptionEntitlements(input) {
			return queryPort.executeQuery({ name: "getSubscriptionEntitlements", payload: input });
		},
		getWorkflowPolicyView(input) {
			return queryPort.executeQuery({ name: "getWorkflowPolicyView", payload: input });
		},
	};
}
````

## File: modules/platform/api/platform-service.ts
````typescript
/**
 * createPlatformService — Composition Root
 *
 * Wires all infrastructure adapters to use cases via the command/query dispatchers,
 * then builds and returns a PlatformFacade ready for use by api/ consumers.
 *
 * Lives in api/ because the api boundary is the legitimate composition root:
 *   api → infrastructure → application → domain (all inward dependencies preserved).
 */

import { createPlatformFacade } from "./facade";
import type { PlatformFacade } from "./facade";
import { PlatformCommandDispatcher } from "../application/handlers/PlatformCommandDispatcher";
import { PlatformQueryDispatcher } from "../application/handlers/PlatformQueryDispatcher";
import {
	FirebasePlatformContextRepository,
	FirebasePolicyCatalogRepository,
	FirebaseIntegrationContractRepository,
	FirebaseSubscriptionAgreementRepository,
	FirebaseWorkflowPolicyRepository,
	FirebaseConfigurationProfileStore,
	EnvSecretReferenceResolver,
} from "../infrastructure/db";
import {
	CachedPlatformContextViewRepository,
	CachedPolicyCatalogViewRepository,
	CachedUsageMeterRepository,
} from "../infrastructure/cache";
import {
	QStashDomainEventPublisher,
	QStashWorkflowDispatcher,
} from "../infrastructure/messaging";
import { FirebaseObservabilitySink } from "../infrastructure/monitoring";
import { FirebaseStorageAuditSignalStore } from "../infrastructure/storage";
import { SmtpNotificationGateway } from "../infrastructure/email";

let _platformFacade: PlatformFacade | undefined;

/**
 * createPlatformService — creates a singleton PlatformFacade with all adapters wired.
 *
 * Call this once at module startup. Subsequent calls return the cached instance.
 */
export function createPlatformService(): PlatformFacade {
	if (_platformFacade) return _platformFacade;

	// Output ports — infrastructure adapters
	const contextRepo = new FirebasePlatformContextRepository();
	const catalogRepo = new FirebasePolicyCatalogRepository();
	const contractRepo = new FirebaseIntegrationContractRepository();
	const agreementRepo = new FirebaseSubscriptionAgreementRepository();
	const workflowPolicyRepo = new FirebaseWorkflowPolicyRepository();
	const configProfileStore = new FirebaseConfigurationProfileStore();
	const secretResolver = new EnvSecretReferenceResolver();
	const contextViewRepo = new CachedPlatformContextViewRepository();
	const catalogViewRepo = new CachedPolicyCatalogViewRepository();
	const usageMeterRepo = new CachedUsageMeterRepository();
	const eventPublisher = new QStashDomainEventPublisher();
	const workflowDispatcher = new QStashWorkflowDispatcher();
	const observabilitySink = new FirebaseObservabilitySink();
	const auditStore = new FirebaseStorageAuditSignalStore();
	const notificationGateway = new SmtpNotificationGateway();

	// Input ports — application dispatchers wired to use cases
	const commandPort = new PlatformCommandDispatcher({
		contextRepo,
		catalogRepo,
		contractRepo,
		agreementRepo,
		workflowPolicyRepo,
		configProfileStore,
		secretResolver,
		eventPublisher,
		workflowDispatcher,
		notificationGateway,
		catalogViewRepo,
		auditStore,
		observabilitySink,
	});

	const queryPort = new PlatformQueryDispatcher({
		contextViewRepo,
		catalogViewRepo,
		usageMeterRepo,
		workflowPolicyRepo,
	});

	_platformFacade = createPlatformFacade({ commandPort, queryPort });
	return _platformFacade;
}
````

## File: modules/platform/application/dtos/index.ts
````typescript
/**
 * platform application contracts and DTOs.
 */

export type PlatformCommandName =
	| "registerPlatformContext"
	| "publishPolicyCatalog"
	| "applyConfigurationProfile"
	| "registerIntegrationContract"
	| "activateSubscriptionAgreement"
	| "fireWorkflowTrigger"
	| "requestNotificationDispatch"
	| "recordAuditSignal"
	| "emitObservabilitySignal";

export type PlatformQueryName =
	| "getPlatformContextView"
	| "listEnabledCapabilities"
	| "getPolicyCatalogView"
	| "getSubscriptionEntitlements"
	| "getWorkflowPolicyView";

export interface PlatformCommand<TName extends PlatformCommandName = PlatformCommandName, TPayload = unknown> {
	name: TName;
	payload: TPayload;
}

export interface PlatformQuery<TName extends PlatformQueryName = PlatformQueryName, TPayload = unknown> {
	name: TName;
	payload: TPayload;
}

export interface PlatformCommandResult {
	ok: boolean;
	code?: string;
	message?: string;
	metadata?: Record<string, unknown>;
}

export interface RegisterPlatformContextInput {
	contextId: string;
	subjectScope: string;
}

export interface PublishPolicyCatalogInput {
	contextId: string;
	revision: number;
}

export interface ApplyConfigurationProfileInput {
	contextId: string;
	profileRef: string;
}

export interface RegisterIntegrationContractInput {
	contextId: string;
	integrationContractId: string;
	endpointRef: string;
	protocol: "http" | "webhook" | "queue" | "topic" | "file";
}

export interface ActivateSubscriptionAgreementInput {
	contextId: string;
	subscriptionAgreementId: string;
	planCode: string;
}

export interface FireWorkflowTriggerInput {
	contextId: string;
	triggerKey: string;
	triggeredBy: string;
}

export interface RequestNotificationDispatchInput {
	contextId: string;
	channel: string;
	recipientRef: string;
	templateKey: string;
}

export interface RecordAuditSignalInput {
	contextId: string;
	signalType: string;
	severity: string;
}

export interface EmitObservabilitySignalInput {
	contextId: string;
	signalName: string;
	signalLevel: string;
	sourceRef: string;
}

export interface GetPlatformContextViewInput {
	contextId: string;
}

export interface ListEnabledCapabilitiesInput {
	contextId: string;
}

export interface GetPolicyCatalogViewInput {
	contextId: string;
}

export interface GetSubscriptionEntitlementsInput {
	contextId: string;
}

export interface GetWorkflowPolicyViewInput {
	contextId: string;
	triggerKey: string;
}
````

## File: modules/platform/application/dtos/PlatformCommandResult.dto.ts
````typescript
/**
 * PlatformCommandResult — Shared Command Result DTO
 *
 * The uniform envelope returned by every command handler in the platform module.
 * Driving adapters (web, CLI) map this to their own protocol-level response —
 * they must not invent new result shapes for platform commands.
 *
 * Fields:
 *   ok        — true if command succeeded, false if it failed
 *   code      — machine-readable outcome code (e.g., "ENTITLEMENT_DENIED", "POLICY_CONFLICT")
 *   message   — human-readable description (optional, primarily for debugging)
 *   metadata  — additional key-value data for downstream audit or tracing (optional)
 *
 * Usage rules:
 *   - Errors are expressed as ok=false + code, never as thrown exceptions at the port boundary
 *   - code should map to a value in shared/constants/PlatformErrorCodeConstants.ts
 *
 * @see application/dtos/index.ts
 * @see shared/constants/PlatformErrorCodeConstants.ts
 * @see docs/application-services.md — Command Result
 */

// TODO: implement PlatformCommandResult DTO interface (re-export or extend from application/dtos/index.ts)
````

## File: modules/platform/application/dtos/PlatformContextView.dto.ts
````typescript
/**
 * PlatformContextView — Read Model DTO
 *
 * A read-only projection of a PlatformContext for use in queries.
 * This is not an aggregate snapshot — it is a purposely flattened view
 * optimised for rendering and downstream read consumers.
 *
 * Fields:
 *   contextId       — PlatformContextId (string representation)
 *   lifecycleState  — current PlatformLifecycleState value
 *   capabilityKeys  — list of currently active capability keys
 *   subjectScope    — string representation of subject scope
 *   updatedAt       — ISO 8601 timestamp of last state change
 *
 * Produced by: GetPlatformContextViewHandler
 * Consumed by: api/contracts.ts surface, driving adapters
 *
 * @see application/handlers/GetPlatformContextViewHandler.ts
 * @see ports/output/index.ts — PlatformContextViewRepository
 * @see docs/application-services.md — Query DTOs
 */

// TODO: implement PlatformContextView DTO interface
````

## File: modules/platform/application/dtos/PolicyCatalogView.dto.ts
````typescript
/**
 * PolicyCatalogView — Read Model DTO
 *
 * A read-only projection of the active PolicyCatalog for a platform scope.
 *
 * Fields:
 *   contextId             — owning platform scope identifier
 *   revision              — current revision number
 *   permissionRuleCount   — count of active permission rules
 *   workflowRuleCount     — count of active workflow rules
 *   notificationRuleCount — count of active notification rules
 *   auditRuleCount        — count of active audit rules
 *   publishedAt           — ISO 8601 timestamp of catalog publication
 *
 * Produced by: GetPolicyCatalogViewHandler
 * Consumed by: api/contracts.ts surface, driving adapters
 *
 * @see application/handlers/GetPolicyCatalogViewHandler.ts
 * @see ports/output/index.ts — PolicyCatalogViewRepository
 * @see docs/application-services.md — Query DTOs
 */

// TODO: implement PolicyCatalogView DTO interface
````

## File: modules/platform/application/dtos/SubscriptionEntitlementsView.dto.ts
````typescript
/**
 * SubscriptionEntitlementsView — Read Model DTO
 *
 * A read-only projection of the current subscription entitlements for a platform scope.
 *
 * Fields:
 *   contextId        — owning platform scope identifier
 *   planCode         — active plan code
 *   entitlements     — list of entitled capability keys
 *   usageLimits      — list of active usage limit descriptors
 *   billingState     — current billing state of the agreement
 *   validUntil       — ISO 8601 timestamp of agreement expiry (null if open-ended)
 *
 * Produced by: GetSubscriptionEntitlementsHandler
 *
 * @see application/handlers/GetSubscriptionEntitlementsHandler.ts
 * @see ports/output/index.ts — SubscriptionAgreementRepository, UsageMeterRepository
 * @see docs/application-services.md — Query DTOs
 */

// TODO: implement SubscriptionEntitlementsView DTO interface
````

## File: modules/platform/application/dtos/WorkflowPolicyView.dto.ts
````typescript
/**
 * WorkflowPolicyView — Read Model DTO
 *
 * A read-only projection of the workflow policy for a specific trigger key.
 *
 * Fields:
 *   contextId   — owning platform scope identifier
 *   triggerKey  — workflow trigger key
 *   enabled     — whether the trigger is currently enabled by policy
 *   ruleRef     — reference to the underlying PolicyRule (for audit linkage)
 *   decisionAt  — ISO 8601 timestamp of the last policy evaluation
 *
 * Produced by: GetWorkflowPolicyViewHandler
 *
 * @see application/handlers/GetWorkflowPolicyViewHandler.ts
 * @see ports/output/index.ts — WorkflowPolicyRepository
 * @see docs/application-services.md — Query DTOs
 */

// TODO: implement WorkflowPolicyView DTO interface
````

## File: modules/platform/application/event-handlers/handleIngressAccountProfileAmended.ts
````typescript
/**
 * handleIngressAccountProfileAmended — Ingress Event Handler
 *
 * Subscribes to: "account.profile_amended"
 *
 * Triggered when:
 *   Triggered when an account profile is updated externally.
 *
 * Platform reaction:
 *   Refresh subject scope references used in active PolicyCatalogs.
 *
 * Uses output ports:
 *   PlatformContextRepository, PolicyCatalogRepository
 *
 * Rules:
 *   - Handler is idempotent — processing the same event twice must produce the same state
 *   - Handler must not call external services directly; it routes through output ports only
 *   - Emits a domain event if platform state changes as a result
 *
 * @see events/ingress/index.ts — ingress function inventory
 * @see events/routing/index.ts — routing registration
 * @see ports/input/index.ts — PlatformEventIngressPort
 * @see docs/domain-events.md — ingress events
 */

// TODO: implement handleIngressAccountProfileAmended ingress event handler
````

## File: modules/platform/application/event-handlers/handleIngressIdentitySubjectAuthenticated.ts
````typescript
/**
 * handleIngressIdentitySubjectAuthenticated — Ingress Event Handler
 *
 * Subscribes to: "identity.subject_authenticated"
 *
 * Triggered when:
 *   Triggered when the identity subdomain emits a subject-authenticated event.
 *
 * Platform reaction:
 *   Validate the subject scope and ensure PlatformContext is in active state.
 *
 * Uses output ports:
 *   PlatformContextRepository
 *
 * Rules:
 *   - Handler is idempotent — processing the same event twice must produce the same state
 *   - Handler must not call external services directly; it routes through output ports only
 *   - Emits a domain event if platform state changes as a result
 *
 * @see events/ingress/index.ts — ingress function inventory
 * @see events/routing/index.ts — routing registration
 * @see ports/input/index.ts — PlatformEventIngressPort
 * @see docs/domain-events.md — ingress events
 */

// TODO: implement handleIngressIdentitySubjectAuthenticated ingress event handler
````

## File: modules/platform/application/event-handlers/handleIngressIntegrationCallbackReceived.ts
````typescript
/**
 * handleIngressIntegrationCallbackReceived — Ingress Event Handler
 *
 * Subscribes to: "integration.callback_received"
 *
 * Triggered when:
 *   Triggered when an external system calls back after a workflow or delivery.
 *
 * Platform reaction:
 *   Correlate with DispatchContextEntity and record delivery outcome.
 *
 * Uses output ports:
 *   IntegrationContractRepository, AuditSignalStore
 *
 * Rules:
 *   - Handler is idempotent — processing the same event twice must produce the same state
 *   - Handler must not call external services directly; it routes through output ports only
 *   - Emits a domain event if platform state changes as a result
 *
 * @see events/ingress/index.ts — ingress function inventory
 * @see events/routing/index.ts — routing registration
 * @see ports/input/index.ts — PlatformEventIngressPort
 * @see docs/domain-events.md — ingress events
 */

// TODO: implement handleIngressIntegrationCallbackReceived ingress event handler
````

## File: modules/platform/application/event-handlers/handleIngressOrganizationMembershipChanged.ts
````typescript
/**
 * handleIngressOrganizationMembershipChanged — Ingress Event Handler
 *
 * Subscribes to: "organization.membership_changed"
 *
 * Triggered when:
 *   Triggered when an organization member is added or removed.
 *
 * Platform reaction:
 *   Re-evaluate SubjectScope policies referencing the organization.
 *
 * Uses output ports:
 *   PolicyCatalogRepository, PlatformContextRepository
 *
 * Rules:
 *   - Handler is idempotent — processing the same event twice must produce the same state
 *   - Handler must not call external services directly; it routes through output ports only
 *   - Emits a domain event if platform state changes as a result
 *
 * @see events/ingress/index.ts — ingress function inventory
 * @see events/routing/index.ts — routing registration
 * @see ports/input/index.ts — PlatformEventIngressPort
 * @see docs/domain-events.md — ingress events
 */

// TODO: implement handleIngressOrganizationMembershipChanged ingress event handler
````

## File: modules/platform/application/event-handlers/handleIngressSubscriptionEntitlementChanged.ts
````typescript
/**
 * handleIngressSubscriptionEntitlementChanged — Ingress Event Handler
 *
 * Subscribes to: "subscription.entitlement_changed"
 *
 * Triggered when:
 *   Triggered when an external billing system changes plan entitlements.
 *
 * Platform reaction:
 *   Sync SubscriptionAgreement with new entitlements and trigger CapabilityEntitlementPolicy re-evaluation.
 *
 * Uses output ports:
 *   SubscriptionAgreementRepository, PlatformContextRepository, DomainEventPublisher
 *
 * Rules:
 *   - Handler is idempotent — processing the same event twice must produce the same state
 *   - Handler must not call external services directly; it routes through output ports only
 *   - Emits a domain event if platform state changes as a result
 *
 * @see events/ingress/index.ts — ingress function inventory
 * @see events/routing/index.ts — routing registration
 * @see ports/input/index.ts — PlatformEventIngressPort
 * @see docs/domain-events.md — ingress events
 */

// TODO: implement handleIngressSubscriptionEntitlementChanged ingress event handler
````

## File: modules/platform/application/event-handlers/handleIngressWorkflowExecutionCompleted.ts
````typescript
/**
 * handleIngressWorkflowExecutionCompleted — Ingress Event Handler
 *
 * Subscribes to: "workflow.execution_completed"
 *
 * Triggered when:
 *   Triggered when a downstream workflow executor signals completion.
 *
 * Platform reaction:
 *   Record the completion, update DispatchContextEntity, and emit completion audit signal.
 *
 * Uses output ports:
 *   AuditSignalStore, DomainEventPublisher
 *
 * Rules:
 *   - Handler is idempotent — processing the same event twice must produce the same state
 *   - Handler must not call external services directly; it routes through output ports only
 *   - Emits a domain event if platform state changes as a result
 *
 * @see events/ingress/index.ts — ingress function inventory
 * @see events/routing/index.ts — routing registration
 * @see ports/input/index.ts — PlatformEventIngressPort
 * @see docs/domain-events.md — ingress events
 */

// TODO: implement handleIngressWorkflowExecutionCompleted ingress event handler
````

## File: modules/platform/application/event-handlers/index.ts
````typescript
/**
 * platform event handler placeholder module.
 */

export const PLATFORM_EVENT_HANDLER_FUNCTIONS = [
	"handleIngressIdentitySubjectAuthenticated",
	"handleIngressAccountProfileAmended",
	"handleIngressOrganizationMembershipChanged",
	"handleIngressSubscriptionEntitlementChanged",
	"handleIngressIntegrationCallbackReceived",
	"handleIngressWorkflowExecutionCompleted",
] as const;

export type PlatformEventHandlerFunction = (typeof PLATFORM_EVENT_HANDLER_FUNCTIONS)[number];
````

## File: modules/platform/application/event-mappers/index.ts
````typescript
/**
 * platform event mapper placeholder module.
 */

export const PLATFORM_EVENT_MAPPER_FUNCTIONS = [
	"mapExternalEventToPlatformEvent",
	"mapIngressEventToCommand",
	"mapDomainEventToPublishedEvent",
] as const;

export type PlatformEventMapperFunction = (typeof PLATFORM_EVENT_MAPPER_FUNCTIONS)[number];
````

## File: modules/platform/application/event-mappers/mapDomainEventToPublishedEvent.ts
````typescript
/**
 * mapDomainEventToPublishedEvent — Domain Event to Published Event Mapper
 *
 * Translates an internal PlatformDomainEvent into the platform's Published Language
 * envelope before it is handed to the DomainEventPublisher output port.
 *
 * Responsibilities:
 *   - Enrich event with publication metadata (schemaVersion, publishedAt, producerRef)
 *   - Ensure published envelope follows the platform Published Language contract
 *   - Strip internal implementation details not meant for downstream consumers
 *
 * @see events/published/ — publisher utilities that receive the mapped envelope
 * @see domain/events/index.ts — PlatformDomainEvent (source)
 * @see ports/output/index.ts — DomainEventPublisher (sink)
 * @see docs/domain-events.md — Published Language contract
 */

// TODO: implement mapDomainEventToPublishedEvent mapper function
````

## File: modules/platform/application/event-mappers/mapExternalEventToPlatformEvent.ts
````typescript
/**
 * mapExternalEventToPlatformEvent — Event Mapper
 *
 * Translates a raw external event payload (from a webhook, queue message, or
 * polling adapter) into the platform domain event envelope format.
 *
 * Mapping rules:
 *   - External event type codes are normalised to PlatformDomainEventType constants
 *   - All mandatory envelope fields (eventId, occurredAt, version, correlationId) are derived
 *   - Unknown external event types produce a typed parse error, not a thrown exception
 *
 * @see events/ingress/ — ingress parsers (call this mapper)
 * @see domain/events/index.ts — PlatformDomainEvent, PlatformDomainEventType
 */

// TODO: implement mapExternalEventToPlatformEvent mapper function
````

## File: modules/platform/application/event-mappers/mapIngressEventToCommand.ts
````typescript
/**
 * mapIngressEventToCommand — Event-to-Command Mapper
 *
 * Translates an ingested PlatformDomainEvent into the appropriate PlatformCommand.
 * This enables event-driven command issuance: a reaction handler uses this mapper
 * to bridge an incoming event into a command that the PlatformCommandPort can execute.
 *
 * Supported mappings:
 *   subscription.entitlement_changed  → ActivateSubscriptionAgreementCommand
 *   organization.membership_changed   → (update subject scope in RegisterPlatformContextCommand)
 *   integration.callback_received     → RecordAuditSignalCommand
 *   workflow.execution_completed      → RecordAuditSignalCommand + EmitObservabilitySignalCommand
 *
 * @see events/handlers/ — handlers that call this mapper
 * @see application/commands/ — command types
 * @see ports/input/index.ts — PlatformCommandPort
 */

// TODO: implement mapIngressEventToCommand mapper function
````

## File: modules/platform/application/handlers/index.ts
````typescript
/**
 * platform application handlers barrel.
 */

export { PlatformCommandDispatcher } from "./PlatformCommandDispatcher";
export type { PlatformCommandDispatcherDeps } from "./PlatformCommandDispatcher";
export { PlatformQueryDispatcher } from "./PlatformQueryDispatcher";
export type { PlatformQueryDispatcherDeps } from "./PlatformQueryDispatcher";
````

## File: modules/platform/application/handlers/PlatformCommandDispatcher.ts
````typescript
/**
 * PlatformCommandDispatcher — Application-layer Command Router
 *
 * Implements: PlatformCommandPort
 * Routes commands by name to the appropriate use case class.
 *
 * This is the primary driving adapter for the platform module's command side.
 * Called by: api/facade.ts via PlatformCommandPort
 */

import type { PlatformCommandPort, PlatformCommand, PlatformCommandResult } from "../../domain/ports/input";
import type {
	PlatformContextRepository,
	PolicyCatalogRepository,
	IntegrationContractRepository,
	SubscriptionAgreementRepository,
	WorkflowPolicyRepository,
	ConfigurationProfileStore,
	SecretReferenceResolver,
	DomainEventPublisher,
	WorkflowDispatcherPort,
	NotificationGateway,
	PolicyCatalogViewRepository,
	AuditSignalStore,
	ObservabilitySink,
} from "../../domain/ports/output";
import { RegisterPlatformContextUseCase } from "../use-cases/register-platform-context.use-cases";
import { PublishPolicyCatalogUseCase } from "../use-cases/publish-policy-catalog.use-cases";
import { ApplyConfigurationProfileUseCase } from "../use-cases/apply-configuration-profile.use-cases";
import { RegisterIntegrationContractUseCase } from "../use-cases/register-integration-contract.use-cases";
import { ActivateSubscriptionAgreementUseCase } from "../use-cases/activate-subscription-agreement.use-cases";
import { FireWorkflowTriggerUseCase } from "../use-cases/fire-workflow-trigger.use-cases";
import { RequestNotificationDispatchUseCase } from "../use-cases/request-notification-dispatch.use-cases";
import { RecordAuditSignalUseCase } from "../use-cases/record-audit-signal.use-cases";
import { EmitObservabilitySignalUseCase } from "../use-cases/emit-observability-signal.use-cases";

export interface PlatformCommandDispatcherDeps {
	contextRepo: PlatformContextRepository;
	catalogRepo: PolicyCatalogRepository;
	contractRepo: IntegrationContractRepository;
	agreementRepo: SubscriptionAgreementRepository;
	workflowPolicyRepo: WorkflowPolicyRepository;
	configProfileStore: ConfigurationProfileStore;
	secretResolver: SecretReferenceResolver;
	eventPublisher: DomainEventPublisher;
	workflowDispatcher: WorkflowDispatcherPort;
	notificationGateway: NotificationGateway;
	catalogViewRepo: PolicyCatalogViewRepository;
	auditStore: AuditSignalStore;
	observabilitySink: ObservabilitySink;
}

export class PlatformCommandDispatcher implements PlatformCommandPort {
	constructor(private readonly deps: PlatformCommandDispatcherDeps) {}

	async executeCommand<TCommand extends PlatformCommand>(
		command: TCommand,
	): Promise<PlatformCommandResult> {
		const { deps } = this;
		switch (command.name) {
			case "registerPlatformContext":
				return new RegisterPlatformContextUseCase(
					deps.contextRepo,
					deps.eventPublisher,
				).execute(command.payload as Parameters<RegisterPlatformContextUseCase["execute"]>[0]);

			case "publishPolicyCatalog":
				return new PublishPolicyCatalogUseCase(
					deps.catalogRepo,
					deps.eventPublisher,
				).execute(command.payload as Parameters<PublishPolicyCatalogUseCase["execute"]>[0]);

			case "applyConfigurationProfile":
				return new ApplyConfigurationProfileUseCase(
					deps.contextRepo,
					deps.configProfileStore,
					deps.eventPublisher,
				).execute(command.payload as Parameters<ApplyConfigurationProfileUseCase["execute"]>[0]);

			case "registerIntegrationContract":
				return new RegisterIntegrationContractUseCase(
					deps.contractRepo,
					deps.secretResolver,
					deps.eventPublisher,
				).execute(command.payload as Parameters<RegisterIntegrationContractUseCase["execute"]>[0]);

			case "activateSubscriptionAgreement":
				return new ActivateSubscriptionAgreementUseCase(
					deps.agreementRepo,
					deps.contextRepo,
					deps.eventPublisher,
				).execute(command.payload as Parameters<ActivateSubscriptionAgreementUseCase["execute"]>[0]);

			case "fireWorkflowTrigger":
				return new FireWorkflowTriggerUseCase(
					deps.workflowPolicyRepo,
					deps.workflowDispatcher,
					deps.eventPublisher,
				).execute(command.payload as Parameters<FireWorkflowTriggerUseCase["execute"]>[0]);

			case "requestNotificationDispatch":
				return new RequestNotificationDispatchUseCase(
					deps.notificationGateway,
					deps.catalogViewRepo,
					deps.auditStore,
					deps.eventPublisher,
				).execute(command.payload as Parameters<RequestNotificationDispatchUseCase["execute"]>[0]);

			case "recordAuditSignal":
				return new RecordAuditSignalUseCase(
					deps.auditStore,
					deps.eventPublisher,
				).execute(command.payload as Parameters<RecordAuditSignalUseCase["execute"]>[0]);

			case "emitObservabilitySignal":
				return new EmitObservabilitySignalUseCase(
					deps.observabilitySink,
					deps.auditStore,
					deps.eventPublisher,
				).execute(command.payload as Parameters<EmitObservabilitySignalUseCase["execute"]>[0]);

			default:
				return {
					ok: false,
					code: "UNKNOWN_COMMAND",
					message: `Unknown platform command: '${String((command as PlatformCommand).name)}'`,
				};
		}
	}
}
````

## File: modules/platform/application/index.ts
````typescript
/**
 * platform application layer barrel.
 */

export * from "./dtos";
export * from "./services";
export * from "./use-cases";
export * from "./handlers";
````

## File: modules/platform/application/services/build-causation-id.ts
````typescript
/**
 * buildCausationId — derive a causation identifier from a triggering event or command.
 *
 * Application-level helper used when publishing domain events: links each
 * event back to the command or event that triggered it, forming an observable
 * causal chain.
 *
 * Convention:
 *   commandCausation — pass the commandId from the triggering PlatformCommand.
 *   eventCausation   — pass the eventId from the triggering PlatformDomainEvent.
 *
 * @see shared/types/CorrelationContext.ts
 */
export function buildCausationId(triggeringId: string): string {
	return `caused-by:${triggeringId}`;
}
````

## File: modules/platform/application/services/build-correlation-id.ts
````typescript
/**
 * buildCorrelationId — generate a new UUID v4 correlation identifier.
 *
 * Application-level helper used when a new command arrives at the driving
 * adapter without an existing correlation chain, or when starting a new
 * batch of domain events not caused by an existing event.
 *
 * @see shared/types/CorrelationContext.ts
 */
export function buildCorrelationId(): string {
	return crypto.randomUUID();
}
````

## File: modules/platform/application/use-cases/activate-subscription-agreement.use-cases.ts
````typescript
/**
 * activate-subscription-agreement — use case.
 *
 * Command:  ActivateSubscriptionAgreement
 * Purpose:  Activates, renews, or suspends a subscription agreement.
 */

import type { PlatformCommandResult, ActivateSubscriptionAgreementInput } from "../dtos";
import type { SubscriptionAgreementRepository, PlatformContextRepository, DomainEventPublisher } from "../../domain/ports/output";
import { SUBSCRIPTION_AGREEMENT_ACTIVATED_EVENT_TYPE } from "../../domain/events";
import { buildCorrelationId } from "../services";

export class ActivateSubscriptionAgreementUseCase {
	constructor(
		private readonly agreementRepo: SubscriptionAgreementRepository,
		private readonly contextRepo: PlatformContextRepository,
		private readonly eventPublisher: DomainEventPublisher,
	) {}

	async execute(input: ActivateSubscriptionAgreementInput): Promise<PlatformCommandResult> {
		try {
			const context = await this.contextRepo.findById(input.contextId);
			if (!context) {
				return { ok: false, code: "PLATFORM_CONTEXT_NOT_FOUND", message: `Context '${input.contextId}' not found.` };
			}
			const existing = await this.agreementRepo.findEffectiveByContextId(input.contextId);
			const now = new Date().toISOString();
			const agreementSnapshot = {
				...(existing as Record<string, unknown> ?? {}),
				subscriptionAgreementId: input.subscriptionAgreementId,
				contextId: input.contextId,
				planCode: input.planCode,
				billingState: "active",
				updatedAt: now,
			};
			await this.agreementRepo.save(agreementSnapshot);
			const contextSnapshot = {
				...(context as Record<string, unknown>),
				subscriptionAgreementId: input.subscriptionAgreementId,
				updatedAt: now,
			};
			await this.contextRepo.save(contextSnapshot);
			await this.eventPublisher.publish([
				{
					type: SUBSCRIPTION_AGREEMENT_ACTIVATED_EVENT_TYPE,
					aggregateType: "SubscriptionAgreement",
					aggregateId: input.subscriptionAgreementId,
					contextId: input.contextId,
					occurredAt: now,
					version: 1,
					correlationId: buildCorrelationId(),
					payload: { subscriptionAgreementId: input.subscriptionAgreementId, planCode: input.planCode },
				},
			]);
			return {
				ok: true,
				code: "SUBSCRIPTION_AGREEMENT_ACTIVATED",
				metadata: { subscriptionAgreementId: input.subscriptionAgreementId, planCode: input.planCode },
			};
		} catch (err) {
			return {
				ok: false,
				code: "ACTIVATE_SUBSCRIPTION_AGREEMENT_FAILED",
				message: err instanceof Error ? err.message : "Unexpected error",
			};
		}
	}
}
````

## File: modules/platform/application/use-cases/apply-configuration-profile.use-cases.ts
````typescript
/**
 * apply-configuration-profile — use case.
 *
 * Command:  ApplyConfigurationProfile
 * Purpose:  Applies a configuration profile and updates capability toggles.
 */

import type { PlatformCommandResult, ApplyConfigurationProfileInput } from "../dtos";
import type { PlatformContextRepository, ConfigurationProfileStore, DomainEventPublisher } from "../../domain/ports/output";
import { CONFIG_PROFILE_APPLIED_EVENT_TYPE } from "../../domain/events";
import { buildCorrelationId } from "../services";

export class ApplyConfigurationProfileUseCase {
	constructor(
		private readonly contextRepo: PlatformContextRepository,
		private readonly profileStore: ConfigurationProfileStore,
		private readonly eventPublisher: DomainEventPublisher,
	) {}

	async execute(input: ApplyConfigurationProfileInput): Promise<PlatformCommandResult> {
		try {
			const profile = await this.profileStore.getProfile(input.profileRef);
			if (!profile) {
				return { ok: false, code: "CONFIGURATION_PROFILE_NOT_FOUND", message: `Profile '${input.profileRef}' not found.` };
			}
			const existing = await this.contextRepo.findById(input.contextId);
			if (!existing) {
				return { ok: false, code: "PLATFORM_CONTEXT_NOT_FOUND", message: `Context '${input.contextId}' not found.` };
			}
			const now = new Date().toISOString();
			const snapshot = {
				...(existing as Record<string, unknown>),
				configurationProfileRef: input.profileRef,
				updatedAt: now,
			};
			await this.contextRepo.save(snapshot);
			await this.eventPublisher.publish([
				{
					type: CONFIG_PROFILE_APPLIED_EVENT_TYPE,
					aggregateType: "PlatformContext",
					aggregateId: input.contextId,
					contextId: input.contextId,
					occurredAt: now,
					version: 1,
					correlationId: buildCorrelationId(),
					payload: { profileRef: input.profileRef },
				},
			]);
			return {
				ok: true,
				code: "CONFIGURATION_PROFILE_APPLIED",
				metadata: { contextId: input.contextId, profileRef: input.profileRef },
			};
		} catch (err) {
			return {
				ok: false,
				code: "APPLY_CONFIGURATION_PROFILE_FAILED",
				message: err instanceof Error ? err.message : "Unexpected error",
			};
		}
	}
}
````

## File: modules/platform/application/use-cases/emit-observability-signal.use-cases.ts
````typescript
/**
 * emit-observability-signal — use case.
 *
 * Command:  EmitObservabilitySignal
 * Purpose:  Emits metrics / trace / alert signals.
 */

import type { PlatformCommandResult, EmitObservabilitySignalInput } from "../dtos";
import type { ObservabilitySink, AuditSignalStore, DomainEventPublisher } from "../../domain/ports/output";
import { OBSERVABILITY_SIGNAL_EMITTED_EVENT_TYPE } from "../../domain/events";
import { buildCorrelationId } from "../services";

const AUDIT_SIGNAL_LEVELS = new Set(["error", "critical", "fatal"]);

export class EmitObservabilitySignalUseCase {
	constructor(
		private readonly observabilitySink: ObservabilitySink,
		private readonly auditStore: AuditSignalStore,
		private readonly eventPublisher: DomainEventPublisher,
	) {}

	async execute(input: EmitObservabilitySignalInput): Promise<PlatformCommandResult> {
		try {
			const now = new Date().toISOString();
			await this.observabilitySink.emit({
				signalName: input.signalName,
				signalLevel: input.signalLevel,
				sourceRef: input.sourceRef,
				contextId: input.contextId,
				occurredAt: now,
			});
			if (AUDIT_SIGNAL_LEVELS.has(input.signalLevel.toLowerCase())) {
				await this.auditStore.write({
					signalType: "observability.signal_emitted",
					severity: input.signalLevel,
					contextId: input.contextId,
					signalName: input.signalName,
					occurredAt: now,
				});
			}
			await this.eventPublisher.publish([
				{
					type: OBSERVABILITY_SIGNAL_EMITTED_EVENT_TYPE,
					aggregateType: "Observability",
					aggregateId: input.contextId,
					contextId: input.contextId,
					occurredAt: now,
					version: 1,
					correlationId: buildCorrelationId(),
					payload: { signalName: input.signalName, signalLevel: input.signalLevel, sourceRef: input.sourceRef },
				},
			]);
			return {
				ok: true,
				code: "OBSERVABILITY_SIGNAL_EMITTED",
				metadata: { signalName: input.signalName, signalLevel: input.signalLevel },
			};
		} catch (err) {
			return {
				ok: false,
				code: "EMIT_OBSERVABILITY_SIGNAL_FAILED",
				message: err instanceof Error ? err.message : "Unexpected error",
			};
		}
	}
}
````

## File: modules/platform/application/use-cases/fire-workflow-trigger.use-cases.ts
````typescript
/**
 * fire-workflow-trigger — use case.
 *
 * Command:  FireWorkflowTrigger
 * Purpose:  Emits a workflow trigger and delegates execution to downstream adapter.
 */

import type { PlatformCommandResult, FireWorkflowTriggerInput } from "../dtos";
import type { WorkflowPolicyRepository, WorkflowDispatcherPort, DomainEventPublisher } from "../../domain/ports/output";
import { WORKFLOW_TRIGGER_FIRED_EVENT_TYPE } from "../../domain/events";
import { buildCorrelationId } from "../services";

export class FireWorkflowTriggerUseCase {
	constructor(
		private readonly policyRepo: WorkflowPolicyRepository,
		private readonly dispatcher: WorkflowDispatcherPort,
		private readonly eventPublisher: DomainEventPublisher,
	) {}

	async execute(input: FireWorkflowTriggerInput): Promise<PlatformCommandResult> {
		try {
			const policyView = await this.policyRepo.getView(input.contextId, input.triggerKey);
			if (!policyView?.enabled) {
				return {
					ok: false,
					code: "WORKFLOW_TRIGGER_NOT_ALLOWED",
					message: `Trigger '${input.triggerKey}' is not enabled by policy.`,
				};
			}
			const dispatchResult = await this.dispatcher.dispatch(input.triggerKey, {
				contextId: input.contextId,
				triggeredBy: input.triggeredBy,
			});
			if (!dispatchResult.ok) {
				return dispatchResult;
			}
			const now = new Date().toISOString();
			await this.eventPublisher.publish([
				{
					type: WORKFLOW_TRIGGER_FIRED_EVENT_TYPE,
					aggregateType: "Workflow",
					aggregateId: input.triggerKey,
					contextId: input.contextId,
					occurredAt: now,
					version: 1,
					correlationId: buildCorrelationId(),
					payload: { triggerKey: input.triggerKey, triggeredBy: input.triggeredBy },
				},
			]);
			return {
				ok: true,
				code: "WORKFLOW_TRIGGER_FIRED",
				metadata: { triggerKey: input.triggerKey, contextId: input.contextId },
			};
		} catch (err) {
			return {
				ok: false,
				code: "FIRE_WORKFLOW_TRIGGER_FAILED",
				message: err instanceof Error ? err.message : "Unexpected error",
			};
		}
	}
}
````

## File: modules/platform/application/use-cases/publish-policy-catalog.use-cases.ts
````typescript
/**
 * publish-policy-catalog — use case.
 *
 * Command:  PublishPolicyCatalog
 * Purpose:  Publishes a new PolicyCatalog revision.
 */

import type { PlatformCommandResult, PublishPolicyCatalogInput } from "../dtos";
import type { PolicyCatalogRepository, DomainEventPublisher } from "../../domain/ports/output";
import { POLICY_CATALOG_PUBLISHED_EVENT_TYPE } from "../../domain/events";
import { buildCorrelationId } from "../services";

export class PublishPolicyCatalogUseCase {
	constructor(
		private readonly catalogRepo: PolicyCatalogRepository,
		private readonly eventPublisher: DomainEventPublisher,
	) {}

	async execute(input: PublishPolicyCatalogInput): Promise<PlatformCommandResult> {
		try {
			const existing = await this.catalogRepo.findActiveByContextId(input.contextId);
			const now = new Date().toISOString();
			const snapshot = {
				...(existing as Record<string, unknown> ?? {}),
				contextId: input.contextId,
				revision: input.revision,
				permissionRuleCount: (existing as Record<string, unknown> | null)?.permissionRuleCount ?? 0,
				workflowRuleCount: (existing as Record<string, unknown> | null)?.workflowRuleCount ?? 0,
				notificationRuleCount: (existing as Record<string, unknown> | null)?.notificationRuleCount ?? 0,
				auditRuleCount: (existing as Record<string, unknown> | null)?.auditRuleCount ?? 0,
				publishedAt: now,
			};
			await this.catalogRepo.saveRevision(snapshot);
			await this.eventPublisher.publish([
				{
					type: POLICY_CATALOG_PUBLISHED_EVENT_TYPE,
					aggregateType: "PolicyCatalog",
					aggregateId: input.contextId,
					contextId: input.contextId,
					occurredAt: now,
					version: input.revision,
					correlationId: buildCorrelationId(),
					payload: { revision: input.revision, publishedAt: now },
				},
			]);
			return {
				ok: true,
				code: "POLICY_CATALOG_PUBLISHED",
				metadata: { contextId: input.contextId, revision: input.revision },
			};
		} catch (err) {
			return {
				ok: false,
				code: "PUBLISH_POLICY_CATALOG_FAILED",
				message: err instanceof Error ? err.message : "Unexpected error",
			};
		}
	}
}
````

## File: modules/platform/application/use-cases/record-audit-signal.use-cases.ts
````typescript
/**
 * record-audit-signal — use case.
 *
 * Command:  RecordAuditSignal
 * Purpose:  Writes a decision or behavior as an immutable audit signal.
 */

import type { PlatformCommandResult, RecordAuditSignalInput } from "../dtos";
import type { AuditSignalStore, DomainEventPublisher } from "../../domain/ports/output";
import { AUDIT_SIGNAL_RECORDED_EVENT_TYPE } from "../../domain/events";
import { buildCorrelationId } from "../services";

export class RecordAuditSignalUseCase {
	constructor(
		private readonly auditStore: AuditSignalStore,
		private readonly eventPublisher: DomainEventPublisher,
	) {}

	async execute(input: RecordAuditSignalInput): Promise<PlatformCommandResult> {
		try {
			const now = new Date().toISOString();
			await this.auditStore.write({
				signalType: input.signalType,
				severity: input.severity,
				contextId: input.contextId,
				occurredAt: now,
			});
			await this.eventPublisher.publish([
				{
					type: AUDIT_SIGNAL_RECORDED_EVENT_TYPE,
					aggregateType: "AuditLog",
					aggregateId: input.contextId,
					contextId: input.contextId,
					occurredAt: now,
					version: 1,
					correlationId: buildCorrelationId(),
					payload: { signalType: input.signalType, severity: input.severity },
				},
			]);
			return {
				ok: true,
				code: "AUDIT_SIGNAL_RECORDED",
				metadata: { signalType: input.signalType, contextId: input.contextId },
			};
		} catch (err) {
			return {
				ok: false,
				code: "RECORD_AUDIT_SIGNAL_FAILED",
				message: err instanceof Error ? err.message : "Unexpected error",
			};
		}
	}
}
````

## File: modules/platform/application/use-cases/register-integration-contract.use-cases.ts
````typescript
/**
 * register-integration-contract — use case.
 *
 * Command:  RegisterIntegrationContract
 * Purpose:  Creates or updates an external integration contract.
 */

import type { PlatformCommandResult, RegisterIntegrationContractInput } from "../dtos";
import type { IntegrationContractRepository, SecretReferenceResolver, DomainEventPublisher } from "../../domain/ports/output";
import { INTEGRATION_CONTRACT_REGISTERED_EVENT_TYPE } from "../../domain/events";
import { buildCorrelationId } from "../services";

export class RegisterIntegrationContractUseCase {
	constructor(
		private readonly contractRepo: IntegrationContractRepository,
		private readonly secretResolver: SecretReferenceResolver,
		private readonly eventPublisher: DomainEventPublisher,
	) {}

	async execute(input: RegisterIntegrationContractInput): Promise<PlatformCommandResult> {
		try {
			const authRef = await this.secretResolver.resolve(input.integrationContractId);
			const existing = await this.contractRepo.findById(input.integrationContractId);
			const now = new Date().toISOString();
			const snapshot = {
				...(existing as Record<string, unknown> ?? {}),
				integrationContractId: input.integrationContractId,
				contextId: input.contextId,
				endpointRef: input.endpointRef,
				protocol: input.protocol,
				authenticationRef: authRef,
				contractState: "active",
				updatedAt: now,
			};
			await this.contractRepo.save(snapshot);
			await this.eventPublisher.publish([
				{
					type: INTEGRATION_CONTRACT_REGISTERED_EVENT_TYPE,
					aggregateType: "IntegrationContract",
					aggregateId: input.integrationContractId,
					contextId: input.contextId,
					occurredAt: now,
					version: 1,
					correlationId: buildCorrelationId(),
					payload: { integrationContractId: input.integrationContractId, protocol: input.protocol },
				},
			]);
			return {
				ok: true,
				code: "INTEGRATION_CONTRACT_REGISTERED",
				metadata: { integrationContractId: input.integrationContractId },
			};
		} catch (err) {
			return {
				ok: false,
				code: "REGISTER_INTEGRATION_CONTRACT_FAILED",
				message: err instanceof Error ? err.message : "Unexpected error",
			};
		}
	}
}
````

## File: modules/platform/application/use-cases/register-platform-context.use-cases.ts
````typescript
/**
 * register-platform-context — use case.
 *
 * Command:  RegisterPlatformContext
 * Purpose:  Creates a PlatformContext or re-activates a platform scope.
 */

import type { PlatformCommandResult, RegisterPlatformContextInput } from "../dtos";
import type { PlatformContextRepository, DomainEventPublisher } from "../../domain/ports/output";
import { PLATFORM_CONTEXT_REGISTERED_EVENT_TYPE } from "../../domain/events";
import { buildCorrelationId } from "../services";

export class RegisterPlatformContextUseCase {
	constructor(
		private readonly contextRepo: PlatformContextRepository,
		private readonly eventPublisher: DomainEventPublisher,
	) {}

	async execute(input: RegisterPlatformContextInput): Promise<PlatformCommandResult> {
		try {
			const existing = await this.contextRepo.findById(input.contextId);
			const now = new Date().toISOString();
			const snapshot = {
				...(existing as Record<string, unknown> ?? {}),
				contextId: input.contextId,
				subjectScope: input.subjectScope,
				lifecycleState: "active",
				capabilityKeys: (existing as Record<string, unknown> | null)?.capabilityKeys ?? [],
				updatedAt: now,
			};
			await this.contextRepo.save(snapshot);
			await this.eventPublisher.publish([
				{
					type: PLATFORM_CONTEXT_REGISTERED_EVENT_TYPE,
					aggregateType: "PlatformContext",
					aggregateId: input.contextId,
					contextId: input.contextId,
					occurredAt: now,
					version: 1,
					correlationId: buildCorrelationId(),
					payload: { subjectScope: input.subjectScope, lifecycleState: "active" },
				},
			]);
			return { ok: true, code: "PLATFORM_CONTEXT_REGISTERED", metadata: { contextId: input.contextId } };
		} catch (err) {
			return {
				ok: false,
				code: "REGISTER_PLATFORM_CONTEXT_FAILED",
				message: err instanceof Error ? err.message : "Unexpected error",
			};
		}
	}
}
````

## File: modules/platform/application/use-cases/request-notification-dispatch.use-cases.ts
````typescript
/**
 * request-notification-dispatch — use case.
 *
 * Command:  RequestNotificationDispatch
 * Purpose:  Creates a notification dispatch request.
 */

import type { PlatformCommandResult, RequestNotificationDispatchInput } from "../dtos";
import type { NotificationGateway, PolicyCatalogViewRepository, AuditSignalStore, DomainEventPublisher } from "../../domain/ports/output";
import { NOTIFICATION_DISPATCH_REQUESTED_EVENT_TYPE } from "../../domain/events";
import { buildCorrelationId } from "../services";

export class RequestNotificationDispatchUseCase {
	constructor(
		private readonly notificationGateway: NotificationGateway,
		private readonly catalogViewRepo: PolicyCatalogViewRepository,
		private readonly auditStore: AuditSignalStore,
		private readonly eventPublisher: DomainEventPublisher,
	) {}

	async execute(input: RequestNotificationDispatchInput): Promise<PlatformCommandResult> {
		try {
			await this.catalogViewRepo.getView(input.contextId);
			const dispatchResult = await this.notificationGateway.dispatch({
				contextId: input.contextId,
				channel: input.channel,
				recipientRef: input.recipientRef,
				templateKey: input.templateKey,
			});
			if (!dispatchResult.ok) {
				return dispatchResult;
			}
			const now = new Date().toISOString();
			await this.auditStore.write({
				signalType: "notification.dispatch_requested",
				severity: "info",
				contextId: input.contextId,
				recipientRef: input.recipientRef,
				occurredAt: now,
			});
			await this.eventPublisher.publish([
				{
					type: NOTIFICATION_DISPATCH_REQUESTED_EVENT_TYPE,
					aggregateType: "Notification",
					aggregateId: input.recipientRef,
					contextId: input.contextId,
					occurredAt: now,
					version: 1,
					correlationId: buildCorrelationId(),
					payload: { channel: input.channel, recipientRef: input.recipientRef, templateKey: input.templateKey },
				},
			]);
			return {
				ok: true,
				code: "NOTIFICATION_DISPATCH_REQUESTED",
				metadata: { channel: input.channel, recipientRef: input.recipientRef },
			};
		} catch (err) {
			return {
				ok: false,
				code: "REQUEST_NOTIFICATION_DISPATCH_FAILED",
				message: err instanceof Error ? err.message : "Unexpected error",
			};
		}
	}
}
````

## File: modules/platform/docs/README.md
````markdown
# Platform Documentation

Implementation-level documentation for the platform bounded context.

## Strategic Documentation (Authority)

Strategic architecture documentation lives in `docs/contexts/platform/`:

- [README.md](../../../docs/contexts/platform/README.md) — Context overview
- [subdomains.md](../../../docs/contexts/platform/subdomains.md) — Subdomain inventory
- [bounded-contexts.md](../../../docs/contexts/platform/bounded-contexts.md) — Ownership map
- [context-map.md](../../../docs/contexts/platform/context-map.md) — Relationships
- [ubiquitous-language.md](../../../docs/contexts/platform/ubiquitous-language.md) — Terminology

## Architecture Reference

- [Bounded Context Template](../../../docs/bounded-context-subdomain-template.md) — Standard structure
- [Architecture Overview](../../../docs/architecture-overview.md) — System-wide architecture
- [Integration Guidelines](../../../docs/integration-guidelines.md) — Cross-context rules

## Conflict Resolution

- Strategic docs in `docs/contexts/platform/` are the authority for naming, ownership, and boundaries.
- This `docs/` folder is for implementation-aligned detail only.
````

## File: modules/platform/domain/aggregates/index.ts
````typescript
/**
 * platform aggregate placeholder module.
 */

export const PLATFORM_DOMAIN_AGGREGATE_FUNCTIONS = [
	"registerPlatformContext",
	"enablePlatformCapability",
	"disablePlatformCapability",
	"publishPolicyCatalogRevision",
	"registerIntegrationContractAggregate",
	"activateSubscriptionAgreementAggregate",
	"renewSubscriptionAgreementAggregate",
	"cancelSubscriptionAgreementAggregate",
] as const;

export type PlatformDomainAggregateFunction = (typeof PLATFORM_DOMAIN_AGGREGATE_FUNCTIONS)[number];
````

## File: modules/platform/domain/aggregates/IntegrationContract.ts
````typescript
/**
 * IntegrationContract — Aggregate Root
 *
 * Manages the endpoint, communication protocol, authentication reference, and
 * delivery policy required when the platform interacts with an external system.
 * Defines the business-facing integration language but does not execute external calls directly.
 *
 * Key attributes:
 *   integrationContractId — IntegrationContractId
 *   contextId             — PlatformContextId (owning platform scope)
 *   endpointRef           — EndpointRef (external endpoint reference)
 *   protocol              — IntegrationProtocol (http | webhook | queue | topic | file)
 *   authenticationRef     — SecretReference (authentication reference)
 *   subscribedSignals     — SignalSubscription[] (signals the external system needs)
 *   deliveryPolicy        — DeliveryPolicy (retry / timeout / idempotency strategy)
 *   contractState         — ContractState (draft | active | paused | revoked)
 *
 * Invariants:
 *   - An active contract must have endpoint and authentication reference
 *   - Async delivery must define a retry/timeout policy
 *   - Subscribed signals must correspond to events in the platform published language
 *
 * Emits:
 *   integration.contract_registered
 *   integration.delivery_failed
 *
 * @see docs/aggregates.md — 聚合根：IntegrationContract
 * @see docs/domain-events.md
 */

// TODO: implement IntegrationContract aggregate root class
````

## File: modules/platform/domain/aggregates/PlatformContext.ts
````typescript
/**
 * PlatformContext — Aggregate Root
 *
 * Platform-scope capability enablement and governance baseline.
 * Answers: "Which capabilities are allowed in this platform scope,
 * and under what policies and configuration does it operate?"
 *
 * Key attributes:
 *   contextId                — PlatformContextId
 *   subjectScope             — SubjectScope (actor/account/organization boundary)
 *   capabilities             — PlatformCapability[] (registered capability set)
 *   policyCatalogId          — PolicyCatalogId (active policy set reference)
 *   configurationProfileRef  — ConfigurationProfileRef (active configuration profile)
 *   subscriptionAgreementId  — SubscriptionAgreementId (active subscription agreement)
 *   lifecycleState           — PlatformLifecycleState (draft | active | suspended | retired)
 *
 * Invariants:
 *   - An active context must reference a valid SubscriptionAgreement
 *   - A capability may only be enabled when entitlement permits
 *   - A suspended or retired context must not issue new workflow or integration delivery commands
 *
 * Lifecycle:
 *   1. Driving adapter translates external request into command
 *   2. Application service loads this aggregate via PlatformContextRepository
 *   3. Aggregate executes command method and enforces invariants
 *   4. Application service persists new state
 *   5. Application service pulls and publishes domain events after successful persistence
 *
 * Emits:
 *   platform.context_registered
 *   platform.capability_enabled
 *   platform.capability_disabled
 *   config.profile_applied
 *
 * @see docs/aggregates.md — 聚合根：PlatformContext
 * @see docs/domain-events.md — 發出事件
 */

// TODO: implement PlatformContext aggregate root class
````

## File: modules/platform/domain/aggregates/PolicyCatalog.ts
````typescript
/**
 * PolicyCatalog — Aggregate Root
 *
 * Owns the versioned set of policies used to evaluate permissions, notifications,
 * workflows, and audit rules within a platform scope.
 * It is the domain's single source of truth for governance semantics —
 * not an adapter configuration container.
 *
 * Key attributes:
 *   policyCatalogId   — PolicyCatalogId
 *   contextId         — PlatformContextId (owning platform scope)
 *   permissionRules   — PolicyRule[] (access-control and authorization rules)
 *   workflowRules     — PolicyRule[] (trigger conditions and step rules)
 *   notificationRules — PolicyRule[] (notification routing and suppression rules)
 *   auditRules        — PolicyRule[] (decisions and behaviors that must be recorded)
 *   revision          — number (monotonically incrementing version number)
 *
 * Invariants:
 *   - Only one active catalog revision per contextId at any time
 *   - Every rule must have explicit subject, condition, and effect
 *   - Permission, workflow, notification, and audit rules must not create indeterminate conflicts
 *
 * Emits:
 *   policy.catalog_published
 *
 * @see docs/aggregates.md — 聚合根：PolicyCatalog
 * @see docs/domain-events.md
 */

// TODO: implement PolicyCatalog aggregate root class
````

## File: modules/platform/domain/aggregates/SubscriptionAgreement.ts
````typescript
/**
 * SubscriptionAgreement — Aggregate Root
 *
 * Represents the plan, entitlements, and constraints currently in effect
 * for a platform scope. It is the commercial boundary for capability
 * enablement and usage governance.
 *
 * Key attributes:
 *   subscriptionAgreementId — SubscriptionAgreementId
 *   contextId               — PlatformContextId (owning platform scope)
 *   planCode                — PlanCode (plan identifier)
 *   entitlements            — Entitlement[] (usable capabilities and quotas)
 *   usageLimits             — UsageLimit[] (quantitative limits)
 *   billingState            — BillingState (pending | active | delinquent | expired | cancelled)
 *   validPeriod             — EffectivePeriod (validity interval)
 *
 * Invariants:
 *   - Entitlements may only be derived from planCode; they must not deviate from plan definition
 *   - An expired or cancelled agreement must not activate new capabilities
 *   - When usage limits are exceeded the platform must return an explicit governance result,
 *     not silently fail
 *
 * Emits:
 *   subscription.agreement_activated
 *
 * @see docs/aggregates.md — 聚合根：SubscriptionAgreement
 * @see docs/domain-events.md
 */

// TODO: implement SubscriptionAgreement aggregate root class
````

## File: modules/platform/domain/constants/index.ts
````typescript
/**
 * platform shared constants placeholder module.
 */

export const PLATFORM_SHARED_CONSTANT_GROUPS = [
	"PlatformLifecycleConstants",
	"PlatformEventTypeConstants",
	"PlatformErrorCodeConstants",
] as const;

export type PlatformSharedConstantGroup = (typeof PLATFORM_SHARED_CONSTANT_GROUPS)[number];
````

## File: modules/platform/domain/constants/PlatformErrorCodeConstants.ts
````typescript
/**
 * PlatformErrorCodeConstants — Shared Constants
 *
 * String constants for all machine-readable error codes used in PlatformCommandResult.
 *
 * Codes:
 *   ENTITLEMENT_DENIED     — capability not allowed by current subscription plan
 *   POLICY_CONFLICT        — two or more policy rules produce a contradictory decision
 *   DELIVERY_NOT_ALLOWED   — integration or notification delivery was blocked by policy
 *   CONTRACT_NOT_ACTIVE    — integration contract is not in active state
 *   AGREEMENT_EXPIRED      — subscription agreement has expired
 *   CONTEXT_NOT_ACTIVE     — platform context is not in active state
 *   INVARIANT_VIOLATION    — aggregate invariant was violated
 *   UNKNOWN_ERROR          — unexpected error (fallback)
 *
 * @see application/dtos/PlatformCommandResult.dto.ts
 * @see adapters/web/mapPlatformResultToHttpResponse.ts
 */

// TODO: implement PlatformErrorCodeConstants as const object
````

## File: modules/platform/domain/constants/PlatformEventTypeConstants.ts
````typescript
/**
 * PlatformEventTypeConstants — Shared Constants
 *
 * Re-exports all PlatformDomainEventType string constants from domain/events/index.ts
 * as a named constant group for use in adapters and infrastructure layers.
 *
 * Rationale:
 *   Infrastructure and adapter layers need event type string literals for
 *   QStash topic routing, Firestore query filters, and monitoring dashboards.
 *   Using this re-export prevents direct domain layer imports into infrastructure.
 *
 * @see domain/events/index.ts — canonical event type source
 */

// TODO: re-export PLATFORM_DOMAIN_EVENT_TYPES from domain/events/index.ts
````

## File: modules/platform/domain/constants/PlatformLifecycleConstants.ts
````typescript
/**
 * PlatformLifecycleConstants — Shared Constants
 *
 * Defines string literal constants for all lifecycle state values used
 * across platform aggregates and shared value objects.
 *
 * Constant groups:
 *   PLATFORM_CONTEXT_LIFECYCLE — "draft" | "active" | "suspended" | "retired"
 *   CONTRACT_STATE            — "draft" | "active" | "paused" | "revoked"
 *   BILLING_STATE             — "pending" | "active" | "delinquent" | "expired" | "cancelled"
 *
 * Rules:
 *   - All state values in domain VOs and aggregates must reference these constants
 *   - Do not inline magic strings in aggregate or domain service code
 *
 * @see shared/value-objects/PlatformLifecycleState.ts
 * @see shared/value-objects/ContractState.ts
 * @see shared/value-objects/BillingState.ts
 */

// TODO: implement PlatformLifecycleConstants as const object(s)
````

## File: modules/platform/domain/entities/DispatchContextEntity.ts
````typescript
/**
 * DispatchContextEntity — Entity
 *
 * Tracks the state of a single delivery attempt for a workflow trigger or
 * notification dispatch. Records attempt count, last failure code, and
 * correlation identifiers for traceability.
 *
 * Key attributes:
 *   dispatchId       — unique dispatch attempt identifier
 *   contractId       — IntegrationContractId of originating contract (nullable for notifications)
 *   triggerKey       — workflow trigger key or notification template key
 *   attemptCount     — number of delivery attempts so far
 *   lastFailureCode  — most recent failure code (nullable if no failures)
 *   correlationId    — CorrelationContext correlation chain identifier
 *   causationId      — event or command that caused this dispatch
 *
 * Invariants:
 *   - attemptCount must be >= 0
 *   - If attemptCount > 0 and status is failed, lastFailureCode must be non-null
 *
 * Used by: WorkflowDispatchPolicy, NotificationRoutingPolicy domain services
 * @see docs/aggregates.md — 子實體與值物件
 */

// TODO: implement DispatchContextEntity interface / class
````

## File: modules/platform/domain/entities/index.ts
````typescript
/**
 * platform entity placeholder module.
 */

export const PLATFORM_DOMAIN_ENTITY_FUNCTIONS = [
	"definePolicyRuleEntity",
	"defineSignalSubscriptionEntity",
	"defineDispatchContextEntity",
] as const;

export type PlatformDomainEntityFunction = (typeof PLATFORM_DOMAIN_ENTITY_FUNCTIONS)[number];
````

## File: modules/platform/domain/entities/PolicyRuleEntity.ts
````typescript
/**
 * PolicyRuleEntity — Entity
 *
 * A single evaluatable governance rule inside a PolicyCatalog aggregate.
 * Has its own identity (ruleId) within the catalog, but cannot exist outside one.
 *
 * Key attributes:
 *   ruleId     — unique within its catalog revision
 *   subject    — SubjectScope the rule applies to
 *   condition  — predicate expression (domain-typed, not SQL/CEL)
 *   effect     — "allow" | "deny" | "require"
 *   ruleType   — "permission" | "workflow" | "notification" | "audit"
 *   priority   — integer; lower value = higher priority
 *
 * Invariants:
 *   - Every rule must declare subject, condition, and effect
 *   - Two rules within the same catalog may not share the same ruleId
 *   - A rule with effect "require" is only valid for ruleType "audit"
 *
 * Owned by: PolicyCatalog aggregate
 * @see domain/aggregates/PolicyCatalog.ts
 * @see docs/aggregates.md — 子實體與值物件
 */

// TODO: implement PolicyRuleEntity interface / class
````

## File: modules/platform/domain/entities/SignalSubscriptionEntity.ts
````typescript
/**
 * SignalSubscriptionEntity — Entity
 *
 * Represents one event type that an IntegrationContract subscribes to receive.
 * Has its own identity (subscriptionId) within the contract.
 *
 * Key attributes:
 *   subscriptionId — unique within its contract
 *   eventType      — PlatformDomainEventType (the event to subscribe to)
 *   filterPredicate — optional payload filter expression
 *   deliveryConfig  — per-subscription delivery overrides (timeout, retry)
 *
 * Invariants:
 *   - eventType must be a recognised PlatformDomainEventType constant
 *   - Only one subscription per eventType per contract is allowed
 *
 * Owned by: IntegrationContract aggregate
 * @see domain/aggregates/IntegrationContract.ts
 * @see domain/events/index.ts — PlatformDomainEventType
 * @see docs/aggregates.md — 子實體與值物件
 */

// TODO: implement SignalSubscriptionEntity interface / class
````

## File: modules/platform/domain/errors/createDeliveryNotAllowedError.ts
````typescript
/**
 * createDeliveryNotAllowedError — Error Factory
 *
 * Creates a typed domain error for the case where an integration delivery
 * or notification dispatch is blocked by policy or contract state.
 *
 * Error fields:
 *   code            — "DELIVERY_NOT_ALLOWED"
 *   deliveryTarget  — the recipient or integration contract reference
 *   blockingReason  — policy rule reference or contract state that caused the block
 *   contextId       — the platform scope
 *
 * @see shared/constants/PlatformErrorCodeConstants.ts
 * @see domain/services/IntegrationCompatibilityService.ts
 * @see domain/services/NotificationRoutingPolicy.ts
 */

// TODO: implement createDeliveryNotAllowedError factory function
````

## File: modules/platform/domain/errors/createEntitlementDeniedError.ts
````typescript
/**
 * createEntitlementDeniedError — Error Factory
 *
 * Creates a typed domain error for the case where a capability action
 * is rejected because current entitlements do not permit it.
 *
 * Error fields:
 *   code       — "ENTITLEMENT_DENIED" (from PlatformErrorCodeConstants)
 *   capabilityKey — the capability that was denied
 *   planCode      — the current plan code at time of denial
 *   contextId     — the platform scope where denial occurred
 *
 * @see shared/constants/PlatformErrorCodeConstants.ts
 * @see domain/services/CapabilityEntitlementPolicy.ts
 */

// TODO: implement createEntitlementDeniedError factory function
````

## File: modules/platform/domain/errors/createPolicyConflictError.ts
````typescript
/**
 * createPolicyConflictError — Error Factory
 *
 * Creates a typed domain error for the case where the PolicyCatalog
 * contains rules that produce a contradictory decision for the same subject/resource.
 *
 * Error fields:
 *   code          — "POLICY_CONFLICT"
 *   conflictingRuleIds — list of ruleIds that conflict
 *   contextId         — the platform scope
 *   catalogRevision   — the revision where the conflict was detected
 *
 * @see shared/constants/PlatformErrorCodeConstants.ts
 * @see domain/services/PermissionResolutionService.ts
 */

// TODO: implement createPolicyConflictError factory function
````

## File: modules/platform/domain/errors/index.ts
````typescript
/**
 * platform shared errors placeholder module.
 */

export const PLATFORM_SHARED_ERROR_FACTORIES = [
	"createEntitlementDeniedError",
	"createPolicyConflictError",
	"createDeliveryNotAllowedError",
] as const;

export type PlatformSharedErrorFactory = (typeof PLATFORM_SHARED_ERROR_FACTORIES)[number];
````

## File: modules/platform/domain/events/AnalyticsEventRecordedEvent.ts
````typescript
/**
 * AnalyticsEventRecordedEvent
 *
 * Event type: "analytics.event_recorded"
 * Owner:      application layer (analytics)
 *
 * When emitted:
 *   An analytics event was recorded and aggregated.
 *
 * Core payload fields:
 *   eventName, metricRef, subjectRef
 *
 * Envelope fields (standard for all platform events):
 *   type, aggregateType, aggregateId, contextId,
 *   occurredAt (ISO 8601), version, correlationId, causationId, actorId, payload
 *
 * @see docs/domain-events.md — 發出事件
 * @see domain/events/index.ts — event type constant: ANALYTICS_EVENT_RECORDED_EVENT_TYPE
 */

// TODO: implement AnalyticsEventRecordedEvent payload type and factory function
````

## File: modules/platform/domain/events/AuditSignalRecordedEvent.ts
````typescript
/**
 * AuditSignalRecordedEvent
 *
 * Event type: "audit.signal_recorded"
 * Owner:      application layer (audit-log)
 *
 * When emitted:
 *   An immutable audit signal was written.
 *
 * Core payload fields:
 *   signalType, severity, subjectRef
 *
 * Envelope fields (standard for all platform events):
 *   type, aggregateType, aggregateId, contextId,
 *   occurredAt (ISO 8601), version, correlationId, causationId, actorId, payload
 *
 * @see docs/domain-events.md — 發出事件
 * @see domain/events/index.ts — event type constant: AUDIT_SIGNAL_RECORDED_EVENT_TYPE
 */

// TODO: implement AuditSignalRecordedEvent payload type and factory function
````

## File: modules/platform/domain/events/BackgroundJobEnqueuedEvent.ts
````typescript
/**
 * BackgroundJobEnqueuedEvent
 *
 * Event type: "background-job.enqueued"
 * Owner:      application layer (background-job)
 *
 * When emitted:
 *   A background job was submitted to the queue.
 *
 * Core payload fields:
 *   jobId, jobType, scheduleAt
 *
 * Envelope fields (standard for all platform events):
 *   type, aggregateType, aggregateId, contextId,
 *   occurredAt (ISO 8601), version, correlationId, causationId, actorId, payload
 *
 * @see docs/domain-events.md — 發出事件
 * @see domain/events/index.ts — event type constant: BACKGROUND_JOB_ENQUEUED_EVENT_TYPE
 */

// TODO: implement BackgroundJobEnqueuedEvent payload type and factory function
````

## File: modules/platform/domain/events/CompliancePolicyVerifiedEvent.ts
````typescript
/**
 * CompliancePolicyVerifiedEvent
 *
 * Event type: "compliance.policy_verified"
 * Owner:      application layer (compliance)
 *
 * When emitted:
 *   A compliance policy check passed or was updated.
 *
 * Core payload fields:
 *   policyRef, verificationResult, effectivePeriod
 *
 * Envelope fields (standard for all platform events):
 *   type, aggregateType, aggregateId, contextId,
 *   occurredAt (ISO 8601), version, correlationId, causationId, actorId, payload
 *
 * @see docs/domain-events.md — 發出事件
 * @see domain/events/index.ts — event type constant: COMPLIANCE_POLICY_VERIFIED_EVENT_TYPE
 */

// TODO: implement CompliancePolicyVerifiedEvent payload type and factory function
````

## File: modules/platform/domain/events/ConfigProfileAppliedEvent.ts
````typescript
/**
 * ConfigProfileAppliedEvent
 *
 * Event type: "config.profile_applied"
 * Owner:      PlatformContext (orchestration)
 *
 * When emitted:
 *   A configuration profile was successfully applied.
 *
 * Core payload fields:
 *   configurationProfileRef, changedKeys
 *
 * Envelope fields (standard for all platform events):
 *   type, aggregateType, aggregateId, contextId,
 *   occurredAt (ISO 8601), version, correlationId, causationId, actorId, payload
 *
 * @see docs/domain-events.md — 發出事件
 * @see domain/events/index.ts — event type constant: CONFIG_PROFILE_APPLIED_EVENT_TYPE
 */

// TODO: implement ConfigProfileAppliedEvent payload type and factory function
````

## File: modules/platform/domain/events/ContentAssetPublishedEvent.ts
````typescript
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
````

## File: modules/platform/domain/events/contracts/index.ts
````typescript
/**
 * platform event contracts projection.
 */

export * from "..";
````

## File: modules/platform/domain/events/index.ts
````typescript
/**
 * platform domain event language.
 *
 * Single source of truth for all platform event type constants.
 * events/contracts re-exports from here; do not define event types elsewhere.
 */

export interface PlatformDomainEvent<TPayload = Record<string, unknown>> {
	type: string;
	aggregateType: string;
	aggregateId: string;
	contextId: string;
	occurredAt: string;
	version: number;
	correlationId?: string;
	causationId?: string;
	actorId?: string;
	payload: TPayload;
}

// ─── PlatformContext aggregate events ────────────────────────────────────────
export const PLATFORM_CONTEXT_REGISTERED_EVENT_TYPE = "platform.context_registered" as const;
export const PLATFORM_CAPABILITY_ENABLED_EVENT_TYPE = "platform.capability_enabled" as const;
export const PLATFORM_CAPABILITY_DISABLED_EVENT_TYPE = "platform.capability_disabled" as const;

// ─── PolicyCatalog aggregate events ──────────────────────────────────────────
export const POLICY_CATALOG_PUBLISHED_EVENT_TYPE = "policy.catalog_published" as const;

// ─── Configuration events (PlatformContext orchestration) ────────────────────
export const CONFIG_PROFILE_APPLIED_EVENT_TYPE = "config.profile_applied" as const;

// ─── Permission domain service events ────────────────────────────────────────
export const PERMISSION_DECISION_RECORDED_EVENT_TYPE = "permission.decision_recorded" as const;

// ─── IntegrationContract aggregate events ────────────────────────────────────
export const INTEGRATION_CONTRACT_REGISTERED_EVENT_TYPE = "integration.contract_registered" as const;
export const INTEGRATION_DELIVERY_FAILED_EVENT_TYPE = "integration.delivery_failed" as const;

// ─── SubscriptionAgreement aggregate events ───────────────────────────────────
export const SUBSCRIPTION_AGREEMENT_ACTIVATED_EVENT_TYPE = "subscription.agreement_activated" as const;

// ─── Application-layer owned events ──────────────────────────────────────────
export const ONBOARDING_FLOW_COMPLETED_EVENT_TYPE = "onboarding.flow_completed" as const;
export const COMPLIANCE_POLICY_VERIFIED_EVENT_TYPE = "compliance.policy_verified" as const;
export const REFERRAL_REWARD_RECORDED_EVENT_TYPE = "referral.reward_recorded" as const;
export const WORKFLOW_TRIGGER_FIRED_EVENT_TYPE = "workflow.trigger_fired" as const;
export const BACKGROUND_JOB_ENQUEUED_EVENT_TYPE = "background-job.enqueued" as const;
export const CONTENT_ASSET_PUBLISHED_EVENT_TYPE = "content.asset_published" as const;
export const SEARCH_QUERY_EXECUTED_EVENT_TYPE = "search.query_executed" as const;
export const NOTIFICATION_DISPATCH_REQUESTED_EVENT_TYPE = "notification.dispatch_requested" as const;
export const AUDIT_SIGNAL_RECORDED_EVENT_TYPE = "audit.signal_recorded" as const;
export const OBSERVABILITY_SIGNAL_EMITTED_EVENT_TYPE = "observability.signal_emitted" as const;
export const ANALYTICS_EVENT_RECORDED_EVENT_TYPE = "analytics.event_recorded" as const;
export const SUPPORT_TICKET_OPENED_EVENT_TYPE = "support.ticket_opened" as const;

// ─── All-events catalogue ─────────────────────────────────────────────────────
export const PLATFORM_DOMAIN_EVENT_TYPES = [
	PLATFORM_CONTEXT_REGISTERED_EVENT_TYPE,
	PLATFORM_CAPABILITY_ENABLED_EVENT_TYPE,
	PLATFORM_CAPABILITY_DISABLED_EVENT_TYPE,
	POLICY_CATALOG_PUBLISHED_EVENT_TYPE,
	CONFIG_PROFILE_APPLIED_EVENT_TYPE,
	PERMISSION_DECISION_RECORDED_EVENT_TYPE,
	INTEGRATION_CONTRACT_REGISTERED_EVENT_TYPE,
	INTEGRATION_DELIVERY_FAILED_EVENT_TYPE,
	SUBSCRIPTION_AGREEMENT_ACTIVATED_EVENT_TYPE,
	ONBOARDING_FLOW_COMPLETED_EVENT_TYPE,
	COMPLIANCE_POLICY_VERIFIED_EVENT_TYPE,
	REFERRAL_REWARD_RECORDED_EVENT_TYPE,
	WORKFLOW_TRIGGER_FIRED_EVENT_TYPE,
	BACKGROUND_JOB_ENQUEUED_EVENT_TYPE,
	CONTENT_ASSET_PUBLISHED_EVENT_TYPE,
	SEARCH_QUERY_EXECUTED_EVENT_TYPE,
	NOTIFICATION_DISPATCH_REQUESTED_EVENT_TYPE,
	AUDIT_SIGNAL_RECORDED_EVENT_TYPE,
	OBSERVABILITY_SIGNAL_EMITTED_EVENT_TYPE,
	ANALYTICS_EVENT_RECORDED_EVENT_TYPE,
	SUPPORT_TICKET_OPENED_EVENT_TYPE,
] as const;

export type PlatformDomainEventType = (typeof PLATFORM_DOMAIN_EVENT_TYPES)[number];
````

## File: modules/platform/domain/events/IntegrationContractRegisteredEvent.ts
````typescript
/**
 * IntegrationContractRegisteredEvent
 *
 * Event type: "integration.contract_registered"
 * Owner:      IntegrationContract
 *
 * When emitted:
 *   An integration contract became active or was updated.
 *
 * Core payload fields:
 *   integrationContractId, protocol, endpointRef
 *
 * Envelope fields (standard for all platform events):
 *   type, aggregateType, aggregateId, contextId,
 *   occurredAt (ISO 8601), version, correlationId, causationId, actorId, payload
 *
 * @see docs/domain-events.md — 發出事件
 * @see domain/events/index.ts — event type constant: INTEGRATION_CONTRACT_REGISTERED_EVENT_TYPE
 */

// TODO: implement IntegrationContractRegisteredEvent payload type and factory function
````

## File: modules/platform/domain/events/IntegrationDeliveryFailedEvent.ts
````typescript
/**
 * IntegrationDeliveryFailedEvent
 *
 * Event type: "integration.delivery_failed"
 * Owner:      IntegrationContract
 *
 * When emitted:
 *   An external delivery attempt failed.
 *
 * Core payload fields:
 *   integrationContractId, deliveryAttempt, failureCode
 *
 * Envelope fields (standard for all platform events):
 *   type, aggregateType, aggregateId, contextId,
 *   occurredAt (ISO 8601), version, correlationId, causationId, actorId, payload
 *
 * @see docs/domain-events.md — 發出事件
 * @see domain/events/index.ts — event type constant: INTEGRATION_DELIVERY_FAILED_EVENT_TYPE
 */

// TODO: implement IntegrationDeliveryFailedEvent payload type and factory function
````

## File: modules/platform/domain/events/NotificationDispatchRequestedEvent.ts
````typescript
/**
 * NotificationDispatchRequestedEvent
 *
 * Event type: "notification.dispatch_requested"
 * Owner:      application layer (notification)
 *
 * When emitted:
 *   A notification dispatch request was created.
 *
 * Core payload fields:
 *   channel, recipientRef, templateKey
 *
 * Envelope fields (standard for all platform events):
 *   type, aggregateType, aggregateId, contextId,
 *   occurredAt (ISO 8601), version, correlationId, causationId, actorId, payload
 *
 * @see docs/domain-events.md — 發出事件
 * @see domain/events/index.ts — event type constant: NOTIFICATION_DISPATCH_REQUESTED_EVENT_TYPE
 */

// TODO: implement NotificationDispatchRequestedEvent payload type and factory function
````

## File: modules/platform/domain/events/ObservabilitySignalEmittedEvent.ts
````typescript
/**
 * ObservabilitySignalEmittedEvent
 *
 * Event type: "observability.signal_emitted"
 * Owner:      application layer (observability)
 *
 * When emitted:
 *   A metric, trace, or alert signal was emitted.
 *
 * Core payload fields:
 *   signalName, signalLevel, sourceRef
 *
 * Envelope fields (standard for all platform events):
 *   type, aggregateType, aggregateId, contextId,
 *   occurredAt (ISO 8601), version, correlationId, causationId, actorId, payload
 *
 * @see docs/domain-events.md — 發出事件
 * @see domain/events/index.ts — event type constant: OBSERVABILITY_SIGNAL_EMITTED_EVENT_TYPE
 */

// TODO: implement ObservabilitySignalEmittedEvent payload type and factory function
````

## File: modules/platform/domain/events/OnboardingFlowCompletedEvent.ts
````typescript
/**
 * OnboardingFlowCompletedEvent
 *
 * Event type: "onboarding.flow_completed"
 * Owner:      application layer (onboarding)
 *
 * When emitted:
 *   A new subject completed the primary onboarding flow.
 *
 * Core payload fields:
 *   onboardingId, subjectRef, completedSteps
 *
 * Envelope fields (standard for all platform events):
 *   type, aggregateType, aggregateId, contextId,
 *   occurredAt (ISO 8601), version, correlationId, causationId, actorId, payload
 *
 * @see docs/domain-events.md — 發出事件
 * @see domain/events/index.ts — event type constant: ONBOARDING_FLOW_COMPLETED_EVENT_TYPE
 */

// TODO: implement OnboardingFlowCompletedEvent payload type and factory function
````

## File: modules/platform/domain/events/PermissionDecisionRecordedEvent.ts
````typescript
/**
 * PermissionDecisionRecordedEvent
 *
 * Event type: "permission.decision_recorded"
 * Owner:      application layer (permission service)
 *
 * When emitted:
 *   A traceable authorization decision was completed.
 *
 * Core payload fields:
 *   decision, subjectRef, resourceRef
 *
 * Envelope fields (standard for all platform events):
 *   type, aggregateType, aggregateId, contextId,
 *   occurredAt (ISO 8601), version, correlationId, causationId, actorId, payload
 *
 * @see docs/domain-events.md — 發出事件
 * @see domain/events/index.ts — event type constant: PERMISSION_DECISION_RECORDED_EVENT_TYPE
 */

// TODO: implement PermissionDecisionRecordedEvent payload type and factory function
````

## File: modules/platform/domain/events/PlatformCapabilityDisabledEvent.ts
````typescript
/**
 * PlatformCapabilityDisabledEvent
 *
 * Event type: "platform.capability_disabled"
 * Owner:      PlatformContext
 *
 * When emitted:
 *   A capability was disabled in a platform scope.
 *
 * Core payload fields:
 *   capabilityKey, reason
 *
 * Envelope fields (standard for all platform events):
 *   type, aggregateType, aggregateId, contextId,
 *   occurredAt (ISO 8601), version, correlationId, causationId, actorId, payload
 *
 * @see docs/domain-events.md — 發出事件
 * @see domain/events/index.ts — event type constant: PLATFORM_CAPABILITY_DISABLED_EVENT_TYPE
 */

// TODO: implement PlatformCapabilityDisabledEvent payload type and factory function
````

## File: modules/platform/domain/events/PlatformCapabilityEnabledEvent.ts
````typescript
/**
 * PlatformCapabilityEnabledEvent
 *
 * Event type: "platform.capability_enabled"
 * Owner:      PlatformContext
 *
 * When emitted:
 *   A capability was enabled in a platform scope.
 *
 * Core payload fields:
 *   capabilityKey, entitlementRef
 *
 * Envelope fields (standard for all platform events):
 *   type, aggregateType, aggregateId, contextId,
 *   occurredAt (ISO 8601), version, correlationId, causationId, actorId, payload
 *
 * @see docs/domain-events.md — 發出事件
 * @see domain/events/index.ts — event type constant: PLATFORM_CAPABILITY_ENABLED_EVENT_TYPE
 */

// TODO: implement PlatformCapabilityEnabledEvent payload type and factory function
````

## File: modules/platform/domain/events/PlatformContextRegisteredEvent.ts
````typescript
/**
 * PlatformContextRegisteredEvent
 *
 * Event type: "platform.context_registered"
 * Owner:      PlatformContext
 *
 * When emitted:
 *   Platform scope creation is complete.
 *
 * Core payload fields:
 *   subjectScope, lifecycleState
 *
 * Envelope fields (standard for all platform events):
 *   type, aggregateType, aggregateId, contextId,
 *   occurredAt (ISO 8601), version, correlationId, causationId, actorId, payload
 *
 * @see docs/domain-events.md — 發出事件
 * @see domain/events/index.ts — event type constant: PLATFORM_CONTEXT_REGISTERED_EVENT_TYPE
 */

// TODO: implement PlatformContextRegisteredEvent payload type and factory function
````

## File: modules/platform/domain/events/PolicyCatalogPublishedEvent.ts
````typescript
/**
 * PolicyCatalogPublishedEvent
 *
 * Event type: "policy.catalog_published"
 * Owner:      PolicyCatalog
 *
 * When emitted:
 *   A new policy revision has taken effect.
 *
 * Core payload fields:
 *   policyCatalogId, revision
 *
 * Envelope fields (standard for all platform events):
 *   type, aggregateType, aggregateId, contextId,
 *   occurredAt (ISO 8601), version, correlationId, causationId, actorId, payload
 *
 * @see docs/domain-events.md — 發出事件
 * @see domain/events/index.ts — event type constant: POLICY_CATALOG_PUBLISHED_EVENT_TYPE
 */

// TODO: implement PolicyCatalogPublishedEvent payload type and factory function
````

## File: modules/platform/domain/events/published/buildPublishedEventEnvelope.ts
````typescript
/**
 * buildPublishedEventEnvelope — Published Event Builder
 *
 * Constructs the standard Published Language envelope for an outgoing platform event.
 * Every event emitted to downstream consumers must pass through this builder to guarantee
 * envelope consistency (version, schemaVersion, producerRef, publishedAt).
 *
 * Envelope fields added:
 *   schemaVersion  — published language schema version (semver string)
 *   producerRef    — platform module identifier
 *   publishedAt    — ISO 8601 emission timestamp
 *   correlationId  — from CorrelationContext (optional)
 *   causationId    — from originating command or event
 *
 * @see events/mappers/mapDomainEventToPublishedEvent.ts
 * @see docs/domain-events.md — Published Language envelope
 */

// TODO: implement buildPublishedEventEnvelope utility function
````

## File: modules/platform/domain/events/published/index.ts
````typescript
/**
 * platform published event placeholder module.
 */

export const PLATFORM_PUBLISHED_EVENT_FUNCTIONS = [
	"buildPublishedEventEnvelope",
	"publishSinglePlatformEvent",
	"publishBatchPlatformEvents",
] as const;

export type PlatformPublishedEventFunction = (typeof PLATFORM_PUBLISHED_EVENT_FUNCTIONS)[number];
````

## File: modules/platform/domain/events/published/publishBatchPlatformEvents.ts
````typescript
/**
 * publishBatchPlatformEvents — Batch Event Publisher Utility
 *
 * Publishes multiple platform domain events in a single DomainEventPublisher call.
 * Used when a command produces more than one domain event (e.g., capability enable + config applied).
 *
 * Rules:
 *   - Maps each event through buildPublishedEventEnvelope before dispatch
 *   - Preserves event order (emitted in the same order they were collected from the aggregate)
 *   - Must not publish a partial batch on failure; the caller decides retry strategy
 *
 * @see events/published/buildPublishedEventEnvelope.ts
 * @see ports/output/index.ts — DomainEventPublisher
 */

// TODO: implement publishBatchPlatformEvents utility function
````

## File: modules/platform/domain/events/published/publishSinglePlatformEvent.ts
````typescript
/**
 * publishSinglePlatformEvent — Single Event Publisher Utility
 *
 * Publishes one platform domain event via the DomainEventPublisher output port
 * after building the standard published envelope.
 *
 * Use this for atomic command side-effects (one command → one primary event).
 *
 * Rules:
 *   - Must call mapDomainEventToPublishedEvent before delegating to the port
 *   - Must not swallow DomainEventPublisher errors; propagate to the application layer
 *
 * @see events/published/buildPublishedEventEnvelope.ts
 * @see ports/output/index.ts — DomainEventPublisher
 */

// TODO: implement publishSinglePlatformEvent utility function
````

## File: modules/platform/domain/events/ReferralRewardRecordedEvent.ts
````typescript
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
````

## File: modules/platform/domain/events/SearchQueryExecutedEvent.ts
````typescript
/**
 * SearchQueryExecutedEvent
 *
 * Event type: "search.query_executed"
 * Owner:      application layer (search)
 *
 * When emitted:
 *   A search query was completed and produced results.
 *
 * Core payload fields:
 *   queryId, queryText, resultCount
 *
 * Envelope fields (standard for all platform events):
 *   type, aggregateType, aggregateId, contextId,
 *   occurredAt (ISO 8601), version, correlationId, causationId, actorId, payload
 *
 * @see docs/domain-events.md — 發出事件
 * @see domain/events/index.ts — event type constant: SEARCH_QUERY_EXECUTED_EVENT_TYPE
 */

// TODO: implement SearchQueryExecutedEvent payload type and factory function
````

## File: modules/platform/domain/events/SubscriptionAgreementActivatedEvent.ts
````typescript
/**
 * SubscriptionAgreementActivatedEvent
 *
 * Event type: "subscription.agreement_activated"
 * Owner:      SubscriptionAgreement
 *
 * When emitted:
 *   A subscription agreement entered active state.
 *
 * Core payload fields:
 *   subscriptionAgreementId, planCode, validUntil
 *
 * Envelope fields (standard for all platform events):
 *   type, aggregateType, aggregateId, contextId,
 *   occurredAt (ISO 8601), version, correlationId, causationId, actorId, payload
 *
 * @see docs/domain-events.md — 發出事件
 * @see domain/events/index.ts — event type constant: SUBSCRIPTION_AGREEMENT_ACTIVATED_EVENT_TYPE
 */

// TODO: implement SubscriptionAgreementActivatedEvent payload type and factory function
````

## File: modules/platform/domain/events/SupportTicketOpenedEvent.ts
````typescript
/**
 * SupportTicketOpenedEvent
 *
 * Event type: "support.ticket_opened"
 * Owner:      application layer (support)
 *
 * When emitted:
 *   A support ticket was created.
 *
 * Core payload fields:
 *   ticketId, priority, requesterRef
 *
 * Envelope fields (standard for all platform events):
 *   type, aggregateType, aggregateId, contextId,
 *   occurredAt (ISO 8601), version, correlationId, causationId, actorId, payload
 *
 * @see docs/domain-events.md — 發出事件
 * @see domain/events/index.ts — event type constant: SUPPORT_TICKET_OPENED_EVENT_TYPE
 */

// TODO: implement SupportTicketOpenedEvent payload type and factory function
````

## File: modules/platform/domain/events/WorkflowTriggerFiredEvent.ts
````typescript
/**
 * WorkflowTriggerFiredEvent
 *
 * Event type: "workflow.trigger_fired"
 * Owner:      application layer (workflow)
 *
 * When emitted:
 *   A workflow trigger was successfully emitted.
 *
 * Core payload fields:
 *   triggerKey, triggeredBy, triggeredAt
 *
 * Envelope fields (standard for all platform events):
 *   type, aggregateType, aggregateId, contextId,
 *   occurredAt (ISO 8601), version, correlationId, causationId, actorId, payload
 *
 * @see docs/domain-events.md — 發出事件
 * @see domain/events/index.ts — event type constant: WORKFLOW_TRIGGER_FIRED_EVENT_TYPE
 */

// TODO: implement WorkflowTriggerFiredEvent payload type and factory function
````

## File: modules/platform/domain/factories/createIntegrationContractAggregate.ts
````typescript
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
````

## File: modules/platform/domain/factories/createPlatformContextAggregate.ts
````typescript
/**
 * createPlatformContextAggregate — Domain Factory
 *
 * Constructs a new PlatformContext aggregate root from validated input.
 * This is the single place where aggregate creation invariants are enforced
 * before the aggregate is handed to the application layer.
 *
 * Responsibility:
 *   - Accept only validated, domain-typed input (not raw HTTP or DTO payloads)
 *   - Apply initial invariants (e.g., capabilities empty on creation)
 *   - Stamp the initial PlatformContextRegisteredEvent into the aggregate's event queue
 *   - Return the aggregate instance ready for persistence
 *
 * Used by: RegisterPlatformContextHandler (application layer)
 *
 * @see domain/aggregates/PlatformContext.ts
 * @see docs/aggregates.md — 聚合根工廠
 */

// TODO: implement createPlatformContextAggregate factory function
````

## File: modules/platform/domain/factories/createPolicyCatalogAggregate.ts
````typescript
/**
 * createPolicyCatalogAggregate — Domain Factory
 *
 * Constructs a new PolicyCatalog aggregate root from validated input.
 *
 * Responsibility:
 *   - Validate that permissionRules, workflowRules, notificationRules,
 *     and auditRules collectively do not contain conflicting effects
 *   - Assign initial revision = 1
 *   - Stamp PolicyCatalogPublishedEvent into the aggregate's event queue
 *
 * Used by: PublishPolicyCatalogHandler (application layer)
 *
 * @see domain/aggregates/PolicyCatalog.ts
 * @see docs/aggregates.md — 聚合根工廠
 */

// TODO: implement createPolicyCatalogAggregate factory function
````

## File: modules/platform/domain/factories/createSubscriptionAgreementAggregate.ts
````typescript
/**
 * createSubscriptionAgreementAggregate — Domain Factory
 *
 * Constructs a new SubscriptionAgreement aggregate root from validated input.
 *
 * Responsibility:
 *   - Derive Entitlement[] from planCode (must not deviate from plan definition)
 *   - Set initial billingState to "pending"
 *   - Stamp SubscriptionAgreementActivatedEvent into the aggregate's event queue
 *     once activation conditions are confirmed
 *
 * Used by: ActivateSubscriptionAgreementHandler (application layer)
 *
 * @see domain/aggregates/SubscriptionAgreement.ts
 * @see docs/aggregates.md — 聚合根工廠
 */

// TODO: implement createSubscriptionAgreementAggregate factory function
````

## File: modules/platform/domain/factories/index.ts
````typescript
/**
 * platform domain factory placeholder module.
 */

export const PLATFORM_DOMAIN_FACTORY_FUNCTIONS = [
	"createPlatformContextAggregate",
	"createPolicyCatalogAggregate",
	"createIntegrationContractAggregate",
	"createSubscriptionAgreementAggregate",
] as const;

export type PlatformDomainFactoryFunction = (typeof PLATFORM_DOMAIN_FACTORY_FUNCTIONS)[number];
````

## File: modules/platform/domain/index.ts
````typescript
/**
 * platform domain layer barrel.
 */

export * from "./aggregates";
export * from "./entities";
export * from "./value-objects";
export * from "./services";
export * from "./events";
````

## File: modules/platform/domain/ports/index.ts
````typescript
/**
 * platform ports barrel.
 */

export * from "./input";
export * from "./output";
````

## File: modules/platform/domain/ports/input/index.ts
````typescript
/**
 * platform input ports.
 */

import type { PlatformDomainEvent } from "../../events";

export type PlatformCommandName =
	| "registerPlatformContext"
	| "publishPolicyCatalog"
	| "applyConfigurationProfile"
	| "registerIntegrationContract"
	| "activateSubscriptionAgreement"
	| "fireWorkflowTrigger"
	| "requestNotificationDispatch"
	| "recordAuditSignal"
	| "emitObservabilitySignal";

export type PlatformQueryName =
	| "getPlatformContextView"
	| "listEnabledCapabilities"
	| "getPolicyCatalogView"
	| "getSubscriptionEntitlements"
	| "getWorkflowPolicyView";

export interface PlatformCommand<TName extends PlatformCommandName = PlatformCommandName, TPayload = unknown> {
	name: TName;
	payload: TPayload;
}

export interface PlatformQuery<TName extends PlatformQueryName = PlatformQueryName, TPayload = unknown> {
	name: TName;
	payload: TPayload;
}

export interface PlatformCommandResult {
	ok: boolean;
	code?: string;
	message?: string;
	metadata?: Record<string, unknown>;
}

export interface PlatformCommandPort {
	executeCommand<TCommand extends PlatformCommand>(command: TCommand): Promise<PlatformCommandResult>;
}

export interface PlatformQueryPort {
	executeQuery<TResult, TQuery extends PlatformQuery>(query: TQuery): Promise<TResult>;
}

export interface PlatformEventIngressPort {
	ingestEvent(event: PlatformDomainEvent): Promise<void>;
}
````

## File: modules/platform/domain/ports/input/PlatformCommandPort.ts
````typescript
/**
 * PlatformCommandPort — Input Port Interface
 *
 * The driving port for all command-oriented interactions with the platform module.
 * Implemented by: application/handlers/index.ts (command dispatch router)
 * Called by:      adapters/web/, adapters/cli/, api/facade.ts
 *
 * Contract:
 *   executeCommand<TCommand extends PlatformCommand>(command: TCommand): Promise<PlatformCommandResult>
 *
 * Invariants:
 *   - Commands are dispatched by name; the handler registry resolves the handler
 *   - Errors in business logic are returned as ok=false results, not thrown exceptions
 *   - The port interface itself has no knowledge of HTTP, CLI, or queue semantics
 *
 * @see ports/input/index.ts — re-exports this interface
 * @see application/handlers/ — implementations
 * @see docs/bounded-context.md — port contract rules
 */

// TODO: implement / re-export PlatformCommandPort interface
````

## File: modules/platform/domain/ports/input/PlatformEventIngressPort.ts
````typescript
/**
 * PlatformEventIngressPort — Input Port Interface
 *
 * The driving port for ingesting external domain events into the platform module.
 * Implemented by: events/routing/routeIngressEvent.ts
 * Called by:      QStash webhook route handler, test harnesses
 *
 * Contract:
 *   ingestEvent(event: PlatformDomainEvent): Promise<void>
 *
 * Invariants:
 *   - Ingestion is idempotent by eventId; re-processing the same event must be safe
 *   - The port itself does not validate payloads; events/ingress/ validates before calling
 *   - The port returns void; failures are expressed via thrown typed errors
 *
 * @see ports/input/index.ts — re-exports this interface
 * @see events/routing/routeIngressEvent.ts — implementation
 * @see docs/bounded-context.md — port contract rules
 */

// TODO: implement / re-export PlatformEventIngressPort interface
````

## File: modules/platform/domain/ports/input/PlatformQueryPort.ts
````typescript
/**
 * PlatformQueryPort — Input Port Interface
 *
 * The driving port for all query-oriented interactions with the platform module.
 * Implemented by: application/handlers/index.ts (query dispatch router)
 * Called by:      adapters/web/, api/facade.ts
 *
 * Contract:
 *   executeQuery<TResult, TQuery extends PlatformQuery>(query: TQuery): Promise<TResult>
 *
 * Invariants:
 *   - Query handlers never mutate state
 *   - Return types are read-model DTOs from application/dtos/
 *   - The port has no knowledge of HTTP status codes or pagination strategies
 *
 * @see ports/input/index.ts — re-exports this interface
 * @see application/handlers/ — implementations
 * @see docs/bounded-context.md — port contract rules
 */

// TODO: implement / re-export PlatformQueryPort interface
````

## File: modules/platform/domain/ports/output/AccountRepository.ts
````typescript
/**
 * AccountRepository — Subdomain Repository
 *
 * Account entity reference (owned by account subdomain)
 *
 * Contract methods:
 *   findById(accountId: string): Promise<unknown | null>
 *
 * Implemented by: infrastructure/ driven adapters
 * Used by:        application/handlers/ (injected at wire-up time)
 *
 * Rules:
 *   - Interface must remain framework-free (no Firebase, QStash, or HTTP types)
 *   - Implementations live in infrastructure/; the interface lives here
 *   - Do not extend this interface for convenience; add new ports for new concerns
 *
 * @see ports/output/index.ts — aggregated re-export
 * @see docs/repositories.md — full port catalogue
 */

// TODO: implement / re-export AccountRepository interface
````

## File: modules/platform/domain/ports/output/AnalyticsSink.ts
````typescript
/**
 * AnalyticsSink — Non-Repository Output Port
 *
 * Records analytics events to the analytics data store
 *
 * Contract methods:
 *   record(event: Record<string, unknown>): Promise<void>
 *
 * Implemented by: infrastructure/ driven adapters
 * Used by:        application/handlers/ (injected at wire-up time)
 *
 * Rules:
 *   - Interface must remain framework-free (no Firebase, QStash, or HTTP types)
 *   - Implementations live in infrastructure/; the interface lives here
 *   - Do not extend this interface for convenience; add new ports for new concerns
 *
 * @see ports/output/index.ts — aggregated re-export
 * @see docs/repositories.md — full port catalogue
 */

// TODO: implement / re-export AnalyticsSink interface
````

## File: modules/platform/domain/ports/output/AuditSignalStore.ts
````typescript
/**
 * AuditSignalStore — Non-Repository Output Port
 *
 * Writes immutable audit signals to the audit-log store
 *
 * Contract methods:
 *   write(signal: Record<string, unknown>): Promise<void>
 *
 * Implemented by: infrastructure/ driven adapters
 * Used by:        application/handlers/ (injected at wire-up time)
 *
 * Rules:
 *   - Interface must remain framework-free (no Firebase, QStash, or HTTP types)
 *   - Implementations live in infrastructure/; the interface lives here
 *   - Do not extend this interface for convenience; add new ports for new concerns
 *
 * @see ports/output/index.ts — aggregated re-export
 * @see docs/repositories.md — full port catalogue
 */

// TODO: implement / re-export AuditSignalStore interface
````

## File: modules/platform/domain/ports/output/CompliancePolicyStore.ts
````typescript
/**
 * CompliancePolicyStore — Subdomain Store
 *
 * Compliance policy reference (owned by compliance subdomain)
 *
 * Contract methods:
 *   getPolicy(policyRef: string): Promise<unknown | null>
 *
 * Implemented by: infrastructure/ driven adapters
 * Used by:        application/handlers/ (injected at wire-up time)
 *
 * Rules:
 *   - Interface must remain framework-free (no Firebase, QStash, or HTTP types)
 *   - Implementations live in infrastructure/; the interface lives here
 *   - Do not extend this interface for convenience; add new ports for new concerns
 *
 * @see ports/output/index.ts — aggregated re-export
 * @see docs/repositories.md — full port catalogue
 */

// TODO: implement / re-export CompliancePolicyStore interface
````

## File: modules/platform/domain/ports/output/ConfigurationProfileStore.ts
````typescript
/**
 * ConfigurationProfileStore — Support Port
 *
 * Read-only configuration profile store
 *
 * Contract methods:
 *   getProfile(profileRef: string): Promise<unknown | null>
 *
 * Implemented by: infrastructure/ driven adapters
 * Used by:        application/handlers/ (injected at wire-up time)
 *
 * Rules:
 *   - Interface must remain framework-free (no Firebase, QStash, or HTTP types)
 *   - Implementations live in infrastructure/; the interface lives here
 *   - Do not extend this interface for convenience; add new ports for new concerns
 *
 * @see ports/output/index.ts — aggregated re-export
 * @see docs/repositories.md — full port catalogue
 */

// TODO: implement / re-export ConfigurationProfileStore interface
````

## File: modules/platform/domain/ports/output/ContentRepository.ts
````typescript
/**
 * ContentRepository — Subdomain Repository
 *
 * Content asset reference (owned by content subdomain)
 *
 * Contract methods:
 *   findById(contentId: string): Promise<unknown | null>
 *
 * Implemented by: infrastructure/ driven adapters
 * Used by:        application/handlers/ (injected at wire-up time)
 *
 * Rules:
 *   - Interface must remain framework-free (no Firebase, QStash, or HTTP types)
 *   - Implementations live in infrastructure/; the interface lives here
 *   - Do not extend this interface for convenience; add new ports for new concerns
 *
 * @see ports/output/index.ts — aggregated re-export
 * @see docs/repositories.md — full port catalogue
 */

// TODO: implement / re-export ContentRepository interface
````

## File: modules/platform/domain/ports/output/DeliveryHistoryRepository.ts
````typescript
/**
 * DeliveryHistoryRepository — Query Port
 *
 * Read-only delivery history store
 *
 * Contract methods:
 *   listByContext(contextId: string): Promise<readonly unknown[]>
 *
 * Implemented by: infrastructure/ driven adapters
 * Used by:        application/handlers/ (injected at wire-up time)
 *
 * Rules:
 *   - Interface must remain framework-free (no Firebase, QStash, or HTTP types)
 *   - Implementations live in infrastructure/; the interface lives here
 *   - Do not extend this interface for convenience; add new ports for new concerns
 *
 * @see ports/output/index.ts — aggregated re-export
 * @see docs/repositories.md — full port catalogue
 */

// TODO: implement / re-export DeliveryHistoryRepository interface
````

## File: modules/platform/domain/ports/output/DomainEventPublisher.ts
````typescript
/**
 * DomainEventPublisher — Non-Repository Output Port
 *
 * Publishes platform domain events to QStash topics for downstream consumers
 *
 * Contract methods:
 *   publish(events: readonly PlatformDomainEvent[]): Promise<void>
 *
 * Implemented by: infrastructure/ driven adapters
 * Used by:        application/handlers/ (injected at wire-up time)
 *
 * Rules:
 *   - Interface must remain framework-free (no Firebase, QStash, or HTTP types)
 *   - Implementations live in infrastructure/; the interface lives here
 *   - Do not extend this interface for convenience; add new ports for new concerns
 *
 * @see ports/output/index.ts — aggregated re-export
 * @see docs/repositories.md — full port catalogue
 */

// TODO: implement / re-export DomainEventPublisher interface
````

## File: modules/platform/domain/ports/output/ExternalSystemGateway.ts
````typescript
/**
 * ExternalSystemGateway — Non-Repository Output Port
 *
 * Makes calls to external integrated systems (webhook, HTTP, queue)
 *
 * Contract methods:
 *   call(request: Record<string, unknown>): Promise<PlatformCommandResult>
 *
 * Implemented by: infrastructure/ driven adapters
 * Used by:        application/handlers/ (injected at wire-up time)
 *
 * Rules:
 *   - Interface must remain framework-free (no Firebase, QStash, or HTTP types)
 *   - Implementations live in infrastructure/; the interface lives here
 *   - Do not extend this interface for convenience; add new ports for new concerns
 *
 * @see ports/output/index.ts — aggregated re-export
 * @see docs/repositories.md — full port catalogue
 */

// TODO: implement / re-export ExternalSystemGateway interface
````

## File: modules/platform/domain/ports/output/index.ts
````typescript
/**
 * platform output ports.
 */

import type { PlatformCommandResult } from "../input";
import type { PlatformDomainEvent } from "../../events";

export interface PlatformContextRepository {
	findById(contextId: string): Promise<unknown | null>;
	save(context: unknown): Promise<void>;
}

export interface PolicyCatalogRepository {
	findActiveByContextId(contextId: string): Promise<unknown | null>;
	saveRevision(catalog: unknown): Promise<void>;
}

export interface IntegrationContractRepository {
	findById(integrationContractId: string): Promise<unknown | null>;
	save(contract: unknown): Promise<void>;
}

export interface SubscriptionAgreementRepository {
	findEffectiveByContextId(contextId: string): Promise<unknown | null>;
	save(agreement: unknown): Promise<void>;
}

export interface AccountRepository {
	findById(accountId: string): Promise<unknown | null>;
}

export interface OnboardingRepository {
	findById(onboardingId: string): Promise<unknown | null>;
}

export interface CompliancePolicyStore {
	getPolicy(policyRef: string): Promise<unknown | null>;
}

export interface ReferralRepository {
	findById(referralId: string): Promise<unknown | null>;
}

export interface ContentRepository {
	findById(contentId: string): Promise<unknown | null>;
}

export interface SupportRepository {
	findById(ticketId: string): Promise<unknown | null>;
}

export interface PlatformContextView {
	contextId: string;
	lifecycleState: string;
	capabilityKeys: string[];
}

export interface PolicyCatalogView {
	contextId: string;
	revision: number;
	permissionRuleCount: number;
	workflowRuleCount: number;
	notificationRuleCount: number;
	auditRuleCount: number;
}

export interface SubscriptionEntitlementsView {
	contextId: string;
	planCode: string;
	entitlements: string[];
	usageLimits: string[];
}

export interface WorkflowPolicyView {
	contextId: string;
	triggerKey: string;
	enabled: boolean;
}

export interface PlatformContextViewRepository {
	getView(contextId: string): Promise<PlatformContextView | null>;
}

export interface PolicyCatalogViewRepository {
	getView(contextId: string): Promise<PolicyCatalogView | null>;
}

export interface UsageMeterRepository {
	getEntitlementsView(contextId: string): Promise<SubscriptionEntitlementsView | null>;
}

export interface DeliveryHistoryRepository {
	listByContext(contextId: string): Promise<readonly unknown[]>;
}

export interface WorkflowPolicyRepository {
	getView(contextId: string, triggerKey: string): Promise<WorkflowPolicyView | null>;
}

export interface ConfigurationProfileStore {
	getProfile(profileRef: string): Promise<unknown | null>;
}

export interface SubjectDirectory {
	getSubject(subjectId: string): Promise<unknown | null>;
}

export interface SecretReferenceResolver {
	resolve(secretRef: string): Promise<string>;
}

export interface DomainEventPublisher {
	publish(events: readonly PlatformDomainEvent[]): Promise<void>;
}

export interface WorkflowDispatcherPort {
	dispatch(triggerKey: string, payload: Record<string, unknown>): Promise<PlatformCommandResult>;
}

export interface NotificationGateway {
	dispatch(request: Record<string, unknown>): Promise<PlatformCommandResult>;
}

export interface AuditSignalStore {
	write(signal: Record<string, unknown>): Promise<void>;
}

export interface ObservabilitySink {
	emit(signal: Record<string, unknown>): Promise<void>;
}

export interface AnalyticsSink {
	record(event: Record<string, unknown>): Promise<void>;
}

export interface ExternalSystemGateway {
	call(request: Record<string, unknown>): Promise<PlatformCommandResult>;
}

export interface JobQueuePort {
	enqueue(job: Record<string, unknown>): Promise<PlatformCommandResult>;
}

export interface SearchIndexPort {
	index(document: Record<string, unknown>): Promise<void>;
}
````

## File: modules/platform/domain/ports/output/IntegrationContractRepository.ts
````typescript
/**
 * IntegrationContractRepository — Aggregate Repository
 *
 * IntegrationContract aggregate root
 *
 * Contract methods:
 *   findById(integrationContractId: string): Promise<IntegrationContract | null>
 *   save(contract: IntegrationContract): Promise<void>
 *
 * Implemented by: infrastructure/ driven adapters
 * Used by:        application/handlers/ (injected at wire-up time)
 *
 * Rules:
 *   - Interface must remain framework-free (no Firebase, QStash, or HTTP types)
 *   - Implementations live in infrastructure/; the interface lives here
 *   - Do not extend this interface for convenience; add new ports for new concerns
 *
 * @see ports/output/index.ts — aggregated re-export
 * @see docs/repositories.md — full port catalogue
 */

// TODO: implement / re-export IntegrationContractRepository interface
````

## File: modules/platform/domain/ports/output/JobQueuePort.ts
````typescript
/**
 * JobQueuePort — Non-Repository Output Port
 *
 * Enqueues background jobs into the QStash job queue
 *
 * Contract methods:
 *   enqueue(job: Record<string, unknown>): Promise<PlatformCommandResult>
 *
 * Implemented by: infrastructure/ driven adapters
 * Used by:        application/handlers/ (injected at wire-up time)
 *
 * Rules:
 *   - Interface must remain framework-free (no Firebase, QStash, or HTTP types)
 *   - Implementations live in infrastructure/; the interface lives here
 *   - Do not extend this interface for convenience; add new ports for new concerns
 *
 * @see ports/output/index.ts — aggregated re-export
 * @see docs/repositories.md — full port catalogue
 */

// TODO: implement / re-export JobQueuePort interface
````

## File: modules/platform/domain/ports/output/NotificationGateway.ts
````typescript
/**
 * NotificationGateway — Non-Repository Output Port
 *
 * Delivers notifications (email, SMS, push) via the appropriate channel adapter
 *
 * Contract methods:
 *   dispatch(request: Record<string, unknown>): Promise<PlatformCommandResult>
 *
 * Implemented by: infrastructure/ driven adapters
 * Used by:        application/handlers/ (injected at wire-up time)
 *
 * Rules:
 *   - Interface must remain framework-free (no Firebase, QStash, or HTTP types)
 *   - Implementations live in infrastructure/; the interface lives here
 *   - Do not extend this interface for convenience; add new ports for new concerns
 *
 * @see ports/output/index.ts — aggregated re-export
 * @see docs/repositories.md — full port catalogue
 */

// TODO: implement / re-export NotificationGateway interface
````

## File: modules/platform/domain/ports/output/ObservabilitySink.ts
````typescript
/**
 * ObservabilitySink — Non-Repository Output Port
 *
 * Emits observability signals (metrics, traces, alerts) to the monitoring backend
 *
 * Contract methods:
 *   emit(signal: Record<string, unknown>): Promise<void>
 *
 * Implemented by: infrastructure/ driven adapters
 * Used by:        application/handlers/ (injected at wire-up time)
 *
 * Rules:
 *   - Interface must remain framework-free (no Firebase, QStash, or HTTP types)
 *   - Implementations live in infrastructure/; the interface lives here
 *   - Do not extend this interface for convenience; add new ports for new concerns
 *
 * @see ports/output/index.ts — aggregated re-export
 * @see docs/repositories.md — full port catalogue
 */

// TODO: implement / re-export ObservabilitySink interface
````

## File: modules/platform/domain/ports/output/OnboardingRepository.ts
````typescript
/**
 * OnboardingRepository — Subdomain Repository
 *
 * Onboarding record reference (owned by onboarding subdomain)
 *
 * Contract methods:
 *   findById(onboardingId: string): Promise<unknown | null>
 *
 * Implemented by: infrastructure/ driven adapters
 * Used by:        application/handlers/ (injected at wire-up time)
 *
 * Rules:
 *   - Interface must remain framework-free (no Firebase, QStash, or HTTP types)
 *   - Implementations live in infrastructure/; the interface lives here
 *   - Do not extend this interface for convenience; add new ports for new concerns
 *
 * @see ports/output/index.ts — aggregated re-export
 * @see docs/repositories.md — full port catalogue
 */

// TODO: implement / re-export OnboardingRepository interface
````

## File: modules/platform/domain/ports/output/PlatformContextRepository.ts
````typescript
/**
 * PlatformContextRepository — Aggregate Repository
 *
 * PlatformContext aggregate root
 *
 * Contract methods:
 *   findById(contextId: string): Promise<PlatformContext | null>
 *   save(context: PlatformContext): Promise<void>
 *
 * Implemented by: infrastructure/ driven adapters
 * Used by:        application/handlers/ (injected at wire-up time)
 *
 * Rules:
 *   - Interface must remain framework-free (no Firebase, QStash, or HTTP types)
 *   - Implementations live in infrastructure/; the interface lives here
 *   - Do not extend this interface for convenience; add new ports for new concerns
 *
 * @see ports/output/index.ts — aggregated re-export
 * @see docs/repositories.md — full port catalogue
 */

// TODO: implement / re-export PlatformContextRepository interface
````

## File: modules/platform/domain/ports/output/PlatformContextViewRepository.ts
````typescript
/**
 * PlatformContextViewRepository — Query Port
 *
 * Read-only PlatformContextView projection store
 *
 * Contract methods:
 *   getView(contextId: string): Promise<PlatformContextView | null>
 *
 * Implemented by: infrastructure/ driven adapters
 * Used by:        application/handlers/ (injected at wire-up time)
 *
 * Rules:
 *   - Interface must remain framework-free (no Firebase, QStash, or HTTP types)
 *   - Implementations live in infrastructure/; the interface lives here
 *   - Do not extend this interface for convenience; add new ports for new concerns
 *
 * @see ports/output/index.ts — aggregated re-export
 * @see docs/repositories.md — full port catalogue
 */

// TODO: implement / re-export PlatformContextViewRepository interface
````

## File: modules/platform/domain/ports/output/PolicyCatalogRepository.ts
````typescript
/**
 * PolicyCatalogRepository — Aggregate Repository
 *
 * PolicyCatalog aggregate root
 *
 * Contract methods:
 *   findActiveByContextId(contextId: string): Promise<PolicyCatalog | null>
 *   saveRevision(catalog: PolicyCatalog): Promise<void>
 *
 * Implemented by: infrastructure/ driven adapters
 * Used by:        application/handlers/ (injected at wire-up time)
 *
 * Rules:
 *   - Interface must remain framework-free (no Firebase, QStash, or HTTP types)
 *   - Implementations live in infrastructure/; the interface lives here
 *   - Do not extend this interface for convenience; add new ports for new concerns
 *
 * @see ports/output/index.ts — aggregated re-export
 * @see docs/repositories.md — full port catalogue
 */

// TODO: implement / re-export PolicyCatalogRepository interface
````

## File: modules/platform/domain/ports/output/PolicyCatalogViewRepository.ts
````typescript
/**
 * PolicyCatalogViewRepository — Query Port
 *
 * Read-only PolicyCatalogView projection store
 *
 * Contract methods:
 *   getView(contextId: string): Promise<PolicyCatalogView | null>
 *
 * Implemented by: infrastructure/ driven adapters
 * Used by:        application/handlers/ (injected at wire-up time)
 *
 * Rules:
 *   - Interface must remain framework-free (no Firebase, QStash, or HTTP types)
 *   - Implementations live in infrastructure/; the interface lives here
 *   - Do not extend this interface for convenience; add new ports for new concerns
 *
 * @see ports/output/index.ts — aggregated re-export
 * @see docs/repositories.md — full port catalogue
 */

// TODO: implement / re-export PolicyCatalogViewRepository interface
````

## File: modules/platform/domain/ports/output/ReferralRepository.ts
````typescript
/**
 * ReferralRepository — Subdomain Repository
 *
 * Referral record reference (owned by referral subdomain)
 *
 * Contract methods:
 *   findById(referralId: string): Promise<unknown | null>
 *
 * Implemented by: infrastructure/ driven adapters
 * Used by:        application/handlers/ (injected at wire-up time)
 *
 * Rules:
 *   - Interface must remain framework-free (no Firebase, QStash, or HTTP types)
 *   - Implementations live in infrastructure/; the interface lives here
 *   - Do not extend this interface for convenience; add new ports for new concerns
 *
 * @see ports/output/index.ts — aggregated re-export
 * @see docs/repositories.md — full port catalogue
 */

// TODO: implement / re-export ReferralRepository interface
````

## File: modules/platform/domain/ports/output/SearchIndexPort.ts
````typescript
/**
 * SearchIndexPort — Non-Repository Output Port
 *
 * Indexes documents for platform-wide search via the search subdomain
 *
 * Contract methods:
 *   index(document: Record<string, unknown>): Promise<void>
 *
 * Implemented by: infrastructure/ driven adapters
 * Used by:        application/handlers/ (injected at wire-up time)
 *
 * Rules:
 *   - Interface must remain framework-free (no Firebase, QStash, or HTTP types)
 *   - Implementations live in infrastructure/; the interface lives here
 *   - Do not extend this interface for convenience; add new ports for new concerns
 *
 * @see ports/output/index.ts — aggregated re-export
 * @see docs/repositories.md — full port catalogue
 */

// TODO: implement / re-export SearchIndexPort interface
````

## File: modules/platform/domain/ports/output/SecretReferenceResolver.ts
````typescript
/**
 * SecretReferenceResolver — Support Port
 *
 * Resolves opaque SecretReference to the actual credential at runtime
 *
 * Contract methods:
 *   resolve(secretRef: string): Promise<string>
 *
 * Implemented by: infrastructure/ driven adapters
 * Used by:        application/handlers/ (injected at wire-up time)
 *
 * Rules:
 *   - Interface must remain framework-free (no Firebase, QStash, or HTTP types)
 *   - Implementations live in infrastructure/; the interface lives here
 *   - Do not extend this interface for convenience; add new ports for new concerns
 *
 * @see ports/output/index.ts — aggregated re-export
 * @see docs/repositories.md — full port catalogue
 */

// TODO: implement / re-export SecretReferenceResolver interface
````

## File: modules/platform/domain/ports/output/SubjectDirectory.ts
````typescript
/**
 * SubjectDirectory — Support Port
 *
 * Read-only subject (actor/account) reference store
 *
 * Contract methods:
 *   getSubject(subjectId: string): Promise<unknown | null>
 *
 * Implemented by: infrastructure/ driven adapters
 * Used by:        application/handlers/ (injected at wire-up time)
 *
 * Rules:
 *   - Interface must remain framework-free (no Firebase, QStash, or HTTP types)
 *   - Implementations live in infrastructure/; the interface lives here
 *   - Do not extend this interface for convenience; add new ports for new concerns
 *
 * @see ports/output/index.ts — aggregated re-export
 * @see docs/repositories.md — full port catalogue
 */

// TODO: implement / re-export SubjectDirectory interface
````

## File: modules/platform/domain/ports/output/SubscriptionAgreementRepository.ts
````typescript
/**
 * SubscriptionAgreementRepository — Aggregate Repository
 *
 * SubscriptionAgreement aggregate root
 *
 * Contract methods:
 *   findEffectiveByContextId(contextId: string): Promise<SubscriptionAgreement | null>
 *   save(agreement: SubscriptionAgreement): Promise<void>
 *
 * Implemented by: infrastructure/ driven adapters
 * Used by:        application/handlers/ (injected at wire-up time)
 *
 * Rules:
 *   - Interface must remain framework-free (no Firebase, QStash, or HTTP types)
 *   - Implementations live in infrastructure/; the interface lives here
 *   - Do not extend this interface for convenience; add new ports for new concerns
 *
 * @see ports/output/index.ts — aggregated re-export
 * @see docs/repositories.md — full port catalogue
 */

// TODO: implement / re-export SubscriptionAgreementRepository interface
````

## File: modules/platform/domain/ports/output/SupportRepository.ts
````typescript
/**
 * SupportRepository — Subdomain Repository
 *
 * Support ticket reference (owned by support subdomain)
 *
 * Contract methods:
 *   findById(ticketId: string): Promise<unknown | null>
 *
 * Implemented by: infrastructure/ driven adapters
 * Used by:        application/handlers/ (injected at wire-up time)
 *
 * Rules:
 *   - Interface must remain framework-free (no Firebase, QStash, or HTTP types)
 *   - Implementations live in infrastructure/; the interface lives here
 *   - Do not extend this interface for convenience; add new ports for new concerns
 *
 * @see ports/output/index.ts — aggregated re-export
 * @see docs/repositories.md — full port catalogue
 */

// TODO: implement / re-export SupportRepository interface
````

## File: modules/platform/domain/ports/output/UsageMeterRepository.ts
````typescript
/**
 * UsageMeterRepository — Query Port
 *
 * Read-only subscription entitlements view store
 *
 * Contract methods:
 *   getEntitlementsView(contextId: string): Promise<SubscriptionEntitlementsView | null>
 *
 * Implemented by: infrastructure/ driven adapters
 * Used by:        application/handlers/ (injected at wire-up time)
 *
 * Rules:
 *   - Interface must remain framework-free (no Firebase, QStash, or HTTP types)
 *   - Implementations live in infrastructure/; the interface lives here
 *   - Do not extend this interface for convenience; add new ports for new concerns
 *
 * @see ports/output/index.ts — aggregated re-export
 * @see docs/repositories.md — full port catalogue
 */

// TODO: implement / re-export UsageMeterRepository interface
````

## File: modules/platform/domain/ports/output/WorkflowDispatcherPort.ts
````typescript
/**
 * WorkflowDispatcherPort — Non-Repository Output Port
 *
 * Dispatches workflow triggers to the QStash workflow executor
 *
 * Contract methods:
 *   dispatch(triggerKey: string, payload: Record<string, unknown>): Promise<PlatformCommandResult>
 *
 * Implemented by: infrastructure/ driven adapters
 * Used by:        application/handlers/ (injected at wire-up time)
 *
 * Rules:
 *   - Interface must remain framework-free (no Firebase, QStash, or HTTP types)
 *   - Implementations live in infrastructure/; the interface lives here
 *   - Do not extend this interface for convenience; add new ports for new concerns
 *
 * @see ports/output/index.ts — aggregated re-export
 * @see docs/repositories.md — full port catalogue
 */

// TODO: implement / re-export WorkflowDispatcherPort interface
````

## File: modules/platform/domain/ports/output/WorkflowPolicyRepository.ts
````typescript
/**
 * WorkflowPolicyRepository — Query Port
 *
 * Read-only workflow policy view store
 *
 * Contract methods:
 *   getView(contextId: string, triggerKey: string): Promise<WorkflowPolicyView | null>
 *
 * Implemented by: infrastructure/ driven adapters
 * Used by:        application/handlers/ (injected at wire-up time)
 *
 * Rules:
 *   - Interface must remain framework-free (no Firebase, QStash, or HTTP types)
 *   - Implementations live in infrastructure/; the interface lives here
 *   - Do not extend this interface for convenience; add new ports for new concerns
 *
 * @see ports/output/index.ts — aggregated re-export
 * @see docs/repositories.md — full port catalogue
 */

// TODO: implement / re-export WorkflowPolicyRepository interface
````

## File: modules/platform/domain/services/assert-never.ts
````typescript
/**
 * assertNever — exhaustive union check utility.
 *
 * TypeScript compile-time guard: throws a runtime Error if a discriminated
 * union branch is reached that should be unreachable.  Useful in domain
 * switch/if chains to guarantee all variants of a discriminated type are
 * handled.
 *
 * Usage:
 *   switch (state) {
 *     case "active":  ...
 *     case "draft":   ...
 *     default: assertNever(state); // compile error when new states are added
 *   }
 *
 * @see shared/value-objects/PlatformLifecycleState.ts — example usage
 */
export function assertNever(value: never): never {
	throw new Error(`Unexpected value: ${JSON.stringify(value)}`);
}
````

## File: modules/platform/domain/services/AuditClassificationService.ts
````typescript
/**
 * AuditClassificationService — Domain Service
 *
 * Determines what kind of audit record a given behavior or decision requires,
 * and at what severity/retention level.
 *
 * Inputs:  AuditSignal, PolicyCatalog
 * Returns: AuditClassification
 *
 * @see docs/domain-services.md — Domain Services 清單
 * @see docs/ubiquitous-language.md — 稽核分類
 */

// TODO: implement AuditClassificationService domain service
````

## File: modules/platform/domain/services/CapabilityEntitlementPolicy.ts
````typescript
/**
 * CapabilityEntitlementPolicy — Domain Service
 *
 * Evaluates whether a platform capability can be activated given the
 * current SubscriptionAgreement entitlements.
 *
 * Inputs:  PlatformCapability, SubscriptionAgreement
 * Returns: DeliveryAllowance | PlanConstraint (never a loose boolean)
 *
 * Cross-aggregate rule: spans PlatformContext and SubscriptionAgreement.
 * Stateless — all inputs supplied by application service via output ports.
 *
 * @see docs/domain-services.md — Domain Services 清單
 */

// TODO: implement CapabilityEntitlementPolicy domain service
````

## File: modules/platform/domain/services/ConfigurationCompositionService.ts
````typescript
/**
 * ConfigurationCompositionService — Domain Service
 *
 * Assembles a single effective configuration view from multiple layers:
 * ConfigurationProfile, PolicyCatalog, and SubscriptionAgreement constraints.
 *
 * Inputs:  ConfigurationProfile, PolicyCatalog, SubscriptionAgreement
 * Returns: effective configuration view (domain-typed, not adapter-typed)
 *
 * @see docs/domain-services.md — Domain Services 清單
 */

// TODO: implement ConfigurationCompositionService domain service
````

## File: modules/platform/domain/services/index.ts
````typescript
/**
 * platform domain services barrel.
 *
 * Domain Services carry business rules and invariants that cannot naturally
 * fall on a single Entity or Value Object.
 */

export { assertNever } from "./assert-never";
export { toIsoTimestamp } from "./to-iso-timestamp";
````

## File: modules/platform/domain/services/IntegrationCompatibilityService.ts
````typescript
/**
 * IntegrationCompatibilityService — Domain Service
 *
 * Validates whether an IntegrationContract is compatible with
 * the current policy, subscription plan, and protocol constraints.
 *
 * Inputs:  IntegrationContract, SubscriptionAgreement, PolicyCatalog
 * Returns: DeliveryAllowance
 *
 * @see docs/domain-services.md — Domain Services 清單
 */

// TODO: implement IntegrationCompatibilityService domain service
````

## File: modules/platform/domain/services/NotificationRoutingPolicy.ts
````typescript
/**
 * NotificationRoutingPolicy — Domain Service
 *
 * Decides which channel a notification should travel through,
 * and whether it should be suppressed based on policy and subject preferences.
 *
 * Inputs:  NotificationDispatch, PolicyCatalog, SubjectPreference
 * Returns: NotificationRoute | suppression decision
 *
 * @see docs/domain-services.md — Domain Services 清單
 * @see docs/ubiquitous-language.md — 通知路由
 */

// TODO: implement NotificationRoutingPolicy domain service
````

## File: modules/platform/domain/services/ObservabilityCorrelationService.ts
````typescript
/**
 * ObservabilityCorrelationService — Domain Service
 *
 * Correlates signals from workflow, integration, notification, and audit
 * into a traceable chain using CorrelationContext.
 *
 * Inputs:  ObservabilitySignal, CorrelationContext
 * Returns: correlated signal (domain-typed)
 *
 * @see docs/domain-services.md — Domain Services 清單
 * @see docs/ubiquitous-language.md — 關聯上下文
 */

// TODO: implement ObservabilityCorrelationService domain service
````

## File: modules/platform/domain/services/PermissionResolutionService.ts
````typescript
/**
 * PermissionResolutionService — Domain Service
 *
 * Resolves a PermissionDecision based on subject scope, active policy catalog,
 * and resource descriptor.
 *
 * Inputs:  SubjectScope, PolicyCatalog, ResourceDescriptor
 * Returns: PermissionDecision (allow | deny | conditional_allow | escalate)
 *
 * Cross-aggregate rule: spans SubjectScope and PolicyCatalog.
 * Errors describe governance semantics: entitlement_denied, policy_conflict.
 *
 * @see docs/domain-services.md — Domain Services 清單
 * @see docs/ubiquitous-language.md — 權限決策
 */

// TODO: implement PermissionResolutionService domain service
````

## File: modules/platform/domain/services/to-iso-timestamp.ts
````typescript
/**
 * toIsoTimestamp — convert a Date or Unix ms timestamp to an ISO 8601 string.
 *
 * All `occurredAt` and `publishedAt` fields in the platform domain must use
 * ISO 8601 strings, never Date objects, to ensure safe serialisation across
 * the server/client boundary.  This is a domain-level invariant.
 *
 * @see instructions — occurredAt must be ISO string (not Date)
 */
export function toIsoTimestamp(value: Date | number): string {
	const date = typeof value === "number" ? new Date(value) : value;
	return date.toISOString();
}
````

## File: modules/platform/domain/services/WorkflowDispatchPolicy.ts
````typescript
/**
 * WorkflowDispatchPolicy — Domain Service
 *
 * Determines whether a workflow trigger should be allowed, delayed,
 * suppressed, or escalated given current policy and permission state.
 *
 * Inputs:  WorkflowTrigger, PolicyCatalog, PermissionDecision
 * Returns: dispatch decision (domain-typed decision object)
 *
 * @see docs/domain-services.md — Domain Services 清單
 * @see docs/ubiquitous-language.md — 工作流觸發器
 */

// TODO: implement WorkflowDispatchPolicy domain service
````

## File: modules/platform/domain/types/CorrelationContext.ts
````typescript
/**
 * CorrelationContext — Shared Type
 *
 * Carries correlation and causation identifiers through the platform's
 * event chain for distributed tracing and audit.
 *
 * Fields:
 *   correlationId — string UUID; shared across all events in a single user action chain
 *   causationId   — string UUID; the eventId or commandId that directly caused this event
 *   actorId       — the authenticated subject identifier (user, service account)
 *   sessionId     — optional browser session identifier (for web-originated commands)
 *
 * Conventions:
 *   - Passed through application service method signatures, not via global context
 *   - All published events must include correlationId and causationId
 *   - Do not store CorrelationContext in aggregates; it is a transport concern
 *
 * @see shared/utils/buildCorrelationId.ts
 * @see shared/utils/buildCausationId.ts
 * @see docs/ubiquitous-language.md — 關聯上下文
 */

// TODO: implement CorrelationContext type interface
````

## File: modules/platform/domain/types/DispatchOutcome.ts
````typescript
/**
 * DispatchOutcome — Shared Type
 *
 * Represents the normalised result of an external delivery attempt.
 * Abstracts protocol-specific responses (HTTP status, queue ACK, error codes)
 * into a single domain-visible outcome type.
 *
 * Values:
 *   success  — delivery confirmed by the external system
 *   failure  — external system rejected or did not acknowledge
 *   partial  — partial delivery (e.g., some batch items failed)
 *   unknown  — no response received within timeout
 *
 * Fields:
 *   outcome      — "success" | "failure" | "partial" | "unknown"
 *   failureCode  — optional protocol-level failure code
 *   attemptAt    — ISO 8601 timestamp of the delivery attempt
 *
 * @see adapters/external/mapExternalResponseToDispatchOutcome.ts
 * @see domain/entities/DispatchContextEntity.ts
 */

// TODO: implement DispatchOutcome discriminated union type
````

## File: modules/platform/domain/types/index.ts
````typescript
/**
 * platform shared types placeholder module.
 */

export const PLATFORM_SHARED_TYPE_GROUPS = [
	"CorrelationContextType",
	"ResourceDescriptorType",
	"DispatchOutcomeType",
] as const;

export type PlatformSharedTypeGroup = (typeof PLATFORM_SHARED_TYPE_GROUPS)[number];
````

## File: modules/platform/domain/types/ResourceDescriptor.ts
````typescript
/**
 * ResourceDescriptor — Shared Type
 *
 * A uniform descriptor for any resource that a permission rule or audit signal
 * refers to. Allows the permission system to be resource-type agnostic.
 *
 * Fields:
 *   resourceType — e.g., "workspace", "knowledge-base", "integration-contract"
 *   resourceId   — stable identifier of the resource
 *   contextId    — owning platform context
 *
 * @see domain/services/PermissionResolutionService.ts
 * @see domain/value-objects/PermissionDecision.ts
 * @see docs/ubiquitous-language.md — 資源描述符
 */

// TODO: implement ResourceDescriptor type interface
````

## File: modules/platform/domain/value-objects/AuditClassification.ts
````typescript
/**
 * AuditClassification — Value Object / Decision Object
 *
 * Determines what kind of audit trail a given behavior or decision requires.
 * Contains: severity level, retention requirement, and classification category.
 *
 * Used by: AuditClassificationService, audit-log subdomain
 * @see docs/aggregates.md — 主要值物件
 * @see docs/domain-services.md — 主要 Decision Objects
 */

// TODO: implement AuditClassification value object
````

## File: modules/platform/domain/value-objects/BillingState.ts
````typescript
/**
 * BillingState — State Value Object
 *
 * Billing state of a SubscriptionAgreement aggregate.
 *
 * Values: pending | active | delinquent | expired | cancelled
 *
 * @see docs/aggregates.md — 主要識別值與狀態值
 */

// TODO: implement BillingState type
````

## File: modules/platform/domain/value-objects/ConfigurationProfileRef.ts
````typescript
/**
 * ConfigurationProfileRef — Value Object
 *
 * A stable reference to an active configuration profile.
 * Does not contain profile data; only the reference identifier.
 *
 * Used by: PlatformContext aggregate
 * @see docs/aggregates.md — 主要值物件
 */

// TODO: implement ConfigurationProfileRef value object
````

## File: modules/platform/domain/value-objects/ContractState.ts
````typescript
/**
 * ContractState — State Value Object
 *
 * Lifecycle state of an IntegrationContract aggregate.
 *
 * Values: draft | active | paused | revoked
 *
 * @see docs/aggregates.md — 主要識別值與狀態值
 */

// TODO: implement ContractState type
````

## File: modules/platform/domain/value-objects/DeliveryAllowance.ts
````typescript
/**
 * DeliveryAllowance — Value Object / Decision Object
 *
 * Expresses whether an integration or notification delivery is permitted
 * under current conditions (plan, policy, quota, contract state).
 * Contains: allowed flag, reason code, and relevant constraint reference.
 *
 * Used by: IntegrationCompatibilityService, notification routing
 * @see docs/aggregates.md — 主要值物件
 * @see docs/domain-services.md — 主要 Decision Objects
 */

// TODO: implement DeliveryAllowance value object
````

## File: modules/platform/domain/value-objects/DeliveryPolicy.ts
````typescript
/**
 * DeliveryPolicy — Value Object
 *
 * Combined delivery configuration:
 *   timeout    — maximum wait before giving up
 *   retries    — maximum retry count and backoff strategy
 *   idempotency — idempotency key derivation strategy
 *
 * Used by: IntegrationContract aggregate, NotificationDispatch
 * @see docs/aggregates.md — 主要值物件
 */

// TODO: implement DeliveryPolicy value object
````

## File: modules/platform/domain/value-objects/EffectivePeriod.ts
````typescript
/**
 * EffectivePeriod — Value Object
 *
 * Validity interval for a subscription agreement, configuration profile,
 * or policy rule.
 *
 * Contains:
 *   startsAt — ISO 8601 datetime string (inclusive)
 *   endsAt   — ISO 8601 datetime string (exclusive, optional for open-ended periods)
 *
 * @see docs/aggregates.md — 主要識別值與狀態值
 */

// TODO: implement EffectivePeriod value object and createEffectivePeriod factory
````

## File: modules/platform/domain/value-objects/EndpointRef.ts
````typescript
/**
 * EndpointRef — Reference Value Object
 *
 * A stable reference to an external endpoint (URL, queue name, topic ARN, etc.).
 * Does not contain the actual endpoint value; points to a resolved configuration.
 *
 * Used by: IntegrationContract aggregate
 * @see docs/aggregates.md — 主要識別值與狀態值
 */

// TODO: implement EndpointRef value object
````

## File: modules/platform/domain/value-objects/index.ts
````typescript
/**
 * platform domain value-object derivation inventory.
 */

export const PLATFORM_DOMAIN_VALUE_OBJECT_TYPES = [
	"PlatformCapability",
	"SubjectScope",
	"PolicyRule",
	"ConfigurationProfileRef",
	"Entitlement",
	"UsageLimit",
	"SignalSubscription",
	"DeliveryPolicy",
	"NotificationRoute",
	"ObservabilitySignal",
	"PermissionDecision",
	"AuditClassification",
	"PlanConstraint",
	"DeliveryAllowance",
	"BillingState",
	"ContractState",
	"EffectivePeriod",
	"EndpointRef",
	"IntegrationContractId",
	"PlatformContextId",
	"PlatformLifecycleState",
	"PolicyCatalogId",
	"SecretReference",
	"SubscriptionAgreementId",
] as const;

export type PlatformDomainValueObjectType = (typeof PLATFORM_DOMAIN_VALUE_OBJECT_TYPES)[number];

export const PLATFORM_DOMAIN_VALUE_OBJECT_FACTORY_FUNCTIONS = [
	"createPlatformCapability",
	"createSubjectScope",
	"createPolicyRule",
	"createConfigurationProfileRef",
	"createEntitlement",
	"createUsageLimit",
	"createSignalSubscription",
	"createDeliveryPolicy",
	"createNotificationRoute",
	"createObservabilitySignal",
	"createPermissionDecision",
	"createAuditClassification",
	"createPlanConstraint",
	"createDeliveryAllowance",
] as const;

export type PlatformDomainValueObjectFactoryFunction =
	(typeof PLATFORM_DOMAIN_VALUE_OBJECT_FACTORY_FUNCTIONS)[number];
````

## File: modules/platform/domain/value-objects/IntegrationContractId.ts
````typescript
/**
 * IntegrationContractId — Identifier Value Object
 *
 * Branded string UUID identifying an IntegrationContract aggregate.
 *
 * @see docs/aggregates.md — 主要識別值與狀態值
 */

// TODO: implement IntegrationContractId branded type and createIntegrationContractId factory
````

## File: modules/platform/domain/value-objects/NotificationRoute.ts
````typescript
/**
 * NotificationRoute — Value Object
 *
 * The channel and recipient language for a notification.
 * Contains: channel type (email | SMS | push | chat), recipient reference,
 * and locale/template selection.
 *
 * Used by: notification subdomain, domain services
 * @see docs/aggregates.md — 主要值物件
 */

// TODO: implement NotificationRoute value object
````

## File: modules/platform/domain/value-objects/ObservabilitySignal.ts
````typescript
/**
 * ObservabilitySignal — Value Object
 *
 * Unified wrapper for metrics, traces, and alert signals in the platform domain language.
 * Contains: signal name, level, source reference, and additional dimensions.
 *
 * Used by: observability subdomain, domain services
 * @see docs/aggregates.md — 主要值物件
 */

// TODO: implement ObservabilitySignal value object
````

## File: modules/platform/domain/value-objects/PlatformCapability.ts
````typescript
/**
 * PlatformCapability — Value Object
 *
 * An activatable, deactivatable, rate-limitable capability constrained by entitlement.
 * Contains: capability name, status, corresponding entitlement reference, and lifecycle state.
 *
 * Used by: PlatformContext aggregate
 * @see docs/aggregates.md — 主要值物件
 */

// TODO: implement PlatformCapability value object (type / interface / branded type)
````

## File: modules/platform/domain/value-objects/PlatformContextId.ts
````typescript
/**
 * PlatformContextId — Identifier Value Object
 *
 * Branded string UUID identifying a PlatformContext aggregate root.
 *
 * Usage: PlatformContext.contextId, cross-aggregate references
 * @see docs/aggregates.md — 主要識別值與狀態值
 */

// TODO: implement PlatformContextId branded type and createPlatformContextId factory
````

## File: modules/platform/domain/value-objects/PlatformLifecycleState.ts
````typescript
/**
 * PlatformLifecycleState — State Value Object
 *
 * Lifecycle state of a PlatformContext aggregate.
 *
 * Values: draft | active | suspended | retired
 *
 * Transition rules:
 *   draft -> active     (context is fully configured and subscription is activated)
 *   active -> suspended (governance action or payment failure)
 *   suspended -> active (issue resolved)
 *   active | suspended -> retired (permanent decommission)
 *
 * @see docs/aggregates.md — 主要識別值與狀態值
 */

// TODO: implement PlatformLifecycleState type and transition guard
````

## File: modules/platform/domain/value-objects/PolicyCatalogId.ts
````typescript
/**
 * PolicyCatalogId — Identifier Value Object
 *
 * Branded string UUID identifying a PolicyCatalog aggregate.
 *
 * @see docs/aggregates.md — 主要識別值與狀態值
 */

// TODO: implement PolicyCatalogId branded type and createPolicyCatalogId factory
````

## File: modules/platform/domain/value-objects/PolicyRule.ts
````typescript
/**
 * PolicyRule — Value Object
 *
 * Expresses a single governance rule with:
 *   subject   — who the rule applies to
 *   condition — under what circumstances
 *   effect    — allow | deny | require
 *   priority  — evaluation precedence
 *
 * Used by: PolicyCatalog aggregate, domain services
 * @see docs/aggregates.md — 主要值物件
 */

// TODO: implement PolicyRule value object
````

## File: modules/platform/domain/value-objects/SecretReference.ts
````typescript
/**
 * SecretReference — Reference Value Object
 *
 * A stable, opaque reference to a secret, credential, or token stored
 * in an external secret manager. Resolved at runtime by SecretReferenceResolver output port.
 *
 * Contains: secretId, vault/provider hint
 * Does NOT contain: the actual secret value
 *
 * Used by: IntegrationContract aggregate
 * @see docs/aggregates.md — 主要識別值與狀態值
 * @see docs/repositories.md — SecretReferenceResolver
 */

// TODO: implement SecretReference value object
````

## File: modules/platform/domain/value-objects/SignalSubscription.ts
````typescript
/**
 * SignalSubscription — Value Object
 *
 * The set of platform events an external system needs to receive
 * through an IntegrationContract. Each subscription maps an event type
 * to a delivery configuration.
 *
 * Used by: IntegrationContract aggregate
 * @see docs/aggregates.md — 主要值物件
 */

// TODO: implement SignalSubscription value object
````

## File: modules/platform/domain/value-objects/SubjectScope.ts
````typescript
/**
 * SubjectScope — Value Object
 *
 * Governance boundary for actor, account, and organization subjects.
 * Expresses which principals are within a given platform context scope.
 *
 * Used by: PlatformContext aggregate, domain services
 * @see docs/aggregates.md — 主要值物件
 */

// TODO: implement SubjectScope value object
````

## File: modules/platform/domain/value-objects/SubscriptionAgreementId.ts
````typescript
/**
 * SubscriptionAgreementId — Identifier Value Object
 *
 * Branded string UUID identifying a SubscriptionAgreement aggregate.
 *
 * @see docs/aggregates.md — 主要識別值與狀態值
 */

// TODO: implement SubscriptionAgreementId branded type and createSubscriptionAgreementId factory
````

## File: modules/platform/domain/value-objects/UsageLimit.ts
````typescript
/**
 * UsageLimit — Value Object
 *
 * Defines a quantitative limit on usage and the enforcement strategy when exceeded.
 * Contains: limit dimension (e.g., API calls / month), threshold, and over-limit policy.
 *
 * Used by: SubscriptionAgreement aggregate
 * @see docs/aggregates.md — 主要值物件
 */

// TODO: implement UsageLimit value object
````

## File: modules/platform/infrastructure/cache/CachedPlatformContextViewRepository.ts
````typescript
/**
 * CachedPlatformContextViewRepository — Firestore-backed View Repository (Driven Adapter)
 *
 * Implements: PlatformContextViewRepository
 * Reads PlatformContextView from "platform-contexts" collection.
 */

import { getFirestore, doc, getDoc } from "firebase/firestore";
import { firebaseClientApp } from "@integration-firebase/client";
import type { PlatformContextViewRepository, PlatformContextView } from "../../domain/ports/output";

export class CachedPlatformContextViewRepository implements PlatformContextViewRepository {
	private get db() {
		return getFirestore(firebaseClientApp);
	}

	async getView(contextId: string): Promise<PlatformContextView | null> {
		const snap = await getDoc(doc(this.db, "platform-contexts", contextId));
		if (!snap.exists()) return null;
		const data = snap.data() as Record<string, unknown>;
		return {
			contextId,
			lifecycleState: typeof data.lifecycleState === "string" ? data.lifecycleState : "unknown",
			capabilityKeys: Array.isArray(data.capabilityKeys) ? (data.capabilityKeys as string[]) : [],
		};
	}
}
````

## File: modules/platform/infrastructure/cache/CachedPolicyCatalogViewRepository.ts
````typescript
/**
 * CachedPolicyCatalogViewRepository — Firestore-backed View Repository (Driven Adapter)
 *
 * Implements: PolicyCatalogViewRepository
 * Reads PolicyCatalogView from "policy-catalogs" collection (latest active revision).
 */

import { getFirestore, collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { firebaseClientApp } from "@integration-firebase/client";
import type { PolicyCatalogViewRepository, PolicyCatalogView } from "../../domain/ports/output";

export class CachedPolicyCatalogViewRepository implements PolicyCatalogViewRepository {
private get db() {
return getFirestore(firebaseClientApp);
}

async getView(contextId: string): Promise<PolicyCatalogView | null> {
const q = query(
collection(this.db, "policy-catalogs"),
orderBy("revision", "desc"),
limit(1),
);
const snap = await getDocs(q);
if (snap.empty) return null;
const data = snap.docs[0].data() as Record<string, unknown>;
return {
contextId,
revision: typeof data.revision === "number" ? data.revision : 0,
permissionRuleCount: typeof data.permissionRuleCount === "number" ? data.permissionRuleCount : 0,
workflowRuleCount: typeof data.workflowRuleCount === "number" ? data.workflowRuleCount : 0,
notificationRuleCount: typeof data.notificationRuleCount === "number" ? data.notificationRuleCount : 0,
auditRuleCount: typeof data.auditRuleCount === "number" ? data.auditRuleCount : 0,
};
}
}
````

## File: modules/platform/infrastructure/cache/CachedUsageMeterRepository.ts
````typescript
/**
 * CachedUsageMeterRepository — Firestore-backed View Repository (Driven Adapter)
 *
 * Implements: UsageMeterRepository
 * Reads SubscriptionEntitlementsView from "subscription-agreements" collection.
 */

import { getFirestore, collection, query, where, getDocs, limit } from "firebase/firestore";
import { firebaseClientApp } from "@integration-firebase/client";
import type { UsageMeterRepository, SubscriptionEntitlementsView } from "../../domain/ports/output";

export class CachedUsageMeterRepository implements UsageMeterRepository {
private get db() {
return getFirestore(firebaseClientApp);
}

async getEntitlementsView(contextId: string): Promise<SubscriptionEntitlementsView | null> {
const q = query(
collection(this.db, "subscription-agreements"),
where("contextId", "==", contextId),
where("billingState", "==", "active"),
limit(1),
);
const snap = await getDocs(q);
if (snap.empty) return null;
const data = snap.docs[0].data() as Record<string, unknown>;
return {
contextId,
planCode: typeof data.planCode === "string" ? data.planCode : "free",
entitlements: Array.isArray(data.entitlements) ? (data.entitlements as string[]) : [],
usageLimits: Array.isArray(data.usageLimits) ? (data.usageLimits as string[]) : [],
};
}
}
````

## File: modules/platform/infrastructure/cache/index.ts
````typescript
/**
 * platform cache infrastructure barrel.
 */

export { CachedPlatformContextViewRepository } from "./CachedPlatformContextViewRepository";
export { CachedPolicyCatalogViewRepository } from "./CachedPolicyCatalogViewRepository";
export { CachedUsageMeterRepository } from "./CachedUsageMeterRepository";
````

## File: modules/platform/infrastructure/db/EnvSecretReferenceResolver.ts
````typescript
/**
 * EnvSecretReferenceResolver — Environment-based Adapter (Driven Adapter)
 *
 * Implements: SecretReferenceResolver
 * Resolves secret references from environment variables.
 */

import type { SecretReferenceResolver } from "../../domain/ports/output";

export class EnvSecretReferenceResolver implements SecretReferenceResolver {
async resolve(secretRef: string): Promise<string> {
const envKey = secretRef.toUpperCase().replace(/-/g, "_");
return process.env[envKey] ?? "";
}
}
````

## File: modules/platform/infrastructure/db/FirebaseConfigurationProfileStore.ts
````typescript
/**
 * FirebaseConfigurationProfileStore — Firestore Store (Driven Adapter)
 *
 * Implements: ConfigurationProfileStore
 * Collection: "config-profiles"
 */

import { getFirestore, doc, getDoc } from "firebase/firestore";
import { firebaseClientApp } from "@integration-firebase/client";
import type { ConfigurationProfileStore } from "../../domain/ports/output";

export class FirebaseConfigurationProfileStore implements ConfigurationProfileStore {
	private get db() {
		return getFirestore(firebaseClientApp);
	}

	async getProfile(profileRef: string): Promise<unknown | null> {
		const snap = await getDoc(doc(this.db, "config-profiles", profileRef));
		if (!snap.exists()) return null;
		return { profileRef, ...(snap.data() as Record<string, unknown>) };
	}
}
````

## File: modules/platform/infrastructure/db/FirebaseIntegrationContractRepository.ts
````typescript
/**
 * FirebaseIntegrationContractRepository — Firestore Repository (Driven Adapter)
 *
 * Implements: IntegrationContractRepository
 * Collection: "integration-contracts"
 */

import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { firebaseClientApp } from "@integration-firebase/client";
import type { IntegrationContractRepository } from "../../domain/ports/output";

export class FirebaseIntegrationContractRepository implements IntegrationContractRepository {
	private get db() {
		return getFirestore(firebaseClientApp);
	}

	async findById(integrationContractId: string): Promise<unknown | null> {
		const snap = await getDoc(doc(this.db, "integration-contracts", integrationContractId));
		if (!snap.exists()) return null;
		return { integrationContractId, ...(snap.data() as Record<string, unknown>) };
	}

	async save(contract: unknown): Promise<void> {
		const record = contract as Record<string, unknown>;
		const id = record.integrationContractId as string;
		await setDoc(doc(this.db, "integration-contracts", id), record, { merge: true });
	}
}
````

## File: modules/platform/infrastructure/db/FirebasePlatformContextRepository.ts
````typescript
/**
 * FirebasePlatformContextRepository — Firestore Repository (Driven Adapter)
 *
 * Implements: PlatformContextRepository
 * Collection: "platform-contexts"
 */

import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { firebaseClientApp } from "@integration-firebase/client";
import type { PlatformContextRepository } from "../../domain/ports/output";

export class FirebasePlatformContextRepository implements PlatformContextRepository {
	private get db() {
		return getFirestore(firebaseClientApp);
	}

	async findById(contextId: string): Promise<unknown | null> {
		const snap = await getDoc(doc(this.db, "platform-contexts", contextId));
		if (!snap.exists()) return null;
		return { contextId, ...(snap.data() as Record<string, unknown>) };
	}

	async save(context: unknown): Promise<void> {
		const record = context as Record<string, unknown>;
		const contextId = record.contextId as string;
		await setDoc(doc(this.db, "platform-contexts", contextId), record, { merge: true });
	}
}
````

## File: modules/platform/infrastructure/db/FirebasePolicyCatalogRepository.ts
````typescript
/**
 * FirebasePolicyCatalogRepository — Firestore Repository (Driven Adapter)
 *
 * Implements: PolicyCatalogRepository
 * Collection: "policy-catalogs"
 */

import { getFirestore, collection, query, orderBy, limit, getDocs, setDoc, doc } from "firebase/firestore";
import { firebaseClientApp } from "@integration-firebase/client";
import type { PolicyCatalogRepository } from "../../domain/ports/output";

export class FirebasePolicyCatalogRepository implements PolicyCatalogRepository {
	private get db() {
		return getFirestore(firebaseClientApp);
	}

	async findActiveByContextId(contextId: string): Promise<unknown | null> {
		const q = query(
			collection(this.db, "policy-catalogs"),
			orderBy("revision", "desc"),
			limit(1),
		);
		const snap = await getDocs(q);
		if (snap.empty) return null;
		const d = snap.docs[0];
		return { contextId, ...(d.data() as Record<string, unknown>), id: d.id };
	}

	async saveRevision(catalog: unknown): Promise<void> {
		const record = catalog as Record<string, unknown>;
		const contextId = record.contextId as string;
		const revision = record.revision as number;
		const id = `${contextId}__rev${revision}`;
		await setDoc(doc(this.db, "policy-catalogs", id), record, { merge: true });
	}
}
````

## File: modules/platform/infrastructure/db/FirebaseSubscriptionAgreementRepository.ts
````typescript
/**
 * FirebaseSubscriptionAgreementRepository — Firestore Repository (Driven Adapter)
 *
 * Implements: SubscriptionAgreementRepository
 * Collection: "subscription-agreements"
 */

import { getFirestore, collection, query, where, getDocs, limit, setDoc, doc } from "firebase/firestore";
import { firebaseClientApp } from "@integration-firebase/client";
import type { SubscriptionAgreementRepository } from "../../domain/ports/output";

export class FirebaseSubscriptionAgreementRepository implements SubscriptionAgreementRepository {
	private get db() {
		return getFirestore(firebaseClientApp);
	}

	async findEffectiveByContextId(contextId: string): Promise<unknown | null> {
		const q = query(
			collection(this.db, "subscription-agreements"),
			where("contextId", "==", contextId),
			where("billingState", "==", "active"),
			limit(1),
		);
		const snap = await getDocs(q);
		if (snap.empty) return null;
		const d = snap.docs[0];
		return { ...(d.data() as Record<string, unknown>), subscriptionAgreementId: d.id };
	}

	async save(agreement: unknown): Promise<void> {
		const record = agreement as Record<string, unknown>;
		const id = record.subscriptionAgreementId as string;
		await setDoc(doc(this.db, "subscription-agreements", id), record, { merge: true });
	}
}
````

## File: modules/platform/infrastructure/db/FirebaseWorkflowPolicyRepository.ts
````typescript
/**
 * FirebaseWorkflowPolicyRepository — Firestore Repository (Driven Adapter)
 *
 * Implements: WorkflowPolicyRepository
 * Collection: "workflow-policies"
 */

import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { firebaseClientApp } from "@integration-firebase/client";
import type { WorkflowPolicyRepository, WorkflowPolicyView } from "../../domain/ports/output";

export class FirebaseWorkflowPolicyRepository implements WorkflowPolicyRepository {
	private get db() {
		return getFirestore(firebaseClientApp);
	}

	private makeId(contextId: string, triggerKey: string): string {
		return `${contextId}__${triggerKey}`;
	}

	async getView(contextId: string, triggerKey: string): Promise<WorkflowPolicyView | null> {
		const id = this.makeId(contextId, triggerKey);
		const snap = await getDoc(doc(this.db, "workflow-policies", id));
		if (!snap.exists()) return null;
		const data = snap.data() as Record<string, unknown>;
		return {
			contextId,
			triggerKey,
			enabled: Boolean(data.enabled),
		};
	}

	async save(policy: WorkflowPolicyView): Promise<void> {
		const id = this.makeId(policy.contextId, policy.triggerKey);
		await setDoc(doc(this.db, "workflow-policies", id), policy, { merge: true });
	}
}
````

## File: modules/platform/infrastructure/db/index.ts
````typescript
/**
 * platform database infrastructure barrel.
 */

export { FirebasePlatformContextRepository } from "./FirebasePlatformContextRepository";
export { FirebasePolicyCatalogRepository } from "./FirebasePolicyCatalogRepository";
export { FirebaseIntegrationContractRepository } from "./FirebaseIntegrationContractRepository";
export { FirebaseSubscriptionAgreementRepository } from "./FirebaseSubscriptionAgreementRepository";
export { FirebaseWorkflowPolicyRepository } from "./FirebaseWorkflowPolicyRepository";
export { FirebaseConfigurationProfileStore } from "./FirebaseConfigurationProfileStore";
export { EnvSecretReferenceResolver } from "./EnvSecretReferenceResolver";
````

## File: modules/platform/infrastructure/email/index.ts
````typescript
/**
 * platform email infrastructure barrel.
 */

export { SmtpNotificationGateway } from "./SmtpNotificationGateway";
````

## File: modules/platform/infrastructure/email/SmtpNotificationGateway.ts
````typescript
/**
 * SmtpNotificationGateway — Email Adapter (Driven Adapter)
 *
 * Implements: NotificationGateway
 * Delivers notifications. In production, replace console.info with
 * a Resend / SendGrid / SMTP relay API call.
 */

import type { NotificationGateway } from "../../domain/ports/output";
import type { PlatformCommandResult } from "../../domain/ports/input";

export class SmtpNotificationGateway implements NotificationGateway {
async dispatch(request: Record<string, unknown>): Promise<PlatformCommandResult> {
if (process.env.NODE_ENV !== "test") {
console.info("[SmtpNotificationGateway] dispatch", request);
}
return { ok: true, code: "NOTIFICATION_DISPATCHED" };
}
}
````

## File: modules/platform/infrastructure/events/ingress/index.ts
````typescript
/**
 * platform event ingress placeholder module.
 */

export const PLATFORM_EVENT_INGRESS_FUNCTIONS = [
	"ingestIdentitySubjectAuthenticated",
	"ingestAccountProfileAmended",
	"ingestOrganizationMembershipChanged",
	"ingestSubscriptionEntitlementChanged",
	"ingestIntegrationCallbackReceived",
	"ingestWorkflowExecutionCompleted",
] as const;

export type PlatformEventIngressFunction = (typeof PLATFORM_EVENT_INGRESS_FUNCTIONS)[number];
````

## File: modules/platform/infrastructure/events/ingress/ingestAccountProfileAmended.ts
````typescript
/**
 * ingestAccountProfileAmended — Ingress Parser / Validator
 *
 * Event type: "account.profile_amended"
 *
 * Input:  Raw message from account subdomain
 * Output: Parsed account profile amendment event
 *
 * Responsibilities:
 *   1. Validate raw payload schema (using Zod or equivalent)
 *   2. Translate to platform domain event envelope
 *   3. Attach correlation and causation identifiers
 *   4. Pass to PlatformEventIngressPort for handler dispatch
 *
 * Rules:
 *   - Must not contain business logic; this layer is purely parsing/validation
 *   - Unknown or malformed payloads should return a typed parse error, not throw
 *
 * @see events/handlers/handleAccountProfileAmended.ts — downstream handler
 * @see ports/input/index.ts — PlatformEventIngressPort
 */

// TODO: implement ingestAccountProfileAmended ingress parser / Zod schema validation
````

## File: modules/platform/infrastructure/events/ingress/ingestIdentitySubjectAuthenticated.ts
````typescript
/**
 * ingestIdentitySubjectAuthenticated — Ingress Parser / Validator
 *
 * Event type: "identity.subject_authenticated"
 *
 * Input:  Raw QStash / topic message from identity subdomain
 * Output: Parsed and typed identity subject authentication event payload
 *
 * Responsibilities:
 *   1. Validate raw payload schema (using Zod or equivalent)
 *   2. Translate to platform domain event envelope
 *   3. Attach correlation and causation identifiers
 *   4. Pass to PlatformEventIngressPort for handler dispatch
 *
 * Rules:
 *   - Must not contain business logic; this layer is purely parsing/validation
 *   - Unknown or malformed payloads should return a typed parse error, not throw
 *
 * @see events/handlers/handleIdentitySubjectAuthenticated.ts — downstream handler
 * @see ports/input/index.ts — PlatformEventIngressPort
 */

// TODO: implement ingestIdentitySubjectAuthenticated ingress parser / Zod schema validation
````

## File: modules/platform/infrastructure/events/ingress/ingestIntegrationCallbackReceived.ts
````typescript
/**
 * ingestIntegrationCallbackReceived — Ingress Parser / Validator
 *
 * Event type: "integration.callback_received"
 *
 * Input:  Raw HTTP callback from external integrated system
 * Output: Parsed integration callback event
 *
 * Responsibilities:
 *   1. Validate raw payload schema (using Zod or equivalent)
 *   2. Translate to platform domain event envelope
 *   3. Attach correlation and causation identifiers
 *   4. Pass to PlatformEventIngressPort for handler dispatch
 *
 * Rules:
 *   - Must not contain business logic; this layer is purely parsing/validation
 *   - Unknown or malformed payloads should return a typed parse error, not throw
 *
 * @see events/handlers/handleIntegrationCallbackReceived.ts — downstream handler
 * @see ports/input/index.ts — PlatformEventIngressPort
 */

// TODO: implement ingestIntegrationCallbackReceived ingress parser / Zod schema validation
````

## File: modules/platform/infrastructure/events/ingress/ingestOrganizationMembershipChanged.ts
````typescript
/**
 * ingestOrganizationMembershipChanged — Ingress Parser / Validator
 *
 * Event type: "organization.membership_changed"
 *
 * Input:  Raw message from organization subdomain
 * Output: Parsed organization membership change event
 *
 * Responsibilities:
 *   1. Validate raw payload schema (using Zod or equivalent)
 *   2. Translate to platform domain event envelope
 *   3. Attach correlation and causation identifiers
 *   4. Pass to PlatformEventIngressPort for handler dispatch
 *
 * Rules:
 *   - Must not contain business logic; this layer is purely parsing/validation
 *   - Unknown or malformed payloads should return a typed parse error, not throw
 *
 * @see events/handlers/handleOrganizationMembershipChanged.ts — downstream handler
 * @see ports/input/index.ts — PlatformEventIngressPort
 */

// TODO: implement ingestOrganizationMembershipChanged ingress parser / Zod schema validation
````

## File: modules/platform/infrastructure/events/ingress/ingestSubscriptionEntitlementChanged.ts
````typescript
/**
 * ingestSubscriptionEntitlementChanged — Ingress Parser / Validator
 *
 * Event type: "subscription.entitlement_changed"
 *
 * Input:  Raw message from billing/subscription external integration
 * Output: Parsed entitlement change event
 *
 * Responsibilities:
 *   1. Validate raw payload schema (using Zod or equivalent)
 *   2. Translate to platform domain event envelope
 *   3. Attach correlation and causation identifiers
 *   4. Pass to PlatformEventIngressPort for handler dispatch
 *
 * Rules:
 *   - Must not contain business logic; this layer is purely parsing/validation
 *   - Unknown or malformed payloads should return a typed parse error, not throw
 *
 * @see events/handlers/handleSubscriptionEntitlementChanged.ts — downstream handler
 * @see ports/input/index.ts — PlatformEventIngressPort
 */

// TODO: implement ingestSubscriptionEntitlementChanged ingress parser / Zod schema validation
````

## File: modules/platform/infrastructure/events/ingress/ingestWorkflowExecutionCompleted.ts
````typescript
/**
 * ingestWorkflowExecutionCompleted — Ingress Parser / Validator
 *
 * Event type: "workflow.execution_completed"
 *
 * Input:  Raw QStash callback from workflow executor
 * Output: Parsed workflow completion event
 *
 * Responsibilities:
 *   1. Validate raw payload schema (using Zod or equivalent)
 *   2. Translate to platform domain event envelope
 *   3. Attach correlation and causation identifiers
 *   4. Pass to PlatformEventIngressPort for handler dispatch
 *
 * Rules:
 *   - Must not contain business logic; this layer is purely parsing/validation
 *   - Unknown or malformed payloads should return a typed parse error, not throw
 *
 * @see events/handlers/handleWorkflowExecutionCompleted.ts — downstream handler
 * @see ports/input/index.ts — PlatformEventIngressPort
 */

// TODO: implement ingestWorkflowExecutionCompleted ingress parser / Zod schema validation
````

## File: modules/platform/infrastructure/events/routing/index.ts
````typescript
/**
 * platform event routing placeholder module.
 */

export const PLATFORM_EVENT_ROUTING_FUNCTIONS = [
	"routeIngressEvent",
	"routeDomainEvent",
	"resolveEventHandler",
] as const;

export type PlatformEventRoutingFunction = (typeof PLATFORM_EVENT_ROUTING_FUNCTIONS)[number];
````

## File: modules/platform/infrastructure/events/routing/resolveEventHandler.ts
````typescript
/**
 * resolveEventHandler — Event Handler Resolver
 *
 * Resolves the correct handler function for a given event type at runtime.
 * Decouples the routing table from hard-coded switch statements;
 * allows handler registration to be extended without modifying the router core.
 *
 * Pattern: registry / handler-map keyed by PlatformDomainEventType
 *
 * @see events/routing/routeIngressEvent.ts
 * @see events/routing/routeDomainEvent.ts
 * @see domain/events/index.ts — PlatformDomainEventType
 */

// TODO: implement resolveEventHandler registry / factory function
````

## File: modules/platform/infrastructure/events/routing/routeDomainEvent.ts
````typescript
/**
 * routeDomainEvent — Domain Event Outbound Router
 *
 * Receives a collected domain event from an aggregate (post-persistence) and
 * dispatches it to the appropriate publisher utility.
 *
 * Responsibilities:
 *   - Determine whether the event should be published externally (via DomainEventPublisher)
 *   - Determine whether the event should trigger internal side-effect handlers
 *   - Route analytics events to AnalyticsSink
 *   - Route audit events to AuditSignalStore
 *
 * @see events/published/publishSinglePlatformEvent.ts
 * @see ports/output/index.ts — DomainEventPublisher, AnalyticsSink, AuditSignalStore
 */

// TODO: implement routeDomainEvent routing function
````

## File: modules/platform/infrastructure/events/routing/routeIngressEvent.ts
````typescript
/**
 * routeIngressEvent — Ingress Event Router
 *
 * Receives a parsed PlatformDomainEvent and dispatches it to the matching
 * ingress event handler function.
 *
 * Routing table (event type → handler):
 *   identity.subject_authenticated      → handleIngressIdentitySubjectAuthenticated
 *   account.profile_amended             → handleIngressAccountProfileAmended
 *   organization.membership_changed     → handleIngressOrganizationMembershipChanged
 *   subscription.entitlement_changed    → handleIngressSubscriptionEntitlementChanged
 *   integration.callback_received       → handleIngressIntegrationCallbackReceived
 *   workflow.execution_completed        → handleIngressWorkflowExecutionCompleted
 *
 * Unknown event types should produce a typed routing error, not a thrown exception.
 *
 * @see events/handlers/ — handler implementations
 * @see events/ingress/ — ingress parsers that call this router
 */

// TODO: implement routeIngressEvent routing function and routing table
````

## File: modules/platform/infrastructure/external/buildExternalDeliveryRequest.ts
````typescript
/**
 * buildExternalDeliveryRequest — External Delivery Request Builder
 *
 * Constructs the protocol-specific request payload for an external delivery
 * (webhook, HTTP call, queue message) from a domain-typed dispatch input.
 *
 * Responsibility:
 *   - Translate IntegrationContract delivery config + signal payload → protocol request
 *   - Apply serialisation rules for the target protocol (JSON body, headers, signing)
 *
 * @see adapters/external/dispatchExternalDelivery.ts — sends the built request
 * @see domain/aggregates/IntegrationContract.ts
 * @see ports/output/index.ts — ExternalSystemGateway
 */

// TODO: implement buildExternalDeliveryRequest request builder
````

## File: modules/platform/infrastructure/external/dispatchExternalDelivery.ts
````typescript
/**
 * dispatchExternalDelivery — External Delivery Dispatcher
 *
 * Sends the built request to the external system via ExternalSystemGateway.
 * Records the delivery attempt in DispatchContextEntity for traceability.
 *
 * Rules:
 *   - All I/O goes through ExternalSystemGateway output port (no direct HTTP calls here)
 *   - Delivery failures must return a typed DispatchOutcome, not throw
 *   - Retry logic is governed by DeliveryPolicy VO, not hardcoded here
 *
 * @see adapters/external/buildExternalDeliveryRequest.ts
 * @see domain/entities/DispatchContextEntity.ts
 * @see ports/output/index.ts — ExternalSystemGateway
 */

// TODO: implement dispatchExternalDelivery function
````

## File: modules/platform/infrastructure/external/index.ts
````typescript
/**
 * platform external driven adapter placeholder module.
 */

export const PLATFORM_ADAPTER_EXTERNAL_FUNCTIONS = [
	"buildExternalDeliveryRequest",
	"dispatchExternalDelivery",
	"mapExternalResponseToDispatchOutcome",
] as const;

export type PlatformAdapterExternalFunction = (typeof PLATFORM_ADAPTER_EXTERNAL_FUNCTIONS)[number];
````

## File: modules/platform/infrastructure/external/mapExternalResponseToDispatchOutcome.ts
````typescript
/**
 * mapExternalResponseToDispatchOutcome — Response Mapper
 *
 * Translates the raw response from an external system call into
 * a domain-typed DispatchOutcome (success | failure | partial).
 *
 * Rules:
 *   - HTTP status codes, queue acknowledgements, and error bodies are all
 *     normalised to a single DispatchOutcome before entering the domain
 *   - Prevents raw HTTP concepts from leaking into the platform domain model
 *
 * @see shared/types/index.ts — DispatchOutcomeType
 * @see adapters/external/dispatchExternalDelivery.ts
 */

// TODO: implement mapExternalResponseToDispatchOutcome mapper function
````

## File: modules/platform/infrastructure/index.ts
````typescript
/**
 * platform infrastructure layer barrel.
 */

export * from "./cache";
export * from "./db";
export * from "./email";
export * from "./messaging";
export * from "./monitoring";
export * from "./storage";
````

## File: modules/platform/infrastructure/messaging/index.ts
````typescript
/**
 * platform messaging infrastructure barrel.
 */

export { QStashDomainEventPublisher } from "./QStashDomainEventPublisher";
export { QStashWorkflowDispatcher } from "./QStashWorkflowDispatcher";
export { QStashJobQueuePort } from "./QStashJobQueuePort";
````

## File: modules/platform/infrastructure/messaging/QStashDomainEventPublisher.ts
````typescript
/**
 * QStashDomainEventPublisher — Messaging Adapter (Driven Adapter)
 *
 * Implements: DomainEventPublisher
 * Publishes platform domain events via Upstash QStash.
 */

import type { DomainEventPublisher } from "../../domain/ports/output";
import type { PlatformDomainEvent } from "../../domain/events";

const QSTASH_ENDPOINT = "https://qstash.upstash.io/v2/publish/";

export class QStashDomainEventPublisher implements DomainEventPublisher {
	constructor(
		private readonly destinationUrl: string = process.env.QSTASH_DESTINATION_URL ?? "",
		private readonly token: string = process.env.QSTASH_TOKEN ?? "",
	) {}

	async publish(events: PlatformDomainEvent[]): Promise<void> {
		if (events.length === 0) return;

		if (!this.destinationUrl || !this.token) {
			if (process.env.NODE_ENV !== "production") {
				for (const event of events) {
					console.warn(
						`[QStashDomainEventPublisher] QSTASH_DESTINATION_URL or QSTASH_TOKEN not set. ` +
							`Skipping publish of event '${event.type}' (${event.aggregateId}).`,
					);
				}
			}
			return;
		}

		for (const event of events) {
			const body = JSON.stringify(event);
			const dedupeId = `${event.aggregateType}:${event.aggregateId}:${event.occurredAt}`;
			const response = await fetch(
				`${QSTASH_ENDPOINT}${encodeURIComponent(this.destinationUrl)}`,
				{
					method: "POST",
					headers: {
						Authorization: `Bearer ${this.token}`,
						"Content-Type": "application/json",
						"Upstash-Retries": "3",
						"Upstash-Deduplication-Id": dedupeId,
					},
					body,
				},
			);
			if (!response.ok) {
				const text = await response.text().catch(() => response.statusText);
				throw new Error(
					`QStashDomainEventPublisher: failed to publish '${event.type}'. ` +
						`HTTP ${response.status}: ${text}`,
				);
			}
		}
	}
}
````

## File: modules/platform/infrastructure/messaging/QStashJobQueuePort.ts
````typescript
/**
 * QStashJobQueuePort — Messaging Adapter (Driven Adapter)
 *
 * Implements: JobQueuePort
 * Transport:  Upstash QStash job queue
 */

import type { JobQueuePort } from "../../domain/ports/output";
import type { PlatformCommandResult } from "../../domain/ports/input";

const QSTASH_ENDPOINT = "https://qstash.upstash.io/v2/publish/";

export class QStashJobQueuePort implements JobQueuePort {
constructor(
private readonly jobWorkerUrl: string = process.env.JOB_WORKER_URL ?? "",
private readonly token: string = process.env.QSTASH_TOKEN ?? "",
) {}

async enqueue(job: Record<string, unknown>): Promise<PlatformCommandResult> {
const jobType = typeof job.jobType === "string" ? job.jobType : "unknown";

if (!this.jobWorkerUrl || !this.token) {
if (process.env.NODE_ENV !== "production") {
console.warn(
`[QStashJobQueuePort] JOB_WORKER_URL or QSTASH_TOKEN not set. ` +
`Skipping enqueue of job '${jobType}'.`,
);
}
return { ok: true, code: "JOB_ENQUEUED_NOOP", metadata: { jobType } };
}

const destinationUrl = `${this.jobWorkerUrl}/api/jobs/${encodeURIComponent(jobType)}`;
const response = await fetch(`${QSTASH_ENDPOINT}${encodeURIComponent(destinationUrl)}`, {
method: "POST",
headers: {
Authorization: `Bearer ${this.token}`,
"Content-Type": "application/json",
"Upstash-Retries": "3",
},
body: JSON.stringify(job),
});

if (!response.ok) {
const text = await response.text().catch(() => response.statusText);
return { ok: false, code: "JOB_ENQUEUE_FAILED", message: `HTTP ${response.status}: ${text}` };
}

return { ok: true, code: "JOB_ENQUEUED", metadata: { jobType } };
}
}
````

## File: modules/platform/infrastructure/messaging/QStashWorkflowDispatcher.ts
````typescript
/**
 * QStashWorkflowDispatcher — Messaging Adapter (Driven Adapter)
 *
 * Implements: WorkflowDispatcherPort
 * Dispatches workflow triggers via Upstash QStash.
 */

import type { WorkflowDispatcherPort } from "../../domain/ports/output";
import type { PlatformCommandResult } from "../../domain/ports/input";

const QSTASH_ENDPOINT = "https://qstash.upstash.io/v2/publish/";

export class QStashWorkflowDispatcher implements WorkflowDispatcherPort {
constructor(
private readonly workflowBaseUrl: string = process.env.WORKFLOW_BASE_URL ?? "",
private readonly token: string = process.env.QSTASH_TOKEN ?? "",
) {}

async dispatch(triggerKey: string, payload: Record<string, unknown>): Promise<PlatformCommandResult> {
if (!this.workflowBaseUrl || !this.token) {
if (process.env.NODE_ENV !== "production") {
console.warn(
`[QStashWorkflowDispatcher] WORKFLOW_BASE_URL or QSTASH_TOKEN not set. ` +
`Skipping workflow dispatch for key '${triggerKey}'.`,
);
}
return { ok: true, code: "WORKFLOW_DISPATCHED_NOOP", metadata: { triggerKey } };
}

const destinationUrl = `${this.workflowBaseUrl}/api/workflows/${encodeURIComponent(triggerKey)}`;
const response = await fetch(`${QSTASH_ENDPOINT}${encodeURIComponent(destinationUrl)}`, {
method: "POST",
headers: {
Authorization: `Bearer ${this.token}`,
"Content-Type": "application/json",
"Upstash-Retries": "3",
},
body: JSON.stringify({ triggerKey, ...payload }),
});

if (!response.ok) {
const text = await response.text().catch(() => response.statusText);
return { ok: false, code: "WORKFLOW_DISPATCH_FAILED", message: `HTTP ${response.status}: ${text}` };
}

return { ok: true, code: "WORKFLOW_DISPATCHED", metadata: { triggerKey } };
}
}
````

## File: modules/platform/infrastructure/monitoring/FirebaseObservabilitySink.ts
````typescript
/**
 * FirebaseObservabilitySink — Monitoring Adapter (Driven Adapter)
 *
 * Implements: ObservabilitySink
 * Emits observability signals as structured console telemetry suitable for
 * Cloud Logging ingestion. Extend with a provider SDK (Datadog, GCM, etc.) as needed.
 */

import type { ObservabilitySink } from "../../domain/ports/output";

export class FirebaseObservabilitySink implements ObservabilitySink {
async emit(signal: Record<string, unknown>): Promise<void> {
const entry = { type: "observability", ...signal, emittedAt: new Date().toISOString() };
if (process.env.NODE_ENV !== "test") {
console.info("[ObservabilitySink]", JSON.stringify(entry));
}
}
}
````

## File: modules/platform/infrastructure/monitoring/index.ts
````typescript
/**
 * platform monitoring infrastructure barrel.
 */

export { FirebaseObservabilitySink } from "./FirebaseObservabilitySink";
````

## File: modules/platform/infrastructure/persistence/index.ts
````typescript
/**
 * platform persistence driven adapter placeholder module.
 */

export const PLATFORM_ADAPTER_PERSISTENCE_FUNCTIONS = [
	"mapAggregateToPersistenceRecord",
	"mapPersistenceRecordToAggregate",
	"persistPlatformAggregate",
	"loadPlatformAggregate",
] as const;

export type PlatformAdapterPersistenceFunction = (typeof PLATFORM_ADAPTER_PERSISTENCE_FUNCTIONS)[number];
````

## File: modules/platform/infrastructure/persistence/mapIntegrationContractToPersistenceRecord.ts
````typescript
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
````

## File: modules/platform/infrastructure/persistence/mapPlatformContextToPersistenceRecord.ts
````typescript
/**
 * mapPlatformContextToPersistenceRecord — Persistence Mapper
 *
 * Serialises a PlatformContext aggregate snapshot into a flat Firestore/DB record.
 *
 * Rules:
 *   - All domain value objects must be serialised to primitives before writing
 *   - Domain entity sub-collections must be flattened or nested per storage contract
 *   - The inverse mapper (persistence record → aggregate) is the reconstitute factory
 *
 * Related:
 *   - domain/aggregates/PlatformContext.ts — source aggregate
 *   - domain/factories/createPlatformContextAggregate.ts — reconstitution path (inverse)
 *   - infrastructure/db/ — Firestore repository that calls this mapper
 *
 * @see docs/repositories.md — persistence record schema contract
 */

// TODO: implement mapPlatformContextToPersistenceRecord serialisation function
````

## File: modules/platform/infrastructure/persistence/mapPolicyCatalogToPersistenceRecord.ts
````typescript
/**
 * mapPolicyCatalogToPersistenceRecord — Persistence Mapper
 *
 * Serialises a PolicyCatalog aggregate (including all PolicyRuleEntities) into a persistence record.
 *
 * Rules:
 *   - All domain value objects must be serialised to primitives before writing
 *   - Domain entity sub-collections must be flattened or nested per storage contract
 *   - The inverse mapper (persistence record → aggregate) is the reconstitute factory
 *
 * Related:
 *   - domain/aggregates/PolicyCatalog.ts — source aggregate
 *   - domain/factories/createPolicyCatalogAggregate.ts — reconstitution path (inverse)
 *   - infrastructure/db/ — Firestore repository that calls this mapper
 *
 * @see docs/repositories.md — persistence record schema contract
 */

// TODO: implement mapPolicyCatalogToPersistenceRecord serialisation function
````

## File: modules/platform/infrastructure/persistence/mapSubscriptionAgreementToPersistenceRecord.ts
````typescript
/**
 * mapSubscriptionAgreementToPersistenceRecord — Persistence Mapper
 *
 * Serialises a SubscriptionAgreement aggregate into a persistence record.
 *
 * Rules:
 *   - All domain value objects must be serialised to primitives before writing
 *   - Domain entity sub-collections must be flattened or nested per storage contract
 *   - The inverse mapper (persistence record → aggregate) is the reconstitute factory
 *
 * Related:
 *   - domain/aggregates/SubscriptionAgreement.ts — source aggregate
 *   - domain/factories/createSubscriptionAgreementAggregate.ts — reconstitution path (inverse)
 *   - infrastructure/db/ — Firestore repository that calls this mapper
 *
 * @see docs/repositories.md — persistence record schema contract
 */

// TODO: implement mapSubscriptionAgreementToPersistenceRecord serialisation function
````

## File: modules/platform/infrastructure/storage/FirebaseStorageAuditSignalStore.ts
````typescript
/**
 * FirebaseStorageAuditSignalStore — Storage Adapter (Driven Adapter)
 *
 * Implements: AuditSignalStore
 * Appends immutable audit signals to "audit-signals" Firestore collection.
 */

import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { firebaseClientApp } from "@integration-firebase/client";
import type { AuditSignalStore } from "../../domain/ports/output";

export class FirebaseStorageAuditSignalStore implements AuditSignalStore {
private get db() {
return getFirestore(firebaseClientApp);
}

async write(signal: Record<string, unknown>): Promise<void> {
await addDoc(collection(this.db, "audit-signals"), {
...signal,
recordedAt: serverTimestamp(),
});
}
}
````

## File: modules/platform/infrastructure/storage/index.ts
````typescript
/**
 * platform storage infrastructure barrel.
 */

export { FirebaseStorageAuditSignalStore } from "./FirebaseStorageAuditSignalStore";
````

## File: modules/platform/interfaces/api/handlePlatformCommandHttp.ts
````typescript
/**
 * handlePlatformCommandHttp — HTTP Command Handler (Driving Adapter)
 *
 * Next.js Server Action or Route Handler wrapper for platform commands.
 * Full cycle:
 *   1. Parse HTTP request via mapHttpRequestToPlatformCommand
 *   2. Execute via PlatformCommandPort (or PlatformFacade)
 *   3. Map PlatformCommandResult to HTTP response via mapPlatformResultToHttpResponse
 *
 * Rules:
 *   - Authentication and authorisation are enforced before this handler is called
 *   - Must not add command business logic
 *   - Follows Next.js server action conventions
 *
 * @see adapters/web/mapHttpRequestToPlatformCommand.ts
 * @see adapters/web/mapPlatformResultToHttpResponse.ts
 * @see api/facade.ts — PlatformFacade
 */

// TODO: implement handlePlatformCommandHttp server action / route handler
````

## File: modules/platform/interfaces/api/handlePlatformQueryHttp.ts
````typescript
/**
 * handlePlatformQueryHttp — HTTP Query Handler (Driving Adapter)
 *
 * Next.js Server Action or Route Handler wrapper for platform queries.
 * Full cycle:
 *   1. Parse HTTP request params into a typed PlatformQuery
 *   2. Execute via PlatformQueryPort (or PlatformFacade)
 *   3. Serialise read model DTO into HTTP response
 *
 * Rules:
 *   - Authentication is enforced before this handler is called
 *   - Must not transform query results; return DTOs as-is from the application layer
 *
 * @see ports/input/index.ts — PlatformQueryPort
 * @see api/facade.ts — PlatformFacade
 * @see application/dtos/ — read model DTOs
 */

// TODO: implement handlePlatformQueryHttp server action / route handler
````

## File: modules/platform/interfaces/api/index.ts
````typescript
/**
 * platform web driving adapter placeholder module.
 */

export const PLATFORM_ADAPTER_WEB_FUNCTIONS = [
	"mapHttpRequestToPlatformCommand",
	"handlePlatformCommandHttp",
	"handlePlatformQueryHttp",
	"mapPlatformResultToHttpResponse",
] as const;

export type PlatformAdapterWebFunction = (typeof PLATFORM_ADAPTER_WEB_FUNCTIONS)[number];
````

## File: modules/platform/interfaces/api/mapHttpRequestToPlatformCommand.ts
````typescript
/**
 * mapHttpRequestToPlatformCommand — HTTP Request Parser
 *
 * Parses and validates an incoming HTTP request body/params into
 * a typed PlatformCommand payload.
 *
 * Rules:
 *   - Request validation (schema, types) is the driving adapter's responsibility
 *   - Unknown or malformed requests must return a typed parse error (HTTP 400 semantics)
 *   - Must not contain business logic
 *   - Uses Zod or equivalent schema validation
 *
 * @see adapters/web/handlePlatformCommandHttp.ts — calls this mapper
 * @see ports/input/index.ts — PlatformCommandPort
 */

// TODO: implement mapHttpRequestToPlatformCommand parser using Zod validation
````

## File: modules/platform/interfaces/api/mapPlatformResultToHttpResponse.ts
````typescript
/**
 * mapPlatformResultToHttpResponse — HTTP Response Mapper
 *
 * Translates a PlatformCommandResult into the HTTP response shape
 * expected by the client (status code + JSON body).
 *
 * Mapping rules:
 *   ok=true              → HTTP 200 (or 201 for creation)
 *   ok=false, code=*     → HTTP 400/403/409/500 based on code
 *   ENTITLEMENT_DENIED   → HTTP 403
 *   POLICY_CONFLICT      → HTTP 409
 *   unknown              → HTTP 500
 *
 * @see adapters/web/handlePlatformCommandHttp.ts
 * @see application/dtos/PlatformCommandResult.dto.ts
 * @see shared/constants/PlatformErrorCodeConstants.ts
 */

// TODO: implement mapPlatformResultToHttpResponse mapping function
````

## File: modules/platform/interfaces/cli/index.ts
````typescript
/**
 * platform CLI driving adapter placeholder module.
 */

export const PLATFORM_ADAPTER_CLI_FUNCTIONS = [
	"parseCliInputToCommand",
	"runPlatformCliCommand",
	"renderPlatformCliResult",
] as const;

export type PlatformAdapterCliFunction = (typeof PLATFORM_ADAPTER_CLI_FUNCTIONS)[number];
````

## File: modules/platform/interfaces/cli/parseCliInputToCommand.ts
````typescript
/**
 * parseCliInputToCommand — CLI Input Parser
 *
 * Parses raw CLI arguments (argv array) into a typed PlatformCommand.
 * This is the driving adapter responsibility: translate external CLI input
 * into the platform's command contract without adding business logic.
 *
 * Rules:
 *   - Unknown command names must return a parse error, not throw
 *   - CLI adapter must not interpret command business rules
 *   - Produced PlatformCommand is passed unchanged to PlatformCommandPort
 *
 * @see adapters/cli/runPlatformCliCommand.ts — executes the parsed command
 * @see ports/input/index.ts — PlatformCommandPort
 */

// TODO: implement parseCliInputToCommand argv parser
````

## File: modules/platform/interfaces/cli/renderPlatformCliResult.ts
````typescript
/**
 * renderPlatformCliResult — CLI Result Renderer
 *
 * Formats a PlatformCommandResult or query view model into
 * human-readable CLI output (stdout / stderr).
 *
 * Rules:
 *   - ok=false results must write to stderr with a non-zero exit code signal
 *   - ok=true results write to stdout in JSON or table format (configurable)
 *   - Must not contain business logic; purely presentation
 *
 * @see adapters/cli/runPlatformCliCommand.ts
 * @see application/dtos/ — view model types
 */

// TODO: implement renderPlatformCliResult formatter
````

## File: modules/platform/interfaces/cli/runPlatformCliCommand.ts
````typescript
/**
 * runPlatformCliCommand — CLI Command Runner
 *
 * Orchestrates a full CLI command cycle:
 *   1. Parse argv via parseCliInputToCommand
 *   2. Resolve PlatformFacade (or PlatformCommandPort directly)
 *   3. Execute the command
 *   4. Render result via renderPlatformCliResult
 *
 * Used as: CLI entrypoint for platform admin operations, migration scripts,
 * and developer tooling. Not for production request paths.
 *
 * @see adapters/cli/parseCliInputToCommand.ts
 * @see adapters/cli/renderPlatformCliResult.ts
 * @see api/facade.ts — PlatformFacade
 */

// TODO: implement runPlatformCliCommand CLI entrypoint
````

## File: modules/platform/interfaces/index.ts
````typescript
export * from "./web";
````

## File: modules/platform/subdomains/access-control/README.md
````markdown
# Access Control

Access control policies and permission resolution.

## Ownership

- **Bounded Context**: platform
- **Status**: Stub — awaiting use case definition

## Development Order

When implementing, follow inside-out:
1. Domain → 2. Application → 3. Ports (if needed) → 4. Infrastructure → 5. Interfaces
````

## File: modules/platform/subdomains/account-profile/application/use-cases/get-account-profile.use-case.ts
````typescript
import {
  createAccountProfileId,
  type AccountProfile,
} from "../../domain/entities/AccountProfile";
import type {
  AccountProfileQueryRepository,
  Unsubscribe,
} from "../../domain/repositories/AccountProfileQueryRepository";

/**
 * Use Case Contract: GetAccountProfile
 * Actor: Authenticated Actor
 * Goal: Read the profile state of the target actor for UI rendering.
 * Main Success Scenario:
 * 1. Validate actor identity input.
 * 2. Load profile from query repository.
 * 3. Return profile snapshot or null when not found.
 * Failure Branches:
 * - Invalid actor id -> schema validation error.
 * - Repository failure -> upstream infrastructure error.
 */
export class GetAccountProfileUseCase {
  constructor(
    private readonly accountProfileQueryRepository: AccountProfileQueryRepository,
  ) {}

  async execute(actorId: string): Promise<AccountProfile | null> {
    const profileId = createAccountProfileId(actorId);
    return this.accountProfileQueryRepository.getAccountProfile(profileId);
  }
}

/**
 * Use Case Contract: SubscribeAccountProfile
 * Actor: Authenticated Actor / UI session
 * Goal: Observe profile updates reactively.
 */
export class SubscribeAccountProfileUseCase {
  constructor(
    private readonly accountProfileQueryRepository: AccountProfileQueryRepository,
  ) {}

  execute(
    actorId: string,
    onUpdate: (profile: AccountProfile | null) => void,
  ): Unsubscribe {
    const profileId = createAccountProfileId(actorId);
    return this.accountProfileQueryRepository.subscribeToAccountProfile(profileId, onUpdate);
  }
}
````

## File: modules/platform/subdomains/account-profile/application/use-cases/update-account-profile.use-case.ts
````typescript
import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import {
	createAccountProfileId,
	createUpdateAccountProfileInput,
	type UpdateAccountProfileInput,
} from "../../domain/entities/AccountProfile";
import type { AccountProfileCommandRepository } from "../../domain/repositories/AccountProfileCommandRepository";

/**
 * Use Case Contract: UpdateAccountProfile
 * Actor: Authenticated Actor
 * Goal: Update account profile fields (name/bio/photo/theme).
 * Main Success Scenario:
 * 1. Validate actor identity input.
 * 2. Validate update payload.
 * 3. Persist profile updates via command repository.
 * 4. Return command success.
 * Failure Branches:
 * - Invalid actor id or payload -> validation error.
 * - Repository failure -> command failure.
 */
export class UpdateAccountProfileUseCase {
	constructor(
		private readonly accountProfileCommandRepository: AccountProfileCommandRepository,
	) {}

	async execute(actorId: string, input: UpdateAccountProfileInput): Promise<CommandResult> {
		try {
			const profileId = createAccountProfileId(actorId);
			const validatedInput = createUpdateAccountProfileInput(input);
			await this.accountProfileCommandRepository.updateAccountProfile(profileId, validatedInput);
			return commandSuccess(profileId, Date.now());
		} catch (err) {
			return commandFailureFrom(
				"UPDATE_ACCOUNT_PROFILE_FAILED",
				err instanceof Error ? err.message : "Failed to update account profile",
			);
		}
	}
}
````

## File: modules/platform/subdomains/account-profile/domain/aggregates/AccountProfileAggregate.ts
````typescript
import type {
  AccountProfileDomainEventType,
  AccountProfileUpdatedEvent,
} from "../events/AccountProfileDomainEvent";
import { createProfileId, createProfileDisplayName } from "../value-objects";
import type { ProfileId } from "../value-objects";
import type {
  AccountProfile,
  UpdateAccountProfileInput,
} from "../entities/AccountProfile";

export interface AccountProfileAggregateSnapshot {
  readonly id: string;
  readonly displayName: string;
  readonly email: string | null;
  readonly photoURL: string | null;
  readonly bio: string | null;
  readonly theme: AccountProfile["theme"] | null;
  readonly updatedAtISO: string;
}

export class AccountProfileAggregate {
  private readonly _domainEvents: AccountProfileDomainEventType[] = [];

  private constructor(private _props: AccountProfileAggregateSnapshot) {}

  static create(id: string, profile: AccountProfile): AccountProfileAggregate {
    createProfileId(id);
    createProfileDisplayName(profile.displayName);
    return new AccountProfileAggregate({
      id,
      displayName: profile.displayName,
      email: profile.email ?? null,
      photoURL: profile.photoURL ?? null,
      bio: profile.bio ?? null,
      theme: profile.theme ?? null,
      updatedAtISO: new Date().toISOString(),
    });
  }

  static reconstitute(
    snapshot: AccountProfileAggregateSnapshot,
  ): AccountProfileAggregate {
    return new AccountProfileAggregate({ ...snapshot });
  }

  update(input: UpdateAccountProfileInput): void {
    const changedFields: string[] = [];
    const now = new Date().toISOString();
    if (input.displayName !== undefined && input.displayName !== this._props.displayName) {
      createProfileDisplayName(input.displayName);
      changedFields.push("displayName");
    }
    if (input.bio !== undefined && input.bio !== this._props.bio) changedFields.push("bio");
    if (input.photoURL !== undefined && input.photoURL !== this._props.photoURL) changedFields.push("photoURL");
    if (input.theme !== undefined) changedFields.push("theme");
    this._props = {
      ...this._props,
      displayName: input.displayName ?? this._props.displayName,
      bio: input.bio ?? this._props.bio,
      photoURL: input.photoURL ?? this._props.photoURL,
      theme: input.theme ?? this._props.theme,
      updatedAtISO: now,
    };
    this.recordEvent<AccountProfileUpdatedEvent>({
      type: "platform.account-profile.updated",
      eventId: crypto.randomUUID(),
      occurredAt: now,
      payload: { profileId: this._props.id, fields: changedFields },
    });
  }

  get id(): ProfileId {
    return createProfileId(this._props.id);
  }

  get displayName(): string {
    return this._props.displayName;
  }

  getSnapshot(): Readonly<AccountProfileAggregateSnapshot> {
    return Object.freeze({ ...this._props });
  }

  pullDomainEvents(): AccountProfileDomainEventType[] {
    const events = [...this._domainEvents];
    this._domainEvents.length = 0;
    return events;
  }

  private recordEvent<TEvent extends AccountProfileDomainEventType>(
    event: TEvent,
  ): void {
    this._domainEvents.push(event);
  }
}
````

## File: modules/platform/subdomains/account-profile/domain/aggregates/index.ts
````typescript
export { AccountProfileAggregate } from "./AccountProfileAggregate";
export type { AccountProfileAggregateSnapshot } from "./AccountProfileAggregate";
````

## File: modules/platform/subdomains/account-profile/domain/entities/AccountProfile.ts
````typescript
import { z } from "@lib-zod";

export const AccountProfileIdSchema = z.string().min(1).brand("AccountProfileId");
export type AccountProfileId = z.infer<typeof AccountProfileIdSchema>;

export const AccountProfileThemeSchema = z.object({
  primary: z.string().min(1),
  background: z.string().min(1),
  accent: z.string().min(1),
});
export type AccountProfileTheme = z.infer<typeof AccountProfileThemeSchema>;

export const AccountProfileSchema = z.object({
  id: AccountProfileIdSchema,
  displayName: z.string().min(1),
  email: z.string().email().optional(),
  photoURL: z.string().min(1).optional(),
  bio: z.string().min(1).optional(),
  theme: AccountProfileThemeSchema.optional(),
});
export type AccountProfile = z.infer<typeof AccountProfileSchema>;

export const UpdateAccountProfileInputSchema = z
  .object({
    displayName: z.string().min(1).optional(),
    bio: z.string().min(1).optional(),
    photoURL: z.string().min(1).optional(),
    theme: AccountProfileThemeSchema.optional(),
  })
  .refine((input) => Object.keys(input).length > 0, {
    message: "At least one profile field is required",
  });
export type UpdateAccountProfileInput = z.infer<typeof UpdateAccountProfileInputSchema>;

export function createAccountProfileId(raw: string): AccountProfileId {
  return AccountProfileIdSchema.parse(raw);
}

export function createAccountProfile(raw: AccountProfile): AccountProfile {
  return AccountProfileSchema.parse(raw);
}

export function createUpdateAccountProfileInput(
  raw: UpdateAccountProfileInput,
): UpdateAccountProfileInput {
  return UpdateAccountProfileInputSchema.parse(raw);
}
````

## File: modules/platform/subdomains/account-profile/domain/events/AccountProfileDomainEvent.ts
````typescript
export interface AccountProfileDomainEvent {
  readonly eventId: string;
  readonly occurredAt: string;
  readonly type: string;
  readonly payload: object;
}

export interface AccountProfileUpdatedEvent extends AccountProfileDomainEvent {
  readonly type: "platform.account-profile.updated";
  readonly payload: {
    readonly profileId: string;
    readonly fields: string[];
  };
}

export type AccountProfileDomainEventType = AccountProfileUpdatedEvent;
````

## File: modules/platform/subdomains/account-profile/domain/events/index.ts
````typescript
export type {
  AccountProfileDomainEvent,
  AccountProfileUpdatedEvent,
  AccountProfileDomainEventType,
} from "./AccountProfileDomainEvent";
````

## File: modules/platform/subdomains/account-profile/domain/index.ts
````typescript
export {
	AccountProfileIdSchema,
	AccountProfileSchema,
	createAccountProfile,
	createAccountProfileId,
	createUpdateAccountProfileInput,
} from "./entities/AccountProfile";
export type {
	AccountProfile,
	AccountProfileId,
	AccountProfileTheme,
	UpdateAccountProfileInput,
} from "./entities/AccountProfile";

export type { Unsubscribe, AccountProfileQueryRepository } from "./repositories/AccountProfileQueryRepository";
export type { AccountProfileCommandRepository } from "./repositories/AccountProfileCommandRepository";
export type { IAccountProfileQueryPort, IAccountProfileCommandPort } from "./ports";
export * from "./aggregates";
export * from "./events";
export * from "./value-objects";
````

## File: modules/platform/subdomains/account-profile/domain/ports/index.ts
````typescript
/**
 * account-profile domain/ports — driven port interfaces for the account-profile subdomain.
 *
 * These re-export the repository contracts from domain/repositories/, making
 * the Ports layer explicitly visible in the directory structure.
 * New code should import port interfaces from this directory.
 */
export type { AccountProfileQueryRepository as IAccountProfileQueryPort } from "../repositories/AccountProfileQueryRepository";
export type { AccountProfileCommandRepository as IAccountProfileCommandPort } from "../repositories/AccountProfileCommandRepository";
````

## File: modules/platform/subdomains/account-profile/domain/repositories/AccountProfileCommandRepository.ts
````typescript
import type {
	AccountProfileId,
	UpdateAccountProfileInput,
} from "../entities/AccountProfile";

export interface AccountProfileCommandRepository {
	updateAccountProfile(
		actorId: AccountProfileId,
		input: UpdateAccountProfileInput,
	): Promise<void>;
}
````

## File: modules/platform/subdomains/account-profile/domain/repositories/AccountProfileQueryRepository.ts
````typescript
import type { AccountProfile, AccountProfileId } from "../entities/AccountProfile";

export type Unsubscribe = () => void;

export interface AccountProfileQueryRepository {
  getAccountProfile(actorId: AccountProfileId): Promise<AccountProfile | null>;
  subscribeToAccountProfile(
    actorId: AccountProfileId,
    onUpdate: (profile: AccountProfile | null) => void,
  ): Unsubscribe;
}
````

## File: modules/platform/subdomains/account-profile/domain/value-objects/index.ts
````typescript
export { ProfileIdSchema, createProfileId } from "./ProfileId";
export type { ProfileId } from "./ProfileId";
export {
  ProfileDisplayNameSchema,
  createProfileDisplayName,
} from "./ProfileDisplayName";
export type { ProfileDisplayName } from "./ProfileDisplayName";
````

## File: modules/platform/subdomains/account-profile/domain/value-objects/ProfileDisplayName.ts
````typescript
import { z } from "@lib-zod";

export const ProfileDisplayNameSchema = z
  .string()
  .min(1)
  .max(100)
  .trim()
  .brand("ProfileDisplayName");
export type ProfileDisplayName = z.infer<typeof ProfileDisplayNameSchema>;

export function createProfileDisplayName(raw: string): ProfileDisplayName {
  return ProfileDisplayNameSchema.parse(raw);
}
````

## File: modules/platform/subdomains/account-profile/domain/value-objects/ProfileId.ts
````typescript
import { z } from "@lib-zod";

export const ProfileIdSchema = z.string().min(1).brand("ProfileId");
export type ProfileId = z.infer<typeof ProfileIdSchema>;

export function createProfileId(raw: string): ProfileId {
  return ProfileIdSchema.parse(raw);
}
````

## File: modules/platform/subdomains/account-profile/infrastructure/create-legacy-account-profile-application.adapter.ts
````typescript
import {
	createAccountProfile,
	type AccountProfile,
	type AccountProfileId,
	type AccountProfileTheme,
	type UpdateAccountProfileInput,
} from "../domain";
import type {
	AccountProfileCommandRepository,
	AccountProfileQueryRepository,
	Unsubscribe,
} from "../domain";

type LegacyTheme = Partial<AccountProfileTheme> | null | undefined;
type LegacyUpdateProfileInput = {
	name?: string;
	bio?: string;
	photoURL?: string;
	theme?: AccountProfileTheme;
};

type LegacyAccountProfileRecord = {
	id: string;
	name?: string | null;
	email?: string | null;
	photoURL?: string | null;
	bio?: string | null;
	theme?: LegacyTheme;
} | null;

export interface LegacyAccountProfileDataSource {
	getUserProfile(userId: string): Promise<LegacyAccountProfileRecord>;
	subscribeToUserProfile(
		userId: string,
		onUpdate: (profile: LegacyAccountProfileRecord) => void,
	): Unsubscribe;
	updateUserProfile(userId: string, input: LegacyUpdateProfileInput): Promise<void>;
}

function normalizeTheme(theme: LegacyTheme): AccountProfileTheme | undefined {
	if (!theme?.primary || !theme?.background || !theme?.accent) {
		return undefined;
	}

	return {
		primary: theme.primary,
		background: theme.background,
		accent: theme.accent,
	};
}

function mapLegacyProfile(record: LegacyAccountProfileRecord): AccountProfile | null {
	if (!record) {
		return null;
	}

	const displayName = (record.name ?? "").trim() || "Unknown Actor";

	return createAccountProfile({
		id: record.id as AccountProfileId,
		displayName,
		email: record.email ?? undefined,
		photoURL: record.photoURL ?? undefined,
		bio: record.bio ?? undefined,
		theme: normalizeTheme(record.theme),
	});
}

/** Read-side adapter: maps legacy data source to AccountProfileQueryRepository. */
class LegacyAccountProfileQueryAdapter implements AccountProfileQueryRepository {
	constructor(
		private readonly legacyDataSource: LegacyAccountProfileDataSource,
	) {}

	async getAccountProfile(
		actorId: AccountProfileId,
	): Promise<AccountProfile | null> {
		const profile = await this.legacyDataSource.getUserProfile(actorId);
		return mapLegacyProfile(profile);
	}

	subscribeToAccountProfile(
		actorId: AccountProfileId,
		onUpdate: (profile: AccountProfile | null) => void,
	): Unsubscribe {
		return this.legacyDataSource.subscribeToUserProfile(actorId, (profile) => {
			onUpdate(mapLegacyProfile(profile));
		});
	}
}

/** Write-side adapter: maps legacy data source to AccountProfileCommandRepository. */
class LegacyAccountProfileCommandAdapter implements AccountProfileCommandRepository {
	constructor(
		private readonly legacyDataSource: LegacyAccountProfileDataSource,
	) {}

	async updateAccountProfile(
		actorId: AccountProfileId,
		input: UpdateAccountProfileInput,
	): Promise<void> {
		const legacyInput: LegacyUpdateProfileInput = {
			name: input.displayName,
			bio: input.bio,
			photoURL: input.photoURL,
			theme: input.theme,
		};

		await this.legacyDataSource.updateUserProfile(actorId, legacyInput);
	}
}

export function createLegacyAccountProfileQueryRepository(
	legacyDataSource: LegacyAccountProfileDataSource,
): AccountProfileQueryRepository {
	return new LegacyAccountProfileQueryAdapter(legacyDataSource);
}

export function createLegacyAccountProfileCommandRepository(
	legacyDataSource: LegacyAccountProfileDataSource,
): AccountProfileCommandRepository {
	return new LegacyAccountProfileCommandAdapter(legacyDataSource);
}
````

## File: modules/platform/subdomains/account-profile/interfaces/components/screens/SettingsProfileRouteScreen.tsx
````typescript
"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";

import { getProfile } from "../../queries/account-profile.queries";
import { updateProfile } from "../../_actions/account-profile.actions";
import { Button } from "@ui-shadcn/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@ui-shadcn/ui/card";
import { Input } from "@ui-shadcn/ui/input";
import { Label } from "@ui-shadcn/ui/label";
import { Textarea } from "@ui-shadcn/ui/textarea";

type FormState = {
  displayName: string;
  bio: string;
  photoURL: string;
};

const EMPTY_FORM: FormState = {
  displayName: "",
  bio: "",
  photoURL: "",
};

interface SettingsProfileRouteScreenProps {
  actorId: string | null;
  fallbackDisplayName?: string | null;
}

export function SettingsProfileRouteScreen({
  actorId,
  fallbackDisplayName,
}: SettingsProfileRouteScreenProps) {
  const normalizedActorId = actorId ?? "";

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!normalizedActorId) {
      setForm(EMPTY_FORM);
      return;
    }

    let cancelled = false;

    async function loadProfile() {
      setLoading(true);
      setMessage(null);
      try {
        const profile = await getProfile(normalizedActorId);
        if (!cancelled) {
          setForm({
            displayName: profile?.displayName ?? fallbackDisplayName ?? "",
            bio: profile?.bio ?? "",
            photoURL: profile?.photoURL ?? "",
          });
        }
      } catch {
        if (!cancelled) {
          setMessage("讀取個人資料失敗，請稍後重試。");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadProfile();

    return () => {
      cancelled = true;
    };
  }, [fallbackDisplayName, normalizedActorId]);

  const hasChanges = useMemo(() => {
    return form.displayName.trim().length > 0 || form.bio.trim().length > 0 || form.photoURL.trim().length > 0;
  }, [form]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!normalizedActorId) {
      setMessage("尚未登入，無法更新個人資料。");
      return;
    }

    const payload = {
      ...(form.displayName.trim() ? { displayName: form.displayName.trim() } : {}),
      ...(form.bio.trim() ? { bio: form.bio.trim() } : {}),
      ...(form.photoURL.trim() ? { photoURL: form.photoURL.trim() } : {}),
    };

    if (Object.keys(payload).length === 0) {
      setMessage("請至少填寫一個欄位再儲存。");
      return;
    }

    setSaving(true);
    setMessage(null);
    try {
      const result = await updateProfile(normalizedActorId, payload);
      if (result.success) {
        setMessage("已更新個人資料。");
      } else {
        setMessage(result.error?.message ?? "更新個人資料失敗。");
      }
    } catch {
      setMessage("更新個人資料失敗，請稍後重試。");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-2xl space-y-4">
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>個人資料</CardTitle>
          <CardDescription>這個頁面已切換到 account-profile 寫入流程（strangler migration）。</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="displayName">顯示名稱</Label>
              <Input
                id="displayName"
                value={form.displayName}
                onChange={(event) => {
                  setForm((prev) => ({ ...prev, displayName: event.target.value }));
                }}
                placeholder="輸入顯示名稱"
                disabled={loading || saving}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">簡介</Label>
              <Textarea
                id="bio"
                value={form.bio}
                onChange={(event) => {
                  setForm((prev) => ({ ...prev, bio: event.target.value }));
                }}
                placeholder="輸入個人簡介"
                rows={4}
                disabled={loading || saving}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="photoURL">頭像網址</Label>
              <Input
                id="photoURL"
                value={form.photoURL}
                onChange={(event) => {
                  setForm((prev) => ({ ...prev, photoURL: event.target.value }));
                }}
                placeholder="https://example.com/avatar.png"
                disabled={loading || saving}
              />
            </div>

            {message ? (
              <p className="text-sm text-muted-foreground">{message}</p>
            ) : null}

            <div className="flex justify-end">
              <Button type="submit" disabled={loading || saving || !hasChanges}>
                {saving ? "儲存中..." : "儲存個人資料"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
````

## File: modules/platform/subdomains/account-profile/interfaces/index.ts
````typescript
export { getProfile, subscribeToProfile } from "./queries/account-profile.queries";
export { updateProfile } from "./_actions/account-profile.actions";
export { SettingsProfileRouteScreen } from "./components/screens/SettingsProfileRouteScreen";
````

## File: modules/platform/subdomains/account-profile/README.md
````markdown
# Account Profile

User profile preferences and settings.

## Ownership

- **Bounded Context**: platform
- **Status**: Stub — awaiting use case definition

## Development Order

When implementing, follow inside-out:
1. Domain → 2. Application → 3. Ports (if needed) → 4. Infrastructure → 5. Interfaces
````

## File: modules/platform/subdomains/account/application/use-cases/account-policy.use-cases.ts
````typescript
/**
 * Account Policy Use Cases — pure application logic.
 * Token-refresh side effects are injected via TokenRefreshPort, not imported directly.
 */

import { commandSuccess, commandFailureFrom, type CommandResult } from "@shared-types";
import type { AccountPolicyRepository } from "../../domain/repositories/AccountPolicyRepository";
import type { TokenRefreshPort } from "../../domain/ports/TokenRefreshPort";
import type { CreatePolicyInput, UpdatePolicyInput } from "../../domain/entities/AccountPolicy";

// ─── Create Account Policy ────────────────────────────────────────────────────

export class CreateAccountPolicyUseCase {
  constructor(
    private readonly policyRepo: AccountPolicyRepository,
    private readonly tokenRefresh: TokenRefreshPort,
  ) {}

  async execute(input: CreatePolicyInput): Promise<CommandResult> {
    try {
      const policy = await this.policyRepo.create(input);
      await this.tokenRefresh.emitTokenRefreshSignal({
        accountId: input.accountId,
        reason: "policy:changed",
        ...(input.traceId ? { traceId: input.traceId } : {}),
      });
      return commandSuccess(policy.id, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "CREATE_ACCOUNT_POLICY_FAILED",
        err instanceof Error ? err.message : "Failed to create account policy",
      );
    }
  }
}

// ─── Update Account Policy ────────────────────────────────────────────────────

export class UpdateAccountPolicyUseCase {
  constructor(
    private readonly policyRepo: AccountPolicyRepository,
    private readonly tokenRefresh: TokenRefreshPort,
  ) {}

  async execute(
    policyId: string,
    accountId: string,
    data: UpdatePolicyInput,
    traceId?: string,
  ): Promise<CommandResult> {
    try {
      const existing = await this.policyRepo.findById(policyId);
      if (!existing) {
        return commandFailureFrom("ACCOUNT_POLICY_NOT_FOUND", `Policy ${policyId} not found`);
      }
      await this.policyRepo.update(policyId, data);
      await this.tokenRefresh.emitTokenRefreshSignal({
        accountId,
        reason: "policy:changed",
        ...(traceId ? { traceId } : {}),
      });
      return commandSuccess(policyId, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "UPDATE_ACCOUNT_POLICY_FAILED",
        err instanceof Error ? err.message : "Failed to update account policy",
      );
    }
  }
}

// ─── Delete Account Policy ────────────────────────────────────────────────────

export class DeleteAccountPolicyUseCase {
  constructor(
    private readonly policyRepo: AccountPolicyRepository,
    private readonly tokenRefresh: TokenRefreshPort,
  ) {}

  async execute(policyId: string, accountId: string): Promise<CommandResult> {
    try {
      const existing = await this.policyRepo.findById(policyId);
      if (!existing) {
        return commandFailureFrom("ACCOUNT_POLICY_NOT_FOUND", `Policy ${policyId} not found`);
      }
      await this.policyRepo.delete(policyId);
      await this.tokenRefresh.emitTokenRefreshSignal({
        accountId,
        reason: "policy:changed",
      });
      return commandSuccess(policyId, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "DELETE_ACCOUNT_POLICY_FAILED",
        err instanceof Error ? err.message : "Failed to delete account policy",
      );
    }
  }
}
````

## File: modules/platform/subdomains/account/application/use-cases/account.use-cases.ts
````typescript
/**
 * Account Use Cases — pure application logic.
 * All cross-domain dependencies are injected via ports (no direct imports).
 */

import { commandSuccess, commandFailureFrom, type CommandResult } from "@shared-types";
import type { AccountRepository } from "../../domain/repositories/AccountRepository";
import type { TokenRefreshPort } from "../../domain/ports/TokenRefreshPort";
import type { UpdateProfileInput, OrganizationRole } from "../../domain/entities/Account";

// ─── Create User Account ──────────────────────────────────────────────────────

export class CreateUserAccountUseCase {
  constructor(private readonly accountRepo: AccountRepository) {}

  async execute(userId: string, name: string, email: string): Promise<CommandResult> {
    try {
      await this.accountRepo.save({
        id: userId,
        name,
        email,
        accountType: "user",
      });
      return commandSuccess(userId, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "CREATE_USER_ACCOUNT_FAILED",
        err instanceof Error ? err.message : "Failed to create user account",
      );
    }
  }
}

// ─── Update User Profile ──────────────────────────────────────────────────────

export class UpdateUserProfileUseCase {
  constructor(private readonly accountRepo: AccountRepository) {}

  async execute(userId: string, data: UpdateProfileInput): Promise<CommandResult> {
    try {
      await this.accountRepo.updateProfile(userId, data);
      return commandSuccess(userId, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "UPDATE_USER_PROFILE_FAILED",
        err instanceof Error ? err.message : "Failed to update user profile",
      );
    }
  }
}

// ─── Credit Wallet ────────────────────────────────────────────────────────────

export class CreditWalletUseCase {
  constructor(private readonly accountRepo: AccountRepository) {}

  async execute(accountId: string, amount: number, description: string): Promise<CommandResult> {
    try {
      if (amount <= 0) {
        return commandFailureFrom("WALLET_INVALID_AMOUNT", "Credit amount must be positive");
      }
      const tx = await this.accountRepo.creditWallet(accountId, amount, description);
      return commandSuccess(tx.id, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "WALLET_CREDIT_FAILED",
        err instanceof Error ? err.message : "Failed to credit wallet",
      );
    }
  }
}

// ─── Debit Wallet ─────────────────────────────────────────────────────────────

export class DebitWalletUseCase {
  constructor(private readonly accountRepo: AccountRepository) {}

  async execute(accountId: string, amount: number, description: string): Promise<CommandResult> {
    try {
      if (amount <= 0) {
        return commandFailureFrom("WALLET_INVALID_AMOUNT", "Debit amount must be positive");
      }
      const balance = await this.accountRepo.getWalletBalance(accountId);
      if (balance < amount) {
        return commandFailureFrom("WALLET_INSUFFICIENT_FUNDS", "Insufficient wallet balance");
      }
      const tx = await this.accountRepo.debitWallet(accountId, amount, description);
      return commandSuccess(tx.id, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "WALLET_DEBIT_FAILED",
        err instanceof Error ? err.message : "Failed to debit wallet",
      );
    }
  }
}

// ─── Assign Account Role ──────────────────────────────────────────────────────

export class AssignAccountRoleUseCase {
  constructor(
    private readonly accountRepo: AccountRepository,
    private readonly tokenRefresh: TokenRefreshPort,
  ) {}

  async execute(
    accountId: string,
    role: OrganizationRole,
    grantedBy: string,
    traceId?: string,
  ): Promise<CommandResult> {
    try {
      const record = await this.accountRepo.assignRole(accountId, role, grantedBy);
      await this.tokenRefresh.emitTokenRefreshSignal({
        accountId,
        reason: "role:changed",
        ...(traceId ? { traceId } : {}),
      });
      return commandSuccess(record.accountId, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "ASSIGN_ROLE_FAILED",
        err instanceof Error ? err.message : "Failed to assign role",
      );
    }
  }
}

// ─── Revoke Account Role ──────────────────────────────────────────────────────

export class RevokeAccountRoleUseCase {
  constructor(
    private readonly accountRepo: AccountRepository,
    private readonly tokenRefresh: TokenRefreshPort,
  ) {}

  async execute(accountId: string): Promise<CommandResult> {
    try {
      await this.accountRepo.revokeRole(accountId);
      await this.tokenRefresh.emitTokenRefreshSignal({
        accountId,
        reason: "role:changed",
      });
      return commandSuccess(accountId, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "REVOKE_ROLE_FAILED",
        err instanceof Error ? err.message : "Failed to revoke role",
      );
    }
  }
}
````

## File: modules/platform/subdomains/account/domain/aggregates/Account.ts
````typescript
import type { AccountDomainEventType } from "../events";
import { canClose, canReactivate, canSuspend } from "../value-objects";
import { createAccountId, createAccountType, createWalletAmount } from "../value-objects";
import type { AccountStatus } from "../value-objects";

export interface AccountSnapshot {
	readonly id: string;
	readonly name: string;
	readonly accountType: "user" | "organization";
	readonly email: string | null;
	readonly photoURL: string | null;
	readonly bio: string | null;
	readonly status: "active" | "suspended" | "closed";
	readonly walletBalance: number;
	readonly createdAtISO: string;
	readonly updatedAtISO: string;
}

export interface CreateAccountInput {
	readonly name: string;
	readonly accountType: "user" | "organization";
	readonly email?: string | null;
	readonly photoURL?: string | null;
	readonly bio?: string | null;
}

export class Account {
	private readonly _domainEvents: AccountDomainEventType[] = [];

	private constructor(private _props: AccountSnapshot) {}

	static create(id: string, input: CreateAccountInput): Account {
		createAccountId(id);
		createAccountType(input.accountType);
		const now = new Date().toISOString();
		const account = new Account({
			id,
			name: input.name,
			accountType: input.accountType,
			email: input.email ?? null,
			photoURL: input.photoURL ?? null,
			bio: input.bio ?? null,
			status: "active",
			walletBalance: 0,
			createdAtISO: now,
			updatedAtISO: now,
		});
		account._domainEvents.push({
			type: "platform.account.created",
			eventId: crypto.randomUUID(),
			occurredAt: now,
			payload: {
				accountId: id,
				name: input.name,
				accountType: input.accountType,
				email: input.email ?? null,
			},
		});
		return account;
	}

	static reconstitute(snapshot: AccountSnapshot): Account {
		createAccountId(snapshot.id);
		createAccountType(snapshot.accountType);
		if (snapshot.walletBalance < 0) {
			throw new Error("Wallet balance cannot be negative.");
		}
		return new Account({ ...snapshot });
	}

	updateProfile(input: { name?: string; bio?: string | null; photoURL?: string | null }): void {
		if (this._props.status !== "active") {
			throw new Error("Only active account can update profile.");
		}
		const now = new Date().toISOString();
		this._props = {
			...this._props,
			name: input.name ?? this._props.name,
			bio: input.bio === undefined ? this._props.bio : input.bio,
			photoURL: input.photoURL === undefined ? this._props.photoURL : input.photoURL,
			updatedAtISO: now,
		};
		this._domainEvents.push({
			type: "platform.account.profile_updated",
			eventId: crypto.randomUUID(),
			occurredAt: now,
			payload: {
				accountId: this._props.id,
				name: this._props.name,
				bio: this._props.bio,
				photoURL: this._props.photoURL,
			},
		});
	}

	creditWallet(amount: number, description: string): void {
		const creditAmount = createWalletAmount(amount);
		const now = new Date().toISOString();
		this._props = {
			...this._props,
			walletBalance: this._props.walletBalance + creditAmount,
			updatedAtISO: now,
		};
		this._domainEvents.push({
			type: "platform.account.wallet_credited",
			eventId: crypto.randomUUID(),
			occurredAt: now,
			payload: {
				accountId: this._props.id,
				amount: creditAmount,
				description,
				balance: this._props.walletBalance,
			},
		});
	}

	debitWallet(amount: number, description: string): void {
		const debitAmount = createWalletAmount(amount);
		if (this._props.walletBalance < debitAmount) {
			throw new Error("Insufficient wallet balance.");
		}
		const now = new Date().toISOString();
		this._props = {
			...this._props,
			walletBalance: this._props.walletBalance - debitAmount,
			updatedAtISO: now,
		};
		this._domainEvents.push({
			type: "platform.account.wallet_debited",
			eventId: crypto.randomUUID(),
			occurredAt: now,
			payload: {
				accountId: this._props.id,
				amount: debitAmount,
				description,
				balance: this._props.walletBalance,
			},
		});
	}

	suspend(): void {
		if (!canSuspend(this._props.status)) {
			throw new Error("Only active account can be suspended.");
		}
		this.changeStatus("suspended", "platform.account.suspended");
	}

	close(): void {
		if (!canClose(this._props.status)) {
			throw new Error("Account is already closed.");
		}
		this.changeStatus("closed", "platform.account.closed");
	}

	reactivate(): void {
		if (!canReactivate(this._props.status)) {
			throw new Error("Only suspended account can be reactivated.");
		}
		this.changeStatus("active", "platform.account.reactivated");
	}

	get id(): string {
		return this._props.id;
	}

	get name(): string {
		return this._props.name;
	}

	get accountType(): "user" | "organization" {
		return this._props.accountType;
	}

	get email(): string | null {
		return this._props.email;
	}

	get photoURL(): string | null {
		return this._props.photoURL;
	}

	get bio(): string | null {
		return this._props.bio;
	}

	get status(): AccountStatus {
		return this._props.status;
	}

	get walletBalance(): number {
		return this._props.walletBalance;
	}

	get createdAtISO(): string {
		return this._props.createdAtISO;
	}

	get updatedAtISO(): string {
		return this._props.updatedAtISO;
	}

	getSnapshot(): Readonly<AccountSnapshot> {
		return Object.freeze({ ...this._props });
	}

	pullDomainEvents(): AccountDomainEventType[] {
		const events = [...this._domainEvents];
		this._domainEvents.length = 0;
		return events;
	}

	private changeStatus(
		status: AccountStatus,
		eventType: "platform.account.suspended" | "platform.account.closed" | "platform.account.reactivated",
	): void {
		const now = new Date().toISOString();
		this._props = { ...this._props, status, updatedAtISO: now };
		this._domainEvents.push({
			type: eventType,
			eventId: crypto.randomUUID(),
			occurredAt: now,
			payload: { accountId: this._props.id },
		});
	}
}
````

## File: modules/platform/subdomains/account/domain/aggregates/index.ts
````typescript
export * from "./Account";
````

## File: modules/platform/subdomains/account/domain/entities/Account.ts
````typescript
/**
 * Account Domain Entities — pure TypeScript, zero framework dependencies.
 * Bounded context: platform/account subdomain.
 */

import type { Timestamp } from "@shared-types";

export type AccountType = "user" | "organization";
export type OrganizationRole = "Owner" | "Admin" | "Member" | "Guest";
export type Presence = "active" | "away" | "offline";

export interface ThemeConfig {
  primary: string;
  background: string;
  accent: string;
}

export interface Wallet {
  balance: number;
}

export interface ExpertiseBadge {
  id: string;
  name: string;
  icon?: string;
}

export interface MemberReference {
  id: string;
  name: string;
  email: string;
  role: OrganizationRole;
  presence: Presence;
  isExternal?: boolean;
  expiryDate?: Timestamp;
}

export interface Team {
  id: string;
  name: string;
  description: string;
  type: "internal" | "external";
  memberIds: string[];
}

export interface AccountEntity {
  id: string;
  name: string;
  accountType: AccountType;
  email?: string;
  photoURL?: string;
  bio?: string;
  achievements?: string[];
  expertiseBadges?: ExpertiseBadge[];
  wallet?: Wallet;
  description?: string;
  ownerId?: string;
  role?: OrganizationRole;
  theme?: ThemeConfig;
  members?: MemberReference[];
  memberIds?: string[];
  teams?: Team[];
  createdAt?: Timestamp;
}

export type AccountRoleRecord = {
  accountId: string;
  role: OrganizationRole;
  grantedBy: string;
  grantedAt: Timestamp;
};

// ─── Value Objects ────────────────────────────────────────────────────────────

export interface UpdateProfileInput {
  name?: string;
  bio?: string;
  photoURL?: string;
  theme?: ThemeConfig;
}

export interface WalletTransaction {
  id: string;
  accountId: string;
  amount: number;
  description: string;
  createdAt: Timestamp;
}
````

## File: modules/platform/subdomains/account/domain/entities/AccountPolicy.ts
````typescript
/**
 * AccountPolicy — Domain Entity.
 * Represents an access-control policy attached to an account.
 * Account-level policies trigger CUSTOM_CLAIMS refresh via TokenRefreshPort.
 * Zero external dependencies.
 */

export type PolicyEffect = "allow" | "deny";

export interface PolicyRule {
  resource: string;
  actions: string[];
  effect: PolicyEffect;
  conditions?: Record<string, string>;
}

export interface AccountPolicy {
  readonly id: string;
  readonly accountId: string;
  readonly name: string;
  readonly description: string;
  readonly rules: PolicyRule[];
  readonly isActive: boolean;
  readonly createdAt: string; // ISO-8601
  readonly updatedAt: string; // ISO-8601
  readonly traceId?: string;
}

// ─── Value Objects (Commands) ─────────────────────────────────────────────────

export interface CreatePolicyInput {
  readonly accountId: string;
  readonly name: string;
  readonly description: string;
  readonly rules: PolicyRule[];
  readonly traceId?: string;
}

export interface UpdatePolicyInput {
  readonly name?: string;
  readonly description?: string;
  readonly rules?: PolicyRule[];
  readonly isActive?: boolean;
}
````

## File: modules/platform/subdomains/account/domain/events/AccountDomainEvent.ts
````typescript
export interface AccountDomainEvent {
	readonly eventId: string;
	readonly occurredAt: string;
	readonly type: string;
	readonly payload: object;
}

export interface AccountCreatedEvent extends AccountDomainEvent {
	readonly type: "platform.account.created";
	readonly payload: {
		readonly accountId: string;
		readonly name: string;
		readonly accountType: "user" | "organization";
		readonly email: string | null;
	};
}

export interface ProfileUpdatedEvent extends AccountDomainEvent {
	readonly type: "platform.account.profile_updated";
	readonly payload: {
		readonly accountId: string;
		readonly name: string;
		readonly bio: string | null;
		readonly photoURL: string | null;
	};
}

export interface WalletCreditedEvent extends AccountDomainEvent {
	readonly type: "platform.account.wallet_credited";
	readonly payload: {
		readonly accountId: string;
		readonly amount: number;
		readonly description: string;
		readonly balance: number;
	};
}

export interface WalletDebitedEvent extends AccountDomainEvent {
	readonly type: "platform.account.wallet_debited";
	readonly payload: {
		readonly accountId: string;
		readonly amount: number;
		readonly description: string;
		readonly balance: number;
	};
}

export interface AccountSuspendedEvent extends AccountDomainEvent {
	readonly type: "platform.account.suspended";
	readonly payload: {
		readonly accountId: string;
	};
}

export interface AccountClosedEvent extends AccountDomainEvent {
	readonly type: "platform.account.closed";
	readonly payload: {
		readonly accountId: string;
	};
}

export interface AccountReactivatedEvent extends AccountDomainEvent {
	readonly type: "platform.account.reactivated";
	readonly payload: {
		readonly accountId: string;
	};
}

export type AccountDomainEventType =
	| AccountCreatedEvent
	| ProfileUpdatedEvent
	| WalletCreditedEvent
	| WalletDebitedEvent
	| AccountSuspendedEvent
	| AccountClosedEvent
	| AccountReactivatedEvent;
````

## File: modules/platform/subdomains/account/domain/events/index.ts
````typescript
export * from "./AccountDomainEvent";
````

## File: modules/platform/subdomains/account/domain/index.ts
````typescript
export type {
  AccountType,
  OrganizationRole,
  Presence,
  ThemeConfig,
  Wallet,
  ExpertiseBadge,
  MemberReference,
  Team,
  AccountEntity,
  AccountRoleRecord,
  UpdateProfileInput,
  WalletTransaction,
} from "./entities/Account";

export type {
  PolicyEffect,
  PolicyRule,
  AccountPolicy,
  CreatePolicyInput,
  UpdatePolicyInput,
} from "./entities/AccountPolicy";

export type { AccountRepository } from "./repositories/AccountRepository";
export type { AccountQueryRepository, WalletBalanceSnapshot, Unsubscribe } from "./repositories/AccountQueryRepository";
export type { AccountPolicyRepository } from "./repositories/AccountPolicyRepository";
export type { TokenRefreshPort, TokenRefreshSignalInput } from "./ports/TokenRefreshPort";
export type { IAccountPort, IAccountQueryPort, IAccountPolicyPort } from "./ports";
export * from "./aggregates";
export * from "./events";
export * from "./value-objects";
````

## File: modules/platform/subdomains/account/domain/ports/index.ts
````typescript
/**
 * account domain/ports — driven port interfaces for the account subdomain.
 *
 * These re-export the repository contracts from domain/repositories/, making
 * the Ports layer explicitly visible in the directory structure.
 * New code should import port interfaces from this directory.
 */
export type { AccountRepository as IAccountPort } from "../repositories/AccountRepository";
export type { AccountQueryRepository as IAccountQueryPort } from "../repositories/AccountQueryRepository";
export type { AccountPolicyRepository as IAccountPolicyPort } from "../repositories/AccountPolicyRepository";
export type { TokenRefreshPort } from "./TokenRefreshPort";
````

## File: modules/platform/subdomains/account/domain/ports/TokenRefreshPort.ts
````typescript
/**
 * TokenRefreshPort — Driven port for emitting token-refresh signals.
 * Decouples account application layer from the identity subdomain.
 * Platform identity adapter implements this port.
 */

export type TokenRefreshReason = "role:changed" | "policy:changed";

export interface TokenRefreshSignalInput {
  accountId: string;
  reason: TokenRefreshReason;
  traceId?: string;
}

export interface TokenRefreshPort {
  emitTokenRefreshSignal(input: TokenRefreshSignalInput): Promise<void>;
}
````

## File: modules/platform/subdomains/account/domain/repositories/AccountPolicyRepository.ts
````typescript
/**
 * AccountPolicyRepository — Policy CRUD persistence port.
 */

import type { AccountPolicy, CreatePolicyInput, UpdatePolicyInput } from "../entities/AccountPolicy";

export interface AccountPolicyRepository {
  findById(id: string): Promise<AccountPolicy | null>;
  findAllByAccountId(accountId: string): Promise<AccountPolicy[]>;
  findActiveByAccountId(accountId: string): Promise<AccountPolicy[]>;
  create(input: CreatePolicyInput): Promise<AccountPolicy>;
  update(policyId: string, data: UpdatePolicyInput): Promise<void>;
  delete(policyId: string): Promise<void>;
}
````

## File: modules/platform/subdomains/account/domain/repositories/AccountQueryRepository.ts
````typescript
/**
 * AccountQueryRepository — Read-side persistence port (CQRS).
 * Separated from AccountRepository for CQRS clarity.
 */

import type { AccountEntity, WalletTransaction, AccountRoleRecord } from "../entities/Account";

export interface WalletBalanceSnapshot {
  balance: number;
}

export type Unsubscribe = () => void;

export interface AccountQueryRepository {
  getUserProfile(userId: string): Promise<AccountEntity | null>;
  subscribeToUserProfile(userId: string, onUpdate: (profile: AccountEntity | null) => void): Unsubscribe;
  getWalletBalance(accountId: string): Promise<WalletBalanceSnapshot>;
  subscribeToWalletBalance(accountId: string, onUpdate: (snapshot: WalletBalanceSnapshot) => void): Unsubscribe;
  subscribeToWalletTransactions(accountId: string, maxCount: number, onUpdate: (txs: WalletTransaction[]) => void): Unsubscribe;
  getAccountRole(accountId: string): Promise<AccountRoleRecord | null>;
  subscribeToAccountRoles(accountId: string, onUpdate: (record: AccountRoleRecord | null) => void): Unsubscribe;
  subscribeToAccountsForUser(userId: string, onUpdate: (accounts: Record<string, AccountEntity>) => void): Unsubscribe;
}
````

## File: modules/platform/subdomains/account/domain/repositories/AccountRepository.ts
````typescript
/**
 * AccountRepository — Write-side persistence port (CQRS).
 * Domain owns the contract; Infrastructure implements it.
 */

import type {
  AccountEntity,
  UpdateProfileInput,
  WalletTransaction,
  AccountRoleRecord,
  OrganizationRole,
} from "../entities/Account";

export interface AccountRepository {
  findById(id: string): Promise<AccountEntity | null>;
  save(account: AccountEntity): Promise<void>;
  updateProfile(userId: string, data: UpdateProfileInput): Promise<void>;
  getWalletBalance(accountId: string): Promise<number>;
  creditWallet(accountId: string, amount: number, description: string): Promise<WalletTransaction>;
  debitWallet(accountId: string, amount: number, description: string): Promise<WalletTransaction>;
  assignRole(accountId: string, role: OrganizationRole, grantedBy: string): Promise<AccountRoleRecord>;
  revokeRole(accountId: string): Promise<void>;
  getRole(accountId: string): Promise<AccountRoleRecord | null>;
}
````

## File: modules/platform/subdomains/account/domain/value-objects/AccountId.ts
````typescript
import { z } from "@lib-zod";

export const AccountIdSchema = z.string().min(1).brand("AccountId");
export type AccountId = z.infer<typeof AccountIdSchema>;

export function createAccountId(raw: string): AccountId {
	return AccountIdSchema.parse(raw);
}
````

## File: modules/platform/subdomains/account/domain/value-objects/AccountStatus.ts
````typescript
export const ACCOUNT_STATUSES = ["active", "suspended", "closed"] as const;
export type AccountStatus = (typeof ACCOUNT_STATUSES)[number];

export function canSuspend(status: AccountStatus): boolean {
	return status === "active";
}

export function canClose(status: AccountStatus): boolean {
	return status !== "closed";
}

export function canReactivate(status: AccountStatus): boolean {
	return status === "suspended";
}
````

## File: modules/platform/subdomains/account/domain/value-objects/AccountType.ts
````typescript
import { z } from "@lib-zod";

export const ACCOUNT_TYPES = ["user", "organization"] as const;
export type AccountType = (typeof ACCOUNT_TYPES)[number];

export const AccountTypeSchema = z.enum(ACCOUNT_TYPES);

export function createAccountType(raw: string): AccountType {
	return AccountTypeSchema.parse(raw);
}
````

## File: modules/platform/subdomains/account/domain/value-objects/index.ts
````typescript
export { AccountIdSchema, createAccountId } from "./AccountId";
export type { AccountId } from "./AccountId";

export { ACCOUNT_TYPES, AccountTypeSchema, createAccountType } from "./AccountType";
export type { AccountType } from "./AccountType";

export { ACCOUNT_STATUSES, canSuspend, canClose, canReactivate } from "./AccountStatus";
export type { AccountStatus } from "./AccountStatus";

export { WalletAmountSchema, createWalletAmount } from "./WalletAmount";
export type { WalletAmount } from "./WalletAmount";
````

## File: modules/platform/subdomains/account/domain/value-objects/WalletAmount.ts
````typescript
import { z } from "@lib-zod";

export const WalletAmountSchema = z.number().positive().brand("WalletAmount");
export type WalletAmount = z.infer<typeof WalletAmountSchema>;

export function createWalletAmount(raw: number): WalletAmount {
	return WalletAmountSchema.parse(raw);
}
````

## File: modules/platform/subdomains/account/infrastructure/account-service.ts
````typescript
/**
 * AccountService — Composition root for account use cases.
 * Wires repositories and ports; provides a unified service interface.
 */

import {
  CreateUserAccountUseCase,
  UpdateUserProfileUseCase,
  CreditWalletUseCase,
  DebitWalletUseCase,
  AssignAccountRoleUseCase,
  RevokeAccountRoleUseCase,
} from "../application/use-cases/account.use-cases";
import {
  CreateAccountPolicyUseCase,
  UpdateAccountPolicyUseCase,
  DeleteAccountPolicyUseCase,
} from "../application/use-cases/account-policy.use-cases";
import { FirebaseAccountRepository } from "./firebase/FirebaseAccountRepository";
import { FirebaseAccountQueryRepository } from "./firebase/FirebaseAccountQueryRepository";
import { FirebaseAccountPolicyRepository } from "./firebase/FirebaseAccountPolicyRepository";
import { tokenRefreshAdapter } from "./identity-token-refresh.adapter";
import type { UpdateProfileInput, OrganizationRole } from "../domain/entities/Account";
import type { CreatePolicyInput, UpdatePolicyInput } from "../domain/entities/AccountPolicy";
import type { AccountQueryRepository } from "../domain/repositories/AccountQueryRepository";
import type { CommandResult } from "@shared-types";

let _accountRepo: FirebaseAccountRepository | undefined;
let _policyRepo: FirebaseAccountPolicyRepository | undefined;

function getAccountRepo(): FirebaseAccountRepository {
  if (!_accountRepo) _accountRepo = new FirebaseAccountRepository();
  return _accountRepo;
}

function getAcctPolicyRepo(): FirebaseAccountPolicyRepository {
  if (!_policyRepo) _policyRepo = new FirebaseAccountPolicyRepository();
  return _policyRepo;
}

export const accountService = {
  createUserAccount: (userId: string, name: string, email: string): Promise<CommandResult> =>
    new CreateUserAccountUseCase(getAccountRepo()).execute(userId, name, email),

  updateUserProfile: (userId: string, data: UpdateProfileInput): Promise<CommandResult> =>
    new UpdateUserProfileUseCase(getAccountRepo()).execute(userId, data),

  creditWallet: (accountId: string, amount: number, description: string): Promise<CommandResult> =>
    new CreditWalletUseCase(getAccountRepo()).execute(accountId, amount, description),

  debitWallet: (accountId: string, amount: number, description: string): Promise<CommandResult> =>
    new DebitWalletUseCase(getAccountRepo()).execute(accountId, amount, description),

  assignRole: (accountId: string, role: OrganizationRole, grantedBy: string, traceId?: string): Promise<CommandResult> =>
    new AssignAccountRoleUseCase(getAccountRepo(), tokenRefreshAdapter).execute(accountId, role, grantedBy, traceId),

  revokeRole: (accountId: string): Promise<CommandResult> =>
    new RevokeAccountRoleUseCase(getAccountRepo(), tokenRefreshAdapter).execute(accountId),

  createPolicy: (input: CreatePolicyInput): Promise<CommandResult> =>
    new CreateAccountPolicyUseCase(getAcctPolicyRepo(), tokenRefreshAdapter).execute(input),

  updatePolicy: (policyId: string, accountId: string, data: UpdatePolicyInput, traceId?: string): Promise<CommandResult> =>
    new UpdateAccountPolicyUseCase(getAcctPolicyRepo(), tokenRefreshAdapter).execute(policyId, accountId, data, traceId),

  deletePolicy: (policyId: string, accountId: string): Promise<CommandResult> =>
    new DeleteAccountPolicyUseCase(getAcctPolicyRepo(), tokenRefreshAdapter).execute(policyId, accountId),
};

/**
 * Creates a wired set of client-side account use cases.
 * Keeps infrastructure wiring in the module boundary rather than in UI files.
 */
export function createClientAccountUseCases() {
  const repo = new FirebaseAccountRepository();
  return {
    createUserAccountUseCase: new CreateUserAccountUseCase(repo),
  };
}

// Internal re-export for the legacy bridge within this subdomain only.
export { FirebaseAccountQueryRepository };

/** Factory that returns a wired AccountQueryRepository without leaking the concrete class. */
export function createAccountQueryRepository(): AccountQueryRepository {
  return new FirebaseAccountQueryRepository();
}
````

## File: modules/platform/subdomains/account/infrastructure/firebase/FirebaseAccountPolicyRepository.ts
````typescript
/**
 * FirebaseAccountPolicyRepository — Policy persistence adapter.
 * Firebase SDK only exists in this file.
 */

import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { firebaseClientApp } from "@integration-firebase/client";
import type { AccountPolicyRepository } from "../../domain/repositories/AccountPolicyRepository";
import type { AccountPolicy, CreatePolicyInput, UpdatePolicyInput } from "../../domain/entities/AccountPolicy";

function toAccountPolicy(id: string, data: Record<string, unknown>): AccountPolicy {
  return {
    id,
    accountId: data.accountId as string,
    name: typeof data.name === "string" ? data.name : "",
    description: typeof data.description === "string" ? data.description : "",
    rules: Array.isArray(data.rules) ? (data.rules as AccountPolicy["rules"]) : [],
    isActive: data.isActive === true,
    createdAt: typeof data.createdAt === "string" ? data.createdAt : new Date().toISOString(),
    updatedAt: typeof data.updatedAt === "string" ? data.updatedAt : new Date().toISOString(),
    traceId: typeof data.traceId === "string" ? data.traceId : undefined,
  };
}

export class FirebaseAccountPolicyRepository implements AccountPolicyRepository {
  private get db() {
    return getFirestore(firebaseClientApp);
  }

  async findById(id: string): Promise<AccountPolicy | null> {
    const snap = await getDoc(doc(this.db, "accountPolicies", id));
    if (!snap.exists()) return null;
    return toAccountPolicy(snap.id, snap.data() as Record<string, unknown>);
  }

  async findAllByAccountId(accountId: string): Promise<AccountPolicy[]> {
    const q = query(collection(this.db, "accountPolicies"), where("accountId", "==", accountId));
    const snaps = await getDocs(q);
    return snaps.docs.map((d) => toAccountPolicy(d.id, d.data() as Record<string, unknown>));
  }

  async findActiveByAccountId(accountId: string): Promise<AccountPolicy[]> {
    const q = query(
      collection(this.db, "accountPolicies"),
      where("accountId", "==", accountId),
      where("isActive", "==", true),
    );
    const snaps = await getDocs(q);
    return snaps.docs.map((d) => toAccountPolicy(d.id, d.data() as Record<string, unknown>));
  }

  async create(input: CreatePolicyInput): Promise<AccountPolicy> {
    const now = new Date().toISOString();
    const ref = await addDoc(collection(this.db, "accountPolicies"), {
      accountId: input.accountId,
      name: input.name,
      description: input.description,
      rules: input.rules,
      isActive: true,
      createdAt: now,
      updatedAt: now,
      ...(input.traceId ? { traceId: input.traceId } : {}),
      _createdAt: serverTimestamp(),
    });
    return {
      id: ref.id,
      accountId: input.accountId,
      name: input.name,
      description: input.description,
      rules: input.rules,
      isActive: true,
      createdAt: now,
      updatedAt: now,
      traceId: input.traceId,
    };
  }

  async update(policyId: string, data: UpdatePolicyInput): Promise<void> {
    const updates: Record<string, unknown> = { updatedAt: new Date().toISOString(), _updatedAt: serverTimestamp() };
    if (data.name !== undefined) updates.name = data.name;
    if (data.description !== undefined) updates.description = data.description;
    if (data.rules !== undefined) updates.rules = data.rules;
    if (data.isActive !== undefined) updates.isActive = data.isActive;
    await updateDoc(doc(this.db, "accountPolicies", policyId), updates);
  }

  async delete(policyId: string): Promise<void> {
    await deleteDoc(doc(this.db, "accountPolicies", policyId));
  }
}
````

## File: modules/platform/subdomains/account/infrastructure/firebase/FirebaseAccountQueryRepository.ts
````typescript
/**
 * FirebaseAccountQueryRepository — Read-side infrastructure adapter.
 * Provides real-time subscriptions and one-shot reads.
 * Firebase SDK only exists in this file.
 */

import {
  getFirestore,
  doc,
  getDoc,
  collection,
  query,
  where,
  orderBy,
  limit as fbLimit,
  onSnapshot,
} from "firebase/firestore";
import { firebaseClientApp } from "@integration-firebase/client";
import type { AccountQueryRepository, WalletBalanceSnapshot, Unsubscribe } from "../../domain/repositories/AccountQueryRepository";
import type { AccountEntity, WalletTransaction, AccountRoleRecord, OrganizationRole } from "../../domain/entities/Account";

function toAccountEntity(id: string, data: Record<string, unknown>): AccountEntity {
  return {
    id,
    name: typeof data.name === "string" ? data.name : "",
    accountType:
      (data.accountType as AccountEntity["accountType"]) === "organization"
        ? "organization"
        : "user",
    email: typeof data.email === "string" ? data.email : undefined,
    photoURL: typeof data.photoURL === "string" ? data.photoURL : undefined,
    bio: typeof data.bio === "string" ? data.bio : undefined,
    wallet: data.wallet != null ? (data.wallet as AccountEntity["wallet"]) : undefined,
    theme: data.theme != null ? (data.theme as AccountEntity["theme"]) : undefined,
    members: Array.isArray(data.members) ? (data.members as AccountEntity["members"]) : undefined,
    memberIds: Array.isArray(data.memberIds) ? (data.memberIds as string[]) : undefined,
    teams: Array.isArray(data.teams) ? (data.teams as AccountEntity["teams"]) : undefined,
    ownerId: typeof data.ownerId === "string" ? data.ownerId : undefined,
    createdAt: data.createdAt as AccountEntity["createdAt"],
  };
}

export class FirebaseAccountQueryRepository implements AccountQueryRepository {
  private get db() {
    return getFirestore(firebaseClientApp);
  }

  async getUserProfile(userId: string): Promise<AccountEntity | null> {
    const snap = await getDoc(doc(this.db, "accounts", userId));
    if (!snap.exists()) return null;
    return toAccountEntity(snap.id, snap.data() as Record<string, unknown>);
  }

  subscribeToUserProfile(userId: string, onUpdate: (profile: AccountEntity | null) => void): Unsubscribe {
    return onSnapshot(doc(this.db, "accounts", userId), (snap) => {
      onUpdate(
        snap.exists() ? toAccountEntity(snap.id, snap.data() as Record<string, unknown>) : null,
      );
    });
  }

  async getWalletBalance(accountId: string): Promise<WalletBalanceSnapshot> {
    const snap = await getDoc(doc(this.db, "accounts", accountId));
    if (!snap.exists()) return { balance: 0 };
    const data = snap.data() as Record<string, unknown>;
    const wallet = data.wallet as Record<string, unknown> | undefined;
    return { balance: typeof wallet?.balance === "number" ? wallet.balance : 0 };
  }

  subscribeToWalletBalance(accountId: string, onUpdate: (snapshot: WalletBalanceSnapshot) => void): Unsubscribe {
    return onSnapshot(doc(this.db, "accounts", accountId), (snap) => {
      if (!snap.exists()) {
        onUpdate({ balance: 0 });
        return;
      }
      const data = snap.data() as Record<string, unknown>;
      const wallet = data.wallet as Record<string, unknown> | undefined;
      onUpdate({ balance: typeof wallet?.balance === "number" ? wallet.balance : 0 });
    });
  }

  subscribeToWalletTransactions(
    accountId: string,
    maxCount: number,
    onUpdate: (txs: WalletTransaction[]) => void,
  ): Unsubscribe {
    const ref = collection(this.db, "accounts", accountId, "walletTransactions");
    const q = query(ref, orderBy("occurredAt", "desc"), fbLimit(maxCount));
    return onSnapshot(q, (snap) => {
      const txs: WalletTransaction[] = snap.docs.map((d) => {
        const data = d.data() as Record<string, unknown>;
        return {
          id: d.id,
          accountId: data.accountId as string,
          amount: data.amount as number,
          description: (data.reason as string | undefined) ?? "",
          createdAt: data.occurredAt as WalletTransaction["createdAt"],
        };
      });
      onUpdate(txs);
    });
  }

  async getAccountRole(accountId: string): Promise<AccountRoleRecord | null> {
    const snap = await getDoc(doc(this.db, "accountRoles", accountId));
    if (!snap.exists()) return null;
    const data = snap.data() as Record<string, unknown>;
    return {
      accountId,
      role: data.role as OrganizationRole,
      grantedBy: data.grantedBy as string,
      grantedAt: data.grantedAt as AccountRoleRecord["grantedAt"],
    };
  }

  subscribeToAccountRoles(accountId: string, onUpdate: (record: AccountRoleRecord | null) => void): Unsubscribe {
    return onSnapshot(doc(this.db, "accountRoles", accountId), (snap) => {
      if (!snap.exists()) {
        onUpdate(null);
        return;
      }
      const data = snap.data() as Record<string, unknown>;
      onUpdate({
        accountId,
        role: data.role as OrganizationRole,
        grantedBy: data.grantedBy as string,
        grantedAt: data.grantedAt as AccountRoleRecord["grantedAt"],
      });
    });
  }

  subscribeToAccountsForUser(userId: string, onUpdate: (accounts: Record<string, AccountEntity>) => void): Unsubscribe {
    const db = this.db;
    let ownerAccounts: Record<string, AccountEntity> = {};
    let memberAccounts: Record<string, AccountEntity> = {};

    const emit = () => {
      onUpdate({ ...ownerAccounts, ...memberAccounts });
    };

    const ownerQuery = query(
      collection(db, "accounts"),
      where("ownerId", "==", userId),
      where("accountType", "==", "organization"),
    );

    const memberQuery = query(
      collection(db, "accounts"),
      where("memberIds", "array-contains", userId),
      where("accountType", "==", "organization"),
    );

    const unsubOwner = onSnapshot(ownerQuery, (snap) => {
      ownerAccounts = {};
      snap.docs.forEach((d) => {
        ownerAccounts[d.id] = toAccountEntity(d.id, d.data() as Record<string, unknown>);
      });
      emit();
    });

    const unsubMember = onSnapshot(memberQuery, (snap) => {
      memberAccounts = {};
      snap.docs.forEach((d) => {
        memberAccounts[d.id] = toAccountEntity(d.id, d.data() as Record<string, unknown>);
      });
      emit();
    });

    return () => {
      unsubOwner();
      unsubMember();
    };
  }
}
````

## File: modules/platform/subdomains/account/infrastructure/firebase/FirebaseAccountRepository.ts
````typescript
/**
 * FirebaseAccountRepository — Infrastructure adapter for account persistence.
 * Translates Firestore documents ↔ Domain AccountEntity.
 * Firebase SDK only exists in this file.
 */

import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  addDoc,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";
import { firebaseClientApp } from "@integration-firebase/client";
import type { AccountRepository } from "../../domain/repositories/AccountRepository";
import type {
  AccountEntity,
  UpdateProfileInput,
  WalletTransaction,
  AccountRoleRecord,
  OrganizationRole,
} from "../../domain/entities/Account";

function toAccountEntity(id: string, data: Record<string, unknown>): AccountEntity {
  return {
    id,
    name: typeof data.name === "string" ? data.name : "",
    accountType:
      (data.accountType as AccountEntity["accountType"]) === "organization"
        ? "organization"
        : "user",
    email: typeof data.email === "string" ? data.email : undefined,
    photoURL: typeof data.photoURL === "string" ? data.photoURL : undefined,
    bio: typeof data.bio === "string" ? data.bio : undefined,
    wallet: data.wallet != null ? (data.wallet as AccountEntity["wallet"]) : undefined,
    theme: data.theme != null ? (data.theme as AccountEntity["theme"]) : undefined,
    members: Array.isArray(data.members) ? (data.members as AccountEntity["members"]) : undefined,
    memberIds: Array.isArray(data.memberIds) ? (data.memberIds as string[]) : undefined,
    teams: Array.isArray(data.teams) ? (data.teams as AccountEntity["teams"]) : undefined,
    ownerId: typeof data.ownerId === "string" ? data.ownerId : undefined,
    createdAt: data.createdAt as AccountEntity["createdAt"],
  };
}

export class FirebaseAccountRepository implements AccountRepository {
  private get db() {
    return getFirestore(firebaseClientApp);
  }

  async findById(id: string): Promise<AccountEntity | null> {
    const snap = await getDoc(doc(this.db, "accounts", id));
    if (!snap.exists()) return null;
    return toAccountEntity(snap.id, snap.data() as Record<string, unknown>);
  }

  async save(account: AccountEntity): Promise<void> {
    await setDoc(doc(this.db, "accounts", account.id), {
      name: account.name,
      accountType: account.accountType,
      email: account.email ?? null,
      photoURL: account.photoURL ?? null,
      bio: account.bio ?? null,
      createdAt: serverTimestamp(),
    });
  }

  async updateProfile(userId: string, data: UpdateProfileInput): Promise<void> {
    const updates: Record<string, unknown> = { updatedAt: serverTimestamp() };
    if (data.name !== undefined) updates.name = data.name;
    if (data.bio !== undefined) updates.bio = data.bio;
    if (data.photoURL !== undefined) updates.photoURL = data.photoURL;
    if (data.theme !== undefined) updates.theme = data.theme;
    await updateDoc(doc(this.db, "accounts", userId), updates);
  }

  async getWalletBalance(accountId: string): Promise<number> {
    const snap = await getDoc(doc(this.db, "accounts", accountId));
    if (!snap.exists()) return 0;
    const data = snap.data() as Record<string, unknown>;
    const wallet = data.wallet as Record<string, unknown> | undefined;
    return typeof wallet?.balance === "number" ? wallet.balance : 0;
  }

  async creditWallet(accountId: string, amount: number, description: string): Promise<WalletTransaction> {
    const db = this.db;
    const accountRef = doc(db, "accounts", accountId);

    await runTransaction(db, async (txn) => {
      const snap = await txn.get(accountRef);
      const current = snap.exists()
        ? ((snap.data() as Record<string, unknown>).wallet as Record<string, unknown> | undefined)
        : undefined;
      const currentBalance = typeof current?.balance === "number" ? current.balance : 0;
      txn.update(accountRef, {
        "wallet.balance": currentBalance + amount,
        updatedAt: serverTimestamp(),
      });
    });

    const txRef = await addDoc(collection(db, "accounts", accountId, "walletTransactions"), {
      accountId,
      type: "credit",
      amount,
      reason: description,
      occurredAt: serverTimestamp(),
    });

    return {
      id: txRef.id,
      accountId,
      amount,
      description,
      createdAt: { seconds: Date.now() / 1000, nanoseconds: 0, toDate: () => new Date() },
    };
  }

  async debitWallet(accountId: string, amount: number, description: string): Promise<WalletTransaction> {
    const db = this.db;
    const accountRef = doc(db, "accounts", accountId);

    await runTransaction(db, async (txn) => {
      const snap = await txn.get(accountRef);
      const current = snap.exists()
        ? ((snap.data() as Record<string, unknown>).wallet as Record<string, unknown> | undefined)
        : undefined;
      const currentBalance = typeof current?.balance === "number" ? current.balance : 0;
      if (currentBalance < amount) {
        throw new Error(`Insufficient wallet balance: have ${currentBalance}, need ${amount}`);
      }
      txn.update(accountRef, {
        "wallet.balance": currentBalance - amount,
        updatedAt: serverTimestamp(),
      });
    });

    const txRef = await addDoc(collection(db, "accounts", accountId, "walletTransactions"), {
      accountId,
      type: "debit",
      amount,
      reason: description,
      occurredAt: serverTimestamp(),
    });

    return {
      id: txRef.id,
      accountId,
      amount,
      description,
      createdAt: { seconds: Date.now() / 1000, nanoseconds: 0, toDate: () => new Date() },
    };
  }

  async assignRole(accountId: string, role: OrganizationRole, grantedBy: string): Promise<AccountRoleRecord> {
    await setDoc(
      doc(this.db, "accountRoles", accountId),
      { accountId, role, grantedBy, grantedAt: new Date().toISOString(), isActive: true, updatedAt: serverTimestamp() },
      { merge: true },
    );
    return {
      accountId,
      role,
      grantedBy,
      grantedAt: { seconds: Date.now() / 1000, nanoseconds: 0, toDate: () => new Date() },
    };
  }

  async revokeRole(accountId: string): Promise<void> {
    await updateDoc(doc(this.db, "accountRoles", accountId), {
      isActive: false,
      revokedAt: new Date().toISOString(),
      updatedAt: serverTimestamp(),
    });
  }

  async getRole(accountId: string): Promise<AccountRoleRecord | null> {
    const snap = await getDoc(doc(this.db, "accountRoles", accountId));
    if (!snap.exists()) return null;
    const data = snap.data() as Record<string, unknown>;
    return {
      accountId,
      role: data.role as OrganizationRole,
      grantedBy: data.grantedBy as string,
      grantedAt: data.grantedAt as AccountRoleRecord["grantedAt"],
    };
  }
}
````

## File: modules/platform/subdomains/account/infrastructure/index.ts
````typescript
export { accountService, createClientAccountUseCases } from "./account-service";
export { createAccountQueryRepository } from "./account-service";
````

## File: modules/platform/subdomains/account/interfaces/components/HeaderUserAvatar.tsx
````typescript
"use client";

/**
 * HeaderUserAvatar – platform/account interfaces component.
 * Displays the signed-in user identity as an avatar with a sign-out action.
 */

import { LogOut } from "lucide-react";

import { Avatar, AvatarFallback } from "@ui-shadcn/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@ui-shadcn/ui/dropdown-menu";

interface HeaderUserAvatarProps {
  readonly name: string;
  readonly email: string;
  readonly onSignOut: () => void;
}

function toInitial(name: string, email: string) {
  const source = name.trim() || email.trim();
  return source.charAt(0).toUpperCase() || "U";
}

export function HeaderUserAvatar({ name, email, onSignOut }: HeaderUserAvatarProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="開啟使用者選單"
          className="rounded-full ring-offset-background transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          <Avatar size="sm">
            <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
              {toInitial(name, email)}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <div className="flex flex-col items-center gap-2 px-4 py-4">
          <Avatar size="lg">
            <AvatarFallback className="bg-primary/10 text-lg font-semibold text-primary">
              {toInitial(name, email)}
            </AvatarFallback>
          </Avatar>
          <div className="text-center">
            <p className="text-sm font-semibold text-foreground">{name}</p>
            <p className="text-xs text-muted-foreground">{email}</p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onClick={onSignOut}
          className="flex items-center gap-2"
        >
          <LogOut className="size-4 shrink-0" />
          <span>登出</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
````

## File: modules/platform/subdomains/account/interfaces/components/NavUser.tsx
````typescript
"use client";

import { Button } from "@ui-shadcn/ui/button";

interface NavUserProps {
  name: string;
  email: string;
  onSignOut: () => void;
}

export function NavUser({ name, email, onSignOut }: NavUserProps) {
  const initial = name.trim().charAt(0).toUpperCase() || "U";

  return (
    <div className="space-y-3 rounded-xl border border-border/50 bg-background/80 p-3">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
          {initial}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{name}</p>
          <p className="truncate text-xs text-muted-foreground">{email}</p>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onSignOut}
        className="w-full"
      >
        登出
      </Button>
    </div>
  );
}
````

## File: modules/platform/subdomains/account/interfaces/index.ts
````typescript
export { HeaderUserAvatar } from "./components/HeaderUserAvatar";
export { NavUser } from "./components/NavUser";

export {
  getUserProfile,
  subscribeToUserProfile,
  getWalletBalance,
  subscribeToWalletBalance,
  subscribeToWalletTransactions,
  getAccountRole,
  subscribeToAccountRoles,
  subscribeToAccountsForUser,
  getAccountPolicies,
  getActiveAccountPolicies,
} from "./queries/account.queries";

export {
  createUserAccount,
  updateUserProfile,
  creditWallet,
  debitWallet,
  assignAccountRole,
  revokeAccountRole,
} from "./_actions/account.actions";

export {
  createAccountPolicy,
  updateAccountPolicy,
  deleteAccountPolicy,
} from "./_actions/account-policy.actions";
````

## File: modules/platform/subdomains/account/README.md
````markdown
# Account

User account lifecycle management.

## Ownership

- **Bounded Context**: platform
- **Status**: Active

## Layers

| Layer | Purpose |
|-------|---------|
| `api/` | Public boundary for cross-subdomain access |
| `application/` | Use case orchestration and DTOs |
| `domain/` | Entities, value objects, and business rules |
| `infrastructure/` | Adapters, persistence, and external integrations |
| `interfaces/` | UI components, hooks, actions, and queries |

## Dependency Direction

```text
interfaces/ → application/ → domain/ ← infrastructure/
```

## Development Order

1. Domain → 2. Application → 3. Ports (if needed) → 4. Infrastructure → 5. Interfaces
````

## File: modules/platform/subdomains/ai/api/index.ts
````typescript
/**
 * Public API boundary for this subdomain.
 * Cross-module consumers must import through this entry point.
 */
export {};
````

## File: modules/platform/subdomains/ai/application/index.ts
````typescript
// Purpose: Application layer placeholder for platform subdomain 'ai'.
````

## File: modules/platform/subdomains/ai/domain/index.ts
````typescript
// Purpose: Domain layer placeholder for platform subdomain 'ai'.
````

## File: modules/platform/subdomains/ai/infrastructure/index.ts
````typescript
// Purpose: Infrastructure layer placeholder for platform subdomain 'ai'.
````

## File: modules/platform/subdomains/ai/README.md
````markdown
# Ai

共享 AI provider 路由、模型政策、配額與安全護欄。

## Ownership

- **Bounded Context**: platform
- **Subdomain Type**: Baseline
- **Status**: Stub — awaiting use case definition

## Development Order

When implementing, follow inside-out:
1. Domain → 2. Application → 3. Ports (if needed) → 4. Infrastructure → 5. Interfaces
````

## File: modules/platform/subdomains/analytics/api/index.ts
````typescript
/**
 * Public API boundary for this subdomain.
 * Cross-module consumers must import through this entry point.
 */
export {};
````

## File: modules/platform/subdomains/analytics/application/index.ts
````typescript
// Purpose: Application layer placeholder for platform subdomain 'analytics'.
````

## File: modules/platform/subdomains/analytics/domain/index.ts
````typescript
// Purpose: Domain layer placeholder for platform subdomain 'analytics'.
````

## File: modules/platform/subdomains/analytics/infrastructure/index.ts
````typescript
// Purpose: Infrastructure layer placeholder for platform subdomain 'analytics'.
````

## File: modules/platform/subdomains/analytics/README.md
````markdown
# Analytics

Platform-wide analytics and metrics.

## Ownership

- **Bounded Context**: platform
- **Status**: Stub — awaiting use case definition

## Development Order

When implementing, follow inside-out:
1. Domain → 2. Application → 3. Ports (if needed) → 4. Infrastructure → 5. Interfaces
````

## File: modules/platform/subdomains/audit-log/api/index.ts
````typescript
/**
 * Public API boundary for this subdomain.
 * Cross-module consumers must import through this entry point.
 */
export {};
````

## File: modules/platform/subdomains/audit-log/application/index.ts
````typescript
// Purpose: Application layer placeholder for platform subdomain 'audit-log'.
````

## File: modules/platform/subdomains/audit-log/domain/index.ts
````typescript
// Purpose: Domain layer placeholder for platform subdomain 'audit-log'.
````

## File: modules/platform/subdomains/audit-log/infrastructure/index.ts
````typescript
// Purpose: Infrastructure layer placeholder for platform subdomain 'audit-log'.
````

## File: modules/platform/subdomains/audit-log/README.md
````markdown
# Audit Log

Platform audit logging.

## Ownership

- **Bounded Context**: platform
- **Status**: Stub — awaiting use case definition

## Development Order

When implementing, follow inside-out:
1. Domain → 2. Application → 3. Ports (if needed) → 4. Infrastructure → 5. Interfaces
````

## File: modules/platform/subdomains/background-job/api/index.ts
````typescript
/**
 * Public API boundary for the background-job subdomain.
 * Cross-module consumers must import through this entry point.
 */

export * from "../application";
export { ingestionService } from "../infrastructure/ingestion-service";
export type { IngestionDocument } from "../domain/entities/IngestionDocument";
export type { IngestionChunk, IngestionChunkMetadata } from "../domain/entities/IngestionChunk";
export type { IngestionJob, IngestionStatus } from "../domain/entities/IngestionJob";
export { canTransitionIngestionStatus } from "../domain/entities/IngestionJob";
````

## File: modules/platform/subdomains/background-job/application/index.ts
````typescript
export {
  RegisterIngestionDocumentUseCase,
  AdvanceIngestionStageUseCase,
  ListWorkspaceIngestionJobsUseCase,
} from "./use-cases/ingestion.use-cases";
export type {
  IngestionResult,
  RegisterIngestionDocumentInput,
  AdvanceIngestionStageInput,
  ListWorkspaceIngestionJobsInput,
} from "./use-cases/ingestion.use-cases";
````

## File: modules/platform/subdomains/background-job/application/use-cases/ingestion.use-cases.ts
````typescript
/**
 * Ingestion Use Cases — application-layer orchestration for IngestionJob domain operations.
 *
 * Each use case receives its repository dependency via constructor injection,
 * keeping it testable and decoupled from any specific adapter.
 *
 * Return type uses a locally-defined IngestionResult<T> rather than the
 * command-only CommandResult, because creation and advancement operations
 * need to surface the resulting IngestionJob entity to callers.
 */

import { randomUUID } from "node:crypto";

import type { DomainError } from "@shared-types";

import type { IngestionDocument } from "../../domain/entities/IngestionDocument";
import { canTransitionIngestionStatus, type IngestionJob, type IngestionStatus } from "../../domain/entities/IngestionJob";
import type { IIngestionJobRepository } from "../../domain/repositories/IIngestionJobRepository";

// ── Shared result type ────────────────────────────────────────────────────────

export type IngestionResult<T> =
  | { readonly ok: true; readonly data: T }
  | { readonly ok: false; readonly error: DomainError };

function ok<T>(data: T): IngestionResult<T> {
  return { ok: true, data };
}

function fail(code: string, message: string): IngestionResult<never> {
  return { ok: false, error: { code, message } };
}

// ── Register Ingestion Document ───────────────────────────────────────────────

export interface RegisterIngestionDocumentInput {
  readonly organizationId: string;
  readonly workspaceId: string;
  readonly sourceFileId: string;
  readonly title: string;
  readonly mimeType: string;
}

export class RegisterIngestionDocumentUseCase {
  constructor(private readonly repo: IIngestionJobRepository) {}

  async execute(input: RegisterIngestionDocumentInput): Promise<IngestionResult<IngestionJob>> {
    const organizationId = input.organizationId.trim();
    const workspaceId    = input.workspaceId.trim();
    const sourceFileId   = input.sourceFileId.trim();
    const title          = input.title.trim();
    const mimeType       = input.mimeType.trim();

    if (!organizationId) return fail("INGESTION_ORGANIZATION_REQUIRED", "Organization is required.");
    if (!workspaceId)    return fail("INGESTION_WORKSPACE_REQUIRED",    "Workspace is required.");
    if (!sourceFileId)   return fail("INGESTION_SOURCE_FILE_REQUIRED",  "Source file id is required.");
    if (!title)          return fail("INGESTION_TITLE_REQUIRED",        "Document title is required.");
    if (!mimeType)       return fail("INGESTION_MIME_TYPE_REQUIRED",    "Mime type is required.");

    const now = new Date().toISOString();

    const document: IngestionDocument = {
      id: randomUUID(),
      organizationId,
      workspaceId,
      sourceFileId,
      title,
      mimeType,
      createdAtISO: now,
      updatedAtISO: now,
    };

    const job: IngestionJob = {
      id:           randomUUID(),
      document,
      status:       "uploaded",
      createdAtISO: now,
      updatedAtISO: now,
    };

    await this.repo.save(job);
    return ok(job);
  }
}

// ── Advance Ingestion Stage ───────────────────────────────────────────────────

export interface AdvanceIngestionStageInput {
  readonly documentId: string;
  readonly nextStatus: IngestionStatus;
  readonly statusMessage?: string;
}

export class AdvanceIngestionStageUseCase {
  constructor(private readonly repo: IIngestionJobRepository) {}

  async execute(input: AdvanceIngestionStageInput): Promise<IngestionResult<IngestionJob>> {
    const documentId = input.documentId.trim();

    if (!documentId) return fail("INGESTION_DOCUMENT_REQUIRED", "Document id is required.");

    const job = await this.repo.findByDocumentId(documentId);
    if (!job) return fail("INGESTION_DOCUMENT_NOT_FOUND", "Ingestion document not found.");

    if (!canTransitionIngestionStatus(job.status, input.nextStatus)) {
      return fail(
        "INGESTION_INVALID_STATUS_TRANSITION",
        `Cannot transition ingestion status from '${job.status}' to '${input.nextStatus}'.`,
      );
    }

    const updated = await this.repo.updateStatus({
      documentId,
      status:        input.nextStatus,
      statusMessage: input.statusMessage,
      updatedAtISO:  new Date().toISOString(),
    });

    if (!updated) return fail("INGESTION_UPDATE_FAILED", "Failed to persist ingestion status update.");

    return ok(updated);
  }
}

// ── List Workspace Ingestion Jobs ─────────────────────────────────────────────

export interface ListWorkspaceIngestionJobsInput {
  readonly organizationId: string;
  readonly workspaceId: string;
}

export class ListWorkspaceIngestionJobsUseCase {
  constructor(private readonly repo: IIngestionJobRepository) {}

  async execute(input: ListWorkspaceIngestionJobsInput): Promise<readonly IngestionJob[]> {
    return this.repo.listByWorkspace(input);
  }
}
````

## File: modules/platform/subdomains/background-job/domain/entities/IngestionChunk.ts
````typescript
/**
 * IngestionChunk — value-like entity representing a text segment produced
 * by the chunking stage of the ingestion pipeline.
 *
 * Produced downstream from the Python `py_fn` worker; tracked by the
 * platform layer for audit and retrieval-quality accounting.
 */

export interface IngestionChunkMetadata {
  readonly sourceDocId: string;
  readonly section?: string;
  readonly pageNumber?: number;
}

export interface IngestionChunk {
  readonly id: string;
  readonly documentId: string;
  readonly chunkIndex: number;
  readonly content: string;
  readonly metadata: IngestionChunkMetadata;
}
````

## File: modules/platform/subdomains/background-job/domain/entities/IngestionDocument.ts
````typescript
/**
 * IngestionDocument — value-like entity representing a source document
 * submitted for RAG pipeline processing.
 *
 * Immutable snapshot attached to an IngestionJob; updated only when the
 * underlying source file metadata changes (e.g. title rename, MIME reclassification).
 */

export interface IngestionDocument {
  readonly id: string;
  readonly organizationId: string;
  readonly workspaceId: string;
  readonly sourceFileId: string;
  readonly title: string;
  readonly mimeType: string;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}
````

## File: modules/platform/subdomains/background-job/domain/entities/IngestionJob.ts
````typescript
/**
 * IngestionJob — aggregate entity tracking a document through the RAG
 * ingestion pipeline.
 *
 * The embedded state machine enforces strict one-way status transitions,
 * keeping invalid states impossible at the domain level.
 *
 * Lifecycle (happy path):
 *   uploaded → parsing → chunking → embedding → indexed
 *
 * Repair paths:
 *   indexed  → stale → re-indexing → parsing
 *   failed   → re-indexing → parsing
 */

import type { IngestionDocument } from "./IngestionDocument";

// ── Status ────────────────────────────────────────────────────────────────────

export type IngestionStatus =
  | "uploaded"
  | "parsing"
  | "chunking"
  | "embedding"
  | "indexed"
  | "stale"
  | "re-indexing"
  | "failed";

const ALLOWED_TRANSITIONS: Readonly<Record<IngestionStatus, readonly IngestionStatus[]>> = {
  uploaded:      ["parsing",    "failed"],
  parsing:       ["chunking",   "failed"],
  chunking:      ["embedding",  "failed"],
  embedding:     ["indexed",    "failed"],
  indexed:       ["stale",      "re-indexing"],
  stale:         ["re-indexing"],
  "re-indexing": ["parsing",    "failed"],
  failed:        ["re-indexing"],
};

/**
 * Domain guard: returns true only when the requested transition is permitted
 * by the state machine contract.
 */
export function canTransitionIngestionStatus(
  from: IngestionStatus,
  to: IngestionStatus,
): boolean {
  return ALLOWED_TRANSITIONS[from].includes(to);
}

// ── Aggregate ─────────────────────────────────────────────────────────────────

export interface IngestionJob {
  /** Unique job identifier (UUID). */
  readonly id: string;
  /** Immutable document snapshot attached to this job. */
  readonly document: IngestionDocument;
  /** Current pipeline stage. */
  readonly status: IngestionStatus;
  /** Optional human-readable message describing the current stage or failure reason. */
  readonly statusMessage?: string;
  /** ISO-8601 timestamp of job creation. */
  readonly createdAtISO: string;
  /** ISO-8601 timestamp of last status update. */
  readonly updatedAtISO: string;
}
````

## File: modules/platform/subdomains/background-job/domain/events/index.ts
````typescript
export type {
  IngestionJobDomainEvent,
  IngestionJobRegisteredEvent,
  IngestionJobAdvancedEvent,
  IngestionJobFailedEvent,
  IngestionJobDomainEventType,
} from "./IngestionJobDomainEvent";
````

## File: modules/platform/subdomains/background-job/domain/events/IngestionJobDomainEvent.ts
````typescript
import type { IngestionStatus } from "../entities/IngestionJob";

export interface IngestionJobDomainEvent {
  readonly eventId: string;
  readonly occurredAt: string;
  readonly type: string;
  readonly payload: object;
}

export interface IngestionJobRegisteredEvent extends IngestionJobDomainEvent {
  readonly type: "platform.background-job.ingestion_registered";
  readonly payload: {
    readonly jobId: string;
    readonly documentId: string;
    readonly organizationId: string;
    readonly workspaceId: string;
    readonly title: string;
    readonly mimeType: string;
  };
}

export interface IngestionJobAdvancedEvent extends IngestionJobDomainEvent {
  readonly type: "platform.background-job.ingestion_advanced";
  readonly payload: {
    readonly jobId: string;
    readonly documentId: string;
    readonly previousStatus: IngestionStatus;
    readonly nextStatus: IngestionStatus;
  };
}

export interface IngestionJobFailedEvent extends IngestionJobDomainEvent {
  readonly type: "platform.background-job.ingestion_failed";
  readonly payload: {
    readonly jobId: string;
    readonly documentId: string;
    readonly reason: string;
  };
}

export type IngestionJobDomainEventType =
  | IngestionJobRegisteredEvent
  | IngestionJobAdvancedEvent
  | IngestionJobFailedEvent;
````

## File: modules/platform/subdomains/background-job/domain/index.ts
````typescript
export type { IngestionDocument } from "./entities/IngestionDocument";
export type { IngestionChunk, IngestionChunkMetadata } from "./entities/IngestionChunk";
export type { IngestionJob, IngestionStatus } from "./entities/IngestionJob";
export { canTransitionIngestionStatus } from "./entities/IngestionJob";
export type { IIngestionJobRepository } from "./repositories/IIngestionJobRepository";
export type { IIngestionJobPort } from "./ports";
export * from "./events";
````

## File: modules/platform/subdomains/background-job/domain/ports/index.ts
````typescript
/**
 * background-job domain/ports — driven port interfaces for the background-job subdomain.
 *
 * These re-export the repository contracts from domain/repositories/, making
 * the Ports layer explicitly visible in the directory structure.
 * New code should import port interfaces from this directory.
 */
export type { IIngestionJobRepository as IIngestionJobPort } from "../repositories/IIngestionJobRepository";
````

## File: modules/platform/subdomains/background-job/domain/repositories/IIngestionJobRepository.ts
````typescript
/**
 * IIngestionJobRepository — output port (driven port) for ingestion job persistence.
 *
 * Implementations live in the adapters layer (InMemoryIngestionJobRepository,
 * FirebaseIngestionJobRepository, …). The domain core depends only on this interface.
 */

import type { IngestionJob, IngestionStatus } from "../entities/IngestionJob";

export interface IIngestionJobRepository {
  /** Retrieve a job by its associated document id. Returns null if not found. */
  findByDocumentId(documentId: string): Promise<IngestionJob | null>;

  /** List all jobs scoped to a specific workspace. */
  listByWorkspace(input: {
    readonly organizationId: string;
    readonly workspaceId: string;
  }): Promise<readonly IngestionJob[]>;

  /** Persist a new ingestion job. */
  save(job: IngestionJob): Promise<void>;

  /** Advance job status; returns the updated job, or null if the document was not found. */
  updateStatus(input: {
    readonly documentId: string;
    readonly status: IngestionStatus;
    readonly statusMessage?: string;
    readonly updatedAtISO: string;
  }): Promise<IngestionJob | null>;
}
````

## File: modules/platform/subdomains/background-job/infrastructure/index.ts
````typescript
export { ingestionService } from "./ingestion-service";
export type { IngestionStatus } from "./ingestion-service";
export { InMemoryIngestionJobRepository } from "./InMemoryIngestionJobRepository";
````

## File: modules/platform/subdomains/background-job/infrastructure/ingestion-service.ts
````typescript
/**
 * ingestionService — composition root for knowledge ingestion use cases.
 *
 * Wires use cases to the default InMemoryIngestionJobRepository.
 * Swap the repository assignment here once a Firebase adapter is in place.
 *
 * This module is the single entry point for ingestion side-effects; adapters
 * (Server Actions, route handlers) must not reach into use cases directly.
 */

import type { IngestionJob } from "../domain/entities/IngestionJob";
import type { IngestionStatus } from "../domain/entities/IngestionJob";
import {
  RegisterIngestionDocumentUseCase,
  AdvanceIngestionStageUseCase,
  ListWorkspaceIngestionJobsUseCase,
  type IngestionResult,
  type RegisterIngestionDocumentInput,
  type AdvanceIngestionStageInput,
} from "../application/use-cases/ingestion.use-cases";
import { InMemoryIngestionJobRepository } from "./InMemoryIngestionJobRepository";

// Single shared repository instance for the lifetime of the module.
const defaultRepo = new InMemoryIngestionJobRepository();

export const ingestionService = {
  /**
   * Register a newly uploaded document and create an IngestionJob in
   * `uploaded` status, ready for the Python worker handoff.
   */
  registerDocument(input: RegisterIngestionDocumentInput): Promise<IngestionResult<IngestionJob>> {
    return new RegisterIngestionDocumentUseCase(defaultRepo).execute(input);
  },

  /**
   * Advance the ingestion pipeline to the given status.
   * Rejects invalid transitions with `INGESTION_INVALID_STATUS_TRANSITION`.
   */
  advanceStage(input: AdvanceIngestionStageInput): Promise<IngestionResult<IngestionJob>> {
    return new AdvanceIngestionStageUseCase(defaultRepo).execute(input);
  },

  /**
   * Return all ingestion jobs belonging to a workspace.
   */
  listWorkspaceJobs(input: {
    readonly organizationId: string;
    readonly workspaceId: string;
  }): Promise<readonly IngestionJob[]> {
    return new ListWorkspaceIngestionJobsUseCase(defaultRepo).execute(input);
  },
} satisfies {
  registerDocument(input: RegisterIngestionDocumentInput): Promise<IngestionResult<IngestionJob>>;
  advanceStage(input: AdvanceIngestionStageInput): Promise<IngestionResult<IngestionJob>>;
  listWorkspaceJobs(input: { readonly organizationId: string; readonly workspaceId: string }): Promise<readonly IngestionJob[]>;
};

// Re-export status type for convenience (callers using `ingestionService` should not
// need to reach into the domain layer directly).
export type { IngestionStatus };
````

## File: modules/platform/subdomains/background-job/infrastructure/InMemoryIngestionJobRepository.ts
````typescript
/**
 * InMemoryIngestionJobRepository — default in-process adapter implementing IIngestionJobRepository.
 *
 * Suitable for development environments and unit tests. Scoped to a single
 * process lifetime (data is lost on restart).
 *
 * Replace with FirebaseIngestionJobRepository for production persistence.
 */

import type { IngestionJob, IngestionStatus } from "../domain/entities/IngestionJob";
import type { IIngestionJobRepository } from "../domain/repositories/IIngestionJobRepository";

export class InMemoryIngestionJobRepository implements IIngestionJobRepository {
  /** Keyed by document.id for O(1) lookups. */
  private readonly store = new Map<string, IngestionJob>();

  async findByDocumentId(documentId: string): Promise<IngestionJob | null> {
    return this.store.get(documentId) ?? null;
  }

  async listByWorkspace(input: {
    readonly organizationId: string;
    readonly workspaceId: string;
  }): Promise<readonly IngestionJob[]> {
    return [...this.store.values()].filter(
      (job) =>
        job.document.organizationId === input.organizationId &&
        job.document.workspaceId    === input.workspaceId,
    );
  }

  async save(job: IngestionJob): Promise<void> {
    this.store.set(job.document.id, job);
  }

  async updateStatus(input: {
    readonly documentId: string;
    readonly status: IngestionStatus;
    readonly statusMessage?: string;
    readonly updatedAtISO: string;
  }): Promise<IngestionJob | null> {
    const current = this.store.get(input.documentId);
    if (!current) return null;

    const updated: IngestionJob = {
      ...current,
      status:        input.status,
      statusMessage: input.statusMessage,
      updatedAtISO:  input.updatedAtISO,
      document: {
        ...current.document,
        updatedAtISO: input.updatedAtISO,
      },
    };

    this.store.set(input.documentId, updated);
    return updated;
  }
}
````

## File: modules/platform/subdomains/background-job/README.md
````markdown
# Background Job

Background job scheduling and execution.

## Ownership

- **Bounded Context**: platform
- **Status**: Stub — awaiting use case definition

## Development Order

When implementing, follow inside-out:
1. Domain → 2. Application → 3. Ports (if needed) → 4. Infrastructure → 5. Interfaces
````

## File: modules/platform/subdomains/billing/api/index.ts
````typescript
/**
 * Public API boundary for this subdomain.
 * Cross-module consumers must import through this entry point.
 */
export {};
````

## File: modules/platform/subdomains/billing/application/index.ts
````typescript
// Purpose: Application layer placeholder for platform subdomain 'billing'.
````

## File: modules/platform/subdomains/billing/domain/index.ts
````typescript
// Purpose: Domain layer placeholder for platform subdomain 'billing'.
````

## File: modules/platform/subdomains/billing/infrastructure/index.ts
````typescript
// Purpose: Infrastructure layer placeholder for platform subdomain 'billing'.
````

## File: modules/platform/subdomains/billing/README.md
````markdown
# Billing

Billing and payment processing.

## Ownership

- **Bounded Context**: platform
- **Status**: Stub — awaiting use case definition

## Development Order

When implementing, follow inside-out:
1. Domain → 2. Application → 3. Ports (if needed) → 4. Infrastructure → 5. Interfaces
````

## File: modules/platform/subdomains/compliance/api/index.ts
````typescript
/**
 * Public API boundary for this subdomain.
 * Cross-module consumers must import through this entry point.
 */
export {};
````

## File: modules/platform/subdomains/compliance/application/index.ts
````typescript
// Purpose: Application layer placeholder for platform subdomain 'compliance'.
````

## File: modules/platform/subdomains/compliance/domain/index.ts
````typescript
// Purpose: Domain layer placeholder for platform subdomain 'compliance'.
````

## File: modules/platform/subdomains/compliance/infrastructure/index.ts
````typescript
// Purpose: Infrastructure layer placeholder for platform subdomain 'compliance'.
````

## File: modules/platform/subdomains/compliance/README.md
````markdown
# Compliance

Regulatory compliance management.

## Ownership

- **Bounded Context**: platform
- **Status**: Stub — awaiting use case definition

## Development Order

When implementing, follow inside-out:
1. Domain → 2. Application → 3. Ports (if needed) → 4. Infrastructure → 5. Interfaces
````

## File: modules/platform/subdomains/consent/api/index.ts
````typescript
/**
 * Public API boundary for this subdomain.
 * Cross-module consumers must import through this entry point.
 */
export {};
````

## File: modules/platform/subdomains/consent/application/index.ts
````typescript
// Purpose: Application layer placeholder for platform subdomain 'consent'.
````

## File: modules/platform/subdomains/consent/domain/index.ts
````typescript
// Purpose: Domain layer placeholder for platform subdomain 'consent'.
````

## File: modules/platform/subdomains/consent/infrastructure/index.ts
````typescript
// Purpose: Infrastructure layer placeholder for platform subdomain 'consent'.
````

## File: modules/platform/subdomains/consent/README.md
````markdown
# Consent

把同意與資料使用授權從 compliance 中切開。

## Ownership

- **Bounded Context**: platform
- **Subdomain Type**: Recommended Gap
- **Status**: Stub — awaiting use case definition

## Development Order

When implementing, follow inside-out:
1. Domain → 2. Application → 3. Ports (if needed) → 4. Infrastructure → 5. Interfaces
````

## File: modules/platform/subdomains/content/api/index.ts
````typescript
/**
 * Public API boundary for this subdomain.
 * Cross-module consumers must import through this entry point.
 */
export {};
````

## File: modules/platform/subdomains/content/application/index.ts
````typescript
// Purpose: Application layer placeholder for platform subdomain 'content'.
````

## File: modules/platform/subdomains/content/domain/index.ts
````typescript
// Purpose: Domain layer placeholder for platform subdomain 'content'.
````

## File: modules/platform/subdomains/content/infrastructure/index.ts
````typescript
// Purpose: Infrastructure layer placeholder for platform subdomain 'content'.
````

## File: modules/platform/subdomains/content/README.md
````markdown
# Content

Platform content management.

## Ownership

- **Bounded Context**: platform
- **Status**: Stub — awaiting use case definition

## Development Order

When implementing, follow inside-out:
1. Domain → 2. Application → 3. Ports (if needed) → 4. Infrastructure → 5. Interfaces
````

## File: modules/platform/subdomains/entitlement/README.md
````markdown
# Entitlement

建立有效權益與功能可用性的統一解算上下文。

## Ownership

- **Bounded Context**: platform
- **Subdomain Type**: Recommended Gap
- **Status**: Stub — awaiting use case definition

## Development Order

When implementing, follow inside-out:
1. Domain → 2. Application → 3. Ports (if needed) → 4. Infrastructure → 5. Interfaces
````

## File: modules/platform/subdomains/feature-flag/api/index.ts
````typescript
/**
 * Public API boundary for this subdomain.
 * Cross-module consumers must import through this entry point.
 */
export {};
````

## File: modules/platform/subdomains/feature-flag/application/index.ts
````typescript
// Purpose: Application layer placeholder for platform subdomain 'feature-flag'.
````

## File: modules/platform/subdomains/feature-flag/domain/index.ts
````typescript
// Purpose: Domain layer placeholder for platform subdomain 'feature-flag'.
````

## File: modules/platform/subdomains/feature-flag/infrastructure/index.ts
````typescript
// Purpose: Infrastructure layer placeholder for platform subdomain 'feature-flag'.
````

## File: modules/platform/subdomains/feature-flag/README.md
````markdown
# Feature Flag

Feature flag management and rollout.

## Ownership

- **Bounded Context**: platform
- **Status**: Stub — awaiting use case definition

## Development Order

When implementing, follow inside-out:
1. Domain → 2. Application → 3. Ports (if needed) → 4. Infrastructure → 5. Interfaces
````

## File: modules/platform/subdomains/identity/api/index.ts
````typescript
/**
 * identity subdomain public API boundary.
 * Consumers (e.g. infrastructure in sibling subdomains) must import through this barrel.
 */
export * from "../application";
export * from "../infrastructure";
export * from "../domain";
export * from "../interfaces";
````

## File: modules/platform/subdomains/identity/application/identity-error-message.ts
````typescript
type StructuredError = {
	code?: string;
	message?: string;
};

const IDENTITY_ERROR_MESSAGES: Record<string, string> = {
	"auth/network-request-failed": "We couldn’t reach the sign-in service. Check your connection and try again.",
	"auth/invalid-credential": "The email or password is incorrect.",
	"auth/invalid-login-credentials": "The email or password is incorrect.",
	"auth/invalid_login_credentials": "The email or password is incorrect.",
	"auth/user-not-found": "The email or password is incorrect.",
	"auth/wrong-password": "The email or password is incorrect.",
	"auth/email-already-in-use": "This email is already registered. Try signing in instead.",
	"auth/weak-password": "Password must be at least 6 characters long.",
	"auth/too-many-requests": "Too many attempts were made. Please wait a moment and try again.",
	"auth/user-disabled": "This account is currently disabled. Contact support for help.",
	"auth/operation-not-allowed": "This sign-in method is not available right now.",
	"auth/invalid-email": "Enter a valid email address.",
	"auth/missing-email": "Enter an email address.",
	"auth/missing-password": "Enter a password.",
};

export function toIdentityErrorMessage(error: unknown, fallback: string): string {
	const resolveFromMessage = (message: string) => {
		const normalizedMessage = message.trim();
		const matchedCode = normalizedMessage.match(/auth\/[a-z][a-z0-9_-]*/)?.[0]?.toLowerCase();

		if (matchedCode && matchedCode in IDENTITY_ERROR_MESSAGES) {
			return IDENTITY_ERROR_MESSAGES[matchedCode];
		}

		return normalizedMessage
			.replace(/^Firebase:\s*/i, "")
			.replace(/^Error\s*/i, "")
			.trim();
	};

	if (typeof error === "object" && error !== null) {
		const { code, message } = error as StructuredError;

		if (code && code in IDENTITY_ERROR_MESSAGES) {
			return IDENTITY_ERROR_MESSAGES[code];
		}

		if (typeof message === "string" && message.trim().length > 0) {
			return resolveFromMessage(message);
		}
	}

	if (error instanceof Error && error.message.trim().length > 0) {
		return resolveFromMessage(error.message);
	}

	return fallback;
}
````

## File: modules/platform/subdomains/identity/application/index.ts
````typescript
export { toIdentityErrorMessage } from "./identity-error-message";
export {
	RegisterUseCase,
	SendPasswordResetEmailUseCase,
	SignInAnonymouslyUseCase,
	SignInUseCase,
	SignOutUseCase,
} from "./use-cases/identity.use-cases";
export { EmitTokenRefreshSignalUseCase } from "./use-cases/token-refresh.use-cases";
````

## File: modules/platform/subdomains/identity/application/use-cases/identity.use-cases.ts
````typescript
import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { RegistrationInput, SignInCredentials } from "../../domain";
import type { IdentityRepository } from "../../domain";
import { toIdentityErrorMessage } from "../identity-error-message";

export class SignInUseCase {
	constructor(private readonly identityRepo: IdentityRepository) {}

	async execute(credentials: SignInCredentials): Promise<CommandResult> {
		try {
			const identity = await this.identityRepo.signInWithEmailAndPassword(credentials);
			return commandSuccess(identity.uid, 0);
		} catch (err) {
			return commandFailureFrom("SIGN_IN_FAILED", toIdentityErrorMessage(err, "Sign-in failed"));
		}
	}
}

export class SignInAnonymouslyUseCase {
	constructor(private readonly identityRepo: IdentityRepository) {}

	async execute(): Promise<CommandResult> {
		try {
			const identity = await this.identityRepo.signInAnonymously();
			return commandSuccess(identity.uid, 0);
		} catch (err) {
			return commandFailureFrom(
				"SIGN_IN_ANONYMOUS_FAILED",
				toIdentityErrorMessage(err, "Anonymous sign-in failed"),
			);
		}
	}
}

export class RegisterUseCase {
	constructor(private readonly identityRepo: IdentityRepository) {}

	async execute(input: RegistrationInput): Promise<CommandResult> {
		try {
			const identity = await this.identityRepo.createUserWithEmailAndPassword(input);
			await this.identityRepo.updateDisplayName(identity.uid, input.name);
			return commandSuccess(identity.uid, 0);
		} catch (err) {
			return commandFailureFrom("REGISTRATION_FAILED", toIdentityErrorMessage(err, "Registration failed"));
		}
	}
}

export class SendPasswordResetEmailUseCase {
	constructor(private readonly identityRepo: IdentityRepository) {}

	async execute(email: string): Promise<CommandResult> {
		try {
			await this.identityRepo.sendPasswordResetEmail(email);
			return commandSuccess(email, 0);
		} catch (err) {
			return commandFailureFrom(
				"PASSWORD_RESET_FAILED",
				toIdentityErrorMessage(err, "Password reset failed"),
			);
		}
	}
}

export class SignOutUseCase {
	constructor(private readonly identityRepo: IdentityRepository) {}

	async execute(): Promise<CommandResult> {
		const currentUser = this.identityRepo.getCurrentUser();
		const aggregateId = currentUser?.uid ?? "anonymous";

		try {
			await this.identityRepo.signOut();
			return commandSuccess(aggregateId, 0);
		} catch (err) {
			return commandFailureFrom("SIGN_OUT_FAILED", toIdentityErrorMessage(err, "Sign-out failed"));
		}
	}
}
````

## File: modules/platform/subdomains/identity/application/use-cases/token-refresh.use-cases.ts
````typescript
import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { TokenRefreshReason } from "../../domain";
import type { TokenRefreshRepository } from "../../domain";

export class EmitTokenRefreshSignalUseCase {
	constructor(private readonly tokenRefreshRepo: TokenRefreshRepository) {}

	async execute(accountId: string, reason: TokenRefreshReason, traceId?: string): Promise<CommandResult> {
		if (!/^[\w-]+$/.test(accountId)) {
			return commandFailureFrom(
				"TOKEN_REFRESH_INVALID_ACCOUNT_ID",
				`accountId '${accountId}' is not a valid Firestore document ID`,
			);
		}

		try {
			await this.tokenRefreshRepo.emit({
				accountId,
				reason,
				issuedAt: new Date().toISOString(),
				...(traceId ? { traceId } : {}),
			});
			return commandSuccess(accountId, 0);
		} catch (err) {
			return commandFailureFrom(
				"TOKEN_REFRESH_EMIT_FAILED",
				err instanceof Error ? err.message : "Failed to emit token refresh signal",
			);
		}
	}
}
````

## File: modules/platform/subdomains/identity/domain/aggregates/index.ts
````typescript
export * from "./UserIdentity";
````

## File: modules/platform/subdomains/identity/domain/aggregates/UserIdentity.ts
````typescript
import type { IdentityDomainEventType } from "../events";
import { canReactivate, canSuspend } from "../value-objects";
import { createDisplayName, createEmail, createUserId } from "../value-objects";
import type { IdentityStatus } from "../value-objects";

export interface UserIdentitySnapshot {
	readonly uid: string;
	readonly email: string | null;
	readonly displayName: string | null;
	readonly photoURL: string | null;
	readonly isAnonymous: boolean;
	readonly emailVerified: boolean;
	readonly status: IdentityStatus;
	readonly lastSignInAtISO: string | null;
	readonly createdAtISO: string;
	readonly updatedAtISO: string;
}

export interface CreateIdentityInput {
	readonly email: string | null;
	readonly displayName: string | null;
	readonly photoURL: string | null;
	readonly isAnonymous: boolean;
	readonly emailVerified: boolean;
}

export class UserIdentity {
	private readonly _domainEvents: IdentityDomainEventType[] = [];

	private constructor(private _props: UserIdentitySnapshot) {}

	static create(uid: string, input: CreateIdentityInput): UserIdentity {
		createUserId(uid);
		if (input.email !== null) {
			createEmail(input.email);
		}
		const normalizedDisplayName = input.displayName === null ? null : createDisplayName(input.displayName);
		const now = new Date().toISOString();
		const aggregate = new UserIdentity({
			uid,
			email: input.email,
			displayName: normalizedDisplayName ?? null,
			photoURL: input.photoURL,
			isAnonymous: input.isAnonymous,
			emailVerified: input.emailVerified,
			status: "active",
			lastSignInAtISO: null,
			createdAtISO: now,
			updatedAtISO: now,
		});
		aggregate._domainEvents.push({
			type: "platform.identity.created",
			eventId: crypto.randomUUID(),
			occurredAt: now,
			payload: {
				uid,
				email: input.email,
				isAnonymous: input.isAnonymous,
			},
		});
		return aggregate;
	}

	static reconstitute(snapshot: UserIdentitySnapshot): UserIdentity {
		return new UserIdentity({ ...snapshot });
	}

	signIn(): void {
		if (this._props.status !== "active") {
			throw new Error("Cannot sign in with a suspended identity.");
		}
		const now = new Date().toISOString();
		this._props = { ...this._props, lastSignInAtISO: now, updatedAtISO: now };
		this._domainEvents.push({
			type: "platform.identity.signed_in",
			eventId: crypto.randomUUID(),
			occurredAt: now,
			payload: { uid: this._props.uid, signedInAtISO: now },
		});
	}

	updateDisplayName(name: string): void {
		const normalizedName = createDisplayName(name);
		const previousDisplayName = this._props.displayName;
		const now = new Date().toISOString();
		this._props = { ...this._props, displayName: normalizedName, updatedAtISO: now };
		this._domainEvents.push({
			type: "platform.identity.display_name_updated",
			eventId: crypto.randomUUID(),
			occurredAt: now,
			payload: {
				uid: this._props.uid,
				previousDisplayName,
				displayName: normalizedName,
			},
		});
	}

	verifyEmail(): void {
		if (this._props.emailVerified) {
			throw new Error("Identity email is already verified.");
		}
		const now = new Date().toISOString();
		this._props = { ...this._props, emailVerified: true, updatedAtISO: now };
		this._domainEvents.push({
			type: "platform.identity.email_verified",
			eventId: crypto.randomUUID(),
			occurredAt: now,
			payload: { uid: this._props.uid, email: this._props.email },
		});
	}

	suspend(): void {
		if (!canSuspend(this._props.status)) {
			throw new Error("Identity is already suspended.");
		}
		const now = new Date().toISOString();
		this._props = { ...this._props, status: "suspended", updatedAtISO: now };
		this._domainEvents.push({
			type: "platform.identity.suspended",
			eventId: crypto.randomUUID(),
			occurredAt: now,
			payload: { uid: this._props.uid },
		});
	}

	reactivate(): void {
		if (!canReactivate(this._props.status)) {
			throw new Error("Identity is not suspended.");
		}
		const now = new Date().toISOString();
		this._props = { ...this._props, status: "active", updatedAtISO: now };
		this._domainEvents.push({
			type: "platform.identity.reactivated",
			eventId: crypto.randomUUID(),
			occurredAt: now,
			payload: { uid: this._props.uid },
		});
	}

	get uid(): string {
		return this._props.uid;
	}

	get email(): string | null {
		return this._props.email;
	}

	get displayName(): string | null {
		return this._props.displayName;
	}

	get isActive(): boolean {
		return this._props.status === "active";
	}

	get isAnonymous(): boolean {
		return this._props.isAnonymous;
	}

	get emailVerified(): boolean {
		return this._props.emailVerified;
	}

	getSnapshot(): Readonly<UserIdentitySnapshot> {
		return Object.freeze({ ...this._props });
	}

	pullDomainEvents(): IdentityDomainEventType[] {
		const events = [...this._domainEvents];
		this._domainEvents.length = 0;
		return events;
	}
}
````

## File: modules/platform/subdomains/identity/domain/entities/Identity.ts
````typescript
/**
 * Identity Domain Entity — represents an authenticated user session.
 * Zero external dependencies.
 */
export interface IdentityEntity {
	readonly uid: string;
	readonly email: string | null;
	readonly displayName: string | null;
	readonly photoURL: string | null;
	readonly isAnonymous: boolean;
	readonly emailVerified: boolean;
}

/** Value Object — credentials for sign-in */
export interface SignInCredentials {
	readonly email: string;
	readonly password: string;
}

/** Value Object — registration input */
export interface RegistrationInput {
	readonly email: string;
	readonly password: string;
	readonly name: string;
}
````

## File: modules/platform/subdomains/identity/domain/entities/TokenRefreshSignal.ts
````typescript
/**
 * TokenRefreshSignal — Domain Value Object.
 * Represents the signal written to Firestore when Custom Claims change.
 */

export type TokenRefreshReason = "role:changed" | "policy:changed";

export interface TokenRefreshSignal {
	readonly accountId: string;
	readonly reason: TokenRefreshReason;
	readonly issuedAt: string;
	readonly traceId?: string;
}
````

## File: modules/platform/subdomains/identity/domain/events/IdentityDomainEvent.ts
````typescript
export interface IdentityDomainEvent {
	readonly eventId: string;
	readonly occurredAt: string;
	readonly type: string;
	readonly payload: object;
}

export interface IdentityCreatedEvent extends IdentityDomainEvent {
	readonly type: "platform.identity.created";
	readonly payload: {
		readonly uid: string;
		readonly email: string | null;
		readonly isAnonymous: boolean;
	};
}

export interface SignedInEvent extends IdentityDomainEvent {
	readonly type: "platform.identity.signed_in";
	readonly payload: {
		readonly uid: string;
		readonly signedInAtISO: string;
	};
}

export interface DisplayNameUpdatedEvent extends IdentityDomainEvent {
	readonly type: "platform.identity.display_name_updated";
	readonly payload: {
		readonly uid: string;
		readonly previousDisplayName: string | null;
		readonly displayName: string;
	};
}

export interface EmailVerifiedEvent extends IdentityDomainEvent {
	readonly type: "platform.identity.email_verified";
	readonly payload: {
		readonly uid: string;
		readonly email: string | null;
	};
}

export interface IdentitySuspendedEvent extends IdentityDomainEvent {
	readonly type: "platform.identity.suspended";
	readonly payload: {
		readonly uid: string;
	};
}

export interface IdentityReactivatedEvent extends IdentityDomainEvent {
	readonly type: "platform.identity.reactivated";
	readonly payload: {
		readonly uid: string;
	};
}

export type IdentityDomainEventType =
	| IdentityCreatedEvent
	| SignedInEvent
	| DisplayNameUpdatedEvent
	| EmailVerifiedEvent
	| IdentitySuspendedEvent
	| IdentityReactivatedEvent;
````

## File: modules/platform/subdomains/identity/domain/events/index.ts
````typescript
export * from "./IdentityDomainEvent";
````

## File: modules/platform/subdomains/identity/domain/index.ts
````typescript
export type { IdentityEntity, RegistrationInput, SignInCredentials } from "./entities/Identity";
export type { TokenRefreshReason, TokenRefreshSignal } from "./entities/TokenRefreshSignal";
export type { IdentityRepository } from "./repositories/IdentityRepository";
export type { TokenRefreshRepository } from "./repositories/TokenRefreshRepository";
export type { IIdentityPort, ITokenRefreshPort } from "./ports";
export * from "./aggregates";
export * from "./events";
export * from "./value-objects";
````

## File: modules/platform/subdomains/identity/domain/ports/index.ts
````typescript
/**
 * identity domain/ports — driven port interfaces for the identity subdomain.
 *
 * These re-export the repository contracts from domain/repositories/, making
 * the Ports layer explicitly visible in the directory structure.
 * New code should import port interfaces from this directory.
 */
export type { IdentityRepository as IIdentityPort } from "../repositories/IdentityRepository";
export type { TokenRefreshRepository as ITokenRefreshPort } from "../repositories/TokenRefreshRepository";
````

## File: modules/platform/subdomains/identity/domain/repositories/IdentityRepository.ts
````typescript
import type { IdentityEntity, RegistrationInput, SignInCredentials } from "../entities/Identity";

export interface IdentityRepository {
	signInWithEmailAndPassword(credentials: SignInCredentials): Promise<IdentityEntity>;
	signInAnonymously(): Promise<IdentityEntity>;
	createUserWithEmailAndPassword(input: RegistrationInput): Promise<IdentityEntity>;
	updateDisplayName(uid: string, displayName: string): Promise<void>;
	sendPasswordResetEmail(email: string): Promise<void>;
	signOut(): Promise<void>;
	getCurrentUser(): IdentityEntity | null;
}
````

## File: modules/platform/subdomains/identity/domain/repositories/TokenRefreshRepository.ts
````typescript
import type { TokenRefreshSignal } from "../entities/TokenRefreshSignal";

export interface TokenRefreshRepository {
	emit(signal: TokenRefreshSignal): Promise<void>;
	subscribe(accountId: string, onSignal: () => void): () => void;
}
````

## File: modules/platform/subdomains/identity/domain/value-objects/DisplayName.ts
````typescript
import { z } from "@lib-zod";

export const DisplayNameSchema = z.string().min(1).max(100).trim().brand("DisplayName");
export type DisplayName = z.infer<typeof DisplayNameSchema>;

export function createDisplayName(raw: string): DisplayName {
	return DisplayNameSchema.parse(raw);
}
````

## File: modules/platform/subdomains/identity/domain/value-objects/Email.ts
````typescript
import { z } from "@lib-zod";

export const EmailSchema = z.string().email().brand("Email");
export type Email = z.infer<typeof EmailSchema>;

export function createEmail(raw: string): Email {
	return EmailSchema.parse(raw);
}

export function unsafeEmail(raw: string): Email {
	return raw as Email;
}
````

## File: modules/platform/subdomains/identity/domain/value-objects/IdentityStatus.ts
````typescript
export const IDENTITY_STATUSES = ["active", "suspended"] as const;
export type IdentityStatus = (typeof IDENTITY_STATUSES)[number];

export function canSuspend(status: IdentityStatus): boolean {
	return status === "active";
}

export function canReactivate(status: IdentityStatus): boolean {
	return status === "suspended";
}
````

## File: modules/platform/subdomains/identity/domain/value-objects/index.ts
````typescript
export { EmailSchema, createEmail, unsafeEmail } from "./Email";
export type { Email } from "./Email";

export { UserIdSchema, createUserId, unsafeUserId } from "./UserId";
export type { UserId } from "./UserId";

export { DisplayNameSchema, createDisplayName } from "./DisplayName";
export type { DisplayName } from "./DisplayName";

export { IDENTITY_STATUSES, canSuspend, canReactivate } from "./IdentityStatus";
export type { IdentityStatus } from "./IdentityStatus";
````

## File: modules/platform/subdomains/identity/domain/value-objects/UserId.ts
````typescript
import { z } from "@lib-zod";

export const UserIdSchema = z.string().min(1).brand("UserId");
export type UserId = z.infer<typeof UserIdSchema>;

export function createUserId(raw: string): UserId {
	return UserIdSchema.parse(raw);
}

export function unsafeUserId(raw: string): UserId {
	return raw as UserId;
}
````

## File: modules/platform/subdomains/identity/infrastructure/firebase/FirebaseIdentityRepository.ts
````typescript
import { firebaseClientApp } from "@integration-firebase/client";
import {
	createUserWithEmailAndPassword as fbCreateUser,
	getAuth,
	sendPasswordResetEmail as fbSendPasswordResetEmail,
	signInAnonymously as fbSignInAnonymously,
	signInWithEmailAndPassword as fbSignIn,
	signOut as fbSignOut,
	type User,
	updateProfile,
} from "firebase/auth";
import type { IdentityEntity, IdentityRepository, RegistrationInput, SignInCredentials } from "../../domain";

function toIdentityEntity(user: User): IdentityEntity {
	return {
		uid: user.uid,
		email: user.email,
		displayName: user.displayName,
		photoURL: user.photoURL,
		isAnonymous: user.isAnonymous,
		emailVerified: user.emailVerified,
	};
}

export class FirebaseIdentityRepository implements IdentityRepository {
	private get auth() {
		return getAuth(firebaseClientApp);
	}

	async signInWithEmailAndPassword(credentials: SignInCredentials): Promise<IdentityEntity> {
		const result = await fbSignIn(this.auth, credentials.email, credentials.password);
		return toIdentityEntity(result.user);
	}

	async signInAnonymously(): Promise<IdentityEntity> {
		const result = await fbSignInAnonymously(this.auth);
		return toIdentityEntity(result.user);
	}

	async createUserWithEmailAndPassword(input: RegistrationInput): Promise<IdentityEntity> {
		const result = await fbCreateUser(this.auth, input.email, input.password);
		return toIdentityEntity(result.user);
	}

	async updateDisplayName(uid: string, displayName: string): Promise<void> {
		const currentUser = this.auth.currentUser;
		if (currentUser && currentUser.uid === uid) {
			await updateProfile(currentUser, { displayName });
		}
	}

	async sendPasswordResetEmail(email: string): Promise<void> {
		await fbSendPasswordResetEmail(this.auth, email);
	}

	async signOut(): Promise<void> {
		await fbSignOut(this.auth);
	}

	getCurrentUser(): IdentityEntity | null {
		const user = this.auth.currentUser;
		return user ? toIdentityEntity(user) : null;
	}
}
````

## File: modules/platform/subdomains/identity/infrastructure/firebase/FirebaseTokenRefreshRepository.ts
````typescript
import { firebaseClientApp } from "@integration-firebase/client";
import { doc, getFirestore, onSnapshot, setDoc } from "firebase/firestore";
import type { TokenRefreshRepository, TokenRefreshSignal } from "../../domain";

const COLLECTION = "tokenRefreshSignals";

export class FirebaseTokenRefreshRepository implements TokenRefreshRepository {
	private get db() {
		return getFirestore(firebaseClientApp);
	}

	async emit(signal: TokenRefreshSignal): Promise<void> {
		await setDoc(
			doc(this.db, COLLECTION, signal.accountId),
			{
				accountId: signal.accountId,
				reason: signal.reason,
				issuedAt: signal.issuedAt,
				...(signal.traceId ? { traceId: signal.traceId } : {}),
			},
			{ merge: true },
		);
	}

	subscribe(accountId: string, onSignal: () => void): () => void {
		let isFirstEmission = true;
		const ref = doc(this.db, COLLECTION, accountId);
		return onSnapshot(ref, () => {
			if (isFirstEmission) {
				isFirstEmission = false;
				return;
			}
			onSignal();
		});
	}
}
````

## File: modules/platform/subdomains/identity/infrastructure/identity-service.ts
````typescript
/**
 * identity-service.ts — Adapter-layer composition root.
 *
 * Wires Firebase-backed repositories into identity use cases.
 * Lives in adapters/ because it instantiates infrastructure adapters.
 * Dependency direction: adapters/ -> application/ -> domain/ (correct, no violation).
 */

import type { TokenRefreshReason } from "../domain";
import { EmitTokenRefreshSignalUseCase } from "../application/use-cases/token-refresh.use-cases";
import {
	RegisterUseCase,
	SendPasswordResetEmailUseCase,
	SignInAnonymouslyUseCase,
	SignInUseCase,
} from "../application/use-cases/identity.use-cases";
import { FirebaseIdentityRepository } from "./firebase/FirebaseIdentityRepository";
import { FirebaseTokenRefreshRepository } from "./firebase/FirebaseTokenRefreshRepository";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface EmitTokenRefreshSignalInput {
	accountId: string;
	reason: TokenRefreshReason;
	traceId?: string;
}

// ─── Server-side token refresh signal emitter ─────────────────────────────────

let _tokenRefreshRepo: FirebaseTokenRefreshRepository | undefined;
let _emitUseCase: EmitTokenRefreshSignalUseCase | undefined;

function getEmitUseCase(): EmitTokenRefreshSignalUseCase {
	if (!_emitUseCase) {
		if (!_tokenRefreshRepo) _tokenRefreshRepo = new FirebaseTokenRefreshRepository();
		_emitUseCase = new EmitTokenRefreshSignalUseCase(_tokenRefreshRepo);
	}
	return _emitUseCase;
}

/**
 * identityApi — server-side operations for identity management.
 * Intended for use in Server Actions and server-side code paths.
 */
export const identityApi = {
	async emitTokenRefreshSignal(input: EmitTokenRefreshSignalInput): Promise<void> {
		await getEmitUseCase().execute(input.accountId, input.reason, input.traceId);
	},
} as const;

// ─── Client-side use-case factory ─────────────────────────────────────────────

/**
 * createClientAuthUseCases — creates Firebase-wired client-side auth use cases.
 * Each call returns fresh use-case instances sharing one repository instance.
 * Use only in "use client" components or client-side hooks.
 */
export function createClientAuthUseCases() {
	const repo = new FirebaseIdentityRepository();
	return {
		signInUseCase: new SignInUseCase(repo),
		signInAnonymouslyUseCase: new SignInAnonymouslyUseCase(repo),
		registerUseCase: new RegisterUseCase(repo),
		sendPasswordResetEmailUseCase: new SendPasswordResetEmailUseCase(repo),
	};
}
````

## File: modules/platform/subdomains/identity/infrastructure/index.ts
````typescript
export { FirebaseIdentityRepository } from "./firebase/FirebaseIdentityRepository";
export { FirebaseTokenRefreshRepository } from "./firebase/FirebaseTokenRefreshRepository";
export type { EmitTokenRefreshSignalInput } from "./identity-service";
export { createClientAuthUseCases, identityApi } from "./identity-service";
````

## File: modules/platform/subdomains/identity/interfaces/_actions/identity.actions.ts
````typescript
"use server";

import { commandFailureFrom, type CommandResult } from "@shared-types";
import { toIdentityErrorMessage } from "../../application/identity-error-message";
import {
	RegisterUseCase,
	SendPasswordResetEmailUseCase,
	SignInAnonymouslyUseCase,
	SignInUseCase,
	SignOutUseCase,
} from "../../application/use-cases/identity.use-cases";
import { FirebaseIdentityRepository } from "../../api";

const identityRepo = new FirebaseIdentityRepository();

export async function signIn(email: string, password: string): Promise<CommandResult> {
	try {
		return await new SignInUseCase(identityRepo).execute({ email, password });
	} catch (err) {
		return commandFailureFrom("SIGN_IN_FAILED", toIdentityErrorMessage(err, "Unexpected error"));
	}
}

export async function signInAnonymously(): Promise<CommandResult> {
	try {
		return await new SignInAnonymouslyUseCase(identityRepo).execute();
	} catch (err) {
		return commandFailureFrom(
			"SIGN_IN_ANONYMOUS_FAILED",
			toIdentityErrorMessage(err, "Unexpected error"),
		);
	}
}

export async function register(email: string, password: string, name: string): Promise<CommandResult> {
	try {
		return await new RegisterUseCase(identityRepo).execute({ email, password, name });
	} catch (err) {
		return commandFailureFrom("REGISTRATION_FAILED", toIdentityErrorMessage(err, "Unexpected error"));
	}
}

export async function sendPasswordResetEmail(email: string): Promise<CommandResult> {
	try {
		return await new SendPasswordResetEmailUseCase(identityRepo).execute(email);
	} catch (err) {
		return commandFailureFrom("PASSWORD_RESET_FAILED", toIdentityErrorMessage(err, "Unexpected error"));
	}
}

export async function signOut(): Promise<CommandResult> {
	try {
		return await new SignOutUseCase(identityRepo).execute();
	} catch (err) {
		return commandFailureFrom("SIGN_OUT_FAILED", toIdentityErrorMessage(err, "Unexpected error"));
	}
}
````

## File: modules/platform/subdomains/identity/interfaces/components/ShellGuard.tsx
````typescript
"use client";

/**
 * ShellGuard – platform/identity interfaces component.
 * Client-side auth guard for the authenticated shell.
 *
 * Responsibilities:
 *  1. Redirect to `/` (public auth page) when auth status is "unauthenticated"
 *  2. Mount useTokenRefreshListener for [S6] Claims refresh (Party 3)
 *  3. Show a loading state while auth is initializing
 */

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "../providers/auth-provider";
import { useTokenRefreshListener } from "../hooks/useTokenRefreshListener";

interface ShellGuardProps {
  children: ReactNode;
}

export function ShellGuard({ children }: ShellGuardProps) {
  const { state } = useAuth();
  const { user, status } = state;
  const router = useRouter();

  // [S6] Party 3: force-refresh ID token when a TOKEN_REFRESH_SIGNAL is emitted
  useTokenRefreshListener(user?.id ?? null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/");
    }
  }, [status, router]);

  if (status === "initializing") {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  return <>{children}</>;
}
````

## File: modules/platform/subdomains/identity/interfaces/contexts/auth-context.ts
````typescript
"use client";

/**
 * auth-context.ts — platform/identity interfaces layer
 * Defines the AuthContext contract: state shape, actions, and React context.
 * Consumed by AuthProvider and useAuth().
 *
 * AuthUser is owned by the Platform/Identity bounded context.
 */

import { createContext, type Dispatch } from "react";

import type { AuthUser } from "@/modules/platform/api/contracts";
export type { AuthUser };

export type AuthStatus = "initializing" | "authenticated" | "unauthenticated";

export interface AuthState {
  user: AuthUser | null;
  status: AuthStatus;
}

export type AuthAction =
  | { type: "SET_AUTH_STATE"; payload: { user: AuthUser | null; status: AuthStatus } }
  | { type: "UPDATE_DISPLAY_NAME"; payload: { name: string } };

export interface AuthContextValue {
  state: AuthState;
  dispatch: Dispatch<AuthAction>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
````

## File: modules/platform/subdomains/identity/interfaces/hooks/useTokenRefreshListener.tsx
````typescript
"use client";

import { getFirebaseAuth } from "@integration-firebase";
import { useEffect } from "react";
import { FirebaseTokenRefreshRepository } from "../../api";

let _tokenRefreshRepo: FirebaseTokenRefreshRepository | undefined;

function getTokenRefreshRepo(): FirebaseTokenRefreshRepository {
	if (!_tokenRefreshRepo) _tokenRefreshRepo = new FirebaseTokenRefreshRepository();
	return _tokenRefreshRepo;
}

export function useTokenRefreshListener(accountId: string | null | undefined): void {
	useEffect(() => {
		if (!accountId) return;
		if (!/^[\w-]+$/.test(accountId)) return;

		const unsubscribe = getTokenRefreshRepo().subscribe(accountId, () => {
			const auth = getFirebaseAuth();
			const currentUser = auth.currentUser;
			if (!currentUser) return;
			void currentUser.getIdToken(true).catch(() => {
				// Non-fatal: token refreshes naturally on next expiry cycle.
			});
		});

		return () => unsubscribe();
	}, [accountId]);
}
````

## File: modules/platform/subdomains/identity/interfaces/index.ts
````typescript
export { ShellGuard } from "./components/ShellGuard";
export {
  AuthContext,
  type AuthState,
  type AuthAction,
  type AuthContextValue,
  type AuthStatus,
  type AuthUser,
} from "./contexts/auth-context";
export { AuthProvider, useAuth } from "./providers/auth-provider";
export {
  DEV_DEMO_ACCOUNT_EMAIL,
  isLocalDevDemoAllowed,
  isDevDemoCredential,
  createDevDemoUser,
  readDevDemoSession,
  writeDevDemoSession,
  clearDevDemoSession,
} from "./utils/dev-demo-auth";
export {
  register,
  sendPasswordResetEmail,
  signIn,
  signInAnonymously,
  signOut,
} from "./_actions/identity.actions";
export { useTokenRefreshListener } from "./hooks/useTokenRefreshListener";
````

## File: modules/platform/subdomains/identity/interfaces/providers/auth-provider.tsx
````typescript
"use client";

/**
 * auth-provider.tsx — platform/identity interfaces layer
 * Hosts the Firebase auth state lifecycle and exposes useAuth().
 * Syncs onAuthStateChanged → AuthContext → consumed by AppProvider and shell guard.
 *
 * [S6] Token refresh is handled separately by useTokenRefreshListener (Party 3).
 */

import { useReducer, useContext, useEffect, type ReactNode } from "react";
import {
  getFirebaseAuth,
  onFirebaseAuthStateChanged,
  signOutFirebase,
  type User,
} from "@integration-firebase";
import {
  AuthContext,
  type AuthAction,
  type AuthState,
  type AuthUser,
} from "../contexts/auth-context";
import {
  clearDevDemoSession,
  isLocalDevDemoAllowed,
  readDevDemoSession,
} from "../utils/dev-demo-auth";

// ─── Constants ────────────────────────────────────────────────────────────────

const AUTH_BOOTSTRAP_TIMEOUT_MS = 6000;

// ─── Mapper ───────────────────────────────────────────────────────────────────

function toAuthUser(user: User): AuthUser {
  return {
    id: user.uid,
    name: user.displayName ?? "Dimension Member",
    email: user.email ?? "",
  };
}

function resolveSignedOutStatePayload(): { user: AuthUser | null; status: "authenticated" | "unauthenticated" } {
  const demoUser = readDevDemoSession();
  return demoUser
    ? { user: demoUser, status: "authenticated" }
    : { user: null, status: "unauthenticated" };
}

// ─── Reducer ──────────────────────────────────────────────────────────────────

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "SET_AUTH_STATE":
      return {
        ...state,
        user: action.payload.user,
        status: action.payload.status,
      };
    case "UPDATE_DISPLAY_NAME":
      if (!state.user) return state;
      return { ...state, user: { ...state.user, name: action.payload.name } };
    default:
      return state;
  }
};

const initialState: AuthState = { user: null, status: "initializing" };

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    let resolved = false;
    let unsubscribe: (() => void) | undefined;

    const timeoutId = window.setTimeout(() => {
      if (resolved) return;
      dispatch({
        type: "SET_AUTH_STATE",
        payload: { user: null, status: "unauthenticated" },
      });
    }, AUTH_BOOTSTRAP_TIMEOUT_MS);

    try {
      const auth = getFirebaseAuth();
      unsubscribe = onFirebaseAuthStateChanged(auth, (firebaseUser) => {
        resolved = true;
        window.clearTimeout(timeoutId);

        if (firebaseUser) {
          dispatch({
            type: "SET_AUTH_STATE",
            payload: { user: toAuthUser(firebaseUser), status: "authenticated" },
          });
        } else {
          dispatch({
            type: "SET_AUTH_STATE",
            payload: resolveSignedOutStatePayload(),
          });
        }
      });
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("[AuthProvider] Firebase auth initialization failed:", error);
      }
      resolved = true;
      window.clearTimeout(timeoutId);
      dispatch({
        type: "SET_AUTH_STATE",
        payload: resolveSignedOutStatePayload(),
      });
    }

    return () => {
      window.clearTimeout(timeoutId);
      unsubscribe?.();
    };
  }, []);

  const logout = async () => {
    if (isLocalDevDemoAllowed()) {
      clearDevDemoSession();
    }

    try {
      await signOutFirebase(getFirebaseAuth());
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("[AuthProvider] Firebase sign out failed:", error);
      }
    } finally {
      // Always dispatch unauthenticated: onAuthStateChanged will not fire when
      // there is no real Firebase session (e.g. dev-demo guest mode), so we
      // cannot rely solely on the listener to clear the auth state.
      dispatch({
        type: "SET_AUTH_STATE",
        payload: { user: null, status: "unauthenticated" },
      });
    }
  };

  return (
    <AuthContext.Provider value={{ state, dispatch, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
````

## File: modules/platform/subdomains/identity/interfaces/utils/dev-demo-auth.ts
````typescript
"use client";

import type { AuthUser } from "@/modules/platform/api/contracts";

const DEV_DEMO_SESSION_KEY = "xuanwu_dev_demo_session_v1";

export const DEV_DEMO_ACCOUNT_EMAIL = "test@demo.com";
// Localhost-only development fallback secret for the requested smoke-test account.
// Never reuse this pattern for production authentication flows.
const DEV_DEMO_ACCOUNT_PASSWORD =
  process.env.NEXT_PUBLIC_DEV_DEMO_PASSWORD ?? "123456";

function isLocalhostHost(hostname: string): boolean {
  return (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "::1" ||
    hostname === "[::1]"
  );
}

export function isLocalDevDemoAllowed(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return process.env.NODE_ENV !== "production" && isLocalhostHost(window.location.hostname);
}

export function isDevDemoCredential(email: string, password: string): boolean {
  return (
    email.trim().toLowerCase() === DEV_DEMO_ACCOUNT_EMAIL &&
    password === DEV_DEMO_ACCOUNT_PASSWORD
  );
}

export function createDevDemoUser(): AuthUser {
  return {
    id: "dev-demo-user",
    name: "Demo User",
    email: DEV_DEMO_ACCOUNT_EMAIL,
  };
}

export function readDevDemoSession(): AuthUser | null {
  if (!isLocalDevDemoAllowed()) {
    return null;
  }

  const raw = window.localStorage.getItem(DEV_DEMO_SESSION_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<AuthUser>;
    if (
      typeof parsed.id !== "string" ||
      typeof parsed.name !== "string" ||
      typeof parsed.email !== "string"
    ) {
      return null;
    }
    return { id: parsed.id, name: parsed.name, email: parsed.email };
  } catch {
    return null;
  }
}

export function writeDevDemoSession(user: AuthUser): void {
  if (!isLocalDevDemoAllowed()) {
    return;
  }
  window.localStorage.setItem(DEV_DEMO_SESSION_KEY, JSON.stringify(user));
}

export function clearDevDemoSession(): void {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.removeItem(DEV_DEMO_SESSION_KEY);
}
````

## File: modules/platform/subdomains/identity/README.md
````markdown
# Identity

Authentication, identity tokens, and session management.

## Ownership

- **Bounded Context**: platform
- **Status**: Active

## Layers

| Layer | Purpose |
|-------|---------|
| `api/` | Public boundary for cross-subdomain access |
| `application/` | Use case orchestration and DTOs |
| `domain/` | Entities, value objects, and business rules |
| `infrastructure/` | Adapters, persistence, and external integrations |
| `interfaces/` | UI components, hooks, actions, and queries |

## Dependency Direction

```text
interfaces/ → application/ → domain/ ← infrastructure/
```

## Development Order

1. Domain → 2. Application → 3. Ports (if needed) → 4. Infrastructure → 5. Interfaces
````

## File: modules/platform/subdomains/integration/api/index.ts
````typescript
/**
 * Public API boundary for this subdomain.
 * Cross-module consumers must import through this entry point.
 */
export {};
````

## File: modules/platform/subdomains/integration/application/index.ts
````typescript
// Purpose: Application layer placeholder for platform subdomain 'integration'.
````

## File: modules/platform/subdomains/integration/domain/index.ts
````typescript
// Purpose: Domain layer placeholder for platform subdomain 'integration'.
````

## File: modules/platform/subdomains/integration/infrastructure/index.ts
````typescript
// Purpose: Infrastructure layer placeholder for platform subdomain 'integration'.
````

## File: modules/platform/subdomains/integration/README.md
````markdown
# Integration

External system integration management.

## Ownership

- **Bounded Context**: platform
- **Status**: Stub — awaiting use case definition

## Development Order

When implementing, follow inside-out:
1. Domain → 2. Application → 3. Ports (if needed) → 4. Infrastructure → 5. Interfaces
````

## File: modules/platform/subdomains/notification/api/index.ts
````typescript
/**
 * Public API boundary for the notification subdomain.
 * Cross-module consumers must import through this entry point.
 */

export * from "../application";
export { notificationService } from "../infrastructure/notification-service";
export type {
  NotificationEntity,
  NotificationType,
  DispatchNotificationInput,
} from "../domain/entities/Notification";
export { NotificationBell } from "../interfaces/components/NotificationBell";
export { NotificationsPage } from "../interfaces/components/NotificationsPage";
export type { NotificationsPageProps } from "../interfaces/components/NotificationsPage";
export * from "../interfaces";
````

## File: modules/platform/subdomains/notification/application/index.ts
````typescript
export {
  DispatchNotificationUseCase,
  MarkNotificationReadUseCase,
  MarkAllNotificationsReadUseCase,
} from "./use-cases/notification.use-cases";
````

## File: modules/platform/subdomains/notification/domain/aggregates/index.ts
````typescript
export { NotificationAggregate } from "./NotificationAggregate";
export type { NotificationAggregateSnapshot } from "./NotificationAggregate";
````

## File: modules/platform/subdomains/notification/domain/aggregates/NotificationAggregate.ts
````typescript
import type {
  NotificationDomainEventType,
  NotificationDispatchedEvent,
  NotificationReadEvent,
} from "../events/NotificationDomainEvent";
import { createNotificationId } from "../value-objects";
import type { NotificationId } from "../value-objects";
import type {
  NotificationEntity,
  DispatchNotificationInput,
} from "../entities/Notification";

export interface NotificationAggregateSnapshot {
  readonly id: string;
  readonly recipientId: string;
  readonly title: string;
  readonly message: string;
  readonly type: NotificationEntity["type"];
  readonly read: boolean;
  readonly timestamp: number;
  readonly sourceEventType: string | undefined;
  readonly metadata: Record<string, unknown> | undefined;
}

export class NotificationAggregate {
  private readonly _domainEvents: NotificationDomainEventType[] = [];

  private constructor(private _props: NotificationAggregateSnapshot) {}

  static create(id: string, input: DispatchNotificationInput): NotificationAggregate {
    createNotificationId(id);
    const aggregate = new NotificationAggregate({
      id,
      recipientId: input.recipientId,
      title: input.title,
      message: input.message,
      type: input.type,
      read: false,
      timestamp: Date.now(),
      sourceEventType: input.sourceEventType,
      metadata: input.metadata,
    });
    aggregate.recordEvent<NotificationDispatchedEvent>({
      type: "platform.notification.dispatched",
      eventId: crypto.randomUUID(),
      occurredAt: new Date().toISOString(),
      payload: {
        notificationId: id,
        recipientId: input.recipientId,
        notificationType: input.type,
      },
    });
    return aggregate;
  }

  static reconstitute(snapshot: NotificationAggregateSnapshot): NotificationAggregate {
    return new NotificationAggregate({ ...snapshot });
  }

  markRead(): void {
    if (this._props.read) return;
    const now = new Date().toISOString();
    this._props = { ...this._props, read: true };
    this.recordEvent<NotificationReadEvent>({
      type: "platform.notification.read",
      eventId: crypto.randomUUID(),
      occurredAt: now,
      payload: {
        notificationId: this._props.id,
        recipientId: this._props.recipientId,
      },
    });
  }

  get id(): NotificationId {
    return createNotificationId(this._props.id);
  }

  get recipientId(): string {
    return this._props.recipientId;
  }

  get read(): boolean {
    return this._props.read;
  }

  getSnapshot(): Readonly<NotificationAggregateSnapshot> {
    return Object.freeze({ ...this._props });
  }

  pullDomainEvents(): NotificationDomainEventType[] {
    const events = [...this._domainEvents];
    this._domainEvents.length = 0;
    return events;
  }

  private recordEvent<TEvent extends NotificationDomainEventType>(event: TEvent): void {
    this._domainEvents.push(event);
  }
}
````

## File: modules/platform/subdomains/notification/domain/entities/Notification.ts
````typescript
/**
 * Notification Domain Entities — pure TypeScript, zero framework dependencies.
 */

export type NotificationType = "info" | "alert" | "success" | "warning";

export interface NotificationEntity {
  id: string;
  recipientId: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  timestamp: number;
  sourceEventType?: string;
  metadata?: Record<string, unknown>;
}

export interface DispatchNotificationInput {
  recipientId: string;
  title: string;
  message: string;
  type: NotificationType;
  sourceEventType?: string;
  metadata?: Record<string, unknown>;
}
````

## File: modules/platform/subdomains/notification/domain/events/index.ts
````typescript
export type {
  NotificationDomainEvent,
  NotificationDispatchedEvent,
  NotificationReadEvent,
  AllNotificationsReadEvent,
  NotificationDomainEventType,
} from "./NotificationDomainEvent";
````

## File: modules/platform/subdomains/notification/domain/events/NotificationDomainEvent.ts
````typescript
import type { NotificationType } from "../entities/Notification";

export interface NotificationDomainEvent {
  readonly eventId: string;
  readonly occurredAt: string;
  readonly type: string;
  readonly payload: object;
}

export interface NotificationDispatchedEvent extends NotificationDomainEvent {
  readonly type: "platform.notification.dispatched";
  readonly payload: {
    readonly notificationId: string;
    readonly recipientId: string;
    readonly notificationType: NotificationType;
  };
}

export interface NotificationReadEvent extends NotificationDomainEvent {
  readonly type: "platform.notification.read";
  readonly payload: {
    readonly notificationId: string;
    readonly recipientId: string;
  };
}

export interface AllNotificationsReadEvent extends NotificationDomainEvent {
  readonly type: "platform.notification.all_read";
  readonly payload: {
    readonly recipientId: string;
  };
}

export type NotificationDomainEventType =
  | NotificationDispatchedEvent
  | NotificationReadEvent
  | AllNotificationsReadEvent;
````

## File: modules/platform/subdomains/notification/domain/index.ts
````typescript
export type {
  NotificationEntity,
  NotificationType,
  DispatchNotificationInput,
} from "./entities/Notification";
export type { NotificationRepository } from "./repositories/NotificationRepository";
export type { INotificationPort } from "./ports";
export * from "./aggregates";
export * from "./events";
export * from "./value-objects";
````

## File: modules/platform/subdomains/notification/domain/ports/index.ts
````typescript
/**
 * notification domain/ports — driven port interfaces for the notification subdomain.
 *
 * These re-export the repository contracts from domain/repositories/, making
 * the Ports layer explicitly visible in the directory structure.
 * New code should import port interfaces from this directory.
 */
export type { NotificationRepository as INotificationPort } from "../repositories/NotificationRepository";
````

## File: modules/platform/subdomains/notification/domain/repositories/NotificationRepository.ts
````typescript
/**
 * NotificationRepository — Port for notification persistence.
 */

import type { NotificationEntity, DispatchNotificationInput } from "../entities/Notification";

export interface NotificationRepository {
  dispatch(input: DispatchNotificationInput): Promise<NotificationEntity>;
  markAsRead(notificationId: string, recipientId: string): Promise<void>;
  markAllAsRead(recipientId: string): Promise<void>;
  findByRecipient(recipientId: string, limit?: number): Promise<NotificationEntity[]>;
  getUnreadCount(recipientId: string): Promise<number>;
}
````

## File: modules/platform/subdomains/notification/domain/value-objects/index.ts
````typescript
export { NotificationIdSchema, createNotificationId } from "./NotificationId";
export type { NotificationId } from "./NotificationId";
````

## File: modules/platform/subdomains/notification/domain/value-objects/NotificationId.ts
````typescript
import { z } from "@lib-zod";

export const NotificationIdSchema = z.string().min(1).brand("NotificationId");
export type NotificationId = z.infer<typeof NotificationIdSchema>;

export function createNotificationId(raw: string): NotificationId {
  return NotificationIdSchema.parse(raw);
}
````

## File: modules/platform/subdomains/notification/infrastructure/firebase/FirebaseNotificationRepository.ts
````typescript
/**
 * FirebaseNotificationRepository — Infrastructure adapter for notification persistence.
 * Firebase SDK is isolated to this file. Query recipient requires Firestore index:
 *   notifications: recipientId ASC, timestamp DESC
 *   notifications: recipientId ASC, read ASC
 */

import {
  getFirestore,
  collection,
  doc,
  addDoc,
  updateDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit as fbLimit,
  serverTimestamp,
} from "firebase/firestore";
import { firebaseClientApp } from "@integration-firebase/client";
import type { NotificationRepository } from "../../domain/repositories/NotificationRepository";
import type { NotificationEntity, DispatchNotificationInput } from "../../domain/entities/Notification";

function toNotification(id: string, data: Record<string, unknown>): NotificationEntity {
  return {
    id,
    recipientId: data.recipientId as string,
    title: data.title as string,
    message: data.message as string,
    type: data.type as NotificationEntity["type"],
    read: data.read as boolean,
    timestamp: data.timestamp as number,
    sourceEventType: typeof data.sourceEventType === "string" ? data.sourceEventType : undefined,
    metadata: data.metadata != null ? (data.metadata as Record<string, unknown>) : undefined,
  };
}

export class FirebaseNotificationRepository implements NotificationRepository {
  private get db() {
    return getFirestore(firebaseClientApp);
  }

  async dispatch(input: DispatchNotificationInput): Promise<NotificationEntity> {
    const now = Date.now();
    const ref = await addDoc(collection(this.db, "notifications"), {
      recipientId: input.recipientId,
      title: input.title,
      message: input.message,
      type: input.type,
      read: false,
      timestamp: now,
      sourceEventType: input.sourceEventType ?? null,
      metadata: input.metadata ?? null,
      _createdAt: serverTimestamp(),
    });
    return {
      id: ref.id,
      recipientId: input.recipientId,
      title: input.title,
      message: input.message,
      type: input.type,
      read: false,
      timestamp: now,
      sourceEventType: input.sourceEventType,
      metadata: input.metadata,
    };
  }

  async markAsRead(notificationId: string, _recipientId: string): Promise<void> {
    await updateDoc(doc(this.db, "notifications", notificationId), { read: true });
  }

  async markAllAsRead(recipientId: string): Promise<void> {
    const q = query(
      collection(this.db, "notifications"),
      where("recipientId", "==", recipientId),
      where("read", "==", false),
    );
    const snaps = await getDocs(q);
    await Promise.all(snaps.docs.map((d) => updateDoc(d.ref, { read: true })));
  }

  async findByRecipient(recipientId: string, maxCount = 50): Promise<NotificationEntity[]> {
    const q = query(
      collection(this.db, "notifications"),
      where("recipientId", "==", recipientId),
      orderBy("timestamp", "desc"),
      fbLimit(maxCount),
    );
    const snaps = await getDocs(q);
    return snaps.docs.map((d) => toNotification(d.id, d.data() as Record<string, unknown>));
  }

  async getUnreadCount(recipientId: string): Promise<number> {
    const q = query(
      collection(this.db, "notifications"),
      where("recipientId", "==", recipientId),
      where("read", "==", false),
    );
    const snaps = await getDocs(q);
    return snaps.size;
  }
}
````

## File: modules/platform/subdomains/notification/infrastructure/index.ts
````typescript
export { notificationService } from "./notification-service";
````

## File: modules/platform/subdomains/notification/infrastructure/notification-service.ts
````typescript
/**
 * NotificationService — Composition root for notification use cases.
 */

import { FirebaseNotificationRepository } from "./firebase/FirebaseNotificationRepository";
import {
  DispatchNotificationUseCase,
  GetNotificationsForRecipientUseCase,
  GetUnreadCountUseCase,
  MarkNotificationReadUseCase,
  MarkAllNotificationsReadUseCase,
} from "../application/use-cases/notification.use-cases";
import type { DispatchNotificationInput, NotificationEntity } from "../domain/entities/Notification";
import type { CommandResult } from "@shared-types";

let _notificationRepo: FirebaseNotificationRepository | undefined;

function getNotifRepo(): FirebaseNotificationRepository {
  if (!_notificationRepo) _notificationRepo = new FirebaseNotificationRepository();
  return _notificationRepo;
}

export const notificationService = {
  dispatch: (input: DispatchNotificationInput): Promise<CommandResult> =>
    new DispatchNotificationUseCase(getNotifRepo()).execute(input),

  markAsRead: (notificationId: string, recipientId: string): Promise<CommandResult> =>
    new MarkNotificationReadUseCase(getNotifRepo()).execute(notificationId, recipientId),

  markAllAsRead: (recipientId: string): Promise<CommandResult> =>
    new MarkAllNotificationsReadUseCase(getNotifRepo()).execute(recipientId),

  getForRecipient: (recipientId: string, maxCount?: number): Promise<NotificationEntity[]> =>
    new GetNotificationsForRecipientUseCase(getNotifRepo()).execute(recipientId, maxCount),

  getUnreadCount: (recipientId: string): Promise<number> =>
    new GetUnreadCountUseCase(getNotifRepo()).execute(recipientId),
};
````

## File: modules/platform/subdomains/notification/interfaces/index.ts
````typescript
export { getNotificationsForRecipient } from "./queries/notification.queries";
export {
  dispatchNotification,
  markNotificationRead,
  markAllNotificationsRead,
} from "./_actions/notification.actions";
````

## File: modules/platform/subdomains/notification/README.md
````markdown
# Notification

Notification delivery and preference management.

## Ownership

- **Bounded Context**: platform
- **Status**: Active

## Layers

| Layer | Purpose |
|-------|---------|
| `api/` | Public boundary for cross-subdomain access |
| `application/` | Use case orchestration and DTOs |
| `domain/` | Entities, value objects, and business rules |
| `infrastructure/` | Adapters, persistence, and external integrations |
| `interfaces/` | UI components, hooks, actions, and queries |

## Dependency Direction

```text
interfaces/ → application/ → domain/ ← infrastructure/
```

## Development Order

1. Domain → 2. Application → 3. Ports (if needed) → 4. Infrastructure → 5. Interfaces
````

## File: modules/platform/subdomains/observability/api/index.ts
````typescript
/**
 * Public API boundary for this subdomain.
 * Cross-module consumers must import through this entry point.
 */
export {};
````

## File: modules/platform/subdomains/observability/application/index.ts
````typescript
// Purpose: Application layer placeholder for platform subdomain 'observability'.
````

## File: modules/platform/subdomains/observability/domain/index.ts
````typescript
// Purpose: Domain layer placeholder for platform subdomain 'observability'.
````

## File: modules/platform/subdomains/observability/infrastructure/index.ts
````typescript
// Purpose: Infrastructure layer placeholder for platform subdomain 'observability'.
````

## File: modules/platform/subdomains/observability/README.md
````markdown
# Observability

System observability and monitoring.

## Ownership

- **Bounded Context**: platform
- **Status**: Stub — awaiting use case definition

## Development Order

When implementing, follow inside-out:
1. Domain → 2. Application → 3. Ports (if needed) → 4. Infrastructure → 5. Interfaces
````

## File: modules/platform/subdomains/onboarding/api/index.ts
````typescript
/**
 * Public API boundary for this subdomain.
 * Cross-module consumers must import through this entry point.
 */
export {};
````

## File: modules/platform/subdomains/onboarding/application/index.ts
````typescript
// Purpose: Application layer placeholder for platform subdomain 'onboarding'.
````

## File: modules/platform/subdomains/onboarding/domain/index.ts
````typescript
// Purpose: Domain layer placeholder for platform subdomain 'onboarding'.
````

## File: modules/platform/subdomains/onboarding/infrastructure/index.ts
````typescript
// Purpose: Infrastructure layer placeholder for platform subdomain 'onboarding'.
````

## File: modules/platform/subdomains/onboarding/README.md
````markdown
# Onboarding

User and organization onboarding flows.

## Ownership

- **Bounded Context**: platform
- **Status**: Stub — awaiting use case definition

## Development Order

When implementing, follow inside-out:
1. Domain → 2. Application → 3. Ports (if needed) → 4. Infrastructure → 5. Interfaces
````

## File: modules/platform/subdomains/organization/application/index.ts
````typescript
export {
  CreateOrganizationUseCase,
  CreateOrganizationWithTeamUseCase,
  UpdateOrganizationSettingsUseCase,
  DeleteOrganizationUseCase,
} from "./use-cases/organization-lifecycle.use-cases";

export {
  InviteMemberUseCase,
  RecruitMemberUseCase,
  RemoveMemberUseCase,
  UpdateMemberRoleUseCase,
} from "./use-cases/organization-member.use-cases";

export {
  CreateTeamUseCase,
  DeleteTeamUseCase,
  UpdateTeamMembersUseCase,
} from "./use-cases/organization-team.use-cases";

export {
  CreatePartnerGroupUseCase,
  SendPartnerInviteUseCase,
  DismissPartnerMemberUseCase,
} from "./use-cases/organization-partner.use-cases";

export {
  CreateOrgPolicyUseCase,
  UpdateOrgPolicyUseCase,
  DeleteOrgPolicyUseCase,
} from "./use-cases/organization-policy.use-cases";
````

## File: modules/platform/subdomains/organization/application/use-cases/organization-lifecycle.use-cases.ts
````typescript
/**
 * Organization Lifecycle Use Cases — org CRUD workflows.
 */

import { commandSuccess, commandFailureFrom, type CommandResult } from "@shared-types";
import type { OrganizationRepository } from "../../domain/repositories/OrganizationRepository";
import type { CreateOrganizationCommand, UpdateOrganizationSettingsCommand } from "../../domain/entities/Organization";

export class CreateOrganizationUseCase {
  constructor(private readonly orgRepo: OrganizationRepository) {}

  async execute(command: CreateOrganizationCommand): Promise<CommandResult> {
    try {
      const orgId = await this.orgRepo.create(command);
      return commandSuccess(orgId, Date.now());
    } catch (err) {
      return commandFailureFrom("CREATE_ORGANIZATION_FAILED", err instanceof Error ? err.message : "Failed to create organization");
    }
  }
}

export class CreateOrganizationWithTeamUseCase {
  constructor(private readonly orgRepo: OrganizationRepository) {}

  async execute(
    command: CreateOrganizationCommand,
    teamName: string,
    teamType: "internal" | "external" = "internal",
  ): Promise<CommandResult> {
    try {
      const organizationId = await this.orgRepo.create(command);
      await this.orgRepo.createTeam({ organizationId, name: teamName, description: "", type: teamType });
      return commandSuccess(organizationId, Date.now());
    } catch (err) {
      return commandFailureFrom("SETUP_ORGANIZATION_WITH_TEAM_FAILED", err instanceof Error ? err.message : "Failed to setup organization with team");
    }
  }
}

export class UpdateOrganizationSettingsUseCase {
  constructor(private readonly orgRepo: OrganizationRepository) {}

  async execute(command: UpdateOrganizationSettingsCommand): Promise<CommandResult> {
    try {
      await this.orgRepo.updateSettings(command);
      return commandSuccess(command.organizationId, Date.now());
    } catch (err) {
      return commandFailureFrom("UPDATE_ORGANIZATION_SETTINGS_FAILED", err instanceof Error ? err.message : "Failed to update organization settings");
    }
  }
}

export class DeleteOrganizationUseCase {
  constructor(private readonly orgRepo: OrganizationRepository) {}

  async execute(organizationId: string): Promise<CommandResult> {
    try {
      await this.orgRepo.delete(organizationId);
      return commandSuccess(organizationId, Date.now());
    } catch (err) {
      return commandFailureFrom("DELETE_ORGANIZATION_FAILED", err instanceof Error ? err.message : "Failed to delete organization");
    }
  }
}
````

## File: modules/platform/subdomains/organization/application/use-cases/organization-member.use-cases.ts
````typescript
/**
 * Organization Member Use Cases — member lifecycle workflows.
 */

import { commandSuccess, commandFailureFrom, type CommandResult } from "@shared-types";
import type { OrganizationRepository } from "../../domain/repositories/OrganizationRepository";
import type { InviteMemberInput, UpdateMemberRoleInput } from "../../domain/entities/Organization";

export class InviteMemberUseCase {
  constructor(private readonly orgRepo: OrganizationRepository) {}

  async execute(input: InviteMemberInput): Promise<CommandResult> {
    try {
      const inviteId = await this.orgRepo.inviteMember(input);
      return commandSuccess(inviteId, Date.now());
    } catch (err) {
      return commandFailureFrom("INVITE_MEMBER_FAILED", err instanceof Error ? err.message : "Failed to invite member");
    }
  }
}

export class RecruitMemberUseCase {
  constructor(private readonly orgRepo: OrganizationRepository) {}

  async execute(organizationId: string, memberId: string, name: string, email: string): Promise<CommandResult> {
    try {
      await this.orgRepo.recruitMember(organizationId, memberId, name, email);
      return commandSuccess(memberId, Date.now());
    } catch (err) {
      return commandFailureFrom("RECRUIT_MEMBER_FAILED", err instanceof Error ? err.message : "Failed to recruit member");
    }
  }
}

export class RemoveMemberUseCase {
  constructor(private readonly orgRepo: OrganizationRepository) {}

  async execute(organizationId: string, memberId: string): Promise<CommandResult> {
    try {
      await this.orgRepo.removeMember(organizationId, memberId);
      return commandSuccess(memberId, Date.now());
    } catch (err) {
      return commandFailureFrom("REMOVE_MEMBER_FAILED", err instanceof Error ? err.message : "Failed to remove member");
    }
  }
}

export class UpdateMemberRoleUseCase {
  constructor(private readonly orgRepo: OrganizationRepository) {}

  async execute(input: UpdateMemberRoleInput): Promise<CommandResult> {
    try {
      await this.orgRepo.updateMemberRole(input);
      return commandSuccess(input.memberId, Date.now());
    } catch (err) {
      return commandFailureFrom("UPDATE_MEMBER_ROLE_FAILED", err instanceof Error ? err.message : "Failed to update member role");
    }
  }
}
````

## File: modules/platform/subdomains/organization/application/use-cases/organization-partner.use-cases.ts
````typescript
/**
 * Organization Partner Use Cases — external partner group workflows.
 */

import { commandSuccess, commandFailureFrom, type CommandResult } from "@shared-types";
import type { OrganizationRepository } from "../../domain/repositories/OrganizationRepository";

export class CreatePartnerGroupUseCase {
  constructor(private readonly orgRepo: OrganizationRepository) {}

  async execute(organizationId: string, groupName: string): Promise<CommandResult> {
    try {
      const teamId = await this.orgRepo.createTeam({ organizationId, name: groupName, description: "", type: "external" });
      return commandSuccess(teamId, Date.now());
    } catch (err) {
      return commandFailureFrom("CREATE_PARTNER_GROUP_FAILED", err instanceof Error ? err.message : "Failed to create partner group");
    }
  }
}

export class SendPartnerInviteUseCase {
  constructor(private readonly orgRepo: OrganizationRepository) {}

  async execute(organizationId: string, teamId: string, email: string): Promise<CommandResult> {
    try {
      const inviteId = await this.orgRepo.sendPartnerInvite(organizationId, teamId, email);
      return commandSuccess(inviteId, Date.now());
    } catch (err) {
      return commandFailureFrom("SEND_PARTNER_INVITE_FAILED", err instanceof Error ? err.message : "Failed to send partner invite");
    }
  }
}

export class DismissPartnerMemberUseCase {
  constructor(private readonly orgRepo: OrganizationRepository) {}

  async execute(organizationId: string, teamId: string, memberId: string): Promise<CommandResult> {
    try {
      await this.orgRepo.dismissPartnerMember(organizationId, teamId, memberId);
      return commandSuccess(memberId, Date.now());
    } catch (err) {
      return commandFailureFrom("DISMISS_PARTNER_MEMBER_FAILED", err instanceof Error ? err.message : "Failed to dismiss partner member");
    }
  }
}
````

## File: modules/platform/subdomains/organization/application/use-cases/organization-policy.use-cases.ts
````typescript
/**
 * Organization Policy Use Cases — org-level RBAC policy management.
 */

import { commandSuccess, commandFailureFrom, type CommandResult } from "@shared-types";
import type { OrgPolicyRepository } from "../../domain/repositories/OrgPolicyRepository";
import type { CreateOrgPolicyInput, UpdateOrgPolicyInput } from "../../domain/entities/Organization";

export class CreateOrgPolicyUseCase {
  constructor(private readonly policyRepo: OrgPolicyRepository) {}

  async execute(input: CreateOrgPolicyInput): Promise<CommandResult> {
    try {
      const policy = await this.policyRepo.createPolicy(input);
      return commandSuccess(policy.id, Date.now());
    } catch (err) {
      return commandFailureFrom("CREATE_ORG_POLICY_FAILED", err instanceof Error ? err.message : "Failed to create org policy");
    }
  }
}

export class UpdateOrgPolicyUseCase {
  constructor(private readonly policyRepo: OrgPolicyRepository) {}

  async execute(policyId: string, data: UpdateOrgPolicyInput): Promise<CommandResult> {
    try {
      await this.policyRepo.updatePolicy(policyId, data);
      return commandSuccess(policyId, Date.now());
    } catch (err) {
      return commandFailureFrom("UPDATE_ORG_POLICY_FAILED", err instanceof Error ? err.message : "Failed to update org policy");
    }
  }
}

export class DeleteOrgPolicyUseCase {
  constructor(private readonly policyRepo: OrgPolicyRepository) {}

  async execute(policyId: string): Promise<CommandResult> {
    try {
      await this.policyRepo.deletePolicy(policyId);
      return commandSuccess(policyId, Date.now());
    } catch (err) {
      return commandFailureFrom("DELETE_ORG_POLICY_FAILED", err instanceof Error ? err.message : "Failed to delete org policy");
    }
  }
}
````

## File: modules/platform/subdomains/organization/application/use-cases/organization-team.use-cases.ts
````typescript
/**
 * Organization Team Use Cases — team-scoped operations owned by the organization subdomain.
 *
 * These use cases depend only on IOrganizationTeamPort (defined in organization's own
 * domain/ports/), keeping the application layer free from direct peer-subdomain imports.
 * The infrastructure composition root (organization-service.ts) injects the concrete
 * team adapter that satisfies the port.
 */

import { commandSuccess, commandFailureFrom, type CommandResult } from "@shared-types";
import type { IOrganizationTeamPort } from "../../domain/ports/IOrganizationTeamPort";
import type { CreateTeamInput } from "../../domain/entities/Organization";

export class CreateTeamUseCase {
  constructor(private readonly teamPort: IOrganizationTeamPort) {}

  async execute(input: CreateTeamInput): Promise<CommandResult> {
    try {
      const teamId = await this.teamPort.createTeam(input);
      return commandSuccess(teamId, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "CREATE_TEAM_FAILED",
        err instanceof Error ? err.message : "Failed to create team",
      );
    }
  }
}

export class DeleteTeamUseCase {
  constructor(private readonly teamPort: IOrganizationTeamPort) {}

  async execute(organizationId: string, teamId: string): Promise<CommandResult> {
    try {
      await this.teamPort.deleteTeam(organizationId, teamId);
      return commandSuccess(teamId, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "DELETE_TEAM_FAILED",
        err instanceof Error ? err.message : "Failed to delete team",
      );
    }
  }
}

export class UpdateTeamMembersUseCase {
  constructor(private readonly teamPort: IOrganizationTeamPort) {}

  async execute(
    organizationId: string,
    teamId: string,
    memberId: string,
    action: "add" | "remove",
  ): Promise<CommandResult> {
    try {
      if (action === "add") {
        await this.teamPort.addMemberToTeam(organizationId, teamId, memberId);
      } else {
        await this.teamPort.removeMemberFromTeam(organizationId, teamId, memberId);
      }
      return commandSuccess(teamId, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "UPDATE_TEAM_MEMBERS_FAILED",
        err instanceof Error ? err.message : "Failed to update team members",
      );
    }
  }
}
````

## File: modules/platform/subdomains/organization/domain/aggregates/index.ts
````typescript
export * from "./Organization";
````

## File: modules/platform/subdomains/organization/domain/aggregates/Organization.ts
````typescript
import type {
	MemberAddedEvent,
	MemberRemovedEvent,
	MemberRoleUpdatedEvent,
	OrganizationCreatedEvent,
	OrganizationDissolvedEvent,
	OrganizationDomainEventType,
	OrganizationReactivatedEvent,
	OrganizationSuspendedEvent,
	SettingsUpdatedEvent,
} from "../events";
import type { ThemeConfig } from "../entities/Organization";
import {
	canDissolve,
	canReactivate,
	canSuspend,
	createMemberRole,
	createOrganizationId,
	type MemberRole,
	type OrganizationStatus,
} from "../value-objects";

export interface OrganizationSnapshot {
	readonly id: string;
	readonly name: string;
	readonly ownerId: string;
	readonly ownerName: string;
	readonly ownerEmail: string;
	readonly description: string | null;
	readonly photoURL: string | null;
	readonly theme: ThemeConfig | null;
	readonly memberCount: number;
	readonly teamCount: number;
	readonly status: "active" | "suspended" | "dissolved";
	readonly createdAtISO: string;
	readonly updatedAtISO: string;
}

export interface CreateOrganizationInput {
	readonly name: string;
	readonly ownerId: string;
	readonly ownerName: string;
	readonly ownerEmail: string;
	readonly description?: string | null;
	readonly photoURL?: string | null;
	readonly theme?: ThemeConfig | null;
}

export class Organization {
	private readonly _domainEvents: OrganizationDomainEventType[] = [];
	private readonly _memberRoles = new Map<string, MemberRole>();

	private constructor(private _props: OrganizationSnapshot) {}

	static create(id: string, input: CreateOrganizationInput): Organization {
		createOrganizationId(id);
		Organization.assertRequired(input.name, "Organization name is required.");
		Organization.assertRequired(input.ownerId, "Owner id is required.");
		Organization.assertRequired(input.ownerName, "Owner name is required.");
		Organization.assertRequired(input.ownerEmail, "Owner email is required.");
		const now = new Date().toISOString();
		const aggregate = new Organization({
			id,
			name: input.name.trim(),
			ownerId: input.ownerId.trim(),
			ownerName: input.ownerName.trim(),
			ownerEmail: input.ownerEmail.trim(),
			description: input.description ?? null,
			photoURL: input.photoURL ?? null,
			theme: input.theme ?? null,
			memberCount: 1,
			teamCount: 0,
			status: "active",
			createdAtISO: now,
			updatedAtISO: now,
		});
		aggregate._memberRoles.set(aggregate._props.ownerId, "Owner");
		aggregate.recordEvent<OrganizationCreatedEvent>({
			type: "platform.organization.created",
			eventId: crypto.randomUUID(),
			occurredAt: now,
			payload: {
				organizationId: aggregate._props.id,
				name: aggregate._props.name,
				ownerId: aggregate._props.ownerId,
				ownerName: aggregate._props.ownerName,
				ownerEmail: aggregate._props.ownerEmail,
				theme: aggregate._props.theme,
			},
		});
		return aggregate;
	}

	static reconstitute(snapshot: OrganizationSnapshot): Organization {
		createOrganizationId(snapshot.id);
		if (snapshot.memberCount < 1) {
			throw new Error("Organization memberCount must be at least 1.");
		}
		if (snapshot.teamCount < 0) {
			throw new Error("Organization teamCount cannot be negative.");
		}
		const aggregate = new Organization({ ...snapshot });
		aggregate._memberRoles.set(snapshot.ownerId, "Owner");
		return aggregate;
	}

	updateSettings(input: { name?: string; description?: string | null; photoURL?: string | null; theme?: ThemeConfig | null }): void {
		this.ensureActive("Only active organization can update settings.");
		if (input.name !== undefined) {
			Organization.assertRequired(input.name, "Organization name is required.");
		}
		const now = new Date().toISOString();
		this._props = {
			...this._props,
			name: input.name === undefined ? this._props.name : input.name.trim(),
			description: input.description === undefined ? this._props.description : input.description,
			photoURL: input.photoURL === undefined ? this._props.photoURL : input.photoURL,
			theme: input.theme === undefined ? this._props.theme : input.theme,
			updatedAtISO: now,
		};
		this.recordEvent<SettingsUpdatedEvent>({
			type: "platform.organization.settings_updated",
			eventId: crypto.randomUUID(),
			occurredAt: now,
			payload: {
				organizationId: this._props.id,
				name: this._props.name,
				description: this._props.description,
				photoURL: this._props.photoURL,
				theme: this._props.theme,
			},
		});
	}

	addMember(memberId: string, name: string, email: string, role: MemberRole): void {
		this.ensureActive("Only active organization can add members.");
		Organization.assertRequired(memberId, "Member id is required.");
		Organization.assertRequired(name, "Member name is required.");
		Organization.assertRequired(email, "Member email is required.");
		const normalizedRole = createMemberRole(role);
		if (memberId === this._props.ownerId || this._memberRoles.has(memberId)) {
			throw new Error("Member already exists in organization.");
		}
		const now = new Date().toISOString();
		this._memberRoles.set(memberId, normalizedRole);
		this._props = {
			...this._props,
			memberCount: this._props.memberCount + 1,
			updatedAtISO: now,
		};
		this.recordEvent<MemberAddedEvent>({
			type: "platform.organization.member_added",
			eventId: crypto.randomUUID(),
			occurredAt: now,
			payload: {
				organizationId: this._props.id,
				memberId,
				name: name.trim(),
				email: email.trim(),
				role: normalizedRole,
				memberCount: this._props.memberCount,
			},
		});
	}

	removeMember(memberId: string): void {
		this.ensureActive("Only active organization can remove members.");
		Organization.assertRequired(memberId, "Member id is required.");
		if (memberId === this._props.ownerId) {
			throw new Error("Cannot remove organization owner.");
		}
		if (!this._memberRoles.has(memberId)) {
			throw new Error("Member does not exist in organization.");
		}
		const now = new Date().toISOString();
		this._memberRoles.delete(memberId);
		this._props = {
			...this._props,
			memberCount: this._props.memberCount - 1,
			updatedAtISO: now,
		};
		this.recordEvent<MemberRemovedEvent>({
			type: "platform.organization.member_removed",
			eventId: crypto.randomUUID(),
			occurredAt: now,
			payload: {
				organizationId: this._props.id,
				memberId,
				memberCount: this._props.memberCount,
			},
		});
	}

	updateMemberRole(memberId: string, newRole: MemberRole): void {
		this.ensureActive("Only active organization can update member roles.");
		Organization.assertRequired(memberId, "Member id is required.");
		if (memberId === this._props.ownerId) {
			throw new Error("Cannot change organization owner role.");
		}
		if (!this._memberRoles.has(memberId)) {
			throw new Error("Member does not exist in organization.");
		}
		const normalizedRole = createMemberRole(newRole);
		const previousRole = this._memberRoles.get(memberId) ?? "Member";
		const now = new Date().toISOString();
		this._memberRoles.set(memberId, normalizedRole);
		this._props = { ...this._props, updatedAtISO: now };
		this.recordEvent<MemberRoleUpdatedEvent>({
			type: "platform.organization.member_role_updated",
			eventId: crypto.randomUUID(),
			occurredAt: now,
			payload: {
				organizationId: this._props.id,
				memberId,
				previousRole,
				role: normalizedRole,
			},
		});
	}

	suspend(): void {
		if (!canSuspend(this._props.status)) {
			throw new Error("Only active organization can be suspended.");
		}
		this.changeStatus("suspended", "platform.organization.suspended");
	}

	dissolve(): void {
		if (!canDissolve(this._props.status)) {
			throw new Error("Organization is already dissolved.");
		}
		this.changeStatus("dissolved", "platform.organization.dissolved");
	}

	reactivate(): void {
		if (!canReactivate(this._props.status)) {
			throw new Error("Only suspended organization can be reactivated.");
		}
		this.changeStatus("active", "platform.organization.reactivated");
	}

	get id(): string {
		return this._props.id;
	}

	get name(): string {
		return this._props.name;
	}

	get ownerId(): string {
		return this._props.ownerId;
	}

	get ownerName(): string {
		return this._props.ownerName;
	}

	get ownerEmail(): string {
		return this._props.ownerEmail;
	}

	get description(): string | null {
		return this._props.description;
	}

	get photoURL(): string | null {
		return this._props.photoURL;
	}

	get theme(): ThemeConfig | null {
		return this._props.theme;
	}

	get memberCount(): number {
		return this._props.memberCount;
	}

	get teamCount(): number {
		return this._props.teamCount;
	}

	get status(): OrganizationStatus {
		return this._props.status;
	}

	get createdAtISO(): string {
		return this._props.createdAtISO;
	}

	get updatedAtISO(): string {
		return this._props.updatedAtISO;
	}

	getSnapshot(): Readonly<OrganizationSnapshot> {
		return Object.freeze({ ...this._props });
	}

	pullDomainEvents(): OrganizationDomainEventType[] {
		const events = [...this._domainEvents];
		this._domainEvents.length = 0;
		return events;
	}

	private changeStatus(
		status: OrganizationStatus,
		eventType: "platform.organization.suspended" | "platform.organization.dissolved" | "platform.organization.reactivated",
	): void {
		const now = new Date().toISOString();
		this._props = { ...this._props, status, updatedAtISO: now };
		if (eventType === "platform.organization.suspended") {
			this.recordEvent<OrganizationSuspendedEvent>({
				type: eventType,
				eventId: crypto.randomUUID(),
				occurredAt: now,
				payload: { organizationId: this._props.id, status },
			});
			return;
		}
		if (eventType === "platform.organization.dissolved") {
			this.recordEvent<OrganizationDissolvedEvent>({
				type: eventType,
				eventId: crypto.randomUUID(),
				occurredAt: now,
				payload: { organizationId: this._props.id, status },
			});
			return;
		}
		this.recordEvent<OrganizationReactivatedEvent>({
			type: eventType,
			eventId: crypto.randomUUID(),
			occurredAt: now,
			payload: { organizationId: this._props.id, status },
		});
	}

	private ensureActive(message: string): void {
		if (this._props.status !== "active") {
			throw new Error(message);
		}
	}

	private recordEvent<TEvent extends OrganizationDomainEventType>(event: TEvent): void {
		this._domainEvents.push(event);
	}

	private static assertRequired(value: string, message: string): void {
		if (value.trim().length === 0) {
			throw new Error(message);
		}
	}
}
````

## File: modules/platform/subdomains/organization/domain/entities/Organization.ts
````typescript
/**
 * Organization Domain Entities — pure TypeScript, zero framework dependencies.
 */

import type { Timestamp } from "@shared-types";

export type OrganizationRole = "Owner" | "Admin" | "Member" | "Guest";
export type Presence = "active" | "away" | "offline";
export type InviteState = "pending" | "accepted" | "expired";
export type PolicyEffect = "allow" | "deny";

export interface MemberReference {
  id: string;
  name: string;
  email: string;
  role: OrganizationRole;
  presence: Presence;
  isExternal?: boolean;
  expiryDate?: Timestamp;
}

export interface Team {
  id: string;
  name: string;
  description: string;
  type: "internal" | "external";
  memberIds: string[];
}

export interface PartnerInvite {
  id: string;
  email: string;
  teamId: string;
  role: OrganizationRole;
  inviteState: InviteState;
  invitedAt: Timestamp;
  protocol: string;
}

export interface ThemeConfig {
  primary: string;
  background: string;
  accent: string;
}

export interface OrganizationEntity {
  id: string;
  name: string;
  ownerId: string;
  email?: string;
  photoURL?: string;
  description?: string;
  theme?: ThemeConfig;
  members: MemberReference[];
  memberIds: string[];
  teams: Team[];
  partnerInvites?: PartnerInvite[];
  createdAt: Timestamp;
}

export interface OrgPolicyRule {
  resource: string;
  actions: string[];
  effect: PolicyEffect;
  conditions?: Record<string, string>;
}

export type OrgPolicyScope = "workspace" | "member" | "global";

export interface OrgPolicy {
  readonly id: string;
  readonly orgId: string;
  readonly name: string;
  readonly description: string;
  readonly rules: OrgPolicyRule[];
  readonly scope: OrgPolicyScope;
  readonly isActive: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface CreateOrganizationCommand {
  readonly organizationName: string;
  readonly ownerId: string;
  readonly ownerName: string;
  readonly ownerEmail: string;
}

export interface UpdateOrganizationSettingsCommand {
  readonly organizationId: string;
  readonly name?: string;
  readonly description?: string;
  readonly theme?: ThemeConfig | null;
  readonly photoURL?: string;
}

export interface InviteMemberInput {
  organizationId: string;
  email: string;
  teamId: string;
  role: OrganizationRole;
  protocol: string;
}

export interface UpdateMemberRoleInput {
  organizationId: string;
  memberId: string;
  role: OrganizationRole;
}

export interface CreateTeamInput {
  organizationId: string;
  name: string;
  description: string;
  type: "internal" | "external";
}

export interface CreateOrgPolicyInput {
  orgId: string;
  name: string;
  description: string;
  rules: OrgPolicyRule[];
  scope: OrgPolicyScope;
}

export interface UpdateOrgPolicyInput {
  name?: string;
  description?: string;
  rules?: OrgPolicyRule[];
  scope?: OrgPolicyScope;
  isActive?: boolean;
}
````

## File: modules/platform/subdomains/organization/domain/events/index.ts
````typescript
export * from "./OrganizationDomainEvent";
````

## File: modules/platform/subdomains/organization/domain/events/OrganizationDomainEvent.ts
````typescript
import type { ThemeConfig } from "../entities/Organization";
import type { MemberRole, OrganizationStatus } from "../value-objects";

export interface OrganizationDomainEvent {
	readonly eventId: string;
	readonly occurredAt: string;
	readonly type: string;
	readonly payload: object;
}

export interface OrganizationCreatedEvent extends OrganizationDomainEvent {
	readonly type: "platform.organization.created";
	readonly payload: {
		readonly organizationId: string;
		readonly name: string;
		readonly ownerId: string;
		readonly ownerName: string;
		readonly ownerEmail: string;
		readonly theme: ThemeConfig | null;
	};
}

export interface SettingsUpdatedEvent extends OrganizationDomainEvent {
	readonly type: "platform.organization.settings_updated";
	readonly payload: {
		readonly organizationId: string;
		readonly name: string;
		readonly description: string | null;
		readonly photoURL: string | null;
		readonly theme: ThemeConfig | null;
	};
}

export interface MemberAddedEvent extends OrganizationDomainEvent {
	readonly type: "platform.organization.member_added";
	readonly payload: {
		readonly organizationId: string;
		readonly memberId: string;
		readonly name: string;
		readonly email: string;
		readonly role: MemberRole;
		readonly memberCount: number;
	};
}

export interface MemberRemovedEvent extends OrganizationDomainEvent {
	readonly type: "platform.organization.member_removed";
	readonly payload: {
		readonly organizationId: string;
		readonly memberId: string;
		readonly memberCount: number;
	};
}

export interface MemberRoleUpdatedEvent extends OrganizationDomainEvent {
	readonly type: "platform.organization.member_role_updated";
	readonly payload: {
		readonly organizationId: string;
		readonly memberId: string;
		readonly previousRole: MemberRole;
		readonly role: MemberRole;
	};
}

export interface OrganizationSuspendedEvent extends OrganizationDomainEvent {
	readonly type: "platform.organization.suspended";
	readonly payload: {
		readonly organizationId: string;
		readonly status: OrganizationStatus;
	};
}

export interface OrganizationDissolvedEvent extends OrganizationDomainEvent {
	readonly type: "platform.organization.dissolved";
	readonly payload: {
		readonly organizationId: string;
		readonly status: OrganizationStatus;
	};
}

export interface OrganizationReactivatedEvent extends OrganizationDomainEvent {
	readonly type: "platform.organization.reactivated";
	readonly payload: {
		readonly organizationId: string;
		readonly status: OrganizationStatus;
	};
}

export type OrganizationDomainEventType =
	| OrganizationCreatedEvent
	| SettingsUpdatedEvent
	| MemberAddedEvent
	| MemberRemovedEvent
	| MemberRoleUpdatedEvent
	| OrganizationSuspendedEvent
	| OrganizationDissolvedEvent
	| OrganizationReactivatedEvent;
````

## File: modules/platform/subdomains/organization/domain/index.ts
````typescript
export type { OrganizationEntity,
  OrganizationRole,
  Presence,
  InviteState,
  PolicyEffect,
  MemberReference,
  Team,
  PartnerInvite,
  ThemeConfig,
  OrgPolicy,
  OrgPolicyRule,
  OrgPolicyScope,
  CreateOrganizationCommand,
  UpdateOrganizationSettingsCommand,
  InviteMemberInput,
  UpdateMemberRoleInput,
  CreateTeamInput,
  CreateOrgPolicyInput,
  UpdateOrgPolicyInput,
} from "./entities/Organization";
export type { OrganizationRepository, Unsubscribe } from "./repositories/OrganizationRepository";
export type { OrgPolicyRepository } from "./repositories/OrgPolicyRepository";
export type { IOrganizationTeamPort } from "./ports/IOrganizationTeamPort";
export * from "./aggregates";
export * from "./events";
export * from "./value-objects";
````

## File: modules/platform/subdomains/organization/domain/ports/index.ts
````typescript
export type { IOrganizationTeamPort } from "./IOrganizationTeamPort";
````

## File: modules/platform/subdomains/organization/domain/ports/IOrganizationTeamPort.ts
````typescript
/**
 * IOrganizationTeamPort — driven port for organization-scoped team operations.
 *
 * Defined in organization's domain layer so the application layer can depend on
 * this interface without importing from a peer subdomain (team).
 * The infrastructure composition root (organization-service.ts) wires the
 * concrete team subdomain adapter as the implementation.
 */

import type { Team, CreateTeamInput } from "../entities/Organization";

export interface IOrganizationTeamPort {
  createTeam(input: CreateTeamInput): Promise<string>;
  deleteTeam(organizationId: string, teamId: string): Promise<void>;
  addMemberToTeam(organizationId: string, teamId: string, memberId: string): Promise<void>;
  removeMemberFromTeam(organizationId: string, teamId: string, memberId: string): Promise<void>;
  getTeams(organizationId: string): Promise<Team[]>;
}
````

## File: modules/platform/subdomains/organization/domain/repositories/OrganizationRepository.ts
````typescript
/**
 * OrganizationRepository — Port for organization persistence.
 */

import type {
  OrganizationEntity,
  InviteMemberInput,
  UpdateMemberRoleInput,
  CreateTeamInput,
  CreateOrganizationCommand,
  UpdateOrganizationSettingsCommand,
  MemberReference,
  Team,
  PartnerInvite,
} from "../entities/Organization";

export type Unsubscribe = () => void;

export interface OrganizationRepository {
  create(command: CreateOrganizationCommand): Promise<string>;
  findById(id: string): Promise<OrganizationEntity | null>;
  save(org: OrganizationEntity): Promise<void>;
  updateSettings(command: UpdateOrganizationSettingsCommand): Promise<void>;
  delete(organizationId: string): Promise<void>;

  inviteMember(input: InviteMemberInput): Promise<string>;
  recruitMember(organizationId: string, memberId: string, name: string, email: string): Promise<void>;
  removeMember(organizationId: string, memberId: string): Promise<void>;
  updateMemberRole(input: UpdateMemberRoleInput): Promise<void>;
  getMembers(organizationId: string): Promise<MemberReference[]>;
  subscribeToMembers(organizationId: string, onUpdate: (members: MemberReference[]) => void): Unsubscribe;

  createTeam(input: CreateTeamInput): Promise<string>;
  deleteTeam(organizationId: string, teamId: string): Promise<void>;
  addMemberToTeam(organizationId: string, teamId: string, memberId: string): Promise<void>;
  removeMemberFromTeam(organizationId: string, teamId: string, memberId: string): Promise<void>;
  getTeams(organizationId: string): Promise<Team[]>;
  subscribeToTeams(organizationId: string, onUpdate: (teams: Team[]) => void): Unsubscribe;

  sendPartnerInvite(organizationId: string, teamId: string, email: string): Promise<string>;
  dismissPartnerMember(organizationId: string, teamId: string, memberId: string): Promise<void>;
  getPartnerInvites(organizationId: string): Promise<PartnerInvite[]>;
}
````

## File: modules/platform/subdomains/organization/domain/repositories/OrgPolicyRepository.ts
````typescript
/**
 * OrgPolicyRepository — Port for org-policy persistence.
 */

import type { OrgPolicy, CreateOrgPolicyInput, UpdateOrgPolicyInput } from "../entities/Organization";

export interface OrgPolicyRepository {
  createPolicy(input: CreateOrgPolicyInput): Promise<OrgPolicy>;
  updatePolicy(policyId: string, data: UpdateOrgPolicyInput): Promise<void>;
  deletePolicy(policyId: string): Promise<void>;
  getPolicies(orgId: string): Promise<OrgPolicy[]>;
}
````

## File: modules/platform/subdomains/organization/domain/value-objects/index.ts
````typescript
export { OrganizationIdSchema, createOrganizationId } from "./OrganizationId";
export type { OrganizationId } from "./OrganizationId";

export { MEMBER_ROLES, MemberRoleSchema, createMemberRole, canManageRole } from "./MemberRole";
export type { MemberRole } from "./MemberRole";

export { ORGANIZATION_STATUSES, canSuspend, canDissolve, canReactivate } from "./OrganizationStatus";
export type { OrganizationStatus } from "./OrganizationStatus";
````

## File: modules/platform/subdomains/organization/domain/value-objects/MemberRole.ts
````typescript
import { z } from "@lib-zod";

export const MEMBER_ROLES = ["Owner", "Admin", "Member", "Guest"] as const;
export const MemberRoleSchema = z.enum(MEMBER_ROLES);
export type MemberRole = z.infer<typeof MemberRoleSchema>;

const ROLE_RANK: Record<MemberRole, number> = {
	Owner: 4,
	Admin: 3,
	Member: 2,
	Guest: 1,
};

export function createMemberRole(raw: string): MemberRole {
	return MemberRoleSchema.parse(raw);
}

export function canManageRole(managerRole: MemberRole, targetRole: MemberRole): boolean {
	if (managerRole === "Owner") {
		return targetRole !== "Owner";
	}
	return ROLE_RANK[managerRole] > ROLE_RANK[targetRole];
}
````

## File: modules/platform/subdomains/organization/domain/value-objects/OrganizationId.ts
````typescript
import { z } from "@lib-zod";

export const OrganizationIdSchema = z.string().min(1).brand("OrganizationId");
export type OrganizationId = z.infer<typeof OrganizationIdSchema>;

export function createOrganizationId(raw: string): OrganizationId {
	return OrganizationIdSchema.parse(raw);
}
````

## File: modules/platform/subdomains/organization/domain/value-objects/OrganizationStatus.ts
````typescript
export const ORGANIZATION_STATUSES = ["active", "suspended", "dissolved"] as const;
export type OrganizationStatus = (typeof ORGANIZATION_STATUSES)[number];

export function canSuspend(status: OrganizationStatus): boolean {
	return status === "active";
}

export function canDissolve(status: OrganizationStatus): boolean {
	return status !== "dissolved";
}

export function canReactivate(status: OrganizationStatus): boolean {
	return status === "suspended";
}
````

## File: modules/platform/subdomains/organization/infrastructure/firebase/FirebaseOrganizationRepository.ts
````typescript
/**
 * FirebaseOrganizationRepository — Infrastructure adapter for organization persistence.
 * Firebase SDK is isolated to this file and organization-mappers.ts.
 * Dual-write: `organizations` (primary) + `accounts` (for organization account profile).
 */

import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  getDocs,
  addDoc,
  arrayUnion,
  arrayRemove,
  onSnapshot,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import { firebaseClientApp } from "@integration-firebase/client";
import type { OrganizationRepository, Unsubscribe } from "../../domain/repositories/OrganizationRepository";
import type {
  OrganizationEntity,
  MemberReference,
  Team,
  PartnerInvite,
  CreateOrganizationCommand,
  UpdateOrganizationSettingsCommand,
  InviteMemberInput,
  UpdateMemberRoleInput,
  CreateTeamInput,
  OrganizationRole,
} from "../../domain/entities/Organization";
import { toOrganizationEntity, toTeam, toPartnerInvite } from "./organization-mappers";

export class FirebaseOrganizationRepository implements OrganizationRepository {
  private get db() {
    return getFirestore(firebaseClientApp);
  }

  private orgAccountRef(organizationId: string) {
    return doc(this.db, "accounts", organizationId);
  }

  private buildAccountData(data: {
    name?: string;
    ownerId?: string;
    email?: string;
    photoURL?: string;
    description?: string;
    theme?: OrganizationEntity["theme"];
    members?: MemberReference[];
    memberIds?: string[];
    teams?: Team[];
    createdAt?: OrganizationEntity["createdAt"] | ReturnType<typeof serverTimestamp>;
  }) {
    return {
      accountType: "organization" as const,
      name: data.name ?? "",
      ownerId: data.ownerId ?? "",
      email: data.email ?? null,
      photoURL: data.photoURL ?? null,
      description: data.description ?? null,
      theme: data.theme ?? null,
      members: data.members ?? [],
      memberIds: data.memberIds ?? [],
      teams: data.teams ?? [],
      createdAt: data.createdAt ?? serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
  }

  async create(command: CreateOrganizationCommand): Promise<string> {
    const orgRef = doc(collection(this.db, "organizations"));
    const owner: MemberReference = {
      id: command.ownerId,
      name: command.ownerName,
      email: command.ownerEmail,
      role: "Owner",
      presence: "active",
    };
    const createdAt = serverTimestamp();
    const batch = writeBatch(this.db);
    batch.set(orgRef, {
      name: command.organizationName,
      ownerId: command.ownerId,
      members: [owner],
      memberIds: [command.ownerId],
      teams: [],
      createdAt,
    });
    batch.set(
      this.orgAccountRef(orgRef.id),
      this.buildAccountData({
        name: command.organizationName,
        ownerId: command.ownerId,
        members: [owner],
        memberIds: [command.ownerId],
        teams: [],
        createdAt,
      }),
      { merge: true },
    );
    await batch.commit();
    return orgRef.id;
  }

  async findById(id: string): Promise<OrganizationEntity | null> {
    const snap = await getDoc(doc(this.db, "organizations", id));
    if (!snap.exists()) return null;
    return toOrganizationEntity(snap.id, snap.data() as Record<string, unknown>);
  }

  async save(org: OrganizationEntity): Promise<void> {
    const batch = writeBatch(this.db);
    batch.set(doc(this.db, "organizations", org.id), {
      name: org.name,
      ownerId: org.ownerId,
      members: org.members,
      memberIds: org.memberIds,
      teams: org.teams,
      updatedAt: serverTimestamp(),
    });
    batch.set(
      this.orgAccountRef(org.id),
      this.buildAccountData({
        name: org.name,
        ownerId: org.ownerId,
        email: org.email,
        photoURL: org.photoURL,
        description: org.description,
        theme: org.theme,
        members: org.members,
        memberIds: org.memberIds,
        teams: org.teams,
        createdAt: org.createdAt,
      }),
      { merge: true },
    );
    await batch.commit();
  }

  async updateSettings(command: UpdateOrganizationSettingsCommand): Promise<void> {
    const updates: Record<string, unknown> = {
      accountType: "organization",
      updatedAt: serverTimestamp(),
    };
    if (command.name !== undefined) updates.name = command.name;
    if (command.description !== undefined) updates.description = command.description;
    if (command.theme !== undefined) updates.theme = command.theme;
    if (command.photoURL !== undefined) updates.photoURL = command.photoURL;
    const batch = writeBatch(this.db);
    batch.update(doc(this.db, "organizations", command.organizationId), updates);
    batch.set(this.orgAccountRef(command.organizationId), updates, { merge: true });
    await batch.commit();
  }

  async delete(organizationId: string): Promise<void> {
    const batch = writeBatch(this.db);
    batch.delete(doc(this.db, "organizations", organizationId));
    batch.delete(this.orgAccountRef(organizationId));
    await batch.commit();
  }

  async inviteMember(input: InviteMemberInput): Promise<string> {
    const ref = await addDoc(collection(this.db, "organizations", input.organizationId, "invites"), {
      email: input.email,
      teamId: input.teamId,
      role: input.role,
      inviteState: "pending",
      protocol: input.protocol,
      invitedAt: serverTimestamp(),
    });
    return ref.id;
  }

  async recruitMember(organizationId: string, memberId: string, name: string, email: string): Promise<void> {
    const member: MemberReference = { id: memberId, name, email, role: "Member", presence: "active" };
    const batch = writeBatch(this.db);
    batch.update(doc(this.db, "organizations", organizationId), {
      members: arrayUnion(member),
      memberIds: arrayUnion(memberId),
      updatedAt: serverTimestamp(),
    });
    batch.set(this.orgAccountRef(organizationId), { members: arrayUnion(member), memberIds: arrayUnion(memberId), updatedAt: serverTimestamp() }, { merge: true });
    await batch.commit();
  }

  async removeMember(organizationId: string, memberId: string): Promise<void> {
    const snap = await getDoc(doc(this.db, "organizations", organizationId));
    if (!snap.exists()) return;
    const data = snap.data() as Record<string, unknown>;
    const members = Array.isArray(data.members)
      ? (data.members as MemberReference[]).filter((m) => m.id !== memberId)
      : [];
    const batch = writeBatch(this.db);
    batch.update(doc(this.db, "organizations", organizationId), { members, memberIds: arrayRemove(memberId), updatedAt: serverTimestamp() });
    batch.set(this.orgAccountRef(organizationId), { members, memberIds: arrayRemove(memberId), updatedAt: serverTimestamp() }, { merge: true });
    await batch.commit();
  }

  async updateMemberRole(input: UpdateMemberRoleInput): Promise<void> {
    const snap = await getDoc(doc(this.db, "organizations", input.organizationId));
    if (!snap.exists()) return;
    const data = snap.data() as Record<string, unknown>;
    const members = Array.isArray(data.members)
      ? (data.members as MemberReference[]).map((m) =>
          m.id === input.memberId ? { ...m, role: input.role as OrganizationRole } : m,
        )
      : [];
    const batch = writeBatch(this.db);
    batch.update(doc(this.db, "organizations", input.organizationId), { members, updatedAt: serverTimestamp() });
    batch.set(this.orgAccountRef(input.organizationId), { members, updatedAt: serverTimestamp() }, { merge: true });
    await batch.commit();
  }

  async getMembers(organizationId: string): Promise<MemberReference[]> {
    const snap = await getDoc(doc(this.db, "organizations", organizationId));
    if (!snap.exists()) return [];
    const data = snap.data() as Record<string, unknown>;
    return Array.isArray(data.members) ? (data.members as MemberReference[]) : [];
  }

  subscribeToMembers(organizationId: string, onUpdate: (members: MemberReference[]) => void): Unsubscribe {
    return onSnapshot(doc(this.db, "organizations", organizationId), (snap) => {
      if (!snap.exists()) { onUpdate([]); return; }
      const data = snap.data() as Record<string, unknown>;
      onUpdate(Array.isArray(data.members) ? (data.members as MemberReference[]) : []);
    });
  }

  async createTeam(input: CreateTeamInput): Promise<string> {
    const teamRef = doc(collection(this.db, "organizations", input.organizationId, "teams"));
    await setDoc(teamRef, {
      name: input.name,
      description: input.description,
      type: input.type,
      memberIds: [],
      createdAt: serverTimestamp(),
    });
    return teamRef.id;
  }

  async deleteTeam(organizationId: string, teamId: string): Promise<void> {
    await deleteDoc(doc(this.db, "organizations", organizationId, "teams", teamId));
  }

  async addMemberToTeam(organizationId: string, teamId: string, memberId: string): Promise<void> {
    await updateDoc(doc(this.db, "organizations", organizationId, "teams", teamId), {
      memberIds: arrayUnion(memberId),
    });
  }

  async removeMemberFromTeam(organizationId: string, teamId: string, memberId: string): Promise<void> {
    await updateDoc(doc(this.db, "organizations", organizationId, "teams", teamId), {
      memberIds: arrayRemove(memberId),
    });
  }

  async getTeams(organizationId: string): Promise<Team[]> {
    const snaps = await getDocs(collection(this.db, "organizations", organizationId, "teams"));
    return snaps.docs.map((d) => toTeam(d.id, d.data() as Record<string, unknown>));
  }

  subscribeToTeams(organizationId: string, onUpdate: (teams: Team[]) => void): Unsubscribe {
    return onSnapshot(collection(this.db, "organizations", organizationId, "teams"), (snap) => {
      onUpdate(snap.docs.map((d) => toTeam(d.id, d.data() as Record<string, unknown>)));
    });
  }

  async sendPartnerInvite(organizationId: string, teamId: string, email: string): Promise<string> {
    const ref = await addDoc(collection(this.db, "organizations", organizationId, "partnerInvites"), {
      email,
      teamId,
      role: "Guest",
      inviteState: "pending",
      invitedAt: serverTimestamp(),
    });
    return ref.id;
  }

  async dismissPartnerMember(organizationId: string, teamId: string, memberId: string): Promise<void> {
    await this.removeMemberFromTeam(organizationId, teamId, memberId);
  }

  async getPartnerInvites(organizationId: string): Promise<PartnerInvite[]> {
    const snaps = await getDocs(collection(this.db, "organizations", organizationId, "partnerInvites"));
    return snaps.docs.map((d) => toPartnerInvite(d.id, d.data() as Record<string, unknown>));
  }
}
````

## File: modules/platform/subdomains/organization/infrastructure/firebase/FirebaseOrgPolicyRepository.ts
````typescript
/**
 * FirebaseOrgPolicyRepository — Infrastructure adapter for org-policy persistence.
 * OrgPolicy lives in top-level `orgPolicies` collection, independent of `organizations`.
 */

import {
  getFirestore,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  collection,
  getDocs,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { firebaseClientApp } from "@integration-firebase/client";
import type { OrgPolicyRepository } from "../../domain/repositories/OrgPolicyRepository";
import type { OrgPolicy, CreateOrgPolicyInput, UpdateOrgPolicyInput } from "../../domain/entities/Organization";
import { toOrgPolicy } from "./organization-mappers";

export class FirebaseOrgPolicyRepository implements OrgPolicyRepository {
  private get db() {
    return getFirestore(firebaseClientApp);
  }

  async createPolicy(input: CreateOrgPolicyInput): Promise<OrgPolicy> {
    const now = new Date().toISOString();
    const ref = await addDoc(collection(this.db, "orgPolicies"), {
      orgId: input.orgId,
      name: input.name,
      description: input.description,
      rules: input.rules,
      scope: input.scope,
      isActive: true,
      createdAt: now,
      updatedAt: now,
      _createdAt: serverTimestamp(),
    });
    return {
      id: ref.id,
      orgId: input.orgId,
      name: input.name,
      description: input.description,
      rules: input.rules,
      scope: input.scope,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    };
  }

  async updatePolicy(policyId: string, data: UpdateOrgPolicyInput): Promise<void> {
    const updates: Record<string, unknown> = {
      updatedAt: new Date().toISOString(),
      _updatedAt: serverTimestamp(),
    };
    if (data.name !== undefined) updates.name = data.name;
    if (data.description !== undefined) updates.description = data.description;
    if (data.rules !== undefined) updates.rules = data.rules;
    if (data.scope !== undefined) updates.scope = data.scope;
    if (data.isActive !== undefined) updates.isActive = data.isActive;
    await updateDoc(doc(this.db, "orgPolicies", policyId), updates);
  }

  async deletePolicy(policyId: string): Promise<void> {
    await deleteDoc(doc(this.db, "orgPolicies", policyId));
  }

  async getPolicies(orgId: string): Promise<OrgPolicy[]> {
    const q = query(collection(this.db, "orgPolicies"), where("orgId", "==", orgId));
    const snaps = await getDocs(q);
    return snaps.docs.map((d) => toOrgPolicy(d.id, d.data() as Record<string, unknown>));
  }
}
````

## File: modules/platform/subdomains/organization/infrastructure/firebase/organization-mappers.ts
````typescript
import type {
  OrganizationEntity,
  MemberReference,
  Team,
  OrgPolicy,
  PartnerInvite,
} from "../../domain/entities/Organization";

export function toOrganizationEntity(id: string, data: Record<string, unknown>): OrganizationEntity {
  return {
    id,
    name: typeof data.name === "string" ? data.name : "",
    ownerId: typeof data.ownerId === "string" ? data.ownerId : "",
    email: typeof data.email === "string" ? data.email : undefined,
    photoURL: typeof data.photoURL === "string" ? data.photoURL : undefined,
    description: typeof data.description === "string" ? data.description : undefined,
    theme: data.theme != null ? (data.theme as OrganizationEntity["theme"]) : undefined,
    members: Array.isArray(data.members) ? (data.members as MemberReference[]) : [],
    memberIds: Array.isArray(data.memberIds) ? (data.memberIds as string[]) : [],
    teams: Array.isArray(data.teams) ? (data.teams as Team[]) : [],
    partnerInvites: Array.isArray(data.partnerInvites) ? (data.partnerInvites as PartnerInvite[]) : undefined,
    createdAt: data.createdAt as OrganizationEntity["createdAt"],
  };
}

export function toTeam(id: string, data: Record<string, unknown>): Team {
  return {
    id,
    name: typeof data.name === "string" ? data.name : "",
    description: typeof data.description === "string" ? data.description : "",
    type: data.type === "external" ? "external" : "internal",
    memberIds: Array.isArray(data.memberIds) ? (data.memberIds as string[]) : [],
  };
}

export function toPartnerInvite(id: string, data: Record<string, unknown>): PartnerInvite {
  const VALID_STATES = new Set<PartnerInvite["inviteState"]>(["pending", "accepted", "expired"]);
  return {
    id,
    email: typeof data.email === "string" ? data.email : "",
    teamId: typeof data.teamId === "string" ? data.teamId : "",
    role: (data.role as PartnerInvite["role"]) ?? "Guest",
    inviteState: VALID_STATES.has(data.inviteState as PartnerInvite["inviteState"])
      ? (data.inviteState as PartnerInvite["inviteState"])
      : "pending",
    invitedAt: data.invitedAt as PartnerInvite["invitedAt"],
    protocol: typeof data.protocol === "string" ? data.protocol : "",
  };
}

export function toOrgPolicy(id: string, data: Record<string, unknown>): OrgPolicy {
  const VALID_SCOPES = new Set<OrgPolicy["scope"]>(["workspace", "member", "global"]);
  return {
    id,
    orgId: typeof data.orgId === "string" ? data.orgId : "",
    name: typeof data.name === "string" ? data.name : "",
    description: typeof data.description === "string" ? data.description : "",
    rules: Array.isArray(data.rules) ? (data.rules as OrgPolicy["rules"]) : [],
    scope: VALID_SCOPES.has(data.scope as OrgPolicy["scope"]) ? (data.scope as OrgPolicy["scope"]) : "global",
    isActive: data.isActive === true,
    createdAt: typeof data.createdAt === "string" ? data.createdAt : new Date().toISOString(),
    updatedAt: typeof data.updatedAt === "string" ? data.updatedAt : new Date().toISOString(),
  };
}
````

## File: modules/platform/subdomains/organization/infrastructure/index.ts
````typescript
export { organizationService, organizationQueryService } from "./organization-service";
````

## File: modules/platform/subdomains/organization/interfaces/components/AccountSwitcher.tsx
````typescript
"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import type { AccountEntity, AuthUser } from "../../../../api";
import { useApp } from "../../../../api";
import { createOrganization } from "../_actions/organization.actions";
import { Button } from "@ui-shadcn/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@ui-shadcn/ui/dialog";
import { Input } from "@ui-shadcn/ui/input";

interface AccountSwitcherProps {
  personalAccount: AuthUser | null;
  organizationAccounts: AccountEntity[];
  activeAccountId: string | null;
  onSelectPersonal: () => void;
  onSelectOrganization: (account: AccountEntity) => void;
  onOrganizationCreated?: (account: AccountEntity) => void;
}

export function AccountSwitcher({
  personalAccount,
  organizationAccounts,
  activeAccountId,
  onSelectPersonal,
  onSelectOrganization,
  onOrganizationCreated,
}: AccountSwitcherProps) {
  const router = useRouter();
  const {
    state: { accountsHydrated, bootstrapPhase },
  } = useApp();
  const [isCreateOrganizationOpen, setIsCreateOrganizationOpen] = useState(false);
  const [organizationName, setOrganizationName] = useState("");
  const [organizationError, setOrganizationError] = useState<string | null>(null);
  const [isCreatingOrganization, setIsCreatingOrganization] = useState(false);

  function resetCreateOrganizationDialog() {
    setOrganizationName("");
    setOrganizationError(null);
    setIsCreatingOrganization(false);
  }

  async function handleCreateOrganization(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!personalAccount) {
      setOrganizationError("帳號資訊已失效，請重新登入後再建立組織。");
      return;
    }

    const nextOrganizationName = organizationName.trim();
    if (!nextOrganizationName) {
      setOrganizationError("請輸入組織名稱。");
      return;
    }

    setIsCreatingOrganization(true);
    setOrganizationError(null);

    const result = await createOrganization({
      organizationName: nextOrganizationName,
      ownerId: personalAccount.id,
      ownerName: personalAccount.name,
      ownerEmail: personalAccount.email,
    });

    if (!result.success) {
      setOrganizationError(result.error.message);
      setIsCreatingOrganization(false);
      return;
    }

    onOrganizationCreated?.({
      id: result.aggregateId,
      name: nextOrganizationName,
      accountType: "organization",
      ownerId: personalAccount.id,
    });

    resetCreateOrganizationDialog();
    setIsCreateOrganizationOpen(false);
    router.push("/organization");
  }

  return (
    <>
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          帳號情境
        </p>
        <select
          aria-label="切換帳號情境"
          value={activeAccountId ?? ""}
          onChange={(event) => {
            const nextId = event.target.value;
            if (nextId === "__create_organization__") {
              setIsCreateOrganizationOpen(true);
              return;
            }

            if (!nextId || nextId === personalAccount?.id) {
              onSelectPersonal();
              return;
            }

            const nextAccount = organizationAccounts.find((account) => account.id === nextId);
            if (nextAccount) {
              onSelectOrganization(nextAccount);
            }
          }}
          className="w-full rounded-lg border border-border/60 bg-background px-3 py-2 text-sm text-foreground"
        >
          {personalAccount && (
            <option value={personalAccount.id}>{personalAccount.name}（個人）</option>
          )}
          {organizationAccounts.map((account) => (
            <option key={account.id} value={account.id}>
              {account.name}（組織）
            </option>
          ))}
          <option value="__create_organization__">+建立組織</option>
        </select>
        {!accountsHydrated && (
          <p className="text-xs text-muted-foreground">
            {bootstrapPhase === "seeded" ? "正在同步組織上下文…" : "正在載入帳號上下文…"}
          </p>
        )}
      </div>

      <Dialog
        open={isCreateOrganizationOpen}
        onOpenChange={(open) => {
          setIsCreateOrganizationOpen(open);
          if (!open) {
            resetCreateOrganizationDialog();
          }
        }}
      >
        <DialogContent aria-describedby="create-organization-description">
          <DialogHeader>
            <DialogTitle>建立新組織</DialogTitle>
            <DialogDescription id="create-organization-description">
              輸入名稱後會直接建立組織並切換到新的組織內容。
            </DialogDescription>
          </DialogHeader>

          <form className="space-y-4" onSubmit={handleCreateOrganization}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground" htmlFor="organization-name">
                組織名稱
              </label>
              <Input
                id="organization-name"
                value={organizationName}
                onChange={(event) => {
                  setOrganizationName(event.target.value);
                  if (organizationError) {
                    setOrganizationError(null);
                  }
                }}
                placeholder="例如：Gig Team"
                // eslint-disable-next-line jsx-a11y/no-autofocus
                autoFocus
                disabled={isCreatingOrganization}
                maxLength={80}
              />
              {organizationError && <p className="text-sm text-destructive">{organizationError}</p>}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  resetCreateOrganizationDialog();
                  setIsCreateOrganizationOpen(false);
                }}
                disabled={isCreatingOrganization}
              >
                取消
              </Button>
              <Button type="submit" disabled={isCreatingOrganization || !personalAccount}>
                {isCreatingOrganization ? "建立中…" : "直接建立"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
````

## File: modules/platform/subdomains/organization/interfaces/components/CreateOrganizationDialog.tsx
````typescript
"use client";

import { type FormEvent, useState } from "react";

import type { AuthUser } from "@/modules/platform/api";
import type { AccountEntity } from "../../../../api";
import { createOrganization } from "../_actions/organization.actions";
import { Button } from "@ui-shadcn/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@ui-shadcn/ui/dialog";
import { Input } from "@ui-shadcn/ui/input";

interface CreateOrganizationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: AuthUser | null;
  onOrganizationCreated?: (account: AccountEntity) => void;
  onNavigate: (href: string) => void;
}

export function CreateOrganizationDialog({
  open,
  onOpenChange,
  user,
  onOrganizationCreated,
  onNavigate,
}: CreateOrganizationDialogProps) {
  const [orgName, setOrgName] = useState("");
  const [orgError, setOrgError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  function reset() {
    setOrgName("");
    setOrgError(null);
    setIsCreating(false);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user) {
      setOrgError("帳號資訊已失效，請重新登入後再建立組織。");
      return;
    }
    const name = orgName.trim();
    if (!name) {
      setOrgError("請輸入組織名稱。");
      return;
    }
    setIsCreating(true);
    setOrgError(null);
    const result = await createOrganization({
      organizationName: name,
      ownerId: user.id,
      ownerName: user.name,
      ownerEmail: user.email,
    });
    if (!result.success) {
      setOrgError(result.error.message);
      setIsCreating(false);
      return;
    }
    const newAccount: AccountEntity = {
      id: result.aggregateId,
      name,
      accountType: "organization",
      ownerId: user.id,
    };
    onOrganizationCreated?.(newAccount);
    reset();
    onOpenChange(false);
    onNavigate("/organization");
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        onOpenChange(isOpen);
        if (!isOpen) reset();
      }}
    >
      <DialogContent aria-describedby="rail-create-org-description">
        <DialogHeader>
          <DialogTitle>建立新組織</DialogTitle>
          <DialogDescription id="rail-create-org-description">
            輸入名稱後會直接建立組織並切換到新的組織內容。
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground" htmlFor="rail-organization-name">
              組織名稱
            </label>
            <Input
              id="rail-organization-name"
              value={orgName}
              onChange={(e) => {
                setOrgName(e.target.value);
                if (orgError) setOrgError(null);
              }}
              placeholder="例如：Gig Team"
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
              disabled={isCreating}
              maxLength={80}
            />
            {orgError && <p className="text-sm text-destructive">{orgError}</p>}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                onOpenChange(false);
              }}
              disabled={isCreating}
            >
              取消
            </Button>
            <Button type="submit" disabled={isCreating || !user}>
              {isCreating ? "建立中…" : "直接建立"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
````

## File: modules/platform/subdomains/organization/interfaces/components/MembersPage.tsx
````typescript
"use client";

import { useEffect, useState } from "react";

import { dismissMember, inviteMember } from "../_actions/organization.actions";
import { getOrganizationMembers } from "../queries/organization.queries";
import { Badge } from "@ui-shadcn/ui/badge";
import { Button } from "@ui-shadcn/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui-shadcn/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@ui-shadcn/ui/dialog";
import { Input } from "@ui-shadcn/ui/input";
import { Label } from "@ui-shadcn/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui-shadcn/ui/select";

type MemberRole = "Admin" | "Member" | "Guest";

export interface MembersPageProps {
  organizationId: string | null;
}

export function MembersPage({ organizationId }: MembersPageProps) {
  const [members, setMembers] = useState<Awaited<ReturnType<typeof getOrganizationMembers>>>([]);
  const [loadState, setLoadState] = useState<"idle" | "loading" | "loaded" | "error">("idle");

  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<MemberRole>("Member");
  const [inviteSubmitting, setInviteSubmitting] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);

  const [removingId, setRemovingId] = useState<string | null>(null);

  async function loadMembers(orgId: string) {
    setLoadState("loading");
    try {
      const data = await getOrganizationMembers(orgId);
      setMembers(data);
      setLoadState("loaded");
    } catch {
      setMembers([]);
      setLoadState("error");
    }
  }

  useEffect(() => {
    if (!organizationId) return;
    const orgId: string = organizationId;
    let cancelled = false;

    async function load() {
      setLoadState("loading");
      try {
        const data = await getOrganizationMembers(orgId);
        if (!cancelled) {
          setMembers(data);
          setLoadState("loaded");
        }
      } catch {
        if (!cancelled) {
          setMembers([]);
          setLoadState("error");
        }
      }
    }
    void load();

    return () => {
      cancelled = true;
    };
  }, [organizationId]);

  async function handleInvite() {
    if (!organizationId || !inviteEmail.trim()) return;
    setInviteSubmitting(true);
    setInviteError(null);
    const result = await inviteMember({
      organizationId,
      email: inviteEmail.trim(),
      teamId: "",
      role: inviteRole,
      protocol: "email",
    });
    setInviteSubmitting(false);
    if (result.success) {
      setInviteOpen(false);
      setInviteEmail("");
      setInviteRole("Member");
      await loadMembers(organizationId);
    } else {
      setInviteError(result.error.message);
    }
  }

  async function handleDismiss(memberId: string) {
    if (!organizationId) return;
    setRemovingId(memberId);
    await dismissMember(organizationId, memberId);
    setRemovingId(null);
    await loadMembers(organizationId);
  }

  if (!organizationId) {
    return (
      <div className="">
        <p className="text-sm text-muted-foreground">請先切換到組織帳戶。</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">成員</h1>
          <p className="mt-1 text-sm text-muted-foreground">組織成員清單與目前角色。</p>
        </div>
        <Button onClick={() => setInviteOpen(true)}>邀請成員</Button>
      </div>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Members</CardTitle>
          <CardDescription>組織成員清單與目前角色。</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {loadState === "loading" && (
            <p className="text-sm text-muted-foreground">載入成員資料中…</p>
          )}
          {loadState === "error" && (
            <p className="text-sm text-destructive">讀取成員資料失敗，請稍後重新整理頁面。</p>
          )}
          {loadState === "loaded" && members.length === 0 && (
            <p className="text-sm text-muted-foreground">目前沒有可顯示的成員資料。</p>
          )}
          {loadState === "loaded" &&
            members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between rounded-lg border border-border/40 px-3 py-2"
              >
                <div>
                  <p className="text-sm font-medium">{member.name}</p>
                  <p className="text-xs text-muted-foreground">{member.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{member.role}</Badge>
                  <Badge variant="secondary">{member.presence}</Badge>
                  {member.role !== "Owner" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={removingId === member.id}
                      onClick={() => handleDismiss(member.id)}
                    >
                      移除
                    </Button>
                  )}
                </div>
              </div>
            ))}
        </CardContent>
      </Card>

      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>邀請成員</DialogTitle>
            <DialogDescription>輸入電子信箱以邀請新成員加入組織。</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <Label htmlFor="invite-email">電子信箱</Label>
              <Input
                id="invite-email"
                type="email"
                placeholder="member@example.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="invite-role">角色</Label>
              <Select value={inviteRole} onValueChange={(v) => setInviteRole(v as MemberRole)}>
                <SelectTrigger id="invite-role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Member">Member</SelectItem>
                  <SelectItem value="Guest">Guest</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {inviteError && <p className="text-sm text-destructive">{inviteError}</p>}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteOpen(false)}>
              取消
            </Button>
            <Button onClick={handleInvite} disabled={inviteSubmitting || !inviteEmail.trim()}>
              {inviteSubmitting ? "邀請中…" : "送出邀請"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
````

## File: modules/platform/subdomains/organization/interfaces/components/OrganizationAuditPage.tsx
````typescript
"use client";

import { useEffect, useMemo, useState } from "react";

import { AuditStream, getOrganizationAuditLogs } from "@/modules/workspace/api";
import type { WorkspaceEntity } from "@/modules/workspace/api";
import { Badge } from "@ui-shadcn/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui-shadcn/ui/card";

// ── Props ─────────────────────────────────────────────────────────────────────

export interface OrganizationAuditPageProps {
  organizationId: string | null;
  workspaces: Record<string, WorkspaceEntity>;
  workspacesHydrated: boolean;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDateTime(value: string | Date | null | undefined): string {
  if (!value) return "—";
  try {
    return new Intl.DateTimeFormat("zh-TW", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(value instanceof Date ? value : new Date(value));
  } catch {
    return value instanceof Date ? value.toISOString() : String(value);
  }
}

const MAX_DISPLAYED_AUDIT_LOGS = 50;

// ── Component ─────────────────────────────────────────────────────────────────

export function OrganizationAuditPage({
  organizationId,
  workspaces,
  workspacesHydrated,
}: OrganizationAuditPageProps) {
  const [auditLogs, setAuditLogs] = useState<
    Awaited<ReturnType<typeof getOrganizationAuditLogs>>
  >([]);
  const [loadState, setLoadState] = useState<"idle" | "loading" | "loaded" | "error">("idle");

  // workspaceNameById is derived from the workspaces prop — no extra fetch needed.
  const workspaceNameById = useMemo(
    () => new Map(Object.values(workspaces).map((w) => [w.id, w.name])),
    [workspaces],
  );

  useEffect(() => {
    if (!organizationId || !workspacesHydrated) return;
    let cancelled = false;
    const workspaceIds = Object.keys(workspaces);

    async function load() {
      setLoadState("loading");
      try {
        const logs = await getOrganizationAuditLogs(workspaceIds, MAX_DISPLAYED_AUDIT_LOGS);
        if (!cancelled) {
          setAuditLogs(logs);
          setLoadState("loaded");
        }
      } catch {
        if (!cancelled) {
          setAuditLogs([]);
          setLoadState("error");
        }
      }
    }
    void load();

    return () => {
      cancelled = true;
    };
  }, [organizationId, workspacesHydrated, workspaces]);

  if (!organizationId) {
    return (
      <div className="">
        <p className="text-sm text-muted-foreground">請先切換到組織帳戶。</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">稽核</h1>
        <p className="mt-1 text-sm text-muted-foreground">組織下所有工作區的 audit log 彙整。</p>
      </div>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Audit</CardTitle>
          <CardDescription>組織下所有工作區的 audit log 彙整。</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {loadState === "loading" && (
            <p className="text-sm text-muted-foreground">載入稽核資料中…</p>
          )}
          {loadState === "error" && (
            <p className="text-sm text-destructive">讀取稽核資料失敗，請稍後重新整理頁面。</p>
          )}
          {loadState === "loaded" && auditLogs.length === 0 && (
            <p className="text-sm text-muted-foreground">目前沒有可顯示的 audit logs。</p>
          )}
          {loadState === "loaded" &&
            auditLogs.slice(0, MAX_DISPLAYED_AUDIT_LOGS).map((log) => (
              <div key={log.id} className="rounded-lg border border-border/40 px-3 py-2">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-medium">{log.action}</p>
                  <Badge variant="outline">{log.source}</Badge>
                  <Badge variant="secondary">
                    {workspaceNameById.get(log.workspaceId) ?? log.workspaceId}
                  </Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{log.detail || "—"}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {formatDateTime(log.occurredAtISO)}
                </p>
              </div>
            ))}
        </CardContent>
      </Card>

      {/* ── 稽核時間軸（新版 AuditStream）─────────────────────────────── */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>稽核時間軸</CardTitle>
          <CardDescription>
            以時間軸視覺化呈現稽核事件；嚴重程度由色點標示（藍 = 中、橘 = 高、紅 = 嚴重）。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AuditStream logs={auditLogs} height={500} />
        </CardContent>
      </Card>
    </div>
  );
}
````

## File: modules/platform/subdomains/organization/interfaces/components/PermissionsPage.tsx
````typescript
"use client";

import { useEffect, useState } from "react";

import { createOrgPolicy } from "../_actions/organization-policy.actions";
import { getOrgPolicies } from "../queries/organization.queries";
import { Badge } from "@ui-shadcn/ui/badge";
import { Button } from "@ui-shadcn/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui-shadcn/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@ui-shadcn/ui/dialog";
import { Input } from "@ui-shadcn/ui/input";
import { Label } from "@ui-shadcn/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui-shadcn/ui/select";

type PolicyScope = "workspace" | "member" | "global";

export interface PermissionsPageProps {
  organizationId: string | null;
}

export function PermissionsPage({ organizationId }: PermissionsPageProps) {
  const [policies, setPolicies] = useState<Awaited<ReturnType<typeof getOrgPolicies>>>([]);
  const [loadState, setLoadState] = useState<"idle" | "loading" | "loaded" | "error">("idle");

  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newScope, setNewScope] = useState<PolicyScope>("member");
  const [createSubmitting, setCreateSubmitting] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  async function loadPolicies(orgId: string) {
    setLoadState("loading");
    try {
      const data = await getOrgPolicies(orgId);
      setPolicies(data);
      setLoadState("loaded");
    } catch {
      setPolicies([]);
      setLoadState("error");
    }
  }

  useEffect(() => {
    if (!organizationId) return;
    const orgId: string = organizationId;
    let cancelled = false;

    async function load() {
      setLoadState("loading");
      try {
        const data = await getOrgPolicies(orgId);
        if (!cancelled) {
          setPolicies(data);
          setLoadState("loaded");
        }
      } catch {
        if (!cancelled) {
          setPolicies([]);
          setLoadState("error");
        }
      }
    }
    void load();

    return () => {
      cancelled = true;
    };
  }, [organizationId]);

  async function handleCreate() {
    if (!organizationId || !newName.trim()) return;
    setCreateSubmitting(true);
    setCreateError(null);
    const result = await createOrgPolicy({
      orgId: organizationId,
      name: newName.trim(),
      description: newDescription.trim(),
      rules: [],
      scope: newScope,
    });
    setCreateSubmitting(false);
    if (result.success) {
      setCreateOpen(false);
      setNewName("");
      setNewDescription("");
      setNewScope("member");
      await loadPolicies(organizationId);
    } else {
      setCreateError(result.error.message);
    }
  }

  if (!organizationId) {
    return (
      <div className="">
        <p className="text-sm text-muted-foreground">請先切換到組織帳戶。</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">權限</h1>
          <p className="mt-1 text-sm text-muted-foreground">組織層級政策規則與 scope。</p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>新增政策</Button>
      </div>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Permissions</CardTitle>
          <CardDescription>組織層級政策規則與 scope。</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {loadState === "loading" && (
            <p className="text-sm text-muted-foreground">載入政策資料中…</p>
          )}
          {loadState === "error" && (
            <p className="text-sm text-destructive">讀取政策資料失敗，請稍後重新整理頁面。</p>
          )}
          {loadState === "loaded" && policies.length === 0 && (
            <p className="text-sm text-muted-foreground">目前沒有可顯示的政策資料。</p>
          )}
          {loadState === "loaded" &&
            policies.map((policy) => (
              <div key={policy.id} className="rounded-lg border border-border/40 px-3 py-2">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-medium">{policy.name}</p>
                  <Badge variant="outline">{policy.scope}</Badge>
                  <Badge variant={policy.isActive ? "default" : "secondary"}>
                    {policy.isActive ? "active" : "inactive"}
                  </Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{policy.description}</p>
                <p className="mt-1 text-xs text-muted-foreground">Rules: {policy.rules.length}</p>
              </div>
            ))}
        </CardContent>
      </Card>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>新增政策</DialogTitle>
            <DialogDescription>建立組織層級存取控制政策。</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <Label htmlFor="policy-name">名稱</Label>
              <Input
                id="policy-name"
                placeholder="政策名稱"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="policy-description">描述</Label>
              <Input
                id="policy-description"
                placeholder="選填"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="policy-scope">Scope</Label>
              <Select value={newScope} onValueChange={(v) => setNewScope(v as PolicyScope)}>
                <SelectTrigger id="policy-scope">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="member">Member（成員）</SelectItem>
                  <SelectItem value="workspace">Workspace（工作區）</SelectItem>
                  <SelectItem value="global">Global（全域）</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {createError && <p className="text-sm text-destructive">{createError}</p>}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>
              取消
            </Button>
            <Button onClick={handleCreate} disabled={createSubmitting || !newName.trim()}>
              {createSubmitting ? "建立中…" : "建立"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
````

## File: modules/platform/subdomains/organization/interfaces/components/TeamsPage.tsx
````typescript
"use client";

import { useEffect, useState } from "react";

import { createTeam } from "../_actions/organization.actions";
import { getOrganizationTeams } from "../queries/organization.queries";
import { Badge } from "@ui-shadcn/ui/badge";
import { Button } from "@ui-shadcn/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui-shadcn/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@ui-shadcn/ui/dialog";
import { Input } from "@ui-shadcn/ui/input";
import { Label } from "@ui-shadcn/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui-shadcn/ui/select";

export interface TeamsPageProps {
  organizationId: string | null;
}

export function TeamsPage({ organizationId }: TeamsPageProps) {
  const [teams, setTeams] = useState<Awaited<ReturnType<typeof getOrganizationTeams>>>([]);
  const [loadState, setLoadState] = useState<"idle" | "loading" | "loaded" | "error">("idle");

  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newType, setNewType] = useState<"internal" | "external">("internal");
  const [createSubmitting, setCreateSubmitting] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  async function loadTeams(orgId: string) {
    setLoadState("loading");
    try {
      const data = await getOrganizationTeams(orgId);
      setTeams(data);
      setLoadState("loaded");
    } catch {
      setTeams([]);
      setLoadState("error");
    }
  }

  useEffect(() => {
    if (!organizationId) return;
    const orgId: string = organizationId;
    let cancelled = false;

    async function load() {
      setLoadState("loading");
      try {
        const data = await getOrganizationTeams(orgId);
        if (!cancelled) {
          setTeams(data);
          setLoadState("loaded");
        }
      } catch {
        if (!cancelled) {
          setTeams([]);
          setLoadState("error");
        }
      }
    }
    void load();

    return () => {
      cancelled = true;
    };
  }, [organizationId]);

  async function handleCreate() {
    if (!organizationId || !newName.trim()) return;
    setCreateSubmitting(true);
    setCreateError(null);
    const result = await createTeam({
      organizationId,
      name: newName.trim(),
      description: newDescription.trim(),
      type: newType,
    });
    setCreateSubmitting(false);
    if (result.success) {
      setCreateOpen(false);
      setNewName("");
      setNewDescription("");
      setNewType("internal");
      await loadTeams(organizationId);
    } else {
      setCreateError(result.error.message);
    }
  }

  if (!organizationId) {
    return (
      <div className="">
        <p className="text-sm text-muted-foreground">請先切換到組織帳戶。</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">團隊</h1>
          <p className="mt-1 text-sm text-muted-foreground">組織團隊與成員關聯。</p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>建立團隊</Button>
      </div>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Teams</CardTitle>
          <CardDescription>組織團隊與成員關聯。</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {loadState === "loading" && (
            <p className="text-sm text-muted-foreground">載入團隊資料中…</p>
          )}
          {loadState === "error" && (
            <p className="text-sm text-destructive">讀取團隊資料失敗，請稍後重新整理頁面。</p>
          )}
          {loadState === "loaded" && teams.length === 0 && (
            <p className="text-sm text-muted-foreground">目前沒有可顯示的團隊資料。</p>
          )}
          {loadState === "loaded" &&
            teams.map((team) => (
              <div key={team.id} className="rounded-lg border border-border/40 px-3 py-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{team.name}</p>
                  <Badge variant="outline">{team.type}</Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{team.description || "—"}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Members: {team.memberIds.length}
                </p>
              </div>
            ))}
        </CardContent>
      </Card>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>建立團隊</DialogTitle>
            <DialogDescription>填寫團隊名稱與類型以建立新團隊。</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <Label htmlFor="team-name">名稱</Label>
              <Input
                id="team-name"
                placeholder="團隊名稱"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="team-description">描述</Label>
              <Input
                id="team-description"
                placeholder="選填"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="team-type">類型</Label>
              <Select
                value={newType}
                onValueChange={(v) => setNewType(v as "internal" | "external")}
              >
                <SelectTrigger id="team-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="internal">Internal（內部）</SelectItem>
                  <SelectItem value="external">External（外部）</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {createError && <p className="text-sm text-destructive">{createError}</p>}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>
              取消
            </Button>
            <Button onClick={handleCreate} disabled={createSubmitting || !newName.trim()}>
              {createSubmitting ? "建立中…" : "建立"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
````

## File: modules/platform/subdomains/organization/interfaces/index.ts
````typescript
export { AccountSwitcher } from "./components/AccountSwitcher";
export { CreateOrganizationDialog } from "./components/CreateOrganizationDialog";
export { MembersPage } from "./components/MembersPage";
export type { MembersPageProps } from "./components/MembersPage";
export { TeamsPage } from "./components/TeamsPage";
export type { TeamsPageProps } from "./components/TeamsPage";
export { PermissionsPage } from "./components/PermissionsPage";
export type { PermissionsPageProps } from "./components/PermissionsPage";
export { OrganizationAuditPage } from "./components/OrganizationAuditPage";
export type { OrganizationAuditPageProps } from "./components/OrganizationAuditPage";

export { getOrganizationMembers, getOrganizationTeams, getOrgPolicies } from "./queries/organization.queries";
export {
  createOrganization,
  createOrganizationWithTeam,
  updateOrganizationSettings,
  deleteOrganization,
  inviteMember,
  recruitMember,
  dismissMember,
  updateMemberRole,
  createTeam,
  deleteTeam,
  updateTeamMembers,
  createPartnerGroup,
  sendPartnerInvite,
  dismissPartnerMember,
} from "./_actions/organization.actions";
export { createOrgPolicy, updateOrgPolicy, deleteOrgPolicy } from "./_actions/organization-policy.actions";
````

## File: modules/platform/subdomains/organization/README.md
````markdown
# Organization

Organization structure, membership, and team management.

## Ownership

- **Bounded Context**: platform
- **Status**: Active

## Layers

| Layer | Purpose |
|-------|---------|
| `api/` | Public boundary for cross-subdomain access |
| `application/` | Use case orchestration and DTOs |
| `domain/` | Entities, value objects, and business rules |
| `infrastructure/` | Adapters, persistence, and external integrations |
| `interfaces/` | UI components, hooks, actions, and queries |

## Dependency Direction

```text
interfaces/ → application/ → domain/ ← infrastructure/
```

## Development Order

1. Domain → 2. Application → 3. Ports (if needed) → 4. Infrastructure → 5. Interfaces
````

## File: modules/platform/subdomains/platform-config/domain/index.ts
````typescript
// Purpose: Domain layer placeholder for platform subdomain 'platform-config'.
````

## File: modules/platform/subdomains/platform-config/infrastructure/index.ts
````typescript
// Purpose: Infrastructure layer placeholder for platform subdomain 'platform-config'.
````

## File: modules/platform/subdomains/platform-config/README.md
````markdown
# Platform Config

Platform configuration management.

## Ownership

- **Bounded Context**: platform
- **Status**: Stub — awaiting use case definition

## Development Order

When implementing, follow inside-out:
1. Domain → 2. Application → 3. Ports (if needed) → 4. Infrastructure → 5. Interfaces
````

## File: modules/platform/subdomains/referral/api/index.ts
````typescript
/**
 * Public API boundary for this subdomain.
 * Cross-module consumers must import through this entry point.
 */
export {};
````

## File: modules/platform/subdomains/referral/application/index.ts
````typescript
// Purpose: Application layer placeholder for platform subdomain 'referral'.
````

## File: modules/platform/subdomains/referral/domain/index.ts
````typescript
// Purpose: Domain layer placeholder for platform subdomain 'referral'.
````

## File: modules/platform/subdomains/referral/infrastructure/index.ts
````typescript
// Purpose: Infrastructure layer placeholder for platform subdomain 'referral'.
````

## File: modules/platform/subdomains/referral/README.md
````markdown
# Referral

Referral program management.

## Ownership

- **Bounded Context**: platform
- **Status**: Stub — awaiting use case definition

## Development Order

When implementing, follow inside-out:
1. Domain → 2. Application → 3. Ports (if needed) → 4. Infrastructure → 5. Interfaces
````

## File: modules/platform/subdomains/search/domain/index.ts
````typescript
// Purpose: Domain layer placeholder for platform subdomain 'search'.
````

## File: modules/platform/subdomains/search/infrastructure/index.ts
````typescript
// Purpose: Infrastructure layer placeholder for platform subdomain 'search'.
````

## File: modules/platform/subdomains/search/README.md
````markdown
# Search

Platform-wide search capabilities.

## Ownership

- **Bounded Context**: platform
- **Status**: Stub — awaiting use case definition

## Development Order

When implementing, follow inside-out:
1. Domain → 2. Application → 3. Ports (if needed) → 4. Infrastructure → 5. Interfaces
````

## File: modules/platform/subdomains/secret-management/api/index.ts
````typescript
/**
 * Public API boundary for this subdomain.
 * Cross-module consumers must import through this entry point.
 */
export {};
````

## File: modules/platform/subdomains/secret-management/application/index.ts
````typescript
// Purpose: Application layer placeholder for platform subdomain 'secret-management'.
````

## File: modules/platform/subdomains/secret-management/domain/index.ts
````typescript
// Purpose: Domain layer placeholder for platform subdomain 'secret-management'.
````

## File: modules/platform/subdomains/secret-management/infrastructure/index.ts
````typescript
// Purpose: Infrastructure layer placeholder for platform subdomain 'secret-management'.
````

## File: modules/platform/subdomains/secret-management/README.md
````markdown
# Secret Management

把憑證、token、rotation 從 integration 中切開。

## Ownership

- **Bounded Context**: platform
- **Subdomain Type**: Recommended Gap
- **Status**: Stub — awaiting use case definition

## Development Order

When implementing, follow inside-out:
1. Domain → 2. Application → 3. Ports (if needed) → 4. Infrastructure → 5. Interfaces
````

## File: modules/platform/subdomains/security-policy/api/index.ts
````typescript
/**
 * Public API boundary for this subdomain.
 * Cross-module consumers must import through this entry point.
 */
export {};
````

## File: modules/platform/subdomains/security-policy/application/index.ts
````typescript
// Purpose: Application layer placeholder for platform subdomain 'security-policy'.
````

## File: modules/platform/subdomains/security-policy/domain/index.ts
````typescript
// Purpose: Domain layer placeholder for platform subdomain 'security-policy'.
````

## File: modules/platform/subdomains/security-policy/infrastructure/index.ts
````typescript
// Purpose: Infrastructure layer placeholder for platform subdomain 'security-policy'.
````

## File: modules/platform/subdomains/security-policy/README.md
````markdown
# Security Policy

Security policy enforcement.

## Ownership

- **Bounded Context**: platform
- **Status**: Stub — awaiting use case definition

## Development Order

When implementing, follow inside-out:
1. Domain → 2. Application → 3. Ports (if needed) → 4. Infrastructure → 5. Interfaces
````

## File: modules/platform/subdomains/subscription/README.md
````markdown
# Subscription

Subscription plan management.

## Ownership

- **Bounded Context**: platform
- **Status**: Stub — awaiting use case definition

## Development Order

When implementing, follow inside-out:
1. Domain → 2. Application → 3. Ports (if needed) → 4. Infrastructure → 5. Interfaces
````

## File: modules/platform/subdomains/support/api/index.ts
````typescript
/**
 * Public API boundary for this subdomain.
 * Cross-module consumers must import through this entry point.
 */
export {};
````

## File: modules/platform/subdomains/support/application/index.ts
````typescript
// Purpose: Application layer placeholder for platform subdomain 'support'.
````

## File: modules/platform/subdomains/support/domain/index.ts
````typescript
// Purpose: Domain layer placeholder for platform subdomain 'support'.
````

## File: modules/platform/subdomains/support/infrastructure/index.ts
````typescript
// Purpose: Infrastructure layer placeholder for platform subdomain 'support'.
````

## File: modules/platform/subdomains/support/README.md
````markdown
# Support

Customer support management.

## Ownership

- **Bounded Context**: platform
- **Status**: Stub — awaiting use case definition

## Development Order

When implementing, follow inside-out:
1. Domain → 2. Application → 3. Ports (if needed) → 4. Infrastructure → 5. Interfaces
````

## File: modules/platform/subdomains/team/api/index.ts
````typescript
/**
 * Module: platform/subdomains/team
 * Layer: api (public boundary)
 * Purpose: Exports types, use cases, and a factory function for the team
 *          subdomain. Consumers must use the TeamRepository port interface
 *          and the createTeamRepository factory — never the concrete adapter.
 */

import type { TeamRepository } from "../domain/repositories/TeamRepository";
import { FirebaseTeamRepository } from "../infrastructure/firebase/FirebaseTeamRepository";

export type { Team, CreateTeamInput } from "../domain/entities/Team";
export type { TeamRepository } from "../domain/repositories/TeamRepository";
export {
  CreateTeamUseCase,
  DeleteTeamUseCase,
  UpdateTeamMembersUseCase,
} from "../application/use-cases/team.use-cases";

/** Factory — returns a TeamRepository backed by Firebase. */
export function createTeamRepository(): TeamRepository {
  return new FirebaseTeamRepository();
}
````

## File: modules/platform/subdomains/team/application/use-cases/team.use-cases.ts
````typescript
/**
 * Module: platform/subdomains/team
 * Layer: application/use-cases
 * Purpose: Team management use cases — create, delete, and member updates.
 */

import { commandSuccess, commandFailureFrom, type CommandResult } from "@shared-types";
import type { TeamRepository } from "../../domain/repositories/TeamRepository";
import type { CreateTeamInput } from "../../domain/entities/Team";

export class CreateTeamUseCase {
  constructor(private readonly teamRepo: TeamRepository) {}

  async execute(input: CreateTeamInput): Promise<CommandResult> {
    try {
      const teamId = await this.teamRepo.createTeam(input);
      return commandSuccess(teamId, Date.now());
    } catch (err) {
      return commandFailureFrom("CREATE_TEAM_FAILED", err instanceof Error ? err.message : "Failed to create team");
    }
  }
}

export class DeleteTeamUseCase {
  constructor(private readonly teamRepo: TeamRepository) {}

  async execute(organizationId: string, teamId: string): Promise<CommandResult> {
    try {
      await this.teamRepo.deleteTeam(organizationId, teamId);
      return commandSuccess(teamId, Date.now());
    } catch (err) {
      return commandFailureFrom("DELETE_TEAM_FAILED", err instanceof Error ? err.message : "Failed to delete team");
    }
  }
}

export class UpdateTeamMembersUseCase {
  constructor(private readonly teamRepo: TeamRepository) {}

  async execute(
    organizationId: string,
    teamId: string,
    memberId: string,
    action: "add" | "remove",
  ): Promise<CommandResult> {
    try {
      if (action === "add") {
        await this.teamRepo.addMemberToTeam(organizationId, teamId, memberId);
      } else {
        await this.teamRepo.removeMemberFromTeam(organizationId, teamId, memberId);
      }
      return commandSuccess(teamId, Date.now());
    } catch (err) {
      return commandFailureFrom("UPDATE_TEAM_MEMBERS_FAILED", err instanceof Error ? err.message : "Failed to update team members");
    }
  }
}
````

## File: modules/platform/subdomains/team/domain/aggregates/index.ts
````typescript
export { OrganizationTeam } from "./OrganizationTeam";
export type { OrganizationTeamSnapshot, CreateOrganizationTeamProps } from "./OrganizationTeam";
````

## File: modules/platform/subdomains/team/domain/aggregates/OrganizationTeam.ts
````typescript
/**
 * OrganizationTeam — Aggregate Root
 *
 * Represents a named grouping of members within an Organization boundary.
 * OrganizationTeam is a subdomain concept of platform/team; it is NOT an
 * independent Tenant. Teams may be internal (org-only members) or external
 * (partner/guest actors included).
 *
 * Invariants:
 *   - A team must belong to exactly one Organization (organizationId is immutable)
 *   - A member may appear in a team's memberIds at most once
 *   - teamType cannot change after creation (replace-and-recreate pattern)
 *   - addMember and removeMember are idempotent: duplicate/absent memberId is a no-op (no event)
 */

import { randomUUID } from "crypto";
import type { TeamId } from "../value-objects/TeamId";
import type { TeamType } from "../value-objects/TeamType";
import type { OrganizationTeamDomainEvent } from "../events/OrganizationTeamDomainEvent";

export interface OrganizationTeamSnapshot {
  readonly id: string;
  readonly organizationId: string;
  readonly name: string;
  readonly description: string;
  readonly teamType: TeamType;
  readonly memberIds: readonly string[];
}

export interface CreateOrganizationTeamProps {
  readonly organizationId: string;
  readonly name: string;
  readonly description?: string;
  readonly teamType: TeamType;
}

export class OrganizationTeam {
  private _domainEvents: OrganizationTeamDomainEvent[] = [];

  private constructor(private _props: OrganizationTeamSnapshot) {}

  // ── Factory — new team ────────────────────────────────────────────────────

  static create(id: TeamId, props: CreateOrganizationTeamProps): OrganizationTeam {
    const team = new OrganizationTeam({
      id,
      organizationId: props.organizationId,
      name: props.name,
      description: props.description ?? "",
      teamType: props.teamType,
      memberIds: [],
    });
    team._domainEvents.push({
      type: "team.created",
      eventId: randomUUID(),
      occurredAt: new Date().toISOString(),
      payload: {
        teamId: id,
        organizationId: props.organizationId,
        name: props.name,
        teamType: props.teamType,
      },
    });
    return team;
  }

  // ── Factory — reconstitute from persistence ───────────────────────────────

  static reconstitute(snapshot: OrganizationTeamSnapshot): OrganizationTeam {
    return new OrganizationTeam(snapshot);
  }

  // ── Commands ──────────────────────────────────────────────────────────────

  /**
   * Add a member to the team.
   * Idempotent: if memberId is already in the team the call is a no-op and
   * no domain event is emitted, so callers may safely call this multiple times.
   */
  addMember(memberId: string): void {
    if (this._props.memberIds.includes(memberId)) return; // idempotent, no event emitted
    this._props = {
      ...this._props,
      memberIds: [...this._props.memberIds, memberId],
    };
    this._domainEvents.push({
      type: "team.member-added",
      eventId: randomUUID(),
      occurredAt: new Date().toISOString(),
      payload: {
        teamId: this._props.id,
        organizationId: this._props.organizationId,
        memberId,
      },
    });
  }

  /**
   * Remove a member from the team.
   * Idempotent: if memberId is not in the team the call is a no-op and
   * no domain event is emitted, supporting at-least-once removal semantics.
   */
  removeMember(memberId: string): void {
    if (!this._props.memberIds.includes(memberId)) return; // idempotent, no event emitted
    this._props = {
      ...this._props,
      memberIds: this._props.memberIds.filter((id) => id !== memberId),
    };
    this._domainEvents.push({
      type: "team.member-removed",
      eventId: randomUUID(),
      occurredAt: new Date().toISOString(),
      payload: {
        teamId: this._props.id,
        organizationId: this._props.organizationId,
        memberId,
      },
    });
  }

  delete(): void {
    this._domainEvents.push({
      type: "team.deleted",
      eventId: randomUUID(),
      occurredAt: new Date().toISOString(),
      payload: {
        teamId: this._props.id,
        organizationId: this._props.organizationId,
      },
    });
  }

  // ── Read ──────────────────────────────────────────────────────────────────

  get id(): TeamId {
    return this._props.id as TeamId;
  }

  getSnapshot(): Readonly<OrganizationTeamSnapshot> {
    return Object.freeze({ ...this._props, memberIds: [...this._props.memberIds] });
  }

  pullDomainEvents(): OrganizationTeamDomainEvent[] {
    const events = [...this._domainEvents];
    this._domainEvents = [];
    return events;
  }
}
````

## File: modules/platform/subdomains/team/domain/entities/Team.ts
````typescript
/**
 * Module: platform/subdomains/team
 * Layer: domain/entities
 * Purpose: Team entity and related input types owned by the team subdomain.
 */

export interface Team {
  id: string;
  name: string;
  description: string;
  type: "internal" | "external";
  memberIds: string[];
}

export interface CreateTeamInput {
  organizationId: string;
  name: string;
  description: string;
  type: "internal" | "external";
}
````

## File: modules/platform/subdomains/team/domain/events/index.ts
````typescript
export type {
  OrganizationTeamDomainEvent,
  OrganizationTeamCreatedEvent,
  OrganizationTeamDeletedEvent,
  OrganizationTeamMemberAddedEvent,
  OrganizationTeamMemberRemovedEvent,
} from "./OrganizationTeamDomainEvent";
````

## File: modules/platform/subdomains/team/domain/events/OrganizationTeamDomainEvent.ts
````typescript
/**
 * OrganizationTeamDomainEvent — domain events produced by the OrganizationTeam aggregate.
 *
 * Naming: past-tense, format `<module>.<action>`.
 * occurredAt: ISO 8601 string (not Date) per platform event convention.
 */
import { z } from "zod";

// ── OrganizationTeamCreated ──────────────────────────────────────────────────

export const OrganizationTeamCreatedEventSchema = z.object({
  type: z.literal("team.created"),
  eventId: z.string().uuid(),
  occurredAt: z.string().datetime(),
  payload: z.object({
    teamId: z.string().uuid(),
    organizationId: z.string(),
    name: z.string(),
    teamType: z.enum(["internal", "external"]),
  }),
});
export type OrganizationTeamCreatedEvent = z.infer<typeof OrganizationTeamCreatedEventSchema>;

// ── OrganizationTeamDeleted ──────────────────────────────────────────────────

export const OrganizationTeamDeletedEventSchema = z.object({
  type: z.literal("team.deleted"),
  eventId: z.string().uuid(),
  occurredAt: z.string().datetime(),
  payload: z.object({
    teamId: z.string().uuid(),
    organizationId: z.string(),
  }),
});
export type OrganizationTeamDeletedEvent = z.infer<typeof OrganizationTeamDeletedEventSchema>;

// ── OrganizationTeamMemberAdded ──────────────────────────────────────────────

export const OrganizationTeamMemberAddedEventSchema = z.object({
  type: z.literal("team.member-added"),
  eventId: z.string().uuid(),
  occurredAt: z.string().datetime(),
  payload: z.object({
    teamId: z.string().uuid(),
    organizationId: z.string(),
    memberId: z.string(),
  }),
});
export type OrganizationTeamMemberAddedEvent = z.infer<typeof OrganizationTeamMemberAddedEventSchema>;

// ── OrganizationTeamMemberRemoved ────────────────────────────────────────────

export const OrganizationTeamMemberRemovedEventSchema = z.object({
  type: z.literal("team.member-removed"),
  eventId: z.string().uuid(),
  occurredAt: z.string().datetime(),
  payload: z.object({
    teamId: z.string().uuid(),
    organizationId: z.string(),
    memberId: z.string(),
  }),
});
export type OrganizationTeamMemberRemovedEvent = z.infer<
  typeof OrganizationTeamMemberRemovedEventSchema
>;

// ── Union ────────────────────────────────────────────────────────────────────

export type OrganizationTeamDomainEvent =
  | OrganizationTeamCreatedEvent
  | OrganizationTeamDeletedEvent
  | OrganizationTeamMemberAddedEvent
  | OrganizationTeamMemberRemovedEvent;
````

## File: modules/platform/subdomains/team/domain/index.ts
````typescript
/**
 * team subdomain — domain layer public exports.
 */

export type { Team, CreateTeamInput } from "./entities/Team";
export type { TeamRepository } from "./repositories/TeamRepository";
export type { ITeamPort } from "./ports";
export * from "./aggregates";
export * from "./events";
export * from "./value-objects";
````

## File: modules/platform/subdomains/team/domain/ports/index.ts
````typescript
/**
 * team domain/ports — driven port interfaces for the team subdomain.
 *
 * These re-export the repository contracts from domain/repositories/, making
 * the Ports layer explicitly visible in the directory structure.
 * New code should import port interfaces from this directory.
 */
export type { TeamRepository as ITeamPort } from "../repositories/TeamRepository";
````

## File: modules/platform/subdomains/team/domain/repositories/TeamRepository.ts
````typescript
/**
 * Module: platform/subdomains/team
 * Layer: domain/repositories
 * Purpose: TeamRepository port — team-scoped operations only.
 *          Implemented in the firebase adapter.
 */

import type { Team, CreateTeamInput } from "../entities/Team";

export interface TeamRepository {
  createTeam(input: CreateTeamInput): Promise<string>;
  deleteTeam(organizationId: string, teamId: string): Promise<void>;
  addMemberToTeam(organizationId: string, teamId: string, memberId: string): Promise<void>;
  removeMemberFromTeam(organizationId: string, teamId: string, memberId: string): Promise<void>;
  getTeams(organizationId: string): Promise<Team[]>;
}
````

## File: modules/platform/subdomains/team/domain/value-objects/index.ts
````typescript
export type { TeamId } from "./TeamId";
export { TeamIdSchema, createTeamId } from "./TeamId";
export type { TeamType } from "./TeamType";
export { TeamTypeSchema } from "./TeamType";
````

## File: modules/platform/subdomains/team/domain/value-objects/TeamId.ts
````typescript
/**
 * TeamId — branded value object for OrganizationTeam identity.
 */
import { z } from "zod";

export const TeamIdSchema = z.string().uuid().brand("TeamId");
export type TeamId = z.infer<typeof TeamIdSchema>;

export function createTeamId(raw: string): TeamId {
  return TeamIdSchema.parse(raw);
}
````

## File: modules/platform/subdomains/team/domain/value-objects/TeamType.ts
````typescript
/**
 * TeamType — value object representing the membership scope of an OrganizationTeam.
 *
 * - internal: members belong to the same Organization
 * - external: members include partner/guest actors outside the Organization
 */
import { z } from "zod";

export const TeamTypeSchema = z.enum(["internal", "external"]);
export type TeamType = z.infer<typeof TeamTypeSchema>;
````

## File: modules/platform/subdomains/team/infrastructure/firebase/FirebaseTeamRepository.ts
````typescript
/**
 * Module: platform/subdomains/team
 * Layer: infrastructure/firebase
 * Purpose: Firebase implementation of TeamRepository.
 *          Directly accesses the organizations/{orgId}/teams sub-collection.
 */

import {
  getFirestore,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  getDocs,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
} from "firebase/firestore";
import { firebaseClientApp } from "@integration-firebase/client";
import type { TeamRepository } from "../../domain/repositories/TeamRepository";
import type { Team, CreateTeamInput } from "../../domain/entities/Team";

function toTeam(id: string, data: Record<string, unknown>): Team {
  return {
    id,
    name: typeof data.name === "string" ? data.name : "",
    description: typeof data.description === "string" ? data.description : "",
    type: data.type === "external" ? "external" : "internal",
    memberIds: Array.isArray(data.memberIds) ? (data.memberIds as string[]) : [],
  };
}

export class FirebaseTeamRepository implements TeamRepository {
  private get db() {
    return getFirestore(firebaseClientApp);
  }

  async createTeam(input: CreateTeamInput): Promise<string> {
    const teamRef = doc(collection(this.db, "organizations", input.organizationId, "teams"));
    await setDoc(teamRef, {
      name: input.name,
      description: input.description,
      type: input.type,
      memberIds: [],
      createdAt: serverTimestamp(),
    });
    return teamRef.id;
  }

  async deleteTeam(organizationId: string, teamId: string): Promise<void> {
    await deleteDoc(doc(this.db, "organizations", organizationId, "teams", teamId));
  }

  async addMemberToTeam(organizationId: string, teamId: string, memberId: string): Promise<void> {
    await updateDoc(doc(this.db, "organizations", organizationId, "teams", teamId), {
      memberIds: arrayUnion(memberId),
    });
  }

  async removeMemberFromTeam(organizationId: string, teamId: string, memberId: string): Promise<void> {
    await updateDoc(doc(this.db, "organizations", organizationId, "teams", teamId), {
      memberIds: arrayRemove(memberId),
    });
  }

  async getTeams(organizationId: string): Promise<Team[]> {
    const snaps = await getDocs(collection(this.db, "organizations", organizationId, "teams"));
    return snaps.docs.map((d) => toTeam(d.id, d.data() as Record<string, unknown>));
  }
}
````

## File: modules/platform/subdomains/team/interfaces/_actions/team.actions.ts
````typescript
"use server";

import { commandFailureFrom, type CommandResult } from "@shared-types";
import {
  createTeamRepository,
  CreateTeamUseCase,
  DeleteTeamUseCase,
  UpdateTeamMembersUseCase,
} from "../../api";
import type { CreateTeamInput } from "../../api";

function getRepo() {
  return createTeamRepository();
}

export async function createTeamAction(input: CreateTeamInput): Promise<CommandResult> {
  try {
    return await new CreateTeamUseCase(getRepo()).execute(input);
  } catch (err) {
    return commandFailureFrom(
      "CREATE_TEAM_FAILED",
      err instanceof Error ? err.message : "Unexpected error",
    );
  }
}

export async function deleteTeamAction(
  organizationId: string,
  teamId: string,
): Promise<CommandResult> {
  try {
    return await new DeleteTeamUseCase(getRepo()).execute(organizationId, teamId);
  } catch (err) {
    return commandFailureFrom(
      "DELETE_TEAM_FAILED",
      err instanceof Error ? err.message : "Unexpected error",
    );
  }
}

export async function updateTeamMembersAction(
  organizationId: string,
  teamId: string,
  memberId: string,
  action: "add" | "remove",
): Promise<CommandResult> {
  try {
    return await new UpdateTeamMembersUseCase(getRepo()).execute(
      organizationId,
      teamId,
      memberId,
      action,
    );
  } catch (err) {
    return commandFailureFrom(
      "UPDATE_TEAM_MEMBERS_FAILED",
      err instanceof Error ? err.message : "Unexpected error",
    );
  }
}
````

## File: modules/platform/subdomains/team/interfaces/index.ts
````typescript
export {
  createTeamAction,
  deleteTeamAction,
  updateTeamMembersAction,
} from "./_actions/team.actions";
````

## File: modules/platform/subdomains/team/README.md
````markdown
# Team

Team management within organizations.

## Ownership

- **Bounded Context**: platform
- **Status**: Stub — awaiting use case definition

## Development Order

When implementing, follow inside-out:
1. Domain → 2. Application → 3. Ports (if needed) → 4. Infrastructure → 5. Interfaces
````

## File: modules/platform/subdomains/tenant/api/index.ts
````typescript
/**
 * Public API boundary for this subdomain.
 * Cross-module consumers must import through this entry point.
 */
export {};
````

## File: modules/platform/subdomains/tenant/application/index.ts
````typescript
// Purpose: Application layer placeholder for platform subdomain 'tenant'.
````

## File: modules/platform/subdomains/tenant/domain/index.ts
````typescript
// Purpose: Domain layer placeholder for platform subdomain 'tenant'.
````

## File: modules/platform/subdomains/tenant/infrastructure/index.ts
````typescript
// Purpose: Infrastructure layer placeholder for platform subdomain 'tenant'.
````

## File: modules/platform/subdomains/tenant/README.md
````markdown
# Tenant

建立多租戶隔離與 tenant-scoped 規則的正典邊界。

## Ownership

- **Bounded Context**: platform
- **Subdomain Type**: Recommended Gap
- **Status**: Stub — awaiting use case definition

## Development Order

When implementing, follow inside-out:
1. Domain → 2. Application → 3. Ports (if needed) → 4. Infrastructure → 5. Interfaces
````

## File: modules/platform/subdomains/workflow/api/index.ts
````typescript
/**
 * Public API boundary for this subdomain.
 * Cross-module consumers must import through this entry point.
 */
export {};
````

## File: modules/platform/subdomains/workflow/application/index.ts
````typescript
// Purpose: Application layer placeholder for platform subdomain 'workflow'.
````

## File: modules/platform/subdomains/workflow/domain/index.ts
````typescript
// Purpose: Domain layer placeholder for platform subdomain 'workflow'.
````

## File: modules/platform/subdomains/workflow/infrastructure/index.ts
````typescript
// Purpose: Infrastructure layer placeholder for platform subdomain 'workflow'.
````

## File: modules/platform/subdomains/workflow/README.md
````markdown
# Workflow

Platform-level workflow orchestration.

## Ownership

- **Bounded Context**: platform
- **Status**: Stub — awaiting use case definition

## Development Order

When implementing, follow inside-out:
1. Domain → 2. Application → 3. Ports (if needed) → 4. Infrastructure → 5. Interfaces
````

## File: modules/platform/api/api.instructions.md
````markdown
---
description: 'Platform API boundary rules: cross-module entry surface, facade contracts, and published language enforcement.'
applyTo: 'modules/platform/api/**/*.{ts,tsx}'
---

# Platform API Layer (Local)

Use this file as execution guardrails for `modules/platform/api/*`.
For full reference, align with `.github/instructions/architecture-core.instructions.md` and `docs/contexts/platform/context-map.md`.

## Core Rules

- `api/` is the **only** cross-module entry surface for platform; never expose `domain/`, `application/`, or `infrastructure/` internals directly.
- Expose stable **facade methods** and **contract types** only — no aggregate classes, no repository interfaces.
- All cross-module tokens must use published language: `actor reference`, `workspaceId`, `entitlement signal`, `knowledge artifact reference`.
- Never pass upstream aggregates as downstream canonical models; translate at the boundary.
- Downstream modules import from `modules/platform/api` only — enforce this with lint restricted-import rules.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill hexagonal-ddd
````

## File: modules/platform/application/application.instructions.md
````markdown
---
description: 'Platform application layer rules: use-case orchestration, command/query dispatch, event handling, and DTO contracts.'
applyTo: 'modules/platform/application/**/*.{ts,tsx}'
---

# Platform Application Layer (Local)

Use this file as execution guardrails for `modules/platform/application/*`.
For full reference, align with `.github/instructions/architecture-core.instructions.md` and `docs/contexts/platform/*`.

## Core Rules

- Use cases orchestrate flow only; complex business rules stay in `domain/`.
- Every use case operates on a **single aggregate** per transaction boundary.
- After persisting, call `pullDomainEvents()` and publish via `DomainEventPublisher` — never publish before persistence.
- Pure reads without business logic belong in **query handlers**, not use cases (`GetXxxUseCase` is a smell).
- DTOs are application-layer contracts; never expose domain entities or value objects across the layer boundary.
- Event handlers translate ingress events to commands via `mapIngressEventToCommand` before dispatching.
- `PlatformCommandDispatcher` and `PlatformQueryDispatcher` are the single dispatch entry points — do not bypass them.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill hexagonal-ddd
````

## File: modules/platform/application/handlers/PlatformQueryDispatcher.ts
````typescript
/**
 * PlatformQueryDispatcher — Application-layer Query Router
 *
 * Implements: PlatformQueryPort
 * Routes queries by name to the appropriate use case class.
 *
 * Called by: api/facade.ts via PlatformQueryPort
 */

import type { PlatformQueryPort, PlatformQuery } from "../../domain/ports/input";
import type {
	PlatformContextViewRepository,
	PolicyCatalogViewRepository,
	UsageMeterRepository,
	WorkflowPolicyRepository,
} from "../../domain/ports/output";
import { GetPlatformContextViewUseCase } from "../queries/get-platform-context-view.queries";
import { ListEnabledCapabilitiesUseCase } from "../queries/list-enabled-capabilities.queries";
import { GetPolicyCatalogViewUseCase } from "../queries/get-policy-catalog-view.queries";
import { GetSubscriptionEntitlementsUseCase } from "../queries/get-subscription-entitlements.queries";
import { GetWorkflowPolicyViewUseCase } from "../queries/get-workflow-policy-view.queries";

export interface PlatformQueryDispatcherDeps {
	contextViewRepo: PlatformContextViewRepository;
	catalogViewRepo: PolicyCatalogViewRepository;
	usageMeterRepo: UsageMeterRepository;
	workflowPolicyRepo: WorkflowPolicyRepository;
}

export class PlatformQueryDispatcher implements PlatformQueryPort {
	constructor(private readonly deps: PlatformQueryDispatcherDeps) {}

	async executeQuery<TResult, TQuery extends PlatformQuery>(
		queryMsg: TQuery,
	): Promise<TResult> {
		const { deps } = this;
		switch (queryMsg.name) {
			case "getPlatformContextView":
				return new GetPlatformContextViewUseCase(deps.contextViewRepo).execute(
					queryMsg.payload as Parameters<GetPlatformContextViewUseCase["execute"]>[0],
				) as Promise<TResult>;

			case "listEnabledCapabilities":
				return new ListEnabledCapabilitiesUseCase(deps.contextViewRepo).execute(
					queryMsg.payload as Parameters<ListEnabledCapabilitiesUseCase["execute"]>[0],
				) as Promise<TResult>;

			case "getPolicyCatalogView":
				return new GetPolicyCatalogViewUseCase(deps.catalogViewRepo).execute(
					queryMsg.payload as Parameters<GetPolicyCatalogViewUseCase["execute"]>[0],
				) as Promise<TResult>;

			case "getSubscriptionEntitlements":
				return new GetSubscriptionEntitlementsUseCase(deps.usageMeterRepo).execute(
					queryMsg.payload as Parameters<GetSubscriptionEntitlementsUseCase["execute"]>[0],
				) as Promise<TResult>;

			case "getWorkflowPolicyView":
				return new GetWorkflowPolicyViewUseCase(deps.workflowPolicyRepo).execute(
					queryMsg.payload as Parameters<GetWorkflowPolicyViewUseCase["execute"]>[0],
				) as Promise<TResult>;

			default:
				throw new Error(`Unknown platform query: '${String((queryMsg as PlatformQuery).name)}'`);
		}
	}
}
````

## File: modules/platform/application/queries/get-platform-context-view.queries.ts
````typescript
/**
 * get-platform-context-view — use case.
 *
 * Query:   GetPlatformContextView
 * Purpose: Returns a read-only summary of a platform scope.
 */

import type { GetPlatformContextViewInput } from "../dtos";
import type { PlatformContextViewRepository, PlatformContextView } from "../../domain/ports/output";

export class GetPlatformContextViewUseCase {
	constructor(private readonly viewRepo: PlatformContextViewRepository) {}

	async execute(input: GetPlatformContextViewInput): Promise<PlatformContextView | null> {
		return this.viewRepo.getView(input.contextId);
	}
}
````

## File: modules/platform/application/queries/get-policy-catalog-view.queries.ts
````typescript
/**
 * get-policy-catalog-view — use case.
 *
 * Query:   GetPolicyCatalogView
 * Purpose: Returns the active policy version and rule summary.
 */

import type { GetPolicyCatalogViewInput } from "../dtos";
import type { PolicyCatalogViewRepository, PolicyCatalogView } from "../../domain/ports/output";

export class GetPolicyCatalogViewUseCase {
	constructor(private readonly viewRepo: PolicyCatalogViewRepository) {}

	async execute(input: GetPolicyCatalogViewInput): Promise<PolicyCatalogView | null> {
		return this.viewRepo.getView(input.contextId);
	}
}
````

## File: modules/platform/application/queries/get-subscription-entitlements.queries.ts
````typescript
/**
 * get-subscription-entitlements — use case.
 *
 * Query:   GetSubscriptionEntitlements
 * Purpose: Returns plan entitlements and usage limits.
 */

import type { GetSubscriptionEntitlementsInput } from "../dtos";
import type { UsageMeterRepository, SubscriptionEntitlementsView } from "../../domain/ports/output";

export class GetSubscriptionEntitlementsUseCase {
	constructor(private readonly usageRepo: UsageMeterRepository) {}

	async execute(input: GetSubscriptionEntitlementsInput): Promise<SubscriptionEntitlementsView | null> {
		return this.usageRepo.getEntitlementsView(input.contextId);
	}
}
````

## File: modules/platform/application/queries/get-workflow-policy-view.queries.ts
````typescript
/**
 * get-workflow-policy-view — use case.
 *
 * Query:   GetWorkflowPolicyView
 * Purpose: Returns the workflow policy corresponding to a trigger key.
 */

import type { GetWorkflowPolicyViewInput } from "../dtos";
import type { WorkflowPolicyRepository, WorkflowPolicyView } from "../../domain/ports/output";

export class GetWorkflowPolicyViewUseCase {
	constructor(private readonly policyRepo: WorkflowPolicyRepository) {}

	async execute(input: GetWorkflowPolicyViewInput): Promise<WorkflowPolicyView | null> {
		return this.policyRepo.getView(input.contextId, input.triggerKey);
	}
}
````

## File: modules/platform/application/queries/index.ts
````typescript
export { GetPlatformContextViewUseCase } from "./get-platform-context-view.queries";
export { ListEnabledCapabilitiesUseCase } from "./list-enabled-capabilities.queries";
export { GetPolicyCatalogViewUseCase } from "./get-policy-catalog-view.queries";
export { GetSubscriptionEntitlementsUseCase } from "./get-subscription-entitlements.queries";
export { GetWorkflowPolicyViewUseCase } from "./get-workflow-policy-view.queries";
````

## File: modules/platform/application/queries/list-enabled-capabilities.queries.ts
````typescript
/**
 * list-enabled-capabilities — use case.
 *
 * Query:   ListEnabledCapabilities
 * Purpose: Lists all currently active capabilities for a platform scope.
 */

import type { ListEnabledCapabilitiesInput } from "../dtos";
import type { PlatformContextViewRepository } from "../../domain/ports/output";

export class ListEnabledCapabilitiesUseCase {
	constructor(private readonly viewRepo: PlatformContextViewRepository) {}

	async execute(input: ListEnabledCapabilitiesInput): Promise<readonly string[]> {
		const view = await this.viewRepo.getView(input.contextId);
		return view?.capabilityKeys ?? [];
	}
}
````

## File: modules/platform/application/services/index.ts
````typescript
/**
 * platform application services barrel.
 *
 * Application Services handle flow coordination, transaction boundaries and
 * cross-aggregate orchestration.  They do not carry core business invariants.
 */

export { buildCausationId } from "./build-causation-id";
export { buildCorrelationId } from "./build-correlation-id";
export {
  quickCreateKnowledgePage,
  type QuickCreatePageInput,
  type QuickCreatePageResult,
} from "./shell-quick-create";
````

## File: modules/platform/application/use-cases/index.ts
````typescript
/**
 * platform application use-cases barrel.
 *
 * Each file follows the kebab-case convention: verb-noun.use-cases.ts
 *
 * Commands:
 *   register-platform-context
 *   publish-policy-catalog
 *   apply-configuration-profile
 *   register-integration-contract
 *   activate-subscription-agreement
 *   fire-workflow-trigger
 *   request-notification-dispatch
 *   record-audit-signal
 *   emit-observability-signal
 *
 * Queries:
 *   get-platform-context-view
 *   list-enabled-capabilities
 *   get-policy-catalog-view
 *   get-subscription-entitlements
 *   get-workflow-policy-view
 */

export { RegisterPlatformContextUseCase } from "./register-platform-context.use-cases";
export { PublishPolicyCatalogUseCase } from "./publish-policy-catalog.use-cases";
export { ApplyConfigurationProfileUseCase } from "./apply-configuration-profile.use-cases";
export { RegisterIntegrationContractUseCase } from "./register-integration-contract.use-cases";
export { ActivateSubscriptionAgreementUseCase } from "./activate-subscription-agreement.use-cases";
export { FireWorkflowTriggerUseCase } from "./fire-workflow-trigger.use-cases";
export { RequestNotificationDispatchUseCase } from "./request-notification-dispatch.use-cases";
export { RecordAuditSignalUseCase } from "./record-audit-signal.use-cases";
export { EmitObservabilitySignalUseCase } from "./emit-observability-signal.use-cases";
export { GetPlatformContextViewUseCase } from "../queries/get-platform-context-view.queries";
export { ListEnabledCapabilitiesUseCase } from "../queries/list-enabled-capabilities.queries";
export { GetPolicyCatalogViewUseCase } from "../queries/get-policy-catalog-view.queries";
export { GetSubscriptionEntitlementsUseCase } from "../queries/get-subscription-entitlements.queries";
export { GetWorkflowPolicyViewUseCase } from "../queries/get-workflow-policy-view.queries";
````

## File: modules/platform/docs/docs.instructions.md
````markdown
---
description: 'Platform documentation rules: strategic doc authority, ADR discipline, and ubiquitous language enforcement.'
applyTo: 'modules/platform/docs/**/*.md'
---

# Platform Docs Layer (Local)

Use this file as execution guardrails for `modules/platform/docs/*`.
For full reference, align with `.github/instructions/docs-authority-and-language.instructions.md` and `docs/contexts/platform/*`.

## Core Rules

- `modules/platform/docs/` holds **links and local summaries only** — authoritative content lives in `docs/contexts/platform/`.
- Do not duplicate strategic knowledge here; point to the canonical source instead.
- Any new architectural decision affecting platform must have a corresponding ADR in `docs/decisions/`.
- Use ubiquitous language from `docs/contexts/platform/ubiquitous-language.md`; do not introduce synonyms or aliases.
- Keep this directory in sync with `docs/contexts/platform/README.md` whenever the subdomain list changes.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill hexagonal-ddd
````

## File: modules/platform/domain/domain-modeling.instructions.md
````markdown
---
description: 'Platform domain tactical modeling rules (local mirror of root domain-modeling guidance).'
applyTo: '*.{ts,tsx}'
---

# Domain Modeling (Platform Local)

Use this local file as execution guardrails for `modules/platform/domain/*`.
For full reference, align with `.github/instructions/domain-modeling.instructions.md` and `docs/contexts/platform/*`.

## Core Rules

- Keep aggregate invariants inside aggregate methods.
- Use immutable value objects with Zod schemas and inferred types.
- Keep domain framework-free (no Firebase/React/transport imports).
- Emit domain events on state transitions and publish via application orchestration.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill hexagonal-ddd
````

## File: modules/platform/domain/value-objects/Entitlement.ts
````typescript
/**
 * Entitlement — Value Object
 *
 * Describes which capability and usage quota a plan allows.
 * Entitlements are derived from planCode; they must not deviate from plan definition.
 *
 * Used by: SubscriptionAgreement aggregate, entitlement subdomain
 */

export const ENTITLEMENT_TYPES = ["capability", "quota", "feature_flag"] as const;
export type EntitlementType = (typeof ENTITLEMENT_TYPES)[number];

export interface Entitlement {
  readonly featureKey: string;
  readonly type: EntitlementType;
  readonly quota: number | null; // null = unlimited
  readonly isEnabled: boolean;
}

export function createEntitlement(input: {
  featureKey: string;
  type: EntitlementType;
  quota?: number | null;
  isEnabled?: boolean;
}): Entitlement {
  if (!input.featureKey || input.featureKey.trim().length === 0) {
    throw new Error("Entitlement featureKey must not be empty");
  }
  return {
    featureKey: input.featureKey.trim(),
    type: input.type,
    quota: input.quota ?? null,
    isEnabled: input.isEnabled ?? true,
  };
}

export function isUnlimited(entitlement: Entitlement): boolean {
  return entitlement.quota === null;
}
````

## File: modules/platform/domain/value-objects/PermissionDecision.ts
````typescript
/**
 * PermissionDecision — Value Object / Decision Object
 *
 * The outcome of a permission evaluation.
 * Possible outcomes: allow | deny | conditional_allow | escalate
 *
 * A PermissionDecision is always explicit — never a loose boolean.
 *
 * Used by: PermissionResolutionService, access-control subdomain
 */

export type PermissionOutcome = "allow" | "deny" | "conditional_allow" | "escalate";

export interface PermissionDecision {
  readonly outcome: PermissionOutcome;
  readonly reason: string;
  readonly conditions?: readonly string[];
  readonly evaluatedAt: string;
}

export function allowDecision(reason: string): PermissionDecision {
  return { outcome: "allow", reason, evaluatedAt: new Date().toISOString() };
}

export function denyDecision(reason: string): PermissionDecision {
  return { outcome: "deny", reason, evaluatedAt: new Date().toISOString() };
}

export function conditionalAllowDecision(
  reason: string,
  conditions: string[],
): PermissionDecision {
  return {
    outcome: "conditional_allow",
    reason,
    conditions,
    evaluatedAt: new Date().toISOString(),
  };
}

export function escalateDecision(reason: string): PermissionDecision {
  return { outcome: "escalate", reason, evaluatedAt: new Date().toISOString() };
}

export function isAllowed(decision: PermissionDecision): boolean {
  return decision.outcome === "allow" || decision.outcome === "conditional_allow";
}
````

## File: modules/platform/domain/value-objects/PlanConstraint.ts
````typescript
/**
 * PlanConstraint — Value Object
 *
 * Expresses the limitation a subscription plan places on a capability, workflow, or delivery.
 * Contains: constraint type, threshold, and enforcement mode (soft | hard).
 *
 * Used by: CapabilityEntitlementPolicy, subscription subdomain
 */

export const CONSTRAINT_TYPES = [
  "usage_limit",
  "feature_gate",
  "rate_limit",
  "storage_cap",
] as const;
export type ConstraintType = (typeof CONSTRAINT_TYPES)[number];

export type EnforcementMode = "hard" | "soft";

export interface PlanConstraint {
  readonly constraintType: ConstraintType;
  readonly featureKey: string;
  readonly threshold: number;
  readonly enforcementMode: EnforcementMode;
}

export function createPlanConstraint(input: {
  constraintType: ConstraintType;
  featureKey: string;
  threshold: number;
  enforcementMode: EnforcementMode;
}): PlanConstraint {
  if (input.threshold < 0) {
    throw new Error("PlanConstraint threshold must not be negative");
  }
  return { ...input };
}

export function isHardConstraint(constraint: PlanConstraint): boolean {
  return constraint.enforcementMode === "hard";
}

export function isExceeded(constraint: PlanConstraint, usage: number): boolean {
  return usage >= constraint.threshold;
}
````

## File: modules/platform/index.ts
````typescript
/**
 * platform — Public module entry point.
 * All cross-module consumers must import through this file or modules/platform/api/.
 */
export * from "./api";
````

## File: modules/platform/infrastructure/infrastructure.instructions.md
````markdown
---
description: 'Platform infrastructure layer rules: Firebase adapters, QStash messaging, event routing, persistence mapping, and cache strategy.'
applyTo: 'modules/platform/infrastructure/**/*.{ts,tsx}'
---

# Platform Infrastructure Layer (Local)

Use this file as execution guardrails for `modules/platform/infrastructure/*`.
For full reference, align with `.github/instructions/firestore-schema.instructions.md` and `docs/contexts/platform/*`.

## Core Rules

- Implement only **port interfaces** declared in `domain/ports/output/`; never invent new contracts here.
- Keep Firestore collection ownership explicit per bounded context — do not read or write another module's collections.
- Persistence mappers (`mapXxxToPersistenceRecord`) are the only place to translate between domain objects and storage records.
- Cached repositories (`cache/`) must delegate to the underlying repository and never bypass domain validation.
- QStash adapters (`messaging/`) must implement `DomainEventPublisher`, `JobQueuePort`, or `WorkflowDispatcherPort` — no ad-hoc fire-and-forget.
- Event routing (`events/routing/`) must use `resolveEventHandler` as the single dispatch table; do not hardcode handler selection in consumers.
- Version breaking schema transitions with migration steps before deploying; update `firestore.indexes.json` with query-shape changes.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill hexagonal-ddd
#use skill xuanwu-development-contracts
````

## File: modules/platform/interfaces/interfaces.instructions.md
````markdown
---
description: 'Platform interfaces layer rules: input/output translation, Server Actions, UI components, CLI wiring, and HTTP handler contracts.'
applyTo: 'modules/platform/interfaces/**/*.{ts,tsx}'
---

# Platform Interfaces Layer (Local)

Use this file as execution guardrails for `modules/platform/interfaces/*`.
For full reference, align with `.github/instructions/nextjs-server-actions.instructions.md`, `.github/instructions/shadcn-ui.instructions.md`, and `docs/contexts/platform/*`.

## Core Rules

- This layer owns **input/output translation only** — no business rules, no repository calls.
- Server Actions (`_actions/`) must be thin: validate input, call the use case or dispatcher, return a stable result shape.
- Never call repositories directly from components, actions, or route handlers.
- UI components consume data via query hooks or Server Components; they do not hold domain logic.
- HTTP handlers (`api/`) map requests to platform commands via `mapHttpRequestToPlatformCommand` and map results via `mapPlatformResultToHttpResponse` — do not inline mapping logic.
- CLI handlers (`cli/`) follow the same pattern: parse → dispatch → render.
- Use shadcn/ui primitives before creating new components; keep semantic markup and accessibility intact.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill hexagonal-ddd
#use skill next-devtools-mcp
#use skill vercel-react-best-practices
````

## File: modules/platform/interfaces/web/providers/ShellProviders.tsx
````typescript
"use client";

/**
 * shell-providers.tsx — platform/interfaces/web layer
 * Composed root providers tree.
 * Import <Providers> into app/layout.tsx to wrap the entire application.
 *
 * Provider nesting order (outermost → innermost):
 *   AuthProvider   — Firebase auth state
 *   AppProvider    — Active account + org accounts (depends on AuthProvider)
 */

import type { ReactNode } from "react";
import { Toaster } from "@ui-shadcn/ui/sonner";
import { AuthProvider } from "../../../subdomains/identity/api";
import { AppProvider } from "./ShellAppProvider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <AppProvider>{children}</AppProvider>
      <Toaster richColors closeButton />
    </AuthProvider>
  );
}
````

## File: modules/platform/interfaces/web/shell/header/components/ShellHeaderControls.tsx
````typescript
"use client";

/**
 * ShellHeaderControls – platform interfaces/web component.
 * Composes shell header utility controls: language switch, theme toggle, notification bell.
 */

import { useAuth } from "../../../../../subdomains/identity/api";
import { ShellNotificationButton } from "./ShellNotificationButton";
import { ShellThemeToggle } from "./ShellThemeToggle";
import { ShellTranslationSwitcher } from "./ShellTranslationSwitcher";

export function ShellHeaderControls() {
  const { state: authState } = useAuth();

  const recipientId = authState.user?.id ?? "";

  return (
    <div className="flex items-center gap-2">
      <ShellTranslationSwitcher />
      <ShellThemeToggle />
      <ShellNotificationButton recipientId={recipientId} />
    </div>
  );
}
````

## File: modules/platform/interfaces/web/shell/header/components/ShellThemeToggle.tsx
````typescript
"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@ui-shadcn/ui/button";

const THEME_KEY = "xuanwu_theme";

export function ShellThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window === "undefined") return "light";
    const storedTheme = window.localStorage.getItem(THEME_KEY);
    if (storedTheme === "light" || storedTheme === "dark") return storedTheme;
    return document.documentElement.classList.contains("dark") ? "dark" : "light";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((current) => (current === "light" ? "dark" : "light"));
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="icon-sm"
      onClick={toggleTheme}
      aria-label="切換深淺主題"
      className="text-muted-foreground"
    >
      {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
    </Button>
  );
}
````

## File: modules/platform/interfaces/web/shell/header/components/ShellTranslationSwitcher.tsx
````typescript
"use client";

/**
 * Module: shell-translation-switcher.tsx
 * Purpose: provide a reusable locale switch control for shell-level UI.
 * Responsibilities: persist locale preference and sync html lang attribute.
 * Constraints: keep state client-side and avoid coupling to business modules.
 */

import { Languages } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@ui-shadcn/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@ui-shadcn/ui/dropdown-menu";

const LOCALE_STORAGE_KEY = "xuanwu_locale";

const localeOptions = [
  { value: "en", label: "English" },
  { value: "zh-TW", label: "繁體中文" },
] as const;

type LocaleValue = (typeof localeOptions)[number]["value"];

function isLocaleValue(value: string | null): value is LocaleValue {
  return value === "en" || value === "zh-TW";
}

export function ShellTranslationSwitcher() {
  const [locale, setLocale] = useState<LocaleValue>(() => {
    if (typeof window === "undefined") {
      return "en";
    }

    const storedValue = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    return isLocaleValue(storedValue) ? storedValue : "en";
  });

  useEffect(() => {
    document.documentElement.lang = locale;
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  }, [locale]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          aria-label="切換語言"
          className="text-muted-foreground"
        >
          <Languages className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuLabel>語言</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={locale} onValueChange={(value) => {
          if (isLocaleValue(value)) {
            setLocale(value);
          }
        }}>
          {localeOptions.map((option) => (
            <DropdownMenuRadioItem key={option.value} value={option.value}>
              {option.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
````

## File: modules/platform/interfaces/web/shell/navigation/services/shell-quick-create.ts
````typescript
import { createKnowledgePage } from "@/modules/notion/api";

export interface QuickCreatePageInput {
  readonly accountId: string;
  readonly workspaceId: string;
  readonly createdByUserId: string;
}

export interface QuickCreatePageResult {
  readonly success: boolean;
  readonly error?: { message: string };
}

/**
 * Shell-level quick create adapter.
 * Kept in interfaces layer so cross-context API calls happen at composition edge.
 */
export async function quickCreateKnowledgePage(
  input: QuickCreatePageInput,
): Promise<QuickCreatePageResult> {
  if (!input.accountId) {
    return { success: false, error: { message: "目前沒有 active account，無法建立" } };
  }
  if (!input.workspaceId) {
    return { success: false, error: { message: "請先切換到工作區，再建立頁面" } };
  }
  return createKnowledgePage({
    accountId: input.accountId,
    workspaceId: input.workspaceId,
    title: "未命名頁面",
    parentPageId: null,
    createdByUserId: input.createdByUserId,
  });
}
````

## File: modules/platform/interfaces/web/shell/sidebar/ShellSidebarHeader.tsx
````typescript
"use client";

import { PanelLeftClose, SlidersHorizontal } from "lucide-react";

interface ShellSidebarHeaderProps {
  sectionLabel: string;
  sectionIcon: React.ReactNode;
  onOpenCustomize: () => void;
  onToggleCollapsed: () => void;
}

export function ShellSidebarHeader({
  sectionLabel,
  sectionIcon,
  onOpenCustomize,
  onToggleCollapsed,
}: ShellSidebarHeaderProps) {
  return (
    <div className="flex shrink-0 items-center border-b border-border/40 px-2 py-1.5">
      <span className="flex flex-1 items-center gap-1.5 px-1 text-[11px] font-semibold tracking-tight text-foreground/80">
        {sectionIcon}
        {sectionLabel}
      </span>
      <div className="flex items-center gap-0.5">
        <button
          type="button"
          title="設定"
          aria-label="設定"
          onClick={onOpenCustomize}
          className="flex size-6 items-center justify-center rounded text-muted-foreground transition hover:bg-muted/70 hover:text-foreground"
        >
          <SlidersHorizontal className="size-3.5" />
        </button>
        <button
          type="button"
          onClick={onToggleCollapsed}
          aria-label="收起側欄"
          title="收起側欄"
          className="flex size-6 items-center justify-center rounded text-muted-foreground transition hover:bg-muted/70 hover:text-foreground"
        >
          <PanelLeftClose className="size-3.5" />
        </button>
      </div>
    </div>
  );
}
````

## File: modules/platform/platform.instructions.md
````markdown
---
description: 'Platform bounded context rules: governance upstream role, module shape, subdomain routing, and cross-context dependency direction.'
applyTo: 'modules/platform/**/*.{ts,tsx,md}'
---

# Platform Bounded Context (Local)

Use this file as execution guardrails for `modules/platform/`.
For full reference, align with `.github/instructions/architecture-core.instructions.md`, `docs/contexts/platform/README.md`, and `docs/bounded-contexts.md`.

## Core Rules

- `platform` is the **governance upstream** for all other bounded contexts (`workspace`, `notion`, `notebooklm`); never invert this dependency.
- Cross-module consumers must import from `modules/platform/api` only — never from `domain/`, `application/`, `infrastructure/`, or `interfaces/` internals.
- Route work to the correct subdomain first; do not place subdomain-specific logic in the context-wide `application/` or `domain/` layers.
- New top-level main domains are forbidden — the system has exactly four: `platform`, `workspace`, `notion`, `notebooklm`.
- Use ubiquitous language from `docs/contexts/platform/ubiquitous-language.md`: `Actor` not `User`, `Entitlement` not `Plan`, `Membership` not `User` for workspace participant.

## Route to Subdomain When

| Concern | Subdomain |
|---|---|
| Authentication, identity federation | `identity` |
| Account lifecycle | `account` |
| Account profile & preferences | `account-profile` |
| Organization, tenant structure | `organization` |
| Team membership | `team` |
| Subscription & billing plan | `subscription` |
| Capability grants | `entitlement` |
| Access policy enforcement | `access-control` |
| Notification dispatch | `notification` |
| Background / ingestion jobs | `background-job` |

## Route Elsewhere When

- Workspace lifecycle, membership, presence → `workspace`
- Knowledge content creation, taxonomy, publishing → `notion`
- Conversation, retrieval, synthesis → `notebooklm`

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill hexagonal-ddd
````

## File: modules/platform/README.md
````markdown
# Platform

治理與營運支撐主域

## Implementation Structure

```text
modules/platform/
├── api/              # Public API boundary
├── application/      # Context-wide orchestration
├── domain/           # Context-wide domain concepts
├── infrastructure/   # Context-wide driven adapters
├── interfaces/       # Context-wide driving adapters
├── docs/             # Links to strategic documentation
└── subdomains/
    ├── account/
    ├── account-profile/
    ├── access-control/
    ├── ai/
    ├── analytics/
    ├── audit-log/
    ├── background-job/
    ├── billing/
    ├── compliance/
    ├── consent/
    ├── content/
    ├── entitlement/
    ├── feature-flag/
    ├── identity/
    ├── integration/
    ├── notification/
    ├── observability/
    ├── onboarding/
    ├── organization/
    ├── platform-config/
    ├── referral/
    ├── search/
    ├── secret-management/
    ├── security-policy/
    ├── subscription/
    ├── support/
    ├── tenant/
    ├── team/
    └── workflow/
```

## Subdomains

| Subdomain | Status | Purpose |
|-----------|--------|---------|
| account | Active | 帳號管理與帳號生命週期 |
| identity | Active | 身份驗證與身份聯邦 |
| notification | Active | 通知治理與遞送 |
| organization | Active | 組織管理與租戶結構 |
| team | Active | 團隊管理與成員關係 |
| account-profile | Stub | 帳號個人檔案與偏好 |
| access-control | Stub | 存取控制與權限策略 |
| ai | Stub | 共享 AI provider 路由與能力治理 |
| analytics | Stub | 平台級分析與指標 |
| audit-log | Stub | 平台稽核日誌 |
| background-job | Stub | 背景任務排程與管理 |
| billing | Stub | 計費與支付管理 |
| compliance | Stub | 合規與法遵管理 |
| consent | Stub | 同意與資料使用授權治理 |
| content | Stub | 平台內容管理 |
| entitlement | Stub | 權益解算與功能可用性治理 |
| feature-flag | Stub | 功能旗標與漸進式發布 |
| integration | Stub | 外部系統整合 |
| observability | Stub | 觀測與監控 |
| onboarding | Stub | 使用者引導流程 |
| platform-config | Stub | 平台組態管理 |
| referral | Stub | 推薦與邀請機制 |
| search | Stub | 平台級搜尋能力 |
| secret-management | Stub | 憑證與 token 生命週期治理 |
| security-policy | Stub | 安全策略管理 |
| subscription | Stub | 訂閱與方案管理 |
| support | Stub | 客戶支援管理 |
| tenant | Stub | 多租戶隔離與 tenant-scoped 規則 |
| workflow | Stub | 平台級工作流引擎 |

## Dependency Direction

```text
interfaces/ → application/ → domain/ ← infrastructure/
```

- `api/` is the only cross-module public boundary.
- Domain must not import infrastructure, interfaces, or external frameworks.
- Cross-module collaboration goes through `api/` only.

## Strategic Documentation

- [Context README](../../docs/contexts/platform/README.md)
- [Subdomains](../../docs/contexts/platform/subdomains.md)
- [Context Map](../../docs/contexts/platform/context-map.md)
- [Ubiquitous Language](../../docs/contexts/platform/ubiquitous-language.md)
- [Bounded Context Template](../../docs/bounded-context-subdomain-template.md)
````

## File: modules/platform/subdomains/access-control/application/dtos/access-control.dto.ts
````typescript
import type { AccessPolicySnapshot } from "../../domain/aggregates/AccessPolicy";

export type AccessPolicyView = Readonly<AccessPolicySnapshot>;

export interface PermissionEvaluationView {
  readonly subjectId: string;
  readonly resourceType: string;
  readonly resourceId?: string;
  readonly action: string;
  readonly allowed: boolean;
  readonly reason: string;
}
````

## File: modules/platform/subdomains/access-control/application/dtos/index.ts
````typescript
export * from "./access-control.dto";
````

## File: modules/platform/subdomains/access-control/application/use-cases/index.ts
````typescript
export * from "./access-control.use-cases";
````

## File: modules/platform/subdomains/access-control/domain/aggregates/AccessPolicy.ts
````typescript
import type { AccessPolicyDomainEventType } from "../events/AccessPolicyDomainEvent";
import type { SubjectRef } from "../value-objects/SubjectRef";
import type { ResourceRef } from "../value-objects/ResourceRef";
import type { PolicyEffect } from "../value-objects/PolicyEffect";

export interface AccessPolicySnapshot {
  readonly id: string;
  readonly subjectRef: SubjectRef;
  readonly resourceRef: ResourceRef;
  readonly actions: readonly string[];
  readonly effect: PolicyEffect;
  readonly conditions: readonly string[];
  readonly isActive: boolean;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}

export interface CreateAccessPolicyInput {
  readonly subjectRef: SubjectRef;
  readonly resourceRef: ResourceRef;
  readonly actions: string[];
  readonly effect: PolicyEffect;
  readonly conditions?: string[];
}

export class AccessPolicy {
  private readonly _domainEvents: AccessPolicyDomainEventType[] = [];

  private constructor(private _props: AccessPolicySnapshot) {}

  static create(id: string, input: CreateAccessPolicyInput): AccessPolicy {
    if (!id || id.trim().length === 0) throw new Error("AccessPolicy id must not be empty");
    if (input.actions.length === 0) throw new Error("AccessPolicy must specify at least one action");
    const now = new Date().toISOString();
    const policy = new AccessPolicy({
      id,
      subjectRef: input.subjectRef,
      resourceRef: input.resourceRef,
      actions: input.actions,
      effect: input.effect,
      conditions: input.conditions ?? [],
      isActive: true,
      createdAtISO: now,
      updatedAtISO: now,
    });
    policy._domainEvents.push({
      type: "platform.access_policy.created",
      eventId: crypto.randomUUID(),
      occurredAt: now,
      payload: {
        policyId: id,
        subjectRef: input.subjectRef,
        resourceRef: input.resourceRef,
        actions: input.actions,
        effect: input.effect,
      },
    });
    return policy;
  }

  static reconstitute(snapshot: AccessPolicySnapshot): AccessPolicy {
    return new AccessPolicy({ ...snapshot });
  }

  update(input: { actions?: string[]; effect?: PolicyEffect; conditions?: string[] }): void {
    if (!this._props.isActive) throw new Error("Cannot update an inactive policy.");
    const now = new Date().toISOString();
    this._props = {
      ...this._props,
      actions: input.actions ?? this._props.actions,
      effect: input.effect ?? this._props.effect,
      conditions: input.conditions ?? this._props.conditions,
      updatedAtISO: now,
    };
    this._domainEvents.push({
      type: "platform.access_policy.updated",
      eventId: crypto.randomUUID(),
      occurredAt: now,
      payload: { policyId: this._props.id },
    });
  }

  deactivate(): void {
    if (!this._props.isActive) throw new Error("Policy is already inactive.");
    const now = new Date().toISOString();
    this._props = { ...this._props, isActive: false, updatedAtISO: now };
    this._domainEvents.push({
      type: "platform.access_policy.deactivated",
      eventId: crypto.randomUUID(),
      occurredAt: now,
      payload: { policyId: this._props.id },
    });
  }

  get id(): string { return this._props.id; }
  get subjectRef(): SubjectRef { return this._props.subjectRef; }
  get resourceRef(): ResourceRef { return this._props.resourceRef; }
  get actions(): readonly string[] { return this._props.actions; }
  get effect(): PolicyEffect { return this._props.effect; }
  get conditions(): readonly string[] { return this._props.conditions; }
  get isActive(): boolean { return this._props.isActive; }

  getSnapshot(): Readonly<AccessPolicySnapshot> {
    return Object.freeze({ ...this._props });
  }

  pullDomainEvents(): AccessPolicyDomainEventType[] {
    const events = [...this._domainEvents];
    this._domainEvents.length = 0;
    return events;
  }
}
````

## File: modules/platform/subdomains/access-control/domain/aggregates/index.ts
````typescript
export * from "./AccessPolicy";
````

## File: modules/platform/subdomains/access-control/domain/events/AccessPolicyDomainEvent.ts
````typescript
import type { SubjectRef } from "../value-objects/SubjectRef";
import type { ResourceRef } from "../value-objects/ResourceRef";
import type { PolicyEffect } from "../value-objects/PolicyEffect";

export interface AccessPolicyDomainEvent {
  readonly eventId: string;
  readonly occurredAt: string;
  readonly type: string;
  readonly payload: object;
}

export interface AccessPolicyCreatedEvent extends AccessPolicyDomainEvent {
  readonly type: "platform.access_policy.created";
  readonly payload: {
    readonly policyId: string;
    readonly subjectRef: SubjectRef;
    readonly resourceRef: ResourceRef;
    readonly actions: readonly string[];
    readonly effect: PolicyEffect;
  };
}

export interface AccessPolicyUpdatedEvent extends AccessPolicyDomainEvent {
  readonly type: "platform.access_policy.updated";
  readonly payload: { readonly policyId: string };
}

export interface AccessPolicyDeactivatedEvent extends AccessPolicyDomainEvent {
  readonly type: "platform.access_policy.deactivated";
  readonly payload: { readonly policyId: string };
}

export type AccessPolicyDomainEventType =
  | AccessPolicyCreatedEvent
  | AccessPolicyUpdatedEvent
  | AccessPolicyDeactivatedEvent;
````

## File: modules/platform/subdomains/access-control/domain/events/index.ts
````typescript
export * from "./AccessPolicyDomainEvent";
````

## File: modules/platform/subdomains/access-control/domain/index.ts
````typescript
export * from "./aggregates";
export * from "./events";
export * from "./repositories";
export * from "./value-objects";
````

## File: modules/platform/subdomains/access-control/domain/repositories/AccessPolicyRepository.ts
````typescript
/**
 * AccessPolicyRepository — Write-side persistence port (CQRS).
 */
import type { AccessPolicySnapshot } from "../aggregates/AccessPolicy";

export interface AccessPolicyRepository {
  findById(id: string): Promise<AccessPolicySnapshot | null>;
  findBySubject(subjectId: string): Promise<AccessPolicySnapshot[]>;
  findActiveBySubjectAndResource(
    subjectId: string,
    resourceType: string,
    resourceId?: string,
  ): Promise<AccessPolicySnapshot[]>;
  save(snapshot: AccessPolicySnapshot): Promise<void>;
  update(snapshot: AccessPolicySnapshot): Promise<void>;
}
````

## File: modules/platform/subdomains/access-control/domain/repositories/index.ts
````typescript
export * from "./AccessPolicyRepository";
````

## File: modules/platform/subdomains/access-control/domain/value-objects/index.ts
````typescript
export * from "./SubjectRef";
export * from "./ResourceRef";
export * from "./PolicyEffect";
````

## File: modules/platform/subdomains/access-control/domain/value-objects/PolicyEffect.ts
````typescript
export type PolicyEffect = "allow" | "deny";

export function isAllow(effect: PolicyEffect): boolean {
  return effect === "allow";
}
````

## File: modules/platform/subdomains/access-control/domain/value-objects/ResourceRef.ts
````typescript
import { z } from "@lib-zod";

export const ResourceRefSchema = z.object({
  resourceType: z.string().min(1),
  resourceId: z.string().min(1).optional(),
  workspaceId: z.string().min(1).optional(),
});
export type ResourceRef = z.infer<typeof ResourceRefSchema>;

export function createResourceRef(
  resourceType: string,
  resourceId?: string,
  workspaceId?: string,
): ResourceRef {
  return ResourceRefSchema.parse({ resourceType, resourceId, workspaceId });
}
````

## File: modules/platform/subdomains/access-control/domain/value-objects/SubjectRef.ts
````typescript
import { z } from "@lib-zod";

export const SubjectRefSchema = z.object({
  subjectId: z.string().min(1),
  subjectType: z.enum(["actor", "organization", "service"]),
});
export type SubjectRef = z.infer<typeof SubjectRefSchema>;

export function createSubjectRef(subjectId: string, subjectType: SubjectRef["subjectType"]): SubjectRef {
  return SubjectRefSchema.parse({ subjectId, subjectType });
}
````

## File: modules/platform/subdomains/access-control/infrastructure/access-control-service.ts
````typescript
/**
 * AccessControlService — Composition root for access-control use cases.
 */
import {
  EvaluatePermissionUseCase,
  CreateAccessPolicyUseCase,
  UpdateAccessPolicyUseCase,
  DeactivateAccessPolicyUseCase,
} from "../application/use-cases/access-control.use-cases";
import { FirebaseAccessPolicyRepository } from "./firebase/FirebaseAccessPolicyRepository";
import type { SubjectRef } from "../domain/value-objects/SubjectRef";
import type { ResourceRef } from "../domain/value-objects/ResourceRef";
import type { PolicyEffect } from "../domain/value-objects/PolicyEffect";
import type { CommandResult } from "@shared-types";

let _repo: FirebaseAccessPolicyRepository | undefined;

function getRepo(): FirebaseAccessPolicyRepository {
  if (!_repo) _repo = new FirebaseAccessPolicyRepository();
  return _repo;
}

export const accessControlService = {
  evaluatePermission: (input: {
    subjectId: string;
    resourceType: string;
    resourceId?: string;
    action: string;
  }): Promise<CommandResult> => new EvaluatePermissionUseCase(getRepo()).execute(input),

  createPolicy: (input: {
    subjectRef: SubjectRef;
    resourceRef: ResourceRef;
    actions: string[];
    effect: PolicyEffect;
    conditions?: string[];
  }): Promise<CommandResult> => new CreateAccessPolicyUseCase(getRepo()).execute(input),

  updatePolicy: (
    policyId: string,
    input: { actions?: string[]; effect?: PolicyEffect; conditions?: string[] },
  ): Promise<CommandResult> => new UpdateAccessPolicyUseCase(getRepo()).execute(policyId, input),

  deactivatePolicy: (policyId: string): Promise<CommandResult> =>
    new DeactivateAccessPolicyUseCase(getRepo()).execute(policyId),
};
````

## File: modules/platform/subdomains/access-control/infrastructure/firebase/FirebaseAccessPolicyRepository.ts
````typescript
/**
 * FirebaseAccessPolicyRepository — Infrastructure adapter for access-policy persistence.
 * Firebase SDK only exists in this file.
 */
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { firebaseClientApp } from "@integration-firebase/client";
import type { AccessPolicyRepository } from "../../domain/repositories/AccessPolicyRepository";
import type { AccessPolicySnapshot } from "../../domain/aggregates/AccessPolicy";

const COLLECTION = "accessPolicies";

function toSnapshot(id: string, data: Record<string, unknown>): AccessPolicySnapshot {
  return {
    id,
    subjectRef: data.subjectRef as AccessPolicySnapshot["subjectRef"],
    resourceRef: data.resourceRef as AccessPolicySnapshot["resourceRef"],
    actions: data.actions as string[],
    effect: data.effect as AccessPolicySnapshot["effect"],
    conditions: (data.conditions as string[]) ?? [],
    isActive: Boolean(data.isActive),
    createdAtISO: data.createdAtISO as string,
    updatedAtISO: data.updatedAtISO as string,
  };
}

export class FirebaseAccessPolicyRepository implements AccessPolicyRepository {
  private get db() {
    return getFirestore(firebaseClientApp);
  }

  async findById(id: string): Promise<AccessPolicySnapshot | null> {
    const snap = await getDoc(doc(this.db, COLLECTION, id));
    if (!snap.exists()) return null;
    return toSnapshot(snap.id, snap.data() as Record<string, unknown>);
  }

  async findBySubject(subjectId: string): Promise<AccessPolicySnapshot[]> {
    const q = query(
      collection(this.db, COLLECTION),
      where("subjectRef.subjectId", "==", subjectId),
    );
    const snaps = await getDocs(q);
    return snaps.docs.map((d) => toSnapshot(d.id, d.data() as Record<string, unknown>));
  }

  async findActiveBySubjectAndResource(
    subjectId: string,
    resourceType: string,
    resourceId?: string,
  ): Promise<AccessPolicySnapshot[]> {
    const constraints = [
      where("subjectRef.subjectId", "==", subjectId),
      where("resourceRef.resourceType", "==", resourceType),
      where("isActive", "==", true),
    ];
    if (resourceId) {
      constraints.push(where("resourceRef.resourceId", "==", resourceId));
    }
    const q = query(collection(this.db, COLLECTION), ...constraints);
    const snaps = await getDocs(q);
    return snaps.docs.map((d) => toSnapshot(d.id, d.data() as Record<string, unknown>));
  }

  async save(snapshot: AccessPolicySnapshot): Promise<void> {
    await setDoc(doc(this.db, COLLECTION, snapshot.id), {
      ...snapshot,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }

  async update(snapshot: AccessPolicySnapshot): Promise<void> {
    await updateDoc(doc(this.db, COLLECTION, snapshot.id), {
      actions: snapshot.actions,
      effect: snapshot.effect,
      conditions: snapshot.conditions,
      isActive: snapshot.isActive,
      updatedAtISO: snapshot.updatedAtISO,
      updatedAt: serverTimestamp(),
    });
  }
}
````

## File: modules/platform/subdomains/access-control/infrastructure/index.ts
````typescript
export * from "./access-control-service";
export { FirebaseAccessPolicyRepository } from "./firebase/FirebaseAccessPolicyRepository";
````

## File: modules/platform/subdomains/account-profile/api/index.ts
````typescript
/**
 * Public API boundary for the account-profile subdomain.
 * Cross-module consumers must import through this entry point.
 *
 * Composition root lives in infrastructure/account-profile-service.ts;
 * this boundary is intentionally thin — it only re-exports public contracts.
 */

import {
	getAccountProfileFromService,
	subscribeToAccountProfileFromService,
	updateAccountProfileFromService,
	configureLegacyAccountProfileDataSource,
} from "../infrastructure";
import {
	getLegacyUserProfile,
	subscribeToLegacyUserProfile,
	updateLegacyUserProfile,
} from "../../account/api/legacy-account-profile.bridge";
import type { AccountProfile, Unsubscribe } from "../domain";
import type { UpdateAccountProfileInput } from "../application";
import type { CommandResult } from "@shared-types";

configureLegacyAccountProfileDataSource({
	getUserProfile: getLegacyUserProfile,
	subscribeToUserProfile: subscribeToLegacyUserProfile,
	updateUserProfile: updateLegacyUserProfile,
});

// ── Use-case delegators ──────────────────────────────────────────────────

export async function getAccountProfile(actorId: string): Promise<AccountProfile | null> {
	return getAccountProfileFromService(actorId);
}

export function subscribeToAccountProfile(
	actorId: string,
	onUpdate: (profile: AccountProfile | null) => void,
): Unsubscribe {
	return subscribeToAccountProfileFromService(actorId, onUpdate);
}

export async function updateAccountProfile(
	actorId: string,
	input: UpdateAccountProfileInput,
): Promise<CommandResult> {
	return updateAccountProfileFromService(actorId, input);
}

// Legacy compatibility exports for migration window.
export const getUserProfile = getAccountProfile;
export const subscribeToUserProfile = subscribeToAccountProfile;

export { getProfile, subscribeToProfile, updateProfile } from "../interfaces";

export * from "../application";
export * from "../domain";
export { SettingsProfileRouteScreen } from "../interfaces";
export type { LegacyAccountProfileDataSource } from "../infrastructure";
````

## File: modules/platform/subdomains/account-profile/application/dtos/account-profile.dto.ts
````typescript
/**
 * Application-layer DTO re-exports for the account-profile subdomain.
 * Interfaces must import from here, not from domain/ directly.
 */
export type {
  AccountProfile,
  AccountProfileId,
  AccountProfileTheme,
  UpdateAccountProfileInput,
} from "../../domain/entities/AccountProfile";
export type { Unsubscribe } from "../../domain/repositories/AccountProfileQueryRepository";
````

## File: modules/platform/subdomains/account-profile/application/index.ts
````typescript
export { GetAccountProfileUseCase, SubscribeAccountProfileUseCase } from "./use-cases/get-account-profile.use-case";
export { UpdateAccountProfileUseCase } from "./use-cases/update-account-profile.use-case";
export type {
	AccountProfile,
	AccountProfileId,
	AccountProfileTheme,
	Unsubscribe,
	UpdateAccountProfileInput,
} from "./dtos/account-profile.dto";
````

## File: modules/platform/subdomains/account-profile/infrastructure/index.ts
````typescript
export {
	createLegacyAccountProfileCommandRepository,
	createLegacyAccountProfileQueryRepository,
} from "./create-legacy-account-profile-application.adapter";
export type {
	LegacyAccountProfileDataSource,
} from "./create-legacy-account-profile-application.adapter";
export {
	getAccountProfile as getAccountProfileFromService,
	subscribeToAccountProfile as subscribeToAccountProfileFromService,
	updateAccountProfile as updateAccountProfileFromService,
	configureLegacyAccountProfileDataSource,
} from "./account-profile-service";
````

## File: modules/platform/subdomains/account-profile/interfaces/_actions/account-profile.actions.ts
````typescript
"use server";

import { commandFailureFrom, type CommandResult } from "@shared-types";
import { updateAccountProfile } from "../../api";
import type { UpdateAccountProfileInput } from "../../application/dtos/account-profile.dto";

export async function updateProfile(
	actorId: string,
	input: UpdateAccountProfileInput,
): Promise<CommandResult> {
	try {
		return await updateAccountProfile(actorId, input);
	} catch (err) {
		return commandFailureFrom(
			"UPDATE_ACCOUNT_PROFILE_FAILED",
			err instanceof Error ? err.message : "Unexpected error",
		);
	}
}
````

## File: modules/platform/subdomains/account-profile/interfaces/queries/account-profile.queries.ts
````typescript
/**
 * Account Profile Read Queries — thin wrappers over account-profile API use cases.
 * NOT Server Actions — callable from React components/hooks directly.
 */

import { getAccountProfile, subscribeToAccountProfile } from "../../api";
import type {
  AccountProfile,
  Unsubscribe,
} from "../../application/dtos/account-profile.dto";

export async function getProfile(actorId: string): Promise<AccountProfile | null> {
  return getAccountProfile(actorId);
}

export function subscribeToProfile(
  actorId: string,
  onUpdate: (profile: AccountProfile | null) => void,
): Unsubscribe {
  return subscribeToAccountProfile(actorId, onUpdate);
}
````

## File: modules/platform/subdomains/account/api/index.ts
````typescript
/**
 * Public API boundary for the account subdomain.
 * Cross-module consumers must import through this entry point.
 */

import { identityApi } from "../../identity/api";
import { configureTokenRefreshEmitter } from "../infrastructure/identity-token-refresh.adapter";

configureTokenRefreshEmitter(identityApi.emitTokenRefreshSignal);

export * from "../application";
export { accountService, createClientAccountUseCases, createAccountQueryRepository } from "../infrastructure";
export type {
  AccountEntity,
  AccountType,
  OrganizationRole,
  AccountRoleRecord,
  UpdateProfileInput,
  WalletTransaction,
  ThemeConfig,
  Wallet,
} from "../domain/entities/Account";
export type {
  AccountPolicy,
  PolicyRule,
  PolicyEffect,
  CreatePolicyInput,
  UpdatePolicyInput,
} from "../domain/entities/AccountPolicy";
export type { WalletBalanceSnapshot, Unsubscribe } from "../domain/repositories/AccountQueryRepository";
export type { AccountQueryRepository } from "../domain/repositories/AccountQueryRepository";
export * from "../interfaces";
````

## File: modules/platform/subdomains/account/api/legacy-account-profile.bridge.ts
````typescript
import { type UpdateProfileInput } from "../application/dtos/account.dto";
import { accountService, createAccountQueryRepository } from "../infrastructure/account-service";
import type { AccountQueryRepository } from "../domain/repositories/AccountQueryRepository";

let _accountQueryRepo: AccountQueryRepository | undefined;

function getAccountQueryRepo(): AccountQueryRepository {
  if (!_accountQueryRepo) {
    _accountQueryRepo = createAccountQueryRepository();
  }
  return _accountQueryRepo;
}

export async function getLegacyUserProfile(userId: string) {
  return getAccountQueryRepo().getUserProfile(userId);
}

export function subscribeToLegacyUserProfile(
  userId: string,
  onUpdate: (profile: Awaited<ReturnType<typeof getLegacyUserProfile>>) => void,
) {
  return getAccountQueryRepo().subscribeToUserProfile(userId, onUpdate);
}

export async function updateLegacyUserProfile(userId: string, input: UpdateProfileInput): Promise<void> {
  await accountService.updateUserProfile(userId, input);
}
````

## File: modules/platform/subdomains/account/application/dtos/account.dto.ts
````typescript
/**
 * Application-layer DTO re-exports for the account subdomain.
 * Interfaces must import from here, not from domain/ directly.
 */
export type {
  AccountEntity,
  WalletTransaction,
  AccountRoleRecord,
  UpdateProfileInput,
  OrganizationRole,
} from "../../domain/entities/Account";
export type { WalletBalanceSnapshot, Unsubscribe } from "../../domain/repositories/AccountQueryRepository";
export type { AccountPolicy, CreatePolicyInput, UpdatePolicyInput } from "../../domain/entities/AccountPolicy";
````

## File: modules/platform/subdomains/account/application/index.ts
````typescript
export {
  CreateUserAccountUseCase,
  UpdateUserProfileUseCase,
  CreditWalletUseCase,
  DebitWalletUseCase,
  AssignAccountRoleUseCase,
  RevokeAccountRoleUseCase,
} from "./use-cases/account.use-cases";

export {
  CreateAccountPolicyUseCase,
  UpdateAccountPolicyUseCase,
  DeleteAccountPolicyUseCase,
} from "./use-cases/account-policy.use-cases";

export {
  resolveActiveAccount,
  type AccountBootstrapPhase,
  type ResolveActiveAccountInput,
  type SelectableActiveAccount,
} from "./services/resolve-active-account";
````

## File: modules/platform/subdomains/account/infrastructure/identity-token-refresh.adapter.ts
````typescript
/**
 * IdentityTokenRefreshAdapter — Implements TokenRefreshPort using the platform identity subdomain.
 * This adapter lives in the adapters layer so the application layer stays clean.
 */

import type { TokenRefreshPort, TokenRefreshSignalInput } from "../domain/ports/TokenRefreshPort";

type EmitTokenRefreshSignal = (input: TokenRefreshSignalInput) => Promise<void>;

let _emitTokenRefreshSignal: EmitTokenRefreshSignal | undefined;

export function configureTokenRefreshEmitter(emitFn: EmitTokenRefreshSignal): void {
  _emitTokenRefreshSignal = emitFn;
}

export class IdentityTokenRefreshAdapter implements TokenRefreshPort {
  async emitTokenRefreshSignal(input: TokenRefreshSignalInput): Promise<void> {
    if (!_emitTokenRefreshSignal) {
      throw new Error("Token refresh emitter is not configured.");
    }
    await _emitTokenRefreshSignal(input);
  }
}

export const tokenRefreshAdapter = new IdentityTokenRefreshAdapter();
````

## File: modules/platform/subdomains/account/interfaces/_actions/account-policy.actions.ts
````typescript
"use server";

/**
 * Account Policy Server Actions — thin adapter: Server Actions → Application Use Cases.
 */

import { commandFailureFrom, type CommandResult } from "@shared-types";
import { accountService } from "../../api";
import type { CreatePolicyInput, UpdatePolicyInput } from "../../application/dtos/account.dto";

export async function createAccountPolicy(input: CreatePolicyInput): Promise<CommandResult> {
  try {
    return await accountService.createPolicy(input);
  } catch (err) {
    return commandFailureFrom("CREATE_ACCOUNT_POLICY_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function updateAccountPolicy(
  policyId: string,
  accountId: string,
  data: UpdatePolicyInput,
  traceId?: string,
): Promise<CommandResult> {
  try {
    return await accountService.updatePolicy(policyId, accountId, data, traceId);
  } catch (err) {
    return commandFailureFrom("UPDATE_ACCOUNT_POLICY_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function deleteAccountPolicy(
  policyId: string,
  accountId: string,
): Promise<CommandResult> {
  try {
    return await accountService.deletePolicy(policyId, accountId);
  } catch (err) {
    return commandFailureFrom("DELETE_ACCOUNT_POLICY_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}
````

## File: modules/platform/subdomains/account/interfaces/_actions/account.actions.ts
````typescript
"use server";

/**
 * Account Server Actions — thin adapter: Next.js Server Actions → Application Use Cases.
 */

import { commandFailureFrom, type CommandResult } from "@shared-types";
import { accountService } from "../../api";
import type { UpdateProfileInput, OrganizationRole } from "../../application/dtos/account.dto";

export async function createUserAccount(
  userId: string,
  name: string,
  email: string,
): Promise<CommandResult> {
  try {
    return await accountService.createUserAccount(userId, name, email);
  } catch (err) {
    return commandFailureFrom("CREATE_USER_ACCOUNT_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function updateUserProfile(
  userId: string,
  data: UpdateProfileInput,
): Promise<CommandResult> {
  try {
    return await accountService.updateUserProfile(userId, data);
  } catch (err) {
    return commandFailureFrom("UPDATE_USER_PROFILE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function creditWallet(
  accountId: string,
  amount: number,
  description: string,
): Promise<CommandResult> {
  try {
    return await accountService.creditWallet(accountId, amount, description);
  } catch (err) {
    return commandFailureFrom("WALLET_CREDIT_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function debitWallet(
  accountId: string,
  amount: number,
  description: string,
): Promise<CommandResult> {
  try {
    return await accountService.debitWallet(accountId, amount, description);
  } catch (err) {
    return commandFailureFrom("WALLET_DEBIT_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function assignAccountRole(
  accountId: string,
  role: OrganizationRole,
  grantedBy: string,
  traceId?: string,
): Promise<CommandResult> {
  try {
    return await accountService.assignRole(accountId, role, grantedBy, traceId);
  } catch (err) {
    return commandFailureFrom("ASSIGN_ROLE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function revokeAccountRole(accountId: string): Promise<CommandResult> {
  try {
    return await accountService.revokeRole(accountId);
  } catch (err) {
    return commandFailureFrom("REVOKE_ROLE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}
````

## File: modules/platform/subdomains/account/interfaces/queries/account.queries.ts
````typescript
/**
 * Account Read Queries — thin wrappers over the AccountQueryRepository port.
 * NOT Server Actions — callable from React components/hooks directly.
 */

import { createAccountQueryRepository } from "../../api";
import type { AccountQueryRepository } from "../../domain/repositories/AccountQueryRepository";
import type { AccountEntity, WalletTransaction, AccountRoleRecord, WalletBalanceSnapshot, Unsubscribe, AccountPolicy } from "../../application/dtos/account.dto";

let _accountQueryRepo: AccountQueryRepository | undefined;

function getAccountQueryRepo(): AccountQueryRepository {
  if (!_accountQueryRepo) _accountQueryRepo = createAccountQueryRepository();
  return _accountQueryRepo;
}

export async function getUserProfile(userId: string): Promise<AccountEntity | null> {
  return getAccountQueryRepo().getUserProfile(userId);
}

export function subscribeToUserProfile(
  userId: string,
  onUpdate: (profile: AccountEntity | null) => void,
): Unsubscribe {
  return getAccountQueryRepo().subscribeToUserProfile(userId, onUpdate);
}

export async function getWalletBalance(accountId: string): Promise<WalletBalanceSnapshot> {
  return getAccountQueryRepo().getWalletBalance(accountId);
}

export function subscribeToWalletBalance(
  accountId: string,
  onUpdate: (snapshot: WalletBalanceSnapshot) => void,
): Unsubscribe {
  return getAccountQueryRepo().subscribeToWalletBalance(accountId, onUpdate);
}

export function subscribeToWalletTransactions(
  accountId: string,
  maxCount: number,
  onUpdate: (txs: WalletTransaction[]) => void,
): Unsubscribe {
  return getAccountQueryRepo().subscribeToWalletTransactions(accountId, maxCount, onUpdate);
}

export async function getAccountRole(accountId: string): Promise<AccountRoleRecord | null> {
  return getAccountQueryRepo().getAccountRole(accountId);
}

export function subscribeToAccountRoles(
  accountId: string,
  onUpdate: (record: AccountRoleRecord | null) => void,
): Unsubscribe {
  return getAccountQueryRepo().subscribeToAccountRoles(accountId, onUpdate);
}

export function subscribeToAccountsForUser(
  userId: string,
  onUpdate: (accounts: Record<string, AccountEntity>) => void,
): Unsubscribe {
  return getAccountQueryRepo().subscribeToAccountsForUser(userId, onUpdate);
}

export async function getAccountPolicies(_accountId: string): Promise<AccountPolicy[]> {
  // Policy reads are server-side only; keep client bundles free of policy repo deps.
  return [];
}

export async function getActiveAccountPolicies(_accountId: string): Promise<AccountPolicy[]> {
  return [];
}
````

## File: modules/platform/subdomains/entitlement/api/index.ts
````typescript
/**
 * Public API boundary for the entitlement subdomain.
 * Cross-module consumers must import through this entry point.
 */
export * from "../application";
export { entitlementService } from "../infrastructure";
export type {
  EntitlementGrantSnapshot,
  CreateEntitlementGrantInput,
} from "../domain/aggregates/EntitlementGrant";
export type { EntitlementGrantDomainEventType } from "../domain/events/EntitlementGrantDomainEvent";
export type { EntitlementGrantRepository } from "../domain/repositories/EntitlementGrantRepository";
export type { EntitlementStatus } from "../domain/value-objects/EntitlementStatus";
export type { FeatureKey } from "../domain/value-objects/FeatureKey";
````

## File: modules/platform/subdomains/entitlement/application/dtos/entitlement.dto.ts
````typescript
import type { EntitlementGrantSnapshot } from "../../domain/aggregates/EntitlementGrant";

export type EntitlementGrantView = Readonly<EntitlementGrantSnapshot>;

export interface EntitlementSignal {
  readonly contextId: string;
  readonly activeFeatures: string[];
  readonly grants: EntitlementGrantView[];
}
````

## File: modules/platform/subdomains/entitlement/application/dtos/index.ts
````typescript
export * from "./entitlement.dto";
````

## File: modules/platform/subdomains/entitlement/application/index.ts
````typescript
export * from "./dtos";
export * from "./use-cases";
````

## File: modules/platform/subdomains/entitlement/application/use-cases/index.ts
````typescript
export * from "./entitlement.use-cases";
````

## File: modules/platform/subdomains/entitlement/domain/aggregates/EntitlementGrant.ts
````typescript
import type { EntitlementGrantDomainEventType } from "../events/EntitlementGrantDomainEvent";
import { createEntitlementId, canSuspend, canRevoke } from "../value-objects";
import type { EntitlementStatus } from "../value-objects";

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

export interface CreateEntitlementGrantInput {
  readonly contextId: string;
  readonly featureKey: string;
  readonly quota?: number | null;
  readonly expiresAt?: string | null;
}

export class EntitlementGrant {
  private readonly _domainEvents: EntitlementGrantDomainEventType[] = [];

  private constructor(private _props: EntitlementGrantSnapshot) {}

  static create(id: string, input: CreateEntitlementGrantInput): EntitlementGrant {
    createEntitlementId(id);
    const now = new Date().toISOString();
    const grant = new EntitlementGrant({
      id,
      contextId: input.contextId,
      featureKey: input.featureKey,
      quota: input.quota ?? null,
      status: "active",
      grantedAt: now,
      expiresAt: input.expiresAt ?? null,
      updatedAtISO: now,
    });
    grant._domainEvents.push({
      type: "platform.entitlement.granted",
      eventId: crypto.randomUUID(),
      occurredAt: now,
      payload: {
        entitlementId: id,
        contextId: input.contextId,
        featureKey: input.featureKey,
        quota: input.quota ?? null,
      },
    });
    return grant;
  }

  static reconstitute(snapshot: EntitlementGrantSnapshot): EntitlementGrant {
    createEntitlementId(snapshot.id);
    return new EntitlementGrant({ ...snapshot });
  }

  suspend(): void {
    if (!canSuspend(this._props.status)) {
      throw new Error("Only active entitlement can be suspended.");
    }
    const now = new Date().toISOString();
    this._props = { ...this._props, status: "suspended", updatedAtISO: now };
    this._domainEvents.push({
      type: "platform.entitlement.suspended",
      eventId: crypto.randomUUID(),
      occurredAt: now,
      payload: { entitlementId: this._props.id, contextId: this._props.contextId },
    });
  }

  revoke(): void {
    if (!canRevoke(this._props.status)) {
      throw new Error("Entitlement is already revoked.");
    }
    const now = new Date().toISOString();
    this._props = { ...this._props, status: "revoked", updatedAtISO: now };
    this._domainEvents.push({
      type: "platform.entitlement.revoked",
      eventId: crypto.randomUUID(),
      occurredAt: now,
      payload: { entitlementId: this._props.id, contextId: this._props.contextId },
    });
  }

  expire(): void {
    const now = new Date().toISOString();
    this._props = { ...this._props, status: "expired", updatedAtISO: now };
    this._domainEvents.push({
      type: "platform.entitlement.expired",
      eventId: crypto.randomUUID(),
      occurredAt: now,
      payload: { entitlementId: this._props.id, contextId: this._props.contextId },
    });
  }

  get id(): string { return this._props.id; }
  get contextId(): string { return this._props.contextId; }
  get featureKey(): string { return this._props.featureKey; }
  get quota(): number | null { return this._props.quota; }
  get status(): EntitlementStatus { return this._props.status; }
  get grantedAt(): string { return this._props.grantedAt; }
  get expiresAt(): string | null { return this._props.expiresAt; }
  get isActive(): boolean { return this._props.status === "active"; }

  getSnapshot(): Readonly<EntitlementGrantSnapshot> {
    return Object.freeze({ ...this._props });
  }

  pullDomainEvents(): EntitlementGrantDomainEventType[] {
    const events = [...this._domainEvents];
    this._domainEvents.length = 0;
    return events;
  }
}
````

## File: modules/platform/subdomains/entitlement/domain/aggregates/index.ts
````typescript
export * from "./EntitlementGrant";
````

## File: modules/platform/subdomains/entitlement/domain/events/EntitlementGrantDomainEvent.ts
````typescript
export interface EntitlementGrantDomainEvent {
  readonly eventId: string;
  readonly occurredAt: string;
  readonly type: string;
  readonly payload: object;
}

export interface EntitlementGrantedEvent extends EntitlementGrantDomainEvent {
  readonly type: "platform.entitlement.granted";
  readonly payload: {
    readonly entitlementId: string;
    readonly contextId: string;
    readonly featureKey: string;
    readonly quota: number | null;
  };
}

export interface EntitlementSuspendedEvent extends EntitlementGrantDomainEvent {
  readonly type: "platform.entitlement.suspended";
  readonly payload: {
    readonly entitlementId: string;
    readonly contextId: string;
  };
}

export interface EntitlementRevokedEvent extends EntitlementGrantDomainEvent {
  readonly type: "platform.entitlement.revoked";
  readonly payload: {
    readonly entitlementId: string;
    readonly contextId: string;
  };
}

export interface EntitlementExpiredEvent extends EntitlementGrantDomainEvent {
  readonly type: "platform.entitlement.expired";
  readonly payload: {
    readonly entitlementId: string;
    readonly contextId: string;
  };
}

export type EntitlementGrantDomainEventType =
  | EntitlementGrantedEvent
  | EntitlementSuspendedEvent
  | EntitlementRevokedEvent
  | EntitlementExpiredEvent;
````

## File: modules/platform/subdomains/entitlement/domain/events/index.ts
````typescript
export * from "./EntitlementGrantDomainEvent";
````

## File: modules/platform/subdomains/entitlement/domain/index.ts
````typescript
export * from "./aggregates";
export * from "./events";
export * from "./repositories";
export * from "./value-objects";
````

## File: modules/platform/subdomains/entitlement/domain/repositories/EntitlementGrantRepository.ts
````typescript
/**
 * EntitlementGrantRepository — Write-side persistence port (CQRS).
 * Domain owns the contract; Infrastructure implements it.
 */
import type { EntitlementGrantSnapshot } from "../aggregates/EntitlementGrant";

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
````

## File: modules/platform/subdomains/entitlement/domain/repositories/index.ts
````typescript
export * from "./EntitlementGrantRepository";
````

## File: modules/platform/subdomains/entitlement/domain/value-objects/EntitlementId.ts
````typescript
import { z } from "@lib-zod";

export const EntitlementIdSchema = z.string().min(1).brand("EntitlementId");
export type EntitlementId = z.infer<typeof EntitlementIdSchema>;

export function createEntitlementId(raw: string): EntitlementId {
  return EntitlementIdSchema.parse(raw);
}
````

## File: modules/platform/subdomains/entitlement/domain/value-objects/EntitlementStatus.ts
````typescript
export const ENTITLEMENT_STATUSES = ["active", "suspended", "expired", "revoked"] as const;
export type EntitlementStatus = (typeof ENTITLEMENT_STATUSES)[number];

export function canSuspend(status: EntitlementStatus): boolean {
  return status === "active";
}

export function canRevoke(status: EntitlementStatus): boolean {
  return status !== "revoked";
}

export function isActiveStatus(status: EntitlementStatus): boolean {
  return status === "active";
}
````

## File: modules/platform/subdomains/entitlement/domain/value-objects/FeatureKey.ts
````typescript
import { z } from "@lib-zod";

export const FeatureKeySchema = z
  .string()
  .min(1)
  .regex(/^[a-z][a-z0-9_:.\-]*$/, "FeatureKey must be lowercase dot/colon/hyphen separated")
  .brand("FeatureKey");
export type FeatureKey = z.infer<typeof FeatureKeySchema>;

export function createFeatureKey(raw: string): FeatureKey {
  return FeatureKeySchema.parse(raw);
}
````

## File: modules/platform/subdomains/entitlement/domain/value-objects/index.ts
````typescript
export * from "./EntitlementId";
export * from "./EntitlementStatus";
export * from "./FeatureKey";
````

## File: modules/platform/subdomains/entitlement/infrastructure/entitlement-service.ts
````typescript
/**
 * EntitlementService — Composition root for entitlement use cases.
 * Wires repositories; provides a unified service interface.
 */
import {
  GrantEntitlementUseCase,
  SuspendEntitlementUseCase,
  RevokeEntitlementUseCase,
  ResolveEntitlementsUseCase,
  CheckFeatureEntitlementUseCase,
} from "../application/use-cases/entitlement.use-cases";
import { FirebaseEntitlementGrantRepository } from "./firebase/FirebaseEntitlementGrantRepository";
import type { CommandResult } from "@shared-types";

let _repo: FirebaseEntitlementGrantRepository | undefined;

function getRepo(): FirebaseEntitlementGrantRepository {
  if (!_repo) _repo = new FirebaseEntitlementGrantRepository();
  return _repo;
}

export const entitlementService = {
  grantEntitlement: (input: {
    contextId: string;
    featureKey: string;
    quota?: number | null;
    expiresAt?: string | null;
  }): Promise<CommandResult> => new GrantEntitlementUseCase(getRepo()).execute(input),

  suspendEntitlement: (entitlementId: string): Promise<CommandResult> =>
    new SuspendEntitlementUseCase(getRepo()).execute(entitlementId),

  revokeEntitlement: (entitlementId: string): Promise<CommandResult> =>
    new RevokeEntitlementUseCase(getRepo()).execute(entitlementId),

  resolveEntitlements: (contextId: string): Promise<CommandResult> =>
    new ResolveEntitlementsUseCase(getRepo()).execute(contextId),

  checkFeatureEntitlement: (contextId: string, featureKey: string): Promise<CommandResult> =>
    new CheckFeatureEntitlementUseCase(getRepo()).execute(contextId, featureKey),
};
````

## File: modules/platform/subdomains/entitlement/infrastructure/firebase/FirebaseEntitlementGrantRepository.ts
````typescript
/**
 * FirebaseEntitlementGrantRepository — Infrastructure adapter for entitlement persistence.
 * Firebase SDK only exists in this file.
 */
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { firebaseClientApp } from "@integration-firebase/client";
import type { EntitlementGrantRepository } from "../../domain/repositories/EntitlementGrantRepository";
import type { EntitlementGrantSnapshot } from "../../domain/aggregates/EntitlementGrant";

const COLLECTION = "entitlementGrants";

function toSnapshot(id: string, data: Record<string, unknown>): EntitlementGrantSnapshot {
  return {
    id,
    contextId: data.contextId as string,
    featureKey: data.featureKey as string,
    quota: data.quota != null ? (data.quota as number) : null,
    status: data.status as EntitlementGrantSnapshot["status"],
    grantedAt: data.grantedAt as string,
    expiresAt: data.expiresAt != null ? (data.expiresAt as string) : null,
    updatedAtISO: data.updatedAtISO as string,
  };
}

export class FirebaseEntitlementGrantRepository implements EntitlementGrantRepository {
  private get db() {
    return getFirestore(firebaseClientApp);
  }

  async findById(id: string): Promise<EntitlementGrantSnapshot | null> {
    const snap = await getDoc(doc(this.db, COLLECTION, id));
    if (!snap.exists()) return null;
    return toSnapshot(snap.id, snap.data() as Record<string, unknown>);
  }

  async findByContextId(contextId: string): Promise<EntitlementGrantSnapshot[]> {
    const q = query(collection(this.db, COLLECTION), where("contextId", "==", contextId));
    const snaps = await getDocs(q);
    return snaps.docs.map((d) => toSnapshot(d.id, d.data() as Record<string, unknown>));
  }

  async findActiveByContextAndFeature(
    contextId: string,
    featureKey: string,
  ): Promise<EntitlementGrantSnapshot | null> {
    const q = query(
      collection(this.db, COLLECTION),
      where("contextId", "==", contextId),
      where("featureKey", "==", featureKey),
      where("status", "==", "active"),
    );
    const snaps = await getDocs(q);
    if (snaps.empty) return null;
    const d = snaps.docs[0];
    return toSnapshot(d.id, d.data() as Record<string, unknown>);
  }

  async save(snapshot: EntitlementGrantSnapshot): Promise<void> {
    await setDoc(doc(this.db, COLLECTION, snapshot.id), {
      ...snapshot,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }

  async update(snapshot: EntitlementGrantSnapshot): Promise<void> {
    await updateDoc(doc(this.db, COLLECTION, snapshot.id), {
      status: snapshot.status,
      updatedAtISO: snapshot.updatedAtISO,
      updatedAt: serverTimestamp(),
    });
  }
}
````

## File: modules/platform/subdomains/entitlement/infrastructure/index.ts
````typescript
export * from "./entitlement-service";
export { FirebaseEntitlementGrantRepository } from "./firebase/FirebaseEntitlementGrantRepository";
````

## File: modules/platform/subdomains/notification/application/dtos/notification.dto.ts
````typescript
/**
 * Application-layer DTO re-exports for the notification subdomain.
 * Interfaces must import from here, not from domain/ directly.
 */
export type { NotificationEntity, DispatchNotificationInput } from "../../domain/entities/Notification";
````

## File: modules/platform/subdomains/notification/application/queries/notification.queries.ts
````typescript
import type { NotificationRepository } from "../../domain/repositories/NotificationRepository";
import type { NotificationEntity } from "../../domain/entities/Notification";

export class GetNotificationsForRecipientUseCase {
  constructor(private readonly repo: NotificationRepository) {}

  async execute(recipientId: string, limit?: number): Promise<NotificationEntity[]> {
    return this.repo.findByRecipient(recipientId, limit);
  }
}

export class GetUnreadCountUseCase {
  constructor(private readonly repo: NotificationRepository) {}

  async execute(recipientId: string): Promise<number> {
    return this.repo.getUnreadCount(recipientId);
  }
}
````

## File: modules/platform/subdomains/notification/application/use-cases/notification.use-cases.ts
````typescript
/**
 * Notification Application Use Cases — orchestrate domain intent without framework concerns.
 */

import { commandSuccess, commandFailureFrom } from "@shared-types";
import type { CommandResult } from "@shared-types";
import type { NotificationRepository } from "../../domain/repositories/NotificationRepository";
import type { DispatchNotificationInput } from "../../domain/entities/Notification";

export class DispatchNotificationUseCase {
  constructor(private readonly repo: NotificationRepository) {}

  async execute(input: DispatchNotificationInput): Promise<CommandResult> {
    try {
      const notification = await this.repo.dispatch(input);
      return commandSuccess(notification.id, 1);
    } catch (err) {
      return commandFailureFrom("DISPATCH_NOTIFICATION_FAILED", err instanceof Error ? err.message : "Unexpected error");
    }
  }
}

export class MarkNotificationReadUseCase {
  constructor(private readonly repo: NotificationRepository) {}

  async execute(notificationId: string, recipientId: string): Promise<CommandResult> {
    try {
      await this.repo.markAsRead(notificationId, recipientId);
      return commandSuccess(notificationId, 1);
    } catch (err) {
      return commandFailureFrom("MARK_READ_FAILED", err instanceof Error ? err.message : "Unexpected error");
    }
  }
}

export class MarkAllNotificationsReadUseCase {
  constructor(private readonly repo: NotificationRepository) {}

  async execute(recipientId: string): Promise<CommandResult> {
    try {
      await this.repo.markAllAsRead(recipientId);
      return commandSuccess(recipientId, 1);
    } catch (err) {
      return commandFailureFrom("MARK_ALL_READ_FAILED", err instanceof Error ? err.message : "Unexpected error");
    }
  }
}

// Re-export read queries for backward compatibility
export { GetNotificationsForRecipientUseCase, GetUnreadCountUseCase } from "../queries/notification.queries";
````

## File: modules/platform/subdomains/notification/interfaces/_actions/notification.actions.ts
````typescript
"use server";

/**
 * Notification Server Actions — thin adapters over use cases.
 */

import { commandFailureFrom, type CommandResult } from "@shared-types";
import { notificationService } from "../../api";
import type { DispatchNotificationInput } from "../../application/dtos/notification.dto";

export async function dispatchNotification(input: DispatchNotificationInput): Promise<CommandResult> {
  try {
    return await notificationService.dispatch(input);
  } catch (err) {
    return commandFailureFrom("DISPATCH_NOTIFICATION_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function markNotificationRead(
  notificationId: string,
  recipientId: string,
): Promise<CommandResult> {
  try {
    return await notificationService.markAsRead(notificationId, recipientId);
  } catch (err) {
    return commandFailureFrom("MARK_READ_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function markAllNotificationsRead(recipientId: string): Promise<CommandResult> {
  try {
    return await notificationService.markAllAsRead(recipientId);
  } catch (err) {
    return commandFailureFrom("MARK_ALL_READ_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}
````

## File: modules/platform/subdomains/notification/interfaces/components/NotificationBell.tsx
````typescript
"use client";

/**
 * NotificationBell — Reusable notification bell for shell header.
 * Lives in platform/subdomains/notification/interfaces.
 */

import Link from "next/link";
import { Bell } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import {
  markNotificationRead,
  markAllNotificationsRead,
} from "../_actions/notification.actions";
import { getNotificationsForRecipient } from "../queries/notification.queries";
import type { NotificationEntity } from "../../application/dtos/notification.dto";
import { Button } from "@ui-shadcn/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@ui-shadcn/ui/dropdown-menu";

const NOTIFICATION_LIMIT = 20;

function formatNotificationTime(timestamp: number) {
  return new Intl.DateTimeFormat("zh-TW", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(timestamp));
}

interface NotificationBellProps {
  readonly recipientId: string;
}

export function NotificationBell({ recipientId }: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMutating, setIsMutating] = useState(false);
  const [notifications, setNotifications] = useState<NotificationEntity[]>([]);

  const unreadCount = useMemo(
    () => notifications.reduce((count, n) => count + (n.read ? 0 : 1), 0),
    [notifications],
  );

  const loadNotifications = useCallback(async () => {
    if (!recipientId) {
      setNotifications([]);
      return;
    }
    setIsLoading(true);
    try {
      const next = await getNotificationsForRecipient(recipientId, NOTIFICATION_LIMIT);
      setNotifications(next);
    } finally {
      setIsLoading(false);
    }
  }, [recipientId]);

  useEffect(() => {
    void loadNotifications();
  }, [loadNotifications]);

  async function handleOpenChange(nextOpen: boolean) {
    setIsOpen(nextOpen);
    if (nextOpen) {
      await loadNotifications();
    }
  }

  async function handleMarkOneRead(notificationId: string) {
    if (!recipientId) return;
    setIsMutating(true);
    const previous = notifications;
    setNotifications((current) =>
      current.map((n) => (n.id === notificationId ? { ...n, read: true } : n)),
    );
    try {
      const result = await markNotificationRead(notificationId, recipientId);
      if (!result.success) setNotifications(previous);
    } finally {
      setIsMutating(false);
    }
  }

  async function handleMarkAllRead() {
    if (!recipientId || unreadCount === 0) return;
    setIsMutating(true);
    const previous = notifications;
    setNotifications((current) => current.map((n) => ({ ...n, read: true })));
    try {
      const result = await markAllNotificationsRead(recipientId);
      if (!result.success) setNotifications(previous);
    } finally {
      setIsMutating(false);
    }
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          aria-label="Open notifications"
          className="relative text-muted-foreground"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute -right-1 -top-1 min-w-4 rounded-full bg-primary px-1 text-center text-[10px] font-semibold leading-4 text-primary-foreground">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between px-3 py-2">
          <p className="text-sm font-semibold">Notifications</p>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs"
            disabled={isMutating || unreadCount === 0}
            onClick={handleMarkAllRead}
          >
            Mark all read
          </Button>
        </div>
        <DropdownMenuSeparator />
        <div className="max-h-80 overflow-y-auto">
          {isLoading ? (
            <p className="px-3 py-6 text-center text-sm text-muted-foreground">Loading...</p>
          ) : notifications.length === 0 ? (
            <p className="px-3 py-6 text-center text-sm text-muted-foreground">No notifications</p>
          ) : (
            notifications.map((notification) => (
              <button
                key={notification.id}
                type="button"
                onClick={() => void handleMarkOneRead(notification.id)}
                disabled={isMutating}
                className="block w-full border-b border-border/60 px-3 py-2 text-left transition-colors hover:bg-muted/50 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium">{notification.title}</p>
                  {!notification.read ? (
                    <span
                      className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary"
                      aria-hidden="true"
                    />
                  ) : null}
                </div>
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                  {notification.message}
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {formatNotificationTime(notification.timestamp)}
                </p>
              </button>
            ))
          )}
        </div>
        <DropdownMenuSeparator />
        <div className="py-1 text-center">
          <Link
            href="/settings/notifications"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            查看全部通知
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
````

## File: modules/platform/subdomains/notification/interfaces/components/NotificationsPage.tsx
````typescript
/**
 * Route: /settings/notifications
 * Purpose: Full-page notification center showing all notifications for the
 *          authenticated user with read/unread filtering and bulk actions.
 */
"use client";

import { Bell, CheckCheck, Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState, useTransition } from "react";

import {
  markAllNotificationsRead,
  markNotificationRead,
} from "../_actions/notification.actions";
import { getNotificationsForRecipient } from "../queries/notification.queries";
import type { NotificationEntity } from "../../application/dtos/notification.dto";
import { Badge } from "@ui-shadcn/ui/badge";
import { Button } from "@ui-shadcn/ui/button";
import { Skeleton } from "@ui-shadcn/ui/skeleton";

type Filter = "all" | "unread";

const TYPE_BADGE: Record<string, string> = {
  info: "bg-blue-100 text-blue-800",
  alert: "bg-red-100 text-red-800",
  success: "bg-green-100 text-green-800",
  warning: "bg-yellow-100 text-yellow-800",
};

function formatTime(ts: number) {
  return new Intl.DateTimeFormat("zh-TW", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(ts));
}

export interface NotificationsPageProps {
  recipientId: string;
}

export function NotificationsPage({ recipientId }: NotificationsPageProps) {
  const [notifications, setNotifications] = useState<NotificationEntity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");
  const [isPending, startTransition] = useTransition();

  const load = useCallback(async () => {
    if (!recipientId) { setIsLoading(false); return; }
    setIsLoading(true);
    try {
      const data = await getNotificationsForRecipient(recipientId, 100);
      setNotifications(data);
    } finally {
      setIsLoading(false);
    }
  }, [recipientId]);

  useEffect(() => { void load(); }, [load]);

  const displayed = useMemo(
    () => filter === "unread" ? notifications.filter((n) => !n.read) : notifications,
    [notifications, filter],
  );

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications],
  );

  function handleMarkOne(id: string) {
    startTransition(async () => {
      setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
      await markNotificationRead(id, recipientId);
    });
  }

  function handleMarkAll() {
    startTransition(async () => {
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      await markAllNotificationsRead(recipientId);
    });
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <h1 className="text-xl font-semibold">通知</h1>
          {unreadCount > 0 && (
            <Badge variant="secondary" className="ml-1">{unreadCount} 未讀</Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setFilter((f) => f === "all" ? "unread" : "all")}
            className="text-xs"
          >
            {filter === "all" ? "只看未讀" : "顯示全部"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={isPending || unreadCount === 0}
            onClick={handleMarkAll}
            className="text-xs gap-1"
          >
            <CheckCheck className="h-3.5 w-3.5" />
            全部已讀
          </Button>
        </div>
      </div>

      {/* Body */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      ) : displayed.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-muted-foreground">
          <Bell className="h-10 w-10 opacity-30" />
          <p className="text-sm">{filter === "unread" ? "沒有未讀通知" : "目前沒有通知"}</p>
        </div>
      ) : (
        <ul className="divide-y divide-border rounded-lg border">
          {displayed.map((n) => (
            <li
              key={n.id}
              className={`flex items-start gap-3 px-4 py-3 transition-colors hover:bg-muted/40 ${n.read ? "opacity-60" : ""}`}
            >
              {!n.read && (
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" />
              )}
              {n.read && <span className="mt-2 h-2 w-2 shrink-0" />}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-medium">{n.title}</p>
                  <span className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium ${TYPE_BADGE[n.type] ?? ""}`}>
                    {n.type}
                  </span>
                </div>
                <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{n.message}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">{formatTime(n.timestamp)}</p>
              </div>
              {!n.read && (
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={isPending}
                  onClick={() => handleMarkOne(n.id)}
                  title="標記已讀"
                  className="h-7 w-7 shrink-0 text-muted-foreground hover:text-foreground"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
````

## File: modules/platform/subdomains/notification/interfaces/queries/notification.queries.ts
````typescript
/**
 * Notification Queries — delegates to notificationService via the subdomain api/ boundary.
 */

import { notificationService } from "../../api";
import type { NotificationEntity } from "../../application/dtos/notification.dto";

export async function getNotificationsForRecipient(recipientId: string, maxCount?: number): Promise<NotificationEntity[]> {
  return notificationService.getForRecipient(recipientId, maxCount);
}
````

## File: modules/platform/subdomains/organization/api/index.ts
````typescript
/**
 * Public API boundary for the organization subdomain.
 * Cross-module consumers must import through this entry point.
 *
 * NOTE: We avoid `export * from "../infrastructure"` here because the
 * infrastructure barrel pulls in Firebase repository constructors during
 * module evaluation, which causes failures during Next.js static
 * prerendering. Infrastructure exports are available in the server barrel
 * (./server.ts) or via direct import from action / service files.
 */

import { createTeamRepository } from "../../team/api";
import { configureOrganizationTeamPortFactory } from "../infrastructure/organization-service";

configureOrganizationTeamPortFactory(createTeamRepository);

// --- Domain types ---
export type {
  OrganizationEntity,
  OrganizationRole,
  Presence,
  InviteState,
  PolicyEffect,
  MemberReference,
  Team,
  PartnerInvite,
  ThemeConfig,
  OrgPolicy,
  OrgPolicyRule,
  OrgPolicyScope,
  CreateOrganizationCommand,
  UpdateOrganizationSettingsCommand,
  InviteMemberInput,
  UpdateMemberRoleInput,
  CreateTeamInput,
  CreateOrgPolicyInput,
  UpdateOrgPolicyInput,
} from "../domain";
export type { OrganizationRepository, Unsubscribe } from "../domain";
export type { OrgPolicyRepository } from "../domain";

// --- Application use cases ---
export {
  CreateOrganizationUseCase,
  CreateOrganizationWithTeamUseCase,
  UpdateOrganizationSettingsUseCase,
  DeleteOrganizationUseCase,
} from "../application";
export {
  InviteMemberUseCase,
  RecruitMemberUseCase,
  RemoveMemberUseCase,
  UpdateMemberRoleUseCase,
} from "../application";
export {
  CreateTeamUseCase,
  DeleteTeamUseCase,
  UpdateTeamMembersUseCase,
} from "../application";
export {
  CreatePartnerGroupUseCase,
  SendPartnerInviteUseCase,
  DismissPartnerMemberUseCase,
} from "../application";
export {
  CreateOrgPolicyUseCase,
  UpdateOrgPolicyUseCase,
  DeleteOrgPolicyUseCase,
} from "../application";

// --- Infrastructure (lazy, safe for SSR) ---
export { organizationService, organizationQueryService } from "../infrastructure";

// --- Interfaces (UI, queries, actions) ---
export * from "../interfaces";
````

## File: modules/platform/subdomains/organization/application/dtos/organization.dto.ts
````typescript
/**
 * Application-layer DTO re-exports for the organization subdomain.
 * Interfaces must import from here, not from domain/ directly.
 */
export type {
  MemberReference,
  Team,
  OrgPolicy,
  CreateOrgPolicyInput,
  UpdateOrgPolicyInput,
  CreateOrganizationCommand,
  UpdateOrganizationSettingsCommand,
  InviteMemberInput,
  UpdateMemberRoleInput,
  CreateTeamInput,
} from "../../domain/entities/Organization";
````

## File: modules/platform/subdomains/organization/interfaces/_actions/organization-policy.actions.ts
````typescript
"use server";

/**
 * Organization Policy Server Actions — thin adapters over use cases.
 */

import { commandFailureFrom, type CommandResult } from "@shared-types";
import { organizationService } from "../../api";
import type { CreateOrgPolicyInput, UpdateOrgPolicyInput } from "../../application/dtos/organization.dto";

export async function createOrgPolicy(input: CreateOrgPolicyInput): Promise<CommandResult> {
  try { return await organizationService.createOrgPolicy(input); }
  catch (err) { return commandFailureFrom("CREATE_ORG_POLICY_FAILED", err instanceof Error ? err.message : "Unexpected error"); }
}

export async function updateOrgPolicy(policyId: string, data: UpdateOrgPolicyInput): Promise<CommandResult> {
  try { return await organizationService.updateOrgPolicy(policyId, data); }
  catch (err) { return commandFailureFrom("UPDATE_ORG_POLICY_FAILED", err instanceof Error ? err.message : "Unexpected error"); }
}

export async function deleteOrgPolicy(policyId: string): Promise<CommandResult> {
  try { return await organizationService.deleteOrgPolicy(policyId); }
  catch (err) { return commandFailureFrom("DELETE_ORG_POLICY_FAILED", err instanceof Error ? err.message : "Unexpected error"); }
}
````

## File: modules/platform/subdomains/organization/interfaces/_actions/organization.actions.ts
````typescript
"use server";

/**
 * Organization Server Actions — thin adapters over use cases.
 */

import { commandFailureFrom, type CommandResult } from "@shared-types";
import { organizationService } from "../../api";
import type {
  CreateOrganizationCommand,
  UpdateOrganizationSettingsCommand,
  InviteMemberInput,
  UpdateMemberRoleInput,
  CreateTeamInput,
} from "../../application/dtos/organization.dto";

export async function createOrganization(cmd: CreateOrganizationCommand): Promise<CommandResult> {
  try { return await organizationService.createOrganization(cmd); }
  catch (err) { return commandFailureFrom("CREATE_ORGANIZATION_FAILED", err instanceof Error ? err.message : "Unexpected error"); }
}

export async function createOrganizationWithTeam(
  cmd: CreateOrganizationCommand,
  teamName: string,
  teamType: "internal" | "external" = "internal",
): Promise<CommandResult> {
  try { return await organizationService.createOrganizationWithTeam(cmd, teamName, teamType); }
  catch (err) { return commandFailureFrom("SETUP_ORGANIZATION_WITH_TEAM_FAILED", err instanceof Error ? err.message : "Unexpected error"); }
}

export async function updateOrganizationSettings(cmd: UpdateOrganizationSettingsCommand): Promise<CommandResult> {
  try { return await organizationService.updateSettings(cmd); }
  catch (err) { return commandFailureFrom("UPDATE_ORGANIZATION_SETTINGS_FAILED", err instanceof Error ? err.message : "Unexpected error"); }
}

export async function deleteOrganization(organizationId: string): Promise<CommandResult> {
  try { return await organizationService.deleteOrganization(organizationId); }
  catch (err) { return commandFailureFrom("DELETE_ORGANIZATION_FAILED", err instanceof Error ? err.message : "Unexpected error"); }
}

export async function inviteMember(input: InviteMemberInput): Promise<CommandResult> {
  try { return await organizationService.inviteMember(input); }
  catch (err) { return commandFailureFrom("INVITE_MEMBER_FAILED", err instanceof Error ? err.message : "Unexpected error"); }
}

export async function recruitMember(
  organizationId: string,
  memberId: string,
  name: string,
  email: string,
): Promise<CommandResult> {
  try { return await organizationService.recruitMember(organizationId, memberId, name, email); }
  catch (err) { return commandFailureFrom("RECRUIT_MEMBER_FAILED", err instanceof Error ? err.message : "Unexpected error"); }
}

export async function dismissMember(organizationId: string, memberId: string): Promise<CommandResult> {
  try { return await organizationService.removeMember(organizationId, memberId); }
  catch (err) { return commandFailureFrom("REMOVE_MEMBER_FAILED", err instanceof Error ? err.message : "Unexpected error"); }
}

export async function updateMemberRole(input: UpdateMemberRoleInput): Promise<CommandResult> {
  try { return await organizationService.updateMemberRole(input); }
  catch (err) { return commandFailureFrom("UPDATE_MEMBER_ROLE_FAILED", err instanceof Error ? err.message : "Unexpected error"); }
}

export async function createTeam(input: CreateTeamInput): Promise<CommandResult> {
  try { return await organizationService.createTeam(input); }
  catch (err) { return commandFailureFrom("CREATE_TEAM_FAILED", err instanceof Error ? err.message : "Unexpected error"); }
}

export async function deleteTeam(organizationId: string, teamId: string): Promise<CommandResult> {
  try { return await organizationService.deleteTeam(organizationId, teamId); }
  catch (err) { return commandFailureFrom("DELETE_TEAM_FAILED", err instanceof Error ? err.message : "Unexpected error"); }
}

export async function updateTeamMembers(
  organizationId: string,
  teamId: string,
  memberId: string,
  action: "add" | "remove",
): Promise<CommandResult> {
  try { return await organizationService.updateTeamMembers(organizationId, teamId, memberId, action); }
  catch (err) { return commandFailureFrom("UPDATE_TEAM_MEMBERS_FAILED", err instanceof Error ? err.message : "Unexpected error"); }
}

export async function createPartnerGroup(organizationId: string, groupName: string): Promise<CommandResult> {
  try { return await organizationService.createPartnerGroup(organizationId, groupName); }
  catch (err) { return commandFailureFrom("CREATE_PARTNER_GROUP_FAILED", err instanceof Error ? err.message : "Unexpected error"); }
}

export async function sendPartnerInvite(
  organizationId: string,
  teamId: string,
  email: string,
): Promise<CommandResult> {
  try { return await organizationService.sendPartnerInvite(organizationId, teamId, email); }
  catch (err) { return commandFailureFrom("SEND_PARTNER_INVITE_FAILED", err instanceof Error ? err.message : "Unexpected error"); }
}

export async function dismissPartnerMember(
  organizationId: string,
  teamId: string,
  memberId: string,
): Promise<CommandResult> {
  try { return await organizationService.dismissPartnerMember(organizationId, teamId, memberId); }
  catch (err) { return commandFailureFrom("DISMISS_PARTNER_MEMBER_FAILED", err instanceof Error ? err.message : "Unexpected error"); }
}
````

## File: modules/platform/subdomains/organization/interfaces/queries/organization.queries.ts
````typescript
/**
 * Organization Queries — delegates to organizationQueryService via the subdomain api/ boundary.
 */

import { organizationQueryService } from "../../api";
import type { MemberReference, Team, OrgPolicy } from "../../application/dtos/organization.dto";

export function getOrganizationMembers(organizationId: string): Promise<MemberReference[]> {
  return organizationQueryService.getMembers(organizationId);
}

export function getOrganizationTeams(organizationId: string): Promise<Team[]> {
  return organizationQueryService.getTeams(organizationId);
}

export function getOrgPolicies(orgId: string): Promise<OrgPolicy[]> {
  return organizationQueryService.getOrgPolicies(orgId);
}
````

## File: modules/platform/subdomains/platform-config/api/index.ts
````typescript
/**
 * Public API boundary for this subdomain.
 * Cross-module consumers must import through this entry point.
 */
export * from "../application";
````

## File: modules/platform/subdomains/search/api/index.ts
````typescript
/**
 * Public API boundary for this subdomain.
 * Cross-module consumers must import through this entry point.
 */
export * from "../application";
````

## File: modules/platform/subdomains/search/application/index.ts
````typescript
// Purpose: Application layer for platform subdomain 'search'.

export {
	listShellCommandCatalogItems,
	type ShellCommandCatalogItem,
} from "./services/shell-command-catalog";
````

## File: modules/platform/subdomains/search/application/services/shell-command-catalog.ts
````typescript
export interface ShellCommandCatalogItem {
  readonly href: string;
  readonly label: string;
  readonly group: "導覽" | "Knowledge" | "Source";
}

const SHELL_COMMAND_CATALOG_ITEMS: readonly ShellCommandCatalogItem[] = [
  { href: "/workspace", label: "Workspace Hub", group: "導覽" },
  { href: "/knowledge", label: "Knowledge Hub", group: "導覽" },
  { href: "/knowledge-base/articles", label: "Knowledge Base", group: "導覽" },
  { href: "/knowledge-database/databases", label: "Knowledge Database", group: "導覽" },
  { href: "/notebook/rag-query", label: "Notebook / AI", group: "導覽" },
  { href: "/ai-chat", label: "AI Chat", group: "導覽" },
  { href: "/knowledge/pages", label: "頁面管理", group: "Knowledge" },
  { href: "/knowledge/block-editor", label: "區塊編輯器", group: "Knowledge" },
  { href: "/source/libraries", label: "Libraries 表格", group: "Source" },
] as const;

export function listShellCommandCatalogItems(): readonly ShellCommandCatalogItem[] {
  return SHELL_COMMAND_CATALOG_ITEMS;
}
````

## File: modules/platform/subdomains/subdomains.instructions.md
````markdown
---
description: 'Platform subdomains structural rules: hexagonal shape per subdomain, status discipline, cross-subdomain collaboration, and stub promotion criteria.'
applyTo: 'modules/platform/subdomains/**/*.{ts,tsx}'
---

# Platform Subdomains Layer (Local)

Use this file as execution guardrails for `modules/platform/subdomains/*`.
For full reference, align with `.github/instructions/architecture-core.instructions.md` and `docs/contexts/platform/subdomains.md`.

## Core Rules

- Every subdomain must maintain the full hexagonal shape: `api/`, `domain/`, `application/`, `infrastructure/`, `interfaces/`, `README.md`.
- Stub subdomains (`domain/index.ts` only) must not be promoted to Active without a corresponding ADR and `README.md` update.
- Cross-subdomain collaboration within platform goes through the **subdomain's own `api/`** — never import a sibling subdomain's `domain/`, `application/`, or `infrastructure/` internals.
- Each subdomain owns its Firestore collection(s); no subdomain reads or writes another subdomain's data directly.
- Domain events emitted by a subdomain must use the discriminant format `platform.<subdomain>.<action>` (e.g. `platform.identity.subject-authenticated`).
- Dependency direction inside each subdomain mirrors the module-level rule: `interfaces → application → domain ← infrastructure`.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill hexagonal-ddd
````

## File: modules/platform/subdomains/subscription/api/index.ts
````typescript
/**
 * Public API boundary for the subscription subdomain.
 */
export * from "../application";
export { subscriptionService } from "../infrastructure";
export type { SubscriptionSnapshot, CreateSubscriptionInput } from "../domain/aggregates/Subscription";
export type { SubscriptionDomainEventType } from "../domain/events/SubscriptionDomainEvent";
export type { SubscriptionRepository } from "../domain/repositories/SubscriptionRepository";
export type { SubscriptionId } from "../domain/value-objects/SubscriptionId";
export type { PlanCode } from "../domain/value-objects/PlanCode";
export type { SubscriptionStatus } from "../domain/value-objects/SubscriptionStatus";
export type { BillingCycle } from "../domain/value-objects/BillingCycle";
````

## File: modules/platform/subdomains/subscription/application/dtos/index.ts
````typescript
export * from "./subscription.dto";
````

## File: modules/platform/subdomains/subscription/application/dtos/subscription.dto.ts
````typescript
import type { SubscriptionSnapshot } from "../../domain/aggregates/Subscription";

export type SubscriptionView = Readonly<SubscriptionSnapshot>;

export interface SubscriptionSummary {
  readonly contextId: string;
  readonly planCode: string;
  readonly status: string;
  readonly isActive: boolean;
  readonly currentPeriodEnd: string | null;
}
````

## File: modules/platform/subdomains/subscription/application/index.ts
````typescript
export * from "./dtos";
export * from "./use-cases";
````

## File: modules/platform/subdomains/subscription/application/use-cases/index.ts
````typescript
export * from "./subscription.use-cases";
````

## File: modules/platform/subdomains/subscription/domain/aggregates/index.ts
````typescript
export * from "./Subscription";
````

## File: modules/platform/subdomains/subscription/domain/aggregates/Subscription.ts
````typescript
import type { SubscriptionDomainEventType } from "../events/SubscriptionDomainEvent";
import { createSubscriptionId, canCancel, canRenew } from "../value-objects";
import type { SubscriptionStatus } from "../value-objects";
import type { PlanCode } from "../value-objects/PlanCode";
import type { BillingCycle } from "../value-objects/BillingCycle";

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

export interface CreateSubscriptionInput {
  readonly contextId: string;
  readonly planCode: string;
  readonly billingCycle: BillingCycle;
  readonly currentPeriodStart?: string;
  readonly currentPeriodEnd?: string | null;
}

export class Subscription {
  private readonly _domainEvents: SubscriptionDomainEventType[] = [];

  private constructor(private _props: SubscriptionSnapshot) {}

  static create(id: string, input: CreateSubscriptionInput): Subscription {
    createSubscriptionId(id);
    const now = new Date().toISOString();
    const sub = new Subscription({
      id,
      contextId: input.contextId,
      planCode: input.planCode,
      billingCycle: input.billingCycle,
      status: "active",
      currentPeriodStart: input.currentPeriodStart ?? now,
      currentPeriodEnd: input.currentPeriodEnd ?? null,
      cancelledAt: null,
      createdAtISO: now,
      updatedAtISO: now,
    });
    sub._domainEvents.push({
      type: "platform.subscription.activated",
      eventId: crypto.randomUUID(),
      occurredAt: now,
      payload: {
        subscriptionId: id,
        contextId: input.contextId,
        planCode: input.planCode,
        billingCycle: input.billingCycle,
      },
    });
    return sub;
  }

  static reconstitute(snapshot: SubscriptionSnapshot): Subscription {
    createSubscriptionId(snapshot.id);
    return new Subscription({ ...snapshot });
  }

  cancel(): void {
    if (!canCancel(this._props.status)) {
      throw new Error(`Subscription in status '${this._props.status}' cannot be cancelled.`);
    }
    const now = new Date().toISOString();
    this._props = {
      ...this._props,
      status: "cancelled",
      cancelledAt: now,
      updatedAtISO: now,
    };
    this._domainEvents.push({
      type: "platform.subscription.cancelled",
      eventId: crypto.randomUUID(),
      occurredAt: now,
      payload: { subscriptionId: this._props.id, contextId: this._props.contextId },
    });
  }

  renew(newPeriodEnd: string): void {
    if (!canRenew(this._props.status)) {
      throw new Error(`Subscription in status '${this._props.status}' cannot be renewed.`);
    }
    const now = new Date().toISOString();
    this._props = {
      ...this._props,
      status: "active",
      currentPeriodStart: now,
      currentPeriodEnd: newPeriodEnd,
      updatedAtISO: now,
    };
    this._domainEvents.push({
      type: "platform.subscription.renewed",
      eventId: crypto.randomUUID(),
      occurredAt: now,
      payload: {
        subscriptionId: this._props.id,
        contextId: this._props.contextId,
        newPeriodEnd,
      },
    });
  }

  markPastDue(): void {
    if (this._props.status !== "active") {
      throw new Error("Only active subscription can be marked past due.");
    }
    const now = new Date().toISOString();
    this._props = { ...this._props, status: "past_due", updatedAtISO: now };
    this._domainEvents.push({
      type: "platform.subscription.past_due",
      eventId: crypto.randomUUID(),
      occurredAt: now,
      payload: { subscriptionId: this._props.id, contextId: this._props.contextId },
    });
  }

  expire(): void {
    const now = new Date().toISOString();
    this._props = { ...this._props, status: "expired", updatedAtISO: now };
    this._domainEvents.push({
      type: "platform.subscription.expired",
      eventId: crypto.randomUUID(),
      occurredAt: now,
      payload: { subscriptionId: this._props.id, contextId: this._props.contextId },
    });
  }

  get id(): string { return this._props.id; }
  get contextId(): string { return this._props.contextId; }
  get planCode(): string { return this._props.planCode; }
  get billingCycle(): BillingCycle { return this._props.billingCycle; }
  get status(): SubscriptionStatus { return this._props.status; }
  get currentPeriodEnd(): string | null { return this._props.currentPeriodEnd; }
  get cancelledAt(): string | null { return this._props.cancelledAt; }
  get isActive(): boolean { return this._props.status === "active" || this._props.status === "trialing"; }

  getSnapshot(): Readonly<SubscriptionSnapshot> {
    return Object.freeze({ ...this._props });
  }

  pullDomainEvents(): SubscriptionDomainEventType[] {
    const events = [...this._domainEvents];
    this._domainEvents.length = 0;
    return events;
  }
}
````

## File: modules/platform/subdomains/subscription/domain/events/index.ts
````typescript
export * from "./SubscriptionDomainEvent";
````

## File: modules/platform/subdomains/subscription/domain/events/SubscriptionDomainEvent.ts
````typescript
import type { BillingCycle } from "../value-objects/BillingCycle";

export interface SubscriptionDomainEvent {
  readonly eventId: string;
  readonly occurredAt: string;
  readonly type: string;
  readonly payload: object;
}

export interface SubscriptionActivatedEvent extends SubscriptionDomainEvent {
  readonly type: "platform.subscription.activated";
  readonly payload: {
    readonly subscriptionId: string;
    readonly contextId: string;
    readonly planCode: string;
    readonly billingCycle: BillingCycle;
  };
}

export interface SubscriptionCancelledEvent extends SubscriptionDomainEvent {
  readonly type: "platform.subscription.cancelled";
  readonly payload: { readonly subscriptionId: string; readonly contextId: string };
}

export interface SubscriptionRenewedEvent extends SubscriptionDomainEvent {
  readonly type: "platform.subscription.renewed";
  readonly payload: {
    readonly subscriptionId: string;
    readonly contextId: string;
    readonly newPeriodEnd: string;
  };
}

export interface SubscriptionPastDueEvent extends SubscriptionDomainEvent {
  readonly type: "platform.subscription.past_due";
  readonly payload: { readonly subscriptionId: string; readonly contextId: string };
}

export interface SubscriptionExpiredEvent extends SubscriptionDomainEvent {
  readonly type: "platform.subscription.expired";
  readonly payload: { readonly subscriptionId: string; readonly contextId: string };
}

export type SubscriptionDomainEventType =
  | SubscriptionActivatedEvent
  | SubscriptionCancelledEvent
  | SubscriptionRenewedEvent
  | SubscriptionPastDueEvent
  | SubscriptionExpiredEvent;
````

## File: modules/platform/subdomains/subscription/domain/index.ts
````typescript
export * from "./aggregates";
export * from "./events";
export * from "./repositories";
export * from "./value-objects";
````

## File: modules/platform/subdomains/subscription/domain/repositories/index.ts
````typescript
export * from "./SubscriptionRepository";
````

## File: modules/platform/subdomains/subscription/domain/repositories/SubscriptionRepository.ts
````typescript
/**
 * SubscriptionRepository — Write-side persistence port (CQRS).
 */
import type { SubscriptionSnapshot } from "../aggregates/Subscription";

export interface SubscriptionRepository {
  findById(id: string): Promise<SubscriptionSnapshot | null>;
  findActiveByContextId(contextId: string): Promise<SubscriptionSnapshot | null>;
  findByContextId(contextId: string): Promise<SubscriptionSnapshot[]>;
  save(snapshot: SubscriptionSnapshot): Promise<void>;
  update(snapshot: SubscriptionSnapshot): Promise<void>;
}
````

## File: modules/platform/subdomains/subscription/domain/value-objects/BillingCycle.ts
````typescript
export type BillingCycle = "monthly" | "annual" | "lifetime";

export function cycleMonths(cycle: BillingCycle): number | null {
  if (cycle === "monthly") return 1;
  if (cycle === "annual") return 12;
  return null; // lifetime
}
````

## File: modules/platform/subdomains/subscription/domain/value-objects/index.ts
````typescript
export * from "./SubscriptionId";
export * from "./PlanCode";
export * from "./SubscriptionStatus";
export * from "./BillingCycle";
````

## File: modules/platform/subdomains/subscription/domain/value-objects/PlanCode.ts
````typescript
import { z } from "@lib-zod";

export const PLAN_CODES = ["free", "starter", "pro", "enterprise"] as const;
export type PlanCodeLiteral = (typeof PLAN_CODES)[number];

export const PlanCodeSchema = z.string().min(1).brand("PlanCode");
export type PlanCode = z.infer<typeof PlanCodeSchema>;

export function createPlanCode(raw: string): PlanCode {
  return PlanCodeSchema.parse(raw);
}
````

## File: modules/platform/subdomains/subscription/domain/value-objects/SubscriptionId.ts
````typescript
import { z } from "@lib-zod";

export const SubscriptionIdSchema = z.string().min(1).brand("SubscriptionId");
export type SubscriptionId = z.infer<typeof SubscriptionIdSchema>;

export function createSubscriptionId(raw: string): SubscriptionId {
  return SubscriptionIdSchema.parse(raw);
}
````

## File: modules/platform/subdomains/subscription/domain/value-objects/SubscriptionStatus.ts
````typescript
export const SUBSCRIPTION_STATUSES = [
  "trialing",
  "active",
  "past_due",
  "cancelled",
  "expired",
] as const;
export type SubscriptionStatus = (typeof SUBSCRIPTION_STATUSES)[number];

export function canCancel(status: SubscriptionStatus): boolean {
  return status === "active" || status === "trialing" || status === "past_due";
}

export function canRenew(status: SubscriptionStatus): boolean {
  return status === "active" || status === "past_due";
}

export function isActive(status: SubscriptionStatus): boolean {
  return status === "active" || status === "trialing";
}
````

## File: modules/platform/subdomains/subscription/infrastructure/firebase/FirebaseSubscriptionRepository.ts
````typescript
/**
 * FirebaseSubscriptionRepository — Infrastructure adapter for subscription persistence.
 * Firebase SDK only exists in this file.
 */
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  serverTimestamp,
} from "firebase/firestore";
import { firebaseClientApp } from "@integration-firebase/client";
import type { SubscriptionRepository } from "../../domain/repositories/SubscriptionRepository";
import type { SubscriptionSnapshot } from "../../domain/aggregates/Subscription";

const COLLECTION = "subscriptions";

function toSnapshot(id: string, data: Record<string, unknown>): SubscriptionSnapshot {
  return {
    id,
    contextId: data.contextId as string,
    planCode: data.planCode as string,
    billingCycle: data.billingCycle as SubscriptionSnapshot["billingCycle"],
    status: data.status as SubscriptionSnapshot["status"],
    currentPeriodStart: data.currentPeriodStart as string,
    currentPeriodEnd: data.currentPeriodEnd != null ? (data.currentPeriodEnd as string) : null,
    cancelledAt: data.cancelledAt != null ? (data.cancelledAt as string) : null,
    createdAtISO: data.createdAtISO as string,
    updatedAtISO: data.updatedAtISO as string,
  };
}

export class FirebaseSubscriptionRepository implements SubscriptionRepository {
  private get db() {
    return getFirestore(firebaseClientApp);
  }

  async findById(id: string): Promise<SubscriptionSnapshot | null> {
    const snap = await getDoc(doc(this.db, COLLECTION, id));
    if (!snap.exists()) return null;
    return toSnapshot(snap.id, snap.data() as Record<string, unknown>);
  }

  async findActiveByContextId(contextId: string): Promise<SubscriptionSnapshot | null> {
    const q = query(
      collection(this.db, COLLECTION),
      where("contextId", "==", contextId),
      where("status", "in", ["active", "trialing"]),
      orderBy("createdAtISO", "desc"),
      limit(1),
    );
    const snaps = await getDocs(q);
    if (snaps.empty) return null;
    const d = snaps.docs[0];
    return toSnapshot(d.id, d.data() as Record<string, unknown>);
  }

  async findByContextId(contextId: string): Promise<SubscriptionSnapshot[]> {
    const q = query(
      collection(this.db, COLLECTION),
      where("contextId", "==", contextId),
      orderBy("createdAtISO", "desc"),
    );
    const snaps = await getDocs(q);
    return snaps.docs.map((d) => toSnapshot(d.id, d.data() as Record<string, unknown>));
  }

  async save(snapshot: SubscriptionSnapshot): Promise<void> {
    await setDoc(doc(this.db, COLLECTION, snapshot.id), {
      ...snapshot,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }

  async update(snapshot: SubscriptionSnapshot): Promise<void> {
    await updateDoc(doc(this.db, COLLECTION, snapshot.id), {
      status: snapshot.status,
      currentPeriodStart: snapshot.currentPeriodStart,
      currentPeriodEnd: snapshot.currentPeriodEnd,
      cancelledAt: snapshot.cancelledAt,
      updatedAtISO: snapshot.updatedAtISO,
      updatedAt: serverTimestamp(),
    });
  }
}
````

## File: modules/platform/subdomains/subscription/infrastructure/index.ts
````typescript
export * from "./subscription-service";
export { FirebaseSubscriptionRepository } from "./firebase/FirebaseSubscriptionRepository";
````

## File: modules/platform/subdomains/subscription/infrastructure/subscription-service.ts
````typescript
/**
 * SubscriptionService — Composition root for subscription use cases.
 */
import {
  ActivateSubscriptionUseCase,
  CancelSubscriptionUseCase,
  RenewSubscriptionUseCase,
  GetActiveSubscriptionUseCase,
  MarkSubscriptionPastDueUseCase,
} from "../application/use-cases/subscription.use-cases";
import { FirebaseSubscriptionRepository } from "./firebase/FirebaseSubscriptionRepository";
import type { BillingCycle } from "../domain/value-objects/BillingCycle";
import type { CommandResult } from "@shared-types";

let _repo: FirebaseSubscriptionRepository | undefined;

function getRepo(): FirebaseSubscriptionRepository {
  if (!_repo) _repo = new FirebaseSubscriptionRepository();
  return _repo;
}

export const subscriptionService = {
  activateSubscription: (input: {
    contextId: string;
    planCode: string;
    billingCycle: BillingCycle;
    currentPeriodEnd?: string | null;
  }): Promise<CommandResult> => new ActivateSubscriptionUseCase(getRepo()).execute(input),

  cancelSubscription: (subscriptionId: string): Promise<CommandResult> =>
    new CancelSubscriptionUseCase(getRepo()).execute(subscriptionId),

  renewSubscription: (subscriptionId: string, newPeriodEnd: string): Promise<CommandResult> =>
    new RenewSubscriptionUseCase(getRepo()).execute(subscriptionId, newPeriodEnd),

  getActiveSubscription: (contextId: string): Promise<CommandResult> =>
    new GetActiveSubscriptionUseCase(getRepo()).execute(contextId),

  markPastDue: (subscriptionId: string): Promise<CommandResult> =>
    new MarkSubscriptionPastDueUseCase(getRepo()).execute(subscriptionId),
};
````

## File: modules/platform/api/index.ts
````typescript
/**
 * platform public API boundary.
 *
 * account is listed before organization to establish canonical definitions for
 * shared type names (OrganizationRole, PolicyEffect, ThemeConfig, Unsubscribe).
 * Organization re-exports are explicit to avoid TS2308 ambiguity errors.
 */

export * from "./contracts";
export * from "./facade";
export { createPlatformService } from "./platform-service";
export * from "../subdomains/identity/api";
export * from "../subdomains/account/api";
export * from "../subdomains/notification/api";

export {
  getProfile,
  subscribeToProfile,
  updateProfile,
  SettingsProfileRouteScreen,
  getAccountProfile,
  subscribeToAccountProfile,
  updateAccountProfile,
} from "../subdomains/account-profile/api";

export type {
  AccountProfile,
  UpdateAccountProfileInput,
} from "../subdomains/account-profile/api";

// organization — explicit to avoid re-export conflicts with account subdomain
export type {
  OrganizationEntity,
  Presence,
  InviteState,
  MemberReference,
  Team,
  PartnerInvite,
  OrgPolicy,
  OrgPolicyRule,
  OrgPolicyScope,
  CreateOrganizationCommand,
  UpdateOrganizationSettingsCommand,
  InviteMemberInput,
  UpdateMemberRoleInput,
  CreateTeamInput,
  CreateOrgPolicyInput,
  UpdateOrgPolicyInput,
  OrganizationRepository,
  OrgPolicyRepository,
} from "../subdomains/organization/api";
export {
  organizationService,
  getOrganizationMembers,
  getOrganizationTeams,
  getOrgPolicies,
  createOrganization,
  createOrganizationWithTeam,
  updateOrganizationSettings,
  deleteOrganization,
  inviteMember,
  recruitMember,
  dismissMember,
  updateMemberRole,
  createTeam,
  deleteTeam,
  updateTeamMembers,
  createPartnerGroup,
  sendPartnerInvite,
  dismissPartnerMember,
  createOrgPolicy,
  updateOrgPolicy,
  deleteOrgPolicy,
  CreateOrganizationUseCase,
  CreateOrganizationWithTeamUseCase,
  UpdateOrganizationSettingsUseCase,
  DeleteOrganizationUseCase,
  InviteMemberUseCase,
  RecruitMemberUseCase,
  RemoveMemberUseCase,
  UpdateMemberRoleUseCase,
  CreateTeamUseCase,
  DeleteTeamUseCase,
  UpdateTeamMembersUseCase,
  CreatePartnerGroupUseCase,
  SendPartnerInviteUseCase,
  DismissPartnerMemberUseCase,
  CreateOrgPolicyUseCase,
  UpdateOrgPolicyUseCase,
  DeleteOrgPolicyUseCase,
  // UI components
  AccountSwitcher,
  CreateOrganizationDialog,
  MembersPage,
  TeamsPage,
  PermissionsPage,
  OrganizationAuditPage,
} from "../subdomains/organization/api";
export type { MembersPageProps, TeamsPageProps, PermissionsPageProps, OrganizationAuditPageProps } from "../subdomains/organization/api";

// background-job — knowledge ingestion pipeline management
export * from "../subdomains/background-job/api";

// Cross-module and app-composition hooks from interfaces layer.
// Only selective exports — do NOT wildcard re-export "../interfaces".
export {
  useApp,
  Providers,
  ShellLayout,
  isActiveOrganizationAccount,
  quickCreateKnowledgePage,
  type QuickCreatePageInput,
  type QuickCreatePageResult,
} from "../interfaces";
````

## File: modules/platform/application/services/shell-quick-create.ts
````typescript
/**
 * Shell quick-create orchestrator.
 *
 * Context-wide application service that coordinates cross-bounded-context
 * creation actions triggered from the platform shell UI.
 * Delegates to the target module's public API boundary only.
 */

// ── Input / output contracts ──────────────────────────────────────────────────

export interface QuickCreatePageInput {
  readonly accountId: string;
  readonly workspaceId: string;
  readonly createdByUserId: string;
}

export interface QuickCreatePageResult {
  readonly success: boolean;
  readonly error?: { message: string };
}

// ── Orchestration ─────────────────────────────────────────────────────────────

export async function quickCreateKnowledgePage(
  input: QuickCreatePageInput,
  createPage: (input: {
    accountId: string;
    workspaceId: string;
    title: string;
    parentPageId: null;
    createdByUserId: string;
  }) => Promise<QuickCreatePageResult>,
): Promise<QuickCreatePageResult> {
  if (!input.accountId) {
    return { success: false, error: { message: "目前沒有 active account，無法建立" } };
  }
  if (!input.workspaceId) {
    return { success: false, error: { message: "請先切換到工作區，再建立頁面" } };
  }
  return createPage({
    accountId: input.accountId,
    workspaceId: input.workspaceId,
    title: "未命名頁面",
    parentPageId: null,
    createdByUserId: input.createdByUserId,
  });
}
````

## File: modules/platform/interfaces/web/shell/breadcrumbs/ShellAppBreadcrumbs.tsx
````typescript
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { resolveShellBreadcrumbLabel } from "../../../../subdomains/platform-config/api";

export function ShellAppBreadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  // Only render when there's more than one segment (i.e., not just root page).
  if (segments.length <= 1) return null;

  const crumbs: { label: string; href: string }[] = segments.map((seg, idx) => ({
    label: resolveShellBreadcrumbLabel(seg),
    href: "/" + segments.slice(0, idx + 1).join("/"),
  }));

  return (
    <nav aria-label="Breadcrumb" className="hidden items-center gap-1 text-xs text-muted-foreground sm:flex">
      {crumbs.map((crumb, idx) => (
        <span key={crumb.href} className="flex items-center gap-1">
          {idx > 0 && <ChevronRight className="size-3 opacity-40" />}
          {idx < crumbs.length - 1 ? (
            <Link
              href={crumb.href}
              className="transition hover:text-foreground"
            >
              {crumb.label}
            </Link>
          ) : (
            <span className="font-medium text-foreground">{crumb.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
````

## File: modules/platform/interfaces/web/shell/header/components/ShellNotificationButton.tsx
````typescript
"use client";

import { NotificationBell } from "../../../../../subdomains/notification/api";

interface ShellNotificationButtonProps {
  readonly recipientId: string;
}

export function ShellNotificationButton({ recipientId }: ShellNotificationButtonProps) {
  return <NotificationBell recipientId={recipientId} />;
}
````

## File: modules/platform/interfaces/web/shell/header/components/ShellUserAvatar.tsx
````typescript
"use client";

import { HeaderUserAvatar } from "../../../../../subdomains/account/api";

interface ShellUserAvatarProps {
  readonly name: string;
  readonly email: string;
  readonly onSignOut: () => void;
}

export function ShellUserAvatar({ name, email, onSignOut }: ShellUserAvatarProps) {
  return <HeaderUserAvatar name={name} email={email} onSignOut={onSignOut} />;
}
````

## File: modules/platform/interfaces/web/shell/search/ShellGlobalSearchDialog.tsx
````typescript
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, Layout } from "lucide-react";
import { listShellCommandCatalogItems } from "../../../../subdomains/search/api";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@ui-shadcn/ui/command";

const NAV_ITEMS = listShellCommandCatalogItems();

const GROUP_ICONS: Record<string, React.ReactNode> = {
  "導覽": <Layout className="size-4 mr-2 opacity-60" />,
  "Knowledge": <FileText className="size-4 mr-2 opacity-60" />,
  "Source": <FileText className="size-4 mr-2 opacity-60" />,
};

interface ShellGlobalSearchDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
}

export function ShellGlobalSearchDialog({ open, onOpenChange }: ShellGlobalSearchDialogProps) {
  const router = useRouter();

  function handleSelect(href: string) {
    onOpenChange(false);
    router.push(href);
  }

  const groups = Array.from(new Set(NAV_ITEMS.map((i) => i.group)));

  return (
    <CommandDialog
      title="全域搜尋"
      description="搜尋頁面或功能"
      open={open}
      onOpenChange={onOpenChange}
    >
      <CommandInput placeholder="搜尋頁面或功能…" />
      <CommandList>
        <CommandEmpty>找不到結果。</CommandEmpty>
        {groups.map((group) => (
          <CommandGroup key={group} heading={group}>
            {NAV_ITEMS.filter((i) => i.group === group).map((item) => (
              <CommandItem
                key={item.href}
                onSelect={() => handleSelect(item.href)}
              >
                {GROUP_ICONS[group]}
                {item.label}
                <CommandShortcut className="text-[10px] opacity-50">{item.href}</CommandShortcut>
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  );
}

/** Hook to manage Cmd/Ctrl+K keyboard shortcut. */
export function useShellGlobalSearch() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        setOpen((prev) => !prev);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  return { open, setOpen };
}
````

## File: modules/platform/interfaces/web/shell/sidebar/ShellAppRail.tsx
````typescript
"use client";

/**
 * Module: app-rail.tsx
 * Purpose: render the narrow leftmost icon rail (app rail) of the authenticated shell.
 * Responsibilities: app logo, account context switcher, top-level section icon nav with
 *   tooltips, and quick sign-out via user avatar dropdown at the bottom.
 * Constraints: UI-only; follows the two-column sidebar pattern from Plane's AppRailRoot.
 *   `h-full` ensures it fills the parent `h-screen` container.
 */

import Link from "next/link";
import {
  Building2,
  CalendarDays,
  ClipboardList,
  FlaskConical,
  NotebookText,
  Plus,
  SlidersHorizontal,
  UserRound,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import type { AuthUser, ActiveAccount, AccountEntity } from "@/modules/platform/api";
import { CreateOrganizationDialog } from "@/modules/platform/api";
import { type WorkspaceEntity, CreateWorkspaceDialogRail } from "@/modules/workspace/api";
import {
  listShellRailCatalogItems,
  isExactOrChildPath,
  type ShellRailCatalogItem,
} from "@/modules/platform/subdomains/platform-config/api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@ui-shadcn/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@ui-shadcn/ui/tooltip";

interface AppRailProps {
  readonly pathname: string;
  readonly user: AuthUser | null;
  readonly activeAccount: ActiveAccount | null;
  readonly organizationAccounts: AccountEntity[];
  readonly workspaces: WorkspaceEntity[];
  readonly workspacesHydrated: boolean;
  readonly isOrganizationAccount: boolean;
  readonly onSelectPersonal: () => void;
  readonly onSelectOrganization: (account: AccountEntity) => void;
  readonly activeWorkspaceId: string | null;
  readonly onSelectWorkspace: (workspaceId: string | null) => void;
  readonly onOrganizationCreated?: (account: AccountEntity) => void;
  readonly onSignOut: () => void;
}

interface RailItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  /** When false the item is hidden; defaults to true */
  show?: boolean;
  isActive?: (pathname: string) => boolean;
}

function getInitial(name: string | undefined | null): string {
  return name?.trim().charAt(0).toUpperCase() || "U";
}

/** Icon map keyed by rail catalog item id. Icons are UI concern — stay in interfaces. */
const RAIL_ICON_MAP: Record<string, React.ReactNode> = {
  workspace: <Building2 className="size-[18px]" />,
  "org-members": <UserRound className="size-[18px]" />,
  "org-teams": <Users className="size-[18px]" />,
  "org-daily": <NotebookText className="size-[18px]" />,
  "org-schedule": <CalendarDays className="size-[18px]" />,
  "org-audit": <ClipboardList className="size-[18px]" />,
  "org-permissions": <SlidersHorizontal className="size-[18px]" />,
  "dev-tools": <FlaskConical className="size-[18px]" />,
};

export function AppRail({
  pathname,
  user,
  activeAccount,
  organizationAccounts,
  workspaces,
  workspacesHydrated,
  isOrganizationAccount,
  onSelectPersonal,
  onSelectOrganization,
  activeWorkspaceId,
  onSelectWorkspace,
  onOrganizationCreated,
  onSignOut: _onSignOut,
}: AppRailProps) {
  const router = useRouter();
  const [isCreateOrgOpen, setIsCreateOrgOpen] = useState(false);
  const [isCreateWorkspaceOpen, setIsCreateWorkspaceOpen] = useState(false);

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  const visibleRailItems: RailItem[] = useMemo(() => {
    const catalogItems = listShellRailCatalogItems(isOrganizationAccount);
    return catalogItems.map((item: ShellRailCatalogItem) => ({
      href: item.href,
      label: item.label,
      icon: RAIL_ICON_MAP[item.id] ?? null,
      isActive: item.activeRoutePrefix
        ? (currentPathname: string) => isExactOrChildPath(item.activeRoutePrefix!, currentPathname)
        : undefined,
    }));
  }, [isOrganizationAccount]);

  const sortedWorkspaces = useMemo(
    () => [...workspaces].sort((a, b) => a.name.localeCompare(b.name, "zh-Hant")),
    [workspaces],
  );

  const accountName = activeAccount?.name ?? user?.name ?? "—";

  return (
    <TooltipProvider delayDuration={400}>
      <aside
        aria-label="App navigation rail"
        className="hidden h-full w-12 shrink-0 flex-col items-center border-r border-border/50 bg-card/40 py-2 md:flex"
      >
        {/* ── Workspace / account logo tile ─────────────────────────── */}
        <DropdownMenu>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  aria-label="切換帳號情境"
                  className="mb-1 flex h-9 w-9 items-center justify-center rounded-lg text-xs font-semibold tracking-tight text-muted-foreground transition hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  {getInitial(accountName)}
                </button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent side="right" className="max-w-[180px]">
              <p className="text-xs font-medium">{accountName}</p>
              <p className="text-[10px] text-muted-foreground">
                {isOrganizationAccount ? "組織帳號" : "個人帳號"}
              </p>
            </TooltipContent>
          </Tooltip>

          <DropdownMenuContent side="right" align="start" className="w-52">
            <DropdownMenuLabel className="text-xs text-muted-foreground">切換帳號</DropdownMenuLabel>
            {user && (
              <DropdownMenuItem
                onClick={onSelectPersonal}
                className={activeAccount?.id === user.id ? "bg-primary/10 text-primary" : ""}
              >
                <span className="truncate">{user.name} (Personal)</span>
              </DropdownMenuItem>
            )}
            {organizationAccounts.map((account) => (
              <DropdownMenuItem
                key={account.id}
                onClick={() => {
                  onSelectOrganization(account);
                }}
                className={activeAccount?.id === account.id ? "bg-primary/10 text-primary" : ""}
              >
                <span className="truncate">{account.name}</span>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                setIsCreateOrgOpen(true);
              }}
              className="gap-2 text-primary"
            >
              <Plus className="size-3.5 shrink-0" />
              <span>建立組織</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="my-2 h-px w-7 bg-border/50" />

        {/* ── Section nav icons ─────────────────────────────────────── */}
        <nav className="flex flex-col items-center gap-0.5" aria-label="主要導覽">
          {visibleRailItems.map((item) => {
            const active = item.isActive?.(pathname) ?? isActive(item.href);

            if (item.href === "/workspace") {
              return (
                <DropdownMenu key={item.href}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DropdownMenuTrigger asChild>
                        <button
                          type="button"
                          aria-current={active ? "page" : undefined}
                          aria-label="工作區中心：切換工作區"
                          className={`flex h-9 w-9 items-center justify-center rounded-lg transition ${
                            active
                              ? "bg-primary/10 text-primary"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          }`}
                        >
                          {item.icon}
                        </button>
                      </DropdownMenuTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p className="text-xs">工作區中心：切換工作區</p>
                    </TooltipContent>
                  </Tooltip>

                  <DropdownMenuContent side="right" align="start" className="w-56">
                    <DropdownMenuLabel className="text-xs text-muted-foreground">工作區</DropdownMenuLabel>
                    <DropdownMenuItem
                      onClick={() => {
                        router.push("/workspace");
                      }}
                      className={pathname === "/workspace" ? "bg-primary/10 text-primary" : ""}
                    >
                      工作區中心
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {!workspacesHydrated ? (
                      <DropdownMenuItem disabled>工作區載入中...</DropdownMenuItem>
                    ) : sortedWorkspaces.length === 0 ? (
                      <DropdownMenuItem disabled>目前帳號沒有工作區</DropdownMenuItem>
                    ) : (
                      sortedWorkspaces.map((workspace) => (
                        <DropdownMenuItem
                          key={workspace.id}
                          onClick={() => {
                            onSelectWorkspace(workspace.id);
                            router.push(`/workspace/${workspace.id}`);
                          }}
                          className={activeWorkspaceId === workspace.id ? "bg-primary/10 text-primary" : ""}
                        >
                          <span className="truncate">{workspace.name}</span>
                        </DropdownMenuItem>
                      ))
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => {
                        setIsCreateWorkspaceOpen(true);
                      }}
                      className="gap-2 text-primary"
                    >
                      <Plus className="size-3.5 shrink-0" />
                      <span>建立工作區</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              );
            }

            return (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    aria-label={item.label}
                    className={`flex h-9 w-9 items-center justify-center rounded-lg transition ${
                      active
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {item.icon}
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p className="text-xs">{item.label}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </nav>

        {/* ── Spacer ────────────────────────────────────────────────── */}
        <div className="flex-1" />

        <div className="h-1" />
      </aside>

      {/* ── Create organization dialog ─────────────────────────────── */}
      <CreateOrganizationDialog
        open={isCreateOrgOpen}
        onOpenChange={setIsCreateOrgOpen}
        user={user}
        onOrganizationCreated={onOrganizationCreated}
        onNavigate={(href) => { router.push(href); }}
      />

      {/* ── Create workspace dialog ────────────────────────────────── */}
      <CreateWorkspaceDialogRail
        open={isCreateWorkspaceOpen}
        onOpenChange={setIsCreateWorkspaceOpen}
        accountId={activeAccount?.id ?? null}
        accountType={activeAccount ? (isOrganizationAccount ? "organization" : "user") : null}
        creatorUserId={user?.id}
        onNavigate={(href: string) => { router.push(href); }}
      />
    </TooltipProvider>
  );
}
````

## File: modules/platform/interfaces/web/shell/sidebar/ShellContextNavSection.tsx
````typescript
"use client";

import Link from "next/link";
import { appendWorkspaceContextQuery } from "@/modules/workspace/api";

interface ContextScopedNavItem {
  href: string;
  label: string;
}

interface ShellContextNavSectionProps {
  title: string;
  items: readonly ContextScopedNavItem[];
  isActiveRoute: (href: string) => boolean;
  activeAccountId: string | null;
  activeWorkspaceId: string | null;
}

export function ShellContextNavSection({
  title,
  items,
  isActiveRoute,
  activeAccountId,
  activeWorkspaceId,
}: ShellContextNavSectionProps) {
  return (
    <nav className="space-y-0.5" aria-label={`${title}導覽`}>
      <p className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70">
        {title}
      </p>
      {(activeAccountId || activeWorkspaceId) && (
        <p className="px-2 pb-1 text-[11px] text-muted-foreground">
          {activeAccountId ? `帳號: ${activeAccountId.slice(0, 8)}` : "帳號: -"}
          {" · "}
          {activeWorkspaceId ? `工作區: ${activeWorkspaceId.slice(0, 8)}` : "工作區: -"}
        </p>
      )}
      {items.map((item) => {
        const active = isActiveRoute(item.href);
        const contextualHref = appendWorkspaceContextQuery(item.href, {
          accountId: activeAccountId,
          workspaceId: activeWorkspaceId,
        });
        return (
          <Link
            key={item.href}
            href={contextualHref}
            aria-current={active ? "page" : undefined}
            className={`flex items-center rounded-md px-2 py-1.5 text-xs font-medium transition ${
              active
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
````

## File: modules/platform/subdomains/access-control/application/index.ts
````typescript
export * from "./dtos";
export * from "./use-cases";
export * from "./services/shell-account-access";
````

## File: modules/platform/subdomains/access-control/application/services/shell-account-access.ts
````typescript
export interface ShellAccountActor {
  readonly id: string;
  readonly accountType?: string;
}

export function isOrganizationActor(
  account: ShellAccountActor | null | undefined,
): account is ShellAccountActor & { accountType: "organization" } {
  return account?.accountType === "organization";
}

/**
 * Type-narrowing guard for ActiveAccount (union of AccountEntity | AuthUser).
 * Returns true when the active account is an organization account.
 */
export function isActiveOrganizationAccount(
  activeAccount: { id: string; accountType?: string } | null,
): activeAccount is { id: string; accountType: "organization" } & Record<string, unknown> {
  return isOrganizationActor(activeAccount);
}

/**
 * Keep shell fallback behavior centralized so route access rules are not
 * duplicated across layout components.
 */
export function resolveOrganizationRouteFallback(
  pathname: string,
  account: ShellAccountActor | null | undefined,
): string | null {
  if (pathname === "/organization" && !isOrganizationActor(account)) {
    return "/workspace";
  }

  return null;
}
````

## File: modules/platform/subdomains/account-profile/infrastructure/account-profile-service.ts
````typescript
/**
 * AccountProfileService — Composition root for account-profile subdomain.
 *
 * Wires the legacy account data-source (from the account subdomain bridge)
 * into domain-port-conforming adapters and use cases. This keeps infrastructure
 * wiring inside the infrastructure layer, off the api boundary.
 */

import {
	GetAccountProfileUseCase,
	SubscribeAccountProfileUseCase,
	UpdateAccountProfileUseCase,
} from "../application";
import {
	createLegacyAccountProfileCommandRepository,
	createLegacyAccountProfileQueryRepository,
	type LegacyAccountProfileDataSource,
} from "./create-legacy-account-profile-application.adapter";
import type { AccountProfile, Unsubscribe } from "../domain";
import type { UpdateAccountProfileInput } from "../application";
import type { CommandResult } from "@shared-types";

// ── Lazy singletons ──────────────────────────────────────────────────────

let _legacyDataSource: LegacyAccountProfileDataSource | undefined;
let _getAccountProfileUseCase: GetAccountProfileUseCase | undefined;
let _subscribeAccountProfileUseCase: SubscribeAccountProfileUseCase | undefined;
let _updateAccountProfileUseCase: UpdateAccountProfileUseCase | undefined;

export function configureLegacyAccountProfileDataSource(
	legacyDataSource: LegacyAccountProfileDataSource,
): void {
	_legacyDataSource = legacyDataSource;
	_getAccountProfileUseCase = undefined;
	_subscribeAccountProfileUseCase = undefined;
	_updateAccountProfileUseCase = undefined;
}

function getLegacyDataSource(): LegacyAccountProfileDataSource {
	if (_legacyDataSource) {
		return _legacyDataSource;
	}

	throw new Error(
		"LegacyAccountProfileDataSource is not configured. Configure it in account-profile/api composition root.",
	);
}

function getGetAccountProfileUseCase(): GetAccountProfileUseCase {
	if (_getAccountProfileUseCase) {
		return _getAccountProfileUseCase;
	}

	const repository = createLegacyAccountProfileQueryRepository(getLegacyDataSource());
	_getAccountProfileUseCase = new GetAccountProfileUseCase(repository);
	return _getAccountProfileUseCase;
}

function getSubscribeAccountProfileUseCase(): SubscribeAccountProfileUseCase {
	if (_subscribeAccountProfileUseCase) {
		return _subscribeAccountProfileUseCase;
	}

	const repository = createLegacyAccountProfileQueryRepository(getLegacyDataSource());
	_subscribeAccountProfileUseCase = new SubscribeAccountProfileUseCase(repository);
	return _subscribeAccountProfileUseCase;
}

function getUpdateAccountProfileUseCase(): UpdateAccountProfileUseCase {
	if (_updateAccountProfileUseCase) {
		return _updateAccountProfileUseCase;
	}

	const repository = createLegacyAccountProfileCommandRepository(getLegacyDataSource());
	_updateAccountProfileUseCase = new UpdateAccountProfileUseCase(repository);
	return _updateAccountProfileUseCase;
}

// ── Public service API ───────────────────────────────────────────────────

export async function getAccountProfile(actorId: string): Promise<AccountProfile | null> {
	return getGetAccountProfileUseCase().execute(actorId);
}

export function subscribeToAccountProfile(
	actorId: string,
	onUpdate: (profile: AccountProfile | null) => void,
): Unsubscribe {
	return getSubscribeAccountProfileUseCase().execute(actorId, onUpdate);
}

export async function updateAccountProfile(
	actorId: string,
	input: UpdateAccountProfileInput,
): Promise<CommandResult> {
	return getUpdateAccountProfileUseCase().execute(actorId, input);
}
````

## File: modules/platform/subdomains/account/application/services/resolve-active-account.ts
````typescript
import type { AccountEntity } from "../../domain/entities/Account";

export type AccountBootstrapPhase = "idle" | "seeded" | "hydrated";

interface PersonalAccountIdentity {
  readonly id: string;
  readonly name: string;
  readonly email: string;
}

export type SelectableActiveAccount = AccountEntity | PersonalAccountIdentity;

export interface ResolveActiveAccountInput {
  readonly currentActiveAccount: SelectableActiveAccount | null;
  readonly accounts: Record<string, AccountEntity>;
  readonly personalAccount: PersonalAccountIdentity;
  readonly preferredActiveAccountId?: string | null;
  readonly bootstrapPhase: AccountBootstrapPhase;
}

/**
 * Resolve the next active account from current selection, persisted preference,
 * and latest account snapshot while preserving optimistic bootstrap behavior.
 */
export function resolveActiveAccount(input: ResolveActiveAccountInput): SelectableActiveAccount {
  const {
    currentActiveAccount,
    accounts,
    personalAccount,
    preferredActiveAccountId,
    bootstrapPhase,
  } = input;

  const validIds = new Set([personalAccount.id, ...Object.keys(accounts)]);
  const currentActiveId = currentActiveAccount?.id;
  let currentActive: SelectableActiveAccount | null = null;

  if (currentActiveId && validIds.has(currentActiveId)) {
    currentActive = currentActiveId === personalAccount.id ? personalAccount : accounts[currentActiveId] ?? null;
  }

  let preferredActive: SelectableActiveAccount | null = null;
  if (preferredActiveAccountId && validIds.has(preferredActiveAccountId)) {
    preferredActive =
      preferredActiveAccountId === personalAccount.id
        ? personalAccount
        : accounts[preferredActiveAccountId] ?? null;
  }

  if (
    preferredActive &&
    (!currentActive || bootstrapPhase === "seeded" || currentActive.id === personalAccount.id)
  ) {
    return preferredActive;
  }

  return currentActive ?? personalAccount;
}
````

## File: modules/platform/subdomains/entitlement/application/use-cases/entitlement.use-cases.ts
````typescript
/**
 * Entitlement Use Cases — pure application logic.
 * All cross-domain dependencies are injected via ports.
 */
import { commandSuccess, commandFailureFrom, type CommandResult } from "@shared-types";
import { EntitlementGrant } from "../../domain/aggregates/EntitlementGrant";
import type { EntitlementGrantRepository } from "../../domain/repositories/EntitlementGrantRepository";

// ─── Grant Entitlement ────────────────────────────────────────────────────────

export class GrantEntitlementUseCase {
  constructor(private readonly repo: EntitlementGrantRepository) {}

  async execute(input: {
    contextId: string;
    featureKey: string;
    quota?: number | null;
    expiresAt?: string | null;
  }): Promise<CommandResult> {
    try {
      const id = crypto.randomUUID();
      const grant = EntitlementGrant.create(id, input);
      await this.repo.save(grant.getSnapshot());
      return commandSuccess(id, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "GRANT_ENTITLEMENT_FAILED",
        err instanceof Error ? err.message : "Failed to grant entitlement",
      );
    }
  }
}

// ─── Suspend Entitlement ──────────────────────────────────────────────────────

export class SuspendEntitlementUseCase {
  constructor(private readonly repo: EntitlementGrantRepository) {}

  async execute(entitlementId: string): Promise<CommandResult> {
    try {
      const snapshot = await this.repo.findById(entitlementId);
      if (!snapshot) {
        return commandFailureFrom("ENTITLEMENT_NOT_FOUND", `Entitlement ${entitlementId} not found`);
      }
      const grant = EntitlementGrant.reconstitute(snapshot);
      grant.suspend();
      await this.repo.update(grant.getSnapshot());
      return commandSuccess(entitlementId, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "SUSPEND_ENTITLEMENT_FAILED",
        err instanceof Error ? err.message : "Failed to suspend entitlement",
      );
    }
  }
}

// ─── Revoke Entitlement ───────────────────────────────────────────────────────

export class RevokeEntitlementUseCase {
  constructor(private readonly repo: EntitlementGrantRepository) {}

  async execute(entitlementId: string): Promise<CommandResult> {
    try {
      const snapshot = await this.repo.findById(entitlementId);
      if (!snapshot) {
        return commandFailureFrom("ENTITLEMENT_NOT_FOUND", `Entitlement ${entitlementId} not found`);
      }
      const grant = EntitlementGrant.reconstitute(snapshot);
      grant.revoke();
      await this.repo.update(grant.getSnapshot());
      return commandSuccess(entitlementId, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "REVOKE_ENTITLEMENT_FAILED",
        err instanceof Error ? err.message : "Failed to revoke entitlement",
      );
    }
  }
}

// ─── Resolve Entitlements (query-style) ───────────────────────────────────────

export class ResolveEntitlementsUseCase {
  constructor(private readonly repo: EntitlementGrantRepository) {}

  async execute(contextId: string): Promise<CommandResult> {
    try {
      const snapshots = await this.repo.findByContextId(contextId);
      const active = snapshots.filter((s) => s.status === "active");
      return commandSuccess(JSON.stringify(active), Date.now());
    } catch (err) {
      return commandFailureFrom(
        "RESOLVE_ENTITLEMENTS_FAILED",
        err instanceof Error ? err.message : "Failed to resolve entitlements",
      );
    }
  }
}

// ─── Check Feature Entitlement ────────────────────────────────────────────────

export class CheckFeatureEntitlementUseCase {
  constructor(private readonly repo: EntitlementGrantRepository) {}

  async execute(contextId: string, featureKey: string): Promise<CommandResult> {
    try {
      const snapshot = await this.repo.findActiveByContextAndFeature(contextId, featureKey);
      return commandSuccess(JSON.stringify({ entitled: snapshot !== null, snapshot }), Date.now());
    } catch (err) {
      return commandFailureFrom(
        "CHECK_ENTITLEMENT_FAILED",
        err instanceof Error ? err.message : "Failed to check entitlement",
      );
    }
  }
}
````

## File: modules/platform/subdomains/organization/infrastructure/organization-service.ts
````typescript
/**
 * OrganizationService — Composition root for organization use cases.
 */

import { FirebaseOrganizationRepository } from "./firebase/FirebaseOrganizationRepository";
import { FirebaseOrgPolicyRepository } from "./firebase/FirebaseOrgPolicyRepository";
import {
  CreateOrganizationUseCase,
  CreateOrganizationWithTeamUseCase,
  UpdateOrganizationSettingsUseCase,
  DeleteOrganizationUseCase,
} from "../application/use-cases/organization-lifecycle.use-cases";
import {
  InviteMemberUseCase,
  RecruitMemberUseCase,
  RemoveMemberUseCase,
  UpdateMemberRoleUseCase,
} from "../application/use-cases/organization-member.use-cases";
import {
  CreateTeamUseCase,
  DeleteTeamUseCase,
  UpdateTeamMembersUseCase,
} from "../application/use-cases/organization-team.use-cases";
import type { IOrganizationTeamPort } from "../domain/ports/IOrganizationTeamPort";
import {
  CreatePartnerGroupUseCase,
  SendPartnerInviteUseCase,
  DismissPartnerMemberUseCase,
} from "../application/use-cases/organization-partner.use-cases";
import {
  CreateOrgPolicyUseCase,
  UpdateOrgPolicyUseCase,
  DeleteOrgPolicyUseCase,
} from "../application/use-cases/organization-policy.use-cases";
import type {
  CreateOrganizationCommand,
  UpdateOrganizationSettingsCommand,
  InviteMemberInput,
  UpdateMemberRoleInput,
  CreateOrgPolicyInput,
  UpdateOrgPolicyInput,
} from "../domain/entities/Organization";
import type { CreateTeamInput } from "../domain/entities/Organization";
import type { CommandResult } from "@shared-types";

let _orgRepo: FirebaseOrganizationRepository | undefined;
let _policyRepo: FirebaseOrgPolicyRepository | undefined;
let _teamPort: IOrganizationTeamPort | undefined;
let _teamPortFactory: (() => IOrganizationTeamPort) | undefined;

export function configureOrganizationTeamPortFactory(
  factory: () => IOrganizationTeamPort,
): void {
  _teamPortFactory = factory;
  _teamPort = undefined;
}

function getOrgRepo(): FirebaseOrganizationRepository {
  if (!_orgRepo) _orgRepo = new FirebaseOrganizationRepository();
  return _orgRepo;
}

function getPolicyRepo(): FirebaseOrgPolicyRepository {
  if (!_policyRepo) _policyRepo = new FirebaseOrgPolicyRepository();
  return _policyRepo;
}

function getTeamPort(): IOrganizationTeamPort {
  if (!_teamPortFactory) {
    throw new Error("Organization team port factory is not configured.");
  }
  if (!_teamPort) _teamPort = _teamPortFactory();
  return _teamPort;
}

export const organizationService = {
  createOrganization: (cmd: CreateOrganizationCommand): Promise<CommandResult> =>
    new CreateOrganizationUseCase(getOrgRepo()).execute(cmd),

  createOrganizationWithTeam: (
    cmd: CreateOrganizationCommand,
    teamName: string,
    teamType: "internal" | "external" = "internal",
  ): Promise<CommandResult> =>
    new CreateOrganizationWithTeamUseCase(getOrgRepo()).execute(cmd, teamName, teamType),

  updateSettings: (cmd: UpdateOrganizationSettingsCommand): Promise<CommandResult> =>
    new UpdateOrganizationSettingsUseCase(getOrgRepo()).execute(cmd),

  deleteOrganization: (orgId: string): Promise<CommandResult> =>
    new DeleteOrganizationUseCase(getOrgRepo()).execute(orgId),

  inviteMember: (input: InviteMemberInput): Promise<CommandResult> =>
    new InviteMemberUseCase(getOrgRepo()).execute(input),

  recruitMember: (orgId: string, memberId: string, name: string, email: string): Promise<CommandResult> =>
    new RecruitMemberUseCase(getOrgRepo()).execute(orgId, memberId, name, email),

  removeMember: (orgId: string, memberId: string): Promise<CommandResult> =>
    new RemoveMemberUseCase(getOrgRepo()).execute(orgId, memberId),

  updateMemberRole: (input: UpdateMemberRoleInput): Promise<CommandResult> =>
    new UpdateMemberRoleUseCase(getOrgRepo()).execute(input),

  createTeam: (input: CreateTeamInput): Promise<CommandResult> =>
    new CreateTeamUseCase(getTeamPort()).execute(input),

  deleteTeam: (orgId: string, teamId: string): Promise<CommandResult> =>
    new DeleteTeamUseCase(getTeamPort()).execute(orgId, teamId),

  updateTeamMembers: (orgId: string, teamId: string, memberId: string, action: "add" | "remove"): Promise<CommandResult> =>
    new UpdateTeamMembersUseCase(getTeamPort()).execute(orgId, teamId, memberId, action),

  createPartnerGroup: (orgId: string, groupName: string): Promise<CommandResult> =>
    new CreatePartnerGroupUseCase(getOrgRepo()).execute(orgId, groupName),

  sendPartnerInvite: (orgId: string, teamId: string, email: string): Promise<CommandResult> =>
    new SendPartnerInviteUseCase(getOrgRepo()).execute(orgId, teamId, email),

  dismissPartnerMember: (orgId: string, teamId: string, memberId: string): Promise<CommandResult> =>
    new DismissPartnerMemberUseCase(getOrgRepo()).execute(orgId, teamId, memberId),

  createOrgPolicy: (input: CreateOrgPolicyInput): Promise<CommandResult> =>
    new CreateOrgPolicyUseCase(getPolicyRepo()).execute(input),

  updateOrgPolicy: (policyId: string, data: UpdateOrgPolicyInput): Promise<CommandResult> =>
    new UpdateOrgPolicyUseCase(getPolicyRepo()).execute(policyId, data),

  deleteOrgPolicy: (policyId: string): Promise<CommandResult> =>
    new DeleteOrgPolicyUseCase(getPolicyRepo()).execute(policyId),
};

/**
 * OrganizationQueryService — read-model queries for client-side data.
 * Composition root: wires Firebase repos for queries; interfaces/ must use this
 * via the subdomain api/ boundary instead of importing infrastructure directly.
 */
export const organizationQueryService = {
  getMembers: (organizationId: string) => getOrgRepo().getMembers(organizationId),
  getTeams: (organizationId: string) => getOrgRepo().getTeams(organizationId),
  getOrgPolicies: (orgId: string) => getPolicyRepo().getPolicies(orgId),
};
````

## File: modules/platform/subdomains/platform-config/application/index.ts
````typescript
// Purpose: Application layer for platform-config subdomain.

export {
	SHELL_ACCOUNT_SECTION_MATCHERS,
	SHELL_ACCOUNT_NAV_ITEMS,
	SHELL_ORGANIZATION_MANAGEMENT_ITEMS,
	SHELL_SECTION_LABELS,
	SHELL_RAIL_CATALOG_ITEMS,
	SHELL_CONTEXT_SECTION_CONFIG,
	SHELL_MOBILE_NAV_ITEMS,
	SHELL_ORG_PRIMARY_NAV_ITEMS,
	SHELL_ORG_SECONDARY_NAV_ITEMS,
	isExactOrChildPath,
	listShellRailCatalogItems,
	resolveShellBreadcrumbLabel,
	resolveShellNavSection,
	resolveShellPageTitle,
	type ShellNavItem,
	type ShellNavSection,
	type ShellRailCatalogItem,
	type ShellContextSectionConfig,
} from "./services/shell-navigation-catalog";
````

## File: modules/platform/subdomains/platform-config/application/services/shell-navigation-catalog.ts
````typescript
// ── Types ──────────────────────────────────────────────────────────────────────

export type ShellNavSection =
  | "workspace"
  | "knowledge"
  | "knowledge-base"
  | "knowledge-database"
  | "source"
  | "notebook"
  | "ai-chat"
  | "account"
  | "organization"
  | "other";

export interface ShellNavItem {
  readonly id: string;
  readonly label: string;
  readonly href: string;
}

export interface ShellRailCatalogItem {
  readonly id: string;
  readonly href: string;
  readonly label: string;
  /** If true, this item is only visible to organization accounts. */
  readonly requiresOrganization: boolean;
  /** Route prefix for active-state matching. When absent, defaults to href. */
  readonly activeRoutePrefix?: string;
}

export interface ShellContextSectionConfig {
  readonly title: string;
  readonly items: readonly { href: string; label: string }[];
}

// ── Route-matching utility ────────────────────────────────────────────────────

export function isExactOrChildPath(targetPath: string, pathname: string): boolean {
  return pathname === targetPath || pathname.startsWith(`${targetPath}/`);
}

// ── Account section matchers ──────────────────────────────────────────────────

export const SHELL_ACCOUNT_SECTION_MATCHERS = [
  "/organization/daily",
  "/organization/schedule",
  "/organization/audit",
] as const;

// ── Route titles & breadcrumb labels ──────────────────────────────────────────

const ROUTE_TITLES: Record<string, string> = {
  "/organization": "組織治理",
  "/organization/daily": "帳號 · 每日",
  "/organization/schedule": "帳號 · 排程",
  "/organization/schedule/dispatcher": "帳號 · 調度台",
  "/organization/audit": "帳號 · 稽核",
  "/workspace": "工作區中心",
  "/knowledge": "知識中心",
  "/knowledge/pages": "知識 · 頁面",
  "/knowledge/block-editor": "知識 · 區塊編輯器",
  "/knowledge-base/articles": "知識庫 · 文章",
  "/knowledge-database/databases": "知識資料庫 · 資料庫",
  "/source/documents": "來源 · 文件",
  "/source/libraries": "來源 · 資料庫",
  "/notebook/rag-query": "筆記本 · 問答 / 引用",
  "/ai-chat": "AI 對話",
  "/dev-tools": "開發工具",
};

const BREADCRUMB_LABELS: Record<string, string> = {
  organization: "組織",
  workspace: "工作區",
  wiki: "Account Wiki",
  "rag-query": "Ask / Cite",
  documents: "文件",
  libraries: "Libraries",
  pages: "頁面",
  "pages-dnd": "頁面 (DnD)",
  "block-editor": "區塊編輯器",
  "rag-reindex": "RAG 重新索引",
  "ai-chat": "Notebook",
  "dev-tools": "開發工具",
  namespaces: "命名空間",
  members: "成員",
  teams: "團隊",
  permissions: "權限",
  workspaces: "工作區清單",
  schedule: "排程",
  daily: "每日",
  audit: "稽核",
};

// ── Organization management items ─────────────────────────────────────────────

export const SHELL_ORGANIZATION_MANAGEMENT_ITEMS: readonly ShellNavItem[] = [];

// ── Account nav items ─────────────────────────────────────────────────────────

export const SHELL_ACCOUNT_NAV_ITEMS: readonly ShellNavItem[] = [
  { id: "schedule", label: "排程", href: "/organization/schedule" },
  { id: "dispatcher", label: "調度台", href: "/organization/schedule/dispatcher" },
  { id: "daily", label: "每日", href: "/organization/daily" },
  { id: "audit", label: "稽核", href: "/organization/audit" },
] as const;

// ── Section labels ────────────────────────────────────────────────────────────

export const SHELL_SECTION_LABELS: Record<ShellNavSection, string> = {
  workspace: "工作區",
  knowledge: "知識",
  "knowledge-base": "知識庫",
  "knowledge-database": "知識資料庫",
  source: "來源",
  notebook: "筆記本",
  "ai-chat": "AI 對話",
  account: "帳號",
  organization: "組織",
  other: "導覽",
};

// ── Rail catalog ──────────────────────────────────────────────────────────────

export const SHELL_RAIL_CATALOG_ITEMS: readonly ShellRailCatalogItem[] = [
  { id: "workspace", href: "/workspace", label: "工作區中心", requiresOrganization: false },
  { id: "org-members", href: "/organization/members", label: "成員", requiresOrganization: true, activeRoutePrefix: "/organization/members" },
  { id: "org-teams", href: "/organization/teams", label: "團隊", requiresOrganization: true, activeRoutePrefix: "/organization/teams" },
  { id: "org-daily", href: "/organization/daily", label: "每日", requiresOrganization: true, activeRoutePrefix: "/organization/daily" },
  { id: "org-schedule", href: "/organization/schedule", label: "排程", requiresOrganization: true, activeRoutePrefix: "/organization/schedule" },
  { id: "org-audit", href: "/organization/audit", label: "稽核", requiresOrganization: true, activeRoutePrefix: "/organization/audit" },
  { id: "org-permissions", href: "/organization/permissions", label: "權限", requiresOrganization: true, activeRoutePrefix: "/organization/permissions" },
  { id: "dev-tools", href: "/dev-tools", label: "開發工具", requiresOrganization: false },
];

export function listShellRailCatalogItems(isOrganization: boolean): readonly ShellRailCatalogItem[] {
  return SHELL_RAIL_CATALOG_ITEMS.filter(
    (item) => !item.requiresOrganization || isOrganization,
  );
}

// ── Context section config ────────────────────────────────────────────────────

export const SHELL_CONTEXT_SECTION_CONFIG: Partial<
  Record<ShellNavSection, ShellContextSectionConfig>
> = {
  "knowledge-base": { title: "知識庫", items: [{ href: "/knowledge-base/articles", label: "文章" }] },
  "knowledge-database": { title: "資料庫", items: [{ href: "/knowledge-database/databases", label: "資料庫" }] },
  source: { title: "來源文件", items: [{ href: "/source/libraries", label: "資料庫" }] },
  notebook: { title: "筆記本", items: [{ href: "/notebook/rag-query", label: "問答 / 引用" }] },
  "ai-chat": { title: "筆記本 / AI", items: [{ href: "/ai-chat", label: "筆記本介面" }] },
};

// ── Mobile & organization nav items ───────────────────────────────────────────

export const SHELL_MOBILE_NAV_ITEMS: readonly ShellNavItem[] = [
  { id: "workspace", label: "工作區", href: "/workspace" },
];

export const SHELL_ORG_PRIMARY_NAV_ITEMS: readonly ShellNavItem[] = [
  { id: "members", label: "成員", href: "/organization/members" },
  { id: "teams", label: "團隊", href: "/organization/teams" },
  { id: "permissions", label: "權限", href: "/organization/permissions" },
  { id: "workspaces", label: "工作區", href: "/organization/workspaces" },
];

export const SHELL_ORG_SECONDARY_NAV_ITEMS: readonly ShellNavItem[] = [
  { id: "schedule", label: "排程", href: "/organization/schedule" },
  { id: "daily", label: "每日", href: "/organization/daily" },
  { id: "audit", label: "稽核", href: "/organization/audit" },
];

// ── Section resolvers ─────────────────────────────────────────────────────────

export function resolveShellNavSection(pathname: string): ShellNavSection {
  if (pathname.startsWith("/workspace")) return "workspace";
  if (pathname.startsWith("/knowledge-base")) return "knowledge-base";
  if (pathname.startsWith("/knowledge-database")) return "knowledge-database";
  if (pathname.startsWith("/knowledge")) return "knowledge";
  if (pathname.startsWith("/source")) return "source";
  if (pathname.startsWith("/notebook")) return "notebook";
  if (pathname.startsWith("/ai-chat")) return "ai-chat";
  if (
    SHELL_ACCOUNT_SECTION_MATCHERS.some(
      (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
    )
  ) {
    return "account";
  }
  if (pathname.startsWith("/organization")) return "organization";
  return "other";
}

export function resolveShellPageTitle(pathname: string): string {
  return ROUTE_TITLES[pathname] ?? "工作區";
}

export function resolveShellBreadcrumbLabel(segment: string): string {
  return BREADCRUMB_LABELS[segment] ?? segment;
}
````

## File: modules/platform/subdomains/subscription/application/use-cases/subscription.use-cases.ts
````typescript
/**
 * Subscription Use Cases — pure application logic.
 */
import { commandSuccess, commandFailureFrom, type CommandResult } from "@shared-types";
import { Subscription } from "../../domain/aggregates/Subscription";
import type { SubscriptionRepository } from "../../domain/repositories/SubscriptionRepository";
import type { BillingCycle } from "../../domain/value-objects/BillingCycle";

// ─── Activate Subscription ────────────────────────────────────────────────────

export class ActivateSubscriptionUseCase {
  constructor(private readonly repo: SubscriptionRepository) {}

  async execute(input: {
    contextId: string;
    planCode: string;
    billingCycle: BillingCycle;
    currentPeriodEnd?: string | null;
  }): Promise<CommandResult> {
    try {
      const id = crypto.randomUUID();
      const sub = Subscription.create(id, input);
      await this.repo.save(sub.getSnapshot());
      return commandSuccess(id, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "ACTIVATE_SUBSCRIPTION_FAILED",
        err instanceof Error ? err.message : "Failed to activate subscription",
      );
    }
  }
}

// ─── Cancel Subscription ──────────────────────────────────────────────────────

export class CancelSubscriptionUseCase {
  constructor(private readonly repo: SubscriptionRepository) {}

  async execute(subscriptionId: string): Promise<CommandResult> {
    try {
      const snapshot = await this.repo.findById(subscriptionId);
      if (!snapshot) {
        return commandFailureFrom("SUBSCRIPTION_NOT_FOUND", `Subscription ${subscriptionId} not found`);
      }
      const sub = Subscription.reconstitute(snapshot);
      sub.cancel();
      await this.repo.update(sub.getSnapshot());
      return commandSuccess(subscriptionId, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "CANCEL_SUBSCRIPTION_FAILED",
        err instanceof Error ? err.message : "Failed to cancel subscription",
      );
    }
  }
}

// ─── Renew Subscription ───────────────────────────────────────────────────────

export class RenewSubscriptionUseCase {
  constructor(private readonly repo: SubscriptionRepository) {}

  async execute(subscriptionId: string, newPeriodEnd: string): Promise<CommandResult> {
    try {
      const snapshot = await this.repo.findById(subscriptionId);
      if (!snapshot) {
        return commandFailureFrom("SUBSCRIPTION_NOT_FOUND", `Subscription ${subscriptionId} not found`);
      }
      const sub = Subscription.reconstitute(snapshot);
      sub.renew(newPeriodEnd);
      await this.repo.update(sub.getSnapshot());
      return commandSuccess(subscriptionId, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "RENEW_SUBSCRIPTION_FAILED",
        err instanceof Error ? err.message : "Failed to renew subscription",
      );
    }
  }
}

// ─── Get Active Subscription (query-style) ───────────────────────────────────

export class GetActiveSubscriptionUseCase {
  constructor(private readonly repo: SubscriptionRepository) {}

  async execute(contextId: string): Promise<CommandResult> {
    try {
      const snapshot = await this.repo.findActiveByContextId(contextId);
      return commandSuccess(JSON.stringify(snapshot), Date.now());
    } catch (err) {
      return commandFailureFrom(
        "GET_ACTIVE_SUBSCRIPTION_FAILED",
        err instanceof Error ? err.message : "Failed to get active subscription",
      );
    }
  }
}

// ─── Mark Past Due ────────────────────────────────────────────────────────────

export class MarkSubscriptionPastDueUseCase {
  constructor(private readonly repo: SubscriptionRepository) {}

  async execute(subscriptionId: string): Promise<CommandResult> {
    try {
      const snapshot = await this.repo.findById(subscriptionId);
      if (!snapshot) {
        return commandFailureFrom("SUBSCRIPTION_NOT_FOUND", `Subscription ${subscriptionId} not found`);
      }
      const sub = Subscription.reconstitute(snapshot);
      sub.markPastDue();
      await this.repo.update(sub.getSnapshot());
      return commandSuccess(subscriptionId, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "MARK_PAST_DUE_FAILED",
        err instanceof Error ? err.message : "Failed to mark subscription past due",
      );
    }
  }
}
````

## File: modules/platform/interfaces/web/providers/ShellAppContext.ts
````typescript
"use client";

/**
 * ShellAppContext — platform/interfaces/web layer
 *
 * Context definition, types, and the useApp() hook.
 * Owns NO workspace-module dependencies — workspace state is managed by
 * WorkspaceContextProvider in the workspace bounded context.
 *
 * The AppProvider that creates this context lives in app/(shell)/ where
 * cross-module composition is allowed.
 */

import {
  createContext,
  useContext,
  type Dispatch,
} from "react";

import type { AccountEntity } from "../../../subdomains/account/api";
import type { ActiveAccount } from "../../../api/contracts";

// ── State ────────────────────────────────────────────────────────────────────

export interface AppState {
  /** All organization accounts visible to the signed-in user. */
  accounts: Record<string, AccountEntity>;
  /** True once the first Firestore snapshot has been received. */
  accountsHydrated: boolean;
  /** Bootstrap phase for optimistic seeding. */
  bootstrapPhase: "idle" | "seeded" | "hydrated";
  /** Currently selected account (personal user account or an organization). */
  activeAccount: ActiveAccount | null;
}

export type AppAction =
  | {
      type: "SEED_ACTIVE_ACCOUNT";
      payload: { user: { id: string; name: string; email: string } };
    }
  | {
      type: "SET_ACCOUNTS";
      payload: {
        accounts: Record<string, AccountEntity>;
        user: { id: string; name: string; email: string };
        preferredActiveAccountId?: string | null;
      };
    }
  | { type: "SET_ACTIVE_ACCOUNT"; payload: ActiveAccount | null }
  | { type: "RESET_STATE" };

export interface AppContextValue {
  state: AppState;
  dispatch: Dispatch<AppAction>;
}

export const AppContext = createContext<AppContextValue | null>(null);

// ── Initial State ────────────────────────────────────────────────────────────

export const APP_INITIAL_STATE: AppState = {
  accounts: {},
  accountsHydrated: false,
  bootstrapPhase: "idle",
  activeAccount: null,
};

// ── Hook ─────────────────────────────────────────────────────────────────────

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
````

## File: modules/platform/interfaces/web/providers/ShellAppProvider.tsx
````typescript
"use client";

/**
 * shell-app-provider.tsx — platform/interfaces/web layer
 * Hosts the app-level active-account lifecycle and exposes useApp().
 *
 * Responsibilities:
 *  1. Watch AuthProvider state for sign-in / sign-out events
 *  2. Subscribe to the user's visible accounts (orgs) via account module queries
 *  3. Maintain activeAccount selection (default: personal user account from auth)
 *  4. Expose state + dispatch via AppContext
 */

import {
  createContext,
  useReducer,
  useEffect,
  useContext,
  type Dispatch,
  type ReactNode,
} from "react";

import {
  resolveActiveAccount,
  subscribeToAccountsForUser,
  type AccountEntity,
} from "../../../subdomains/account/api";
import { type AuthUser, useAuth } from "../../../subdomains/identity/api";
import {
  subscribeToWorkspacesForAccount,
  getWorkspaceStorageKey,
  toWorkspaceMap,
  type WorkspaceEntity,
} from "@/modules/workspace/api";
import type { ActiveAccount } from "@/modules/platform/api/contracts";
export type { ActiveAccount };

export interface AppState {
  /** All organization accounts visible to the signed-in user. */
  accounts: Record<string, AccountEntity>;
  /** True once the first Firestore snapshot has been received. */
  accountsHydrated: boolean;
  /** Bootstrap phase for optimistic seeding. */
  bootstrapPhase: "idle" | "seeded" | "hydrated";
  /** Currently selected account (personal user account or an organization). */
  activeAccount: ActiveAccount | null;
  /** Currently selected workspace context under the active account. */
  activeWorkspaceId: string | null;
  /** Workspaces visible under the active account (single source for shell UI). */
  workspaces: Record<string, WorkspaceEntity>;
  /** True once the first active-account workspace snapshot has been received. */
  workspacesHydrated: boolean;
}

export type AppAction =
  | {
      type: "SEED_ACTIVE_ACCOUNT";
      payload: { user: AuthUser };
    }
  | {
      type: "SET_ACCOUNTS";
      payload: {
        accounts: Record<string, AccountEntity>;
        user: AuthUser;
        preferredActiveAccountId?: string | null;
      };
    }
  | {
      type: "SET_WORKSPACES";
      payload: {
        workspaces: Record<string, WorkspaceEntity>;
        hydrated: boolean;
      };
    }
  | { type: "SET_ACTIVE_ACCOUNT"; payload: ActiveAccount | null }
  | { type: "SET_ACTIVE_WORKSPACE"; payload: string | null }
  | { type: "RESET_STATE" };

export interface AppContextValue {
  state: AppState;
  dispatch: Dispatch<AppAction>;
}

export const AppContext = createContext<AppContextValue | null>(null);

// -- Initial State -----------------------------------------------------------

const LAST_ACTIVE_ACCOUNT_STORAGE_KEY = "xuanwu_last_active_account";

const initialState: AppState = {
  accounts: {},
  accountsHydrated: false,
  bootstrapPhase: "idle",
  activeAccount: null,
  activeWorkspaceId: null,
  workspaces: {},
  workspacesHydrated: false,
};

// -- Reducer -----------------------------------------------------------------

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SEED_ACTIVE_ACCOUNT":
      return {
        ...state,
        accounts: {},
        accountsHydrated: false,
        bootstrapPhase: "seeded",
        activeAccount: action.payload.user,
        activeWorkspaceId: null,
      };
    case "SET_ACCOUNTS": {
      const { accounts, user, preferredActiveAccountId } = action.payload;
      return {
        ...state,
        accounts,
        accountsHydrated: true,
        bootstrapPhase: "hydrated",
        activeAccount: resolveActiveAccount({
          currentActiveAccount: state.activeAccount,
          accounts,
          personalAccount: user,
          preferredActiveAccountId,
          bootstrapPhase: state.bootstrapPhase,
        }),
      };
    }
    case "SET_WORKSPACES":
      return {
        ...state,
        workspaces: action.payload.workspaces,
        workspacesHydrated: action.payload.hydrated,
      };
    case "SET_ACTIVE_ACCOUNT":
      if (state.activeAccount?.id === action.payload?.id) return state;
      return {
        ...state,
        activeAccount: action.payload,
        activeWorkspaceId: null,
        workspaces: {},
        workspacesHydrated: false,
      };
    case "SET_ACTIVE_WORKSPACE":
      if (state.activeWorkspaceId === action.payload) return state;
      return { ...state, activeWorkspaceId: action.payload };
    case "RESET_STATE":
      return initialState;
    default:
      return state;
  }
}

// -- Provider ----------------------------------------------------------------

export function AppProvider({ children }: { children: ReactNode }) {
  const { state: authState } = useAuth();
  const { user, status } = authState;
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    if (status === "initializing") return;

    if (!user) {
      dispatch({ type: "RESET_STATE" });
      return;
    }

    dispatch({ type: "SEED_ACTIVE_ACCOUNT", payload: { user } });
    const preferredActiveAccountId =
      typeof window === "undefined"
        ? null
        : window.localStorage.getItem(LAST_ACTIVE_ACCOUNT_STORAGE_KEY);

    const unsubscribe = subscribeToAccountsForUser(user.id, (accounts) => {
      dispatch({
        type: "SET_ACCOUNTS",
        payload: { accounts, user, preferredActiveAccountId },
      });
    });

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, user?.id]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const activeAccountId = state.activeAccount?.id;

    if (!user || !activeAccountId) {
      window.localStorage.removeItem(LAST_ACTIVE_ACCOUNT_STORAGE_KEY);
      return;
    }

    window.localStorage.setItem(LAST_ACTIVE_ACCOUNT_STORAGE_KEY, activeAccountId);
  }, [state.activeAccount?.id, user]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const activeAccountId = state.activeAccount?.id;
    if (!activeAccountId) {
      dispatch({ type: "SET_ACTIVE_WORKSPACE", payload: null });
      return;
    }

    const storedWorkspaceId = window.localStorage.getItem(getWorkspaceStorageKey(activeAccountId));
    dispatch({ type: "SET_ACTIVE_WORKSPACE", payload: storedWorkspaceId || null });
  }, [state.activeAccount?.id]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const activeAccountId = state.activeAccount?.id;
    if (!activeAccountId) return;

    const storageKey = getWorkspaceStorageKey(activeAccountId);
    if (!state.activeWorkspaceId) {
      window.localStorage.removeItem(storageKey);
      return;
    }

    window.localStorage.setItem(storageKey, state.activeWorkspaceId);
  }, [state.activeAccount?.id, state.activeWorkspaceId]);

  useEffect(() => {
    const activeAccountId = state.activeAccount?.id;
    if (!activeAccountId) {
      dispatch({
        type: "SET_WORKSPACES",
        payload: { workspaces: {}, hydrated: true },
      });
      return;
    }

    dispatch({
      type: "SET_WORKSPACES",
      payload: { workspaces: {}, hydrated: false },
    });

    const unsubscribe = subscribeToWorkspacesForAccount(activeAccountId, (workspaces) => {
      dispatch({
        type: "SET_WORKSPACES",
        payload: {
          workspaces: toWorkspaceMap(workspaces),
          hydrated: true,
        },
      });
    });

    return () => unsubscribe();
  }, [state.activeAccount?.id]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

// -- Hook --------------------------------------------------------------------

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
````

## File: modules/platform/interfaces/web/shell/sidebar/ShellSidebarBody.tsx
````typescript
"use client";

import Link from "next/link";

import { KnowledgeSidebarSection } from "@/modules/notion/api";
import {
  WorkspaceSectionContent,
  type NavPreferences,
  type SidebarLocaleBundle,
} from "@/modules/workspace/api";
import { SHELL_CONTEXT_SECTION_CONFIG } from "@/modules/platform/subdomains/platform-config/api";

import {
  type NavSection,
  sidebarItemClass,
  sidebarSectionTitleClass,
} from "../navigation/data/ShellSidebarNavData";
import { ShellContextNavSection } from "./ShellContextNavSection";

interface NavItem {
  id: string;
  label: string;
  href: string;
}

interface WorkspaceLink {
  id: string;
  name: string;
  href: string;
}

interface ShellSidebarBodyProps {
  section: NavSection;
  isActiveRoute: (href: string) => boolean;
  activeAccountId: string | null;
  showAccountManagement: boolean;
  visibleAccountItems: readonly NavItem[];
  visibleOrganizationManagementItems: readonly NavItem[];
  workspacePathId: string | null;
  navPrefs: NavPreferences;
  localeBundle: SidebarLocaleBundle | null;
  showRecentWorkspaces: boolean;
  visibleRecentWorkspaceLinks: WorkspaceLink[];
  hasOverflow: boolean;
  isExpanded: boolean;
  activeWorkspaceId: string | null;
  onSelectWorkspace: (workspaceId: string | null) => void;
  onToggleExpanded: () => void;
  pathname: string;
  workspacesHydrated: boolean;
  allWorkspaceLinks: WorkspaceLink[];
  currentSearchWorkspaceId: string;
  creatingKind: "page" | "database" | null;
  onQuickCreatePage: () => void;
}

function ManagedNavGroup({
  title,
  ariaLabel,
  items,
  isActiveRoute,
}: {
  title: string;
  ariaLabel: string;
  items: readonly NavItem[];
  isActiveRoute: (href: string) => boolean;
}) {
  return (
    <nav className="space-y-0.5" aria-label={ariaLabel}>
      <p className={sidebarSectionTitleClass}>{title}</p>
      {items.map((item) => {
        const active = isActiveRoute(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={sidebarItemClass(active)}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function DashboardSidebarBody({
  section,
  isActiveRoute,
  activeAccountId,
  showAccountManagement,
  visibleAccountItems,
  visibleOrganizationManagementItems,
  workspacePathId,
  navPrefs,
  localeBundle,
  showRecentWorkspaces,
  visibleRecentWorkspaceLinks,
  hasOverflow,
  isExpanded,
  activeWorkspaceId,
  onSelectWorkspace,
  onToggleExpanded,
  pathname,
  workspacesHydrated,
  allWorkspaceLinks,
  currentSearchWorkspaceId,
  creatingKind,
  onQuickCreatePage,
}: ShellSidebarBodyProps) {
  const contextSection = SHELL_CONTEXT_SECTION_CONFIG[section];

  return (
    <div className="flex-1 overflow-y-auto px-2.5 py-2.5">
      {section === "account" && (
        <div className="space-y-2">
          {showAccountManagement && visibleAccountItems.length > 0 && (
            <ManagedNavGroup
              title="帳號"
              ariaLabel="帳號導覽"
              items={visibleAccountItems}
              isActiveRoute={isActiveRoute}
            />
          )}
          {!showAccountManagement && (
            <p className="px-2 py-4 text-[11px] text-muted-foreground">
              請切換到組織帳號以查看帳號選項。
            </p>
          )}
        </div>
      )}

      {section === "organization" && (
        <div className="space-y-2">
          {showAccountManagement && visibleOrganizationManagementItems.length > 0 && (
            <ManagedNavGroup
              title="組織管理"
              ariaLabel="組織管理導覽"
              items={visibleOrganizationManagementItems}
              isActiveRoute={isActiveRoute}
            />
          )}
          {!showAccountManagement && (
            <p className="px-2 py-4 text-[11px] text-muted-foreground">
              請切換到組織帳號以查看管理選項。
            </p>
          )}
        </div>
      )}

      {section === "workspace" && (
        <div className="space-y-2">
          <WorkspaceSectionContent
            workspacePathId={workspacePathId}
            navPrefs={navPrefs}
            localeBundle={localeBundle}
            showRecentWorkspaces={showRecentWorkspaces}
            visibleRecentWorkspaceLinks={visibleRecentWorkspaceLinks}
            hasOverflow={hasOverflow}
            isExpanded={isExpanded}
            activeWorkspaceId={activeWorkspaceId}
            isActiveRoute={isActiveRoute}
            onSelectWorkspace={onSelectWorkspace}
            onToggleExpanded={onToggleExpanded}
            getItemClassName={sidebarItemClass}
            sectionTitleClassName={sidebarSectionTitleClass}
          />
        </div>
      )}

      {section === "knowledge" && (
        <KnowledgeSidebarSection
          pathname={pathname}
          workspacesHydrated={workspacesHydrated}
          allWorkspaceLinks={allWorkspaceLinks}
          activeAccountId={activeAccountId}
          activeWorkspaceId={currentSearchWorkspaceId || activeWorkspaceId}
          creatingKind={creatingKind}
          onSelectWorkspace={onSelectWorkspace}
          onQuickCreatePage={onQuickCreatePage}
        />
      )}

      {contextSection && (
        <ShellContextNavSection
          title={contextSection.title}
          items={contextSection.items}
          isActiveRoute={isActiveRoute}
          activeAccountId={activeAccountId}
          activeWorkspaceId={currentSearchWorkspaceId || activeWorkspaceId}
        />
      )}
    </div>
  );
}
````

## File: modules/platform/subdomains/access-control/api/index.ts
````typescript
/**
 * Public API boundary for the access-control subdomain.
 */
export * from "../application";
export { accessControlService } from "../infrastructure";
export type { AccessPolicySnapshot, CreateAccessPolicyInput } from "../domain/aggregates/AccessPolicy";
export type { AccessPolicyDomainEventType } from "../domain/events/AccessPolicyDomainEvent";
export type { AccessPolicyRepository } from "../domain/repositories/AccessPolicyRepository";
export type { SubjectRef } from "../domain/value-objects/SubjectRef";
export type { ResourceRef } from "../domain/value-objects/ResourceRef";
export type { PolicyEffect } from "../domain/value-objects/PolicyEffect";
export {
	isOrganizationActor,
	isActiveOrganizationAccount,
	resolveOrganizationRouteFallback,
	type ShellAccountActor,
} from "../application/services/shell-account-access";
````

## File: modules/platform/subdomains/access-control/application/use-cases/access-control.use-cases.ts
````typescript
/**
 * Access-Control Use Cases — pure application logic.
 */
import { commandSuccess, commandFailureFrom, type CommandResult } from "@shared-types";
import { AccessPolicy } from "../../domain/aggregates/AccessPolicy";
import {
  allowDecision,
  denyDecision,
} from "../../../../domain/value-objects/PermissionDecision";
import type { AccessPolicyRepository } from "../../domain/repositories/AccessPolicyRepository";
import type { SubjectRef } from "../../domain/value-objects/SubjectRef";
import type { ResourceRef } from "../../domain/value-objects/ResourceRef";
import type { PolicyEffect } from "../../domain/value-objects/PolicyEffect";

// ─── Evaluate Permission ──────────────────────────────────────────────────────

export class EvaluatePermissionUseCase {
  constructor(private readonly repo: AccessPolicyRepository) {}

  async execute(input: {
    subjectId: string;
    resourceType: string;
    resourceId?: string;
    action: string;
  }): Promise<CommandResult> {
    try {
      const policies = await this.repo.findActiveBySubjectAndResource(
        input.subjectId,
        input.resourceType,
        input.resourceId,
      );

      // Explicit deny takes priority (deny-override semantics)
      const hasDeny = policies.some(
        (p) => p.effect === "deny" && p.actions.includes(input.action),
      );
      if (hasDeny) {
        return commandSuccess(JSON.stringify(denyDecision("Explicit deny policy matched")), Date.now());
      }

      const hasAllow = policies.some(
        (p) => p.effect === "allow" && p.actions.includes(input.action),
      );
      if (hasAllow) {
        return commandSuccess(JSON.stringify(allowDecision("Allow policy matched")), Date.now());
      }

      return commandSuccess(JSON.stringify(denyDecision("No matching allow policy")), Date.now());
    } catch (err) {
      return commandFailureFrom(
        "EVALUATE_PERMISSION_FAILED",
        err instanceof Error ? err.message : "Failed to evaluate permission",
      );
    }
  }
}

// ─── Create Access Policy ─────────────────────────────────────────────────────

export class CreateAccessPolicyUseCase {
  constructor(private readonly repo: AccessPolicyRepository) {}

  async execute(input: {
    subjectRef: SubjectRef;
    resourceRef: ResourceRef;
    actions: string[];
    effect: PolicyEffect;
    conditions?: string[];
  }): Promise<CommandResult> {
    try {
      const id = crypto.randomUUID();
      const policy = AccessPolicy.create(id, input);
      await this.repo.save(policy.getSnapshot());
      return commandSuccess(id, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "CREATE_ACCESS_POLICY_FAILED",
        err instanceof Error ? err.message : "Failed to create access policy",
      );
    }
  }
}

// ─── Update Access Policy ─────────────────────────────────────────────────────

export class UpdateAccessPolicyUseCase {
  constructor(private readonly repo: AccessPolicyRepository) {}

  async execute(
    policyId: string,
    input: { actions?: string[]; effect?: PolicyEffect; conditions?: string[] },
  ): Promise<CommandResult> {
    try {
      const snapshot = await this.repo.findById(policyId);
      if (!snapshot) {
        return commandFailureFrom("POLICY_NOT_FOUND", `AccessPolicy ${policyId} not found`);
      }
      const policy = AccessPolicy.reconstitute(snapshot);
      policy.update(input);
      await this.repo.update(policy.getSnapshot());
      return commandSuccess(policyId, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "UPDATE_ACCESS_POLICY_FAILED",
        err instanceof Error ? err.message : "Failed to update access policy",
      );
    }
  }
}

// ─── Delete (Deactivate) Access Policy ───────────────────────────────────────

export class DeactivateAccessPolicyUseCase {
  constructor(private readonly repo: AccessPolicyRepository) {}

  async execute(policyId: string): Promise<CommandResult> {
    try {
      const snapshot = await this.repo.findById(policyId);
      if (!snapshot) {
        return commandFailureFrom("POLICY_NOT_FOUND", `AccessPolicy ${policyId} not found`);
      }
      const policy = AccessPolicy.reconstitute(snapshot);
      policy.deactivate();
      await this.repo.update(policy.getSnapshot());
      return commandSuccess(policyId, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "DEACTIVATE_ACCESS_POLICY_FAILED",
        err instanceof Error ? err.message : "Failed to deactivate access policy",
      );
    }
  }
}
````

## File: modules/platform/interfaces/web/shell/navigation/components/ShellDashboardSidebar.tsx
````typescript
"use client";

/**
 * Module: shell-dashboard-sidebar.tsx
 * Purpose: render the secondary navigation panel of the authenticated shell.
 * Responsibilities: account switcher, search hint, org management sub-nav, and
 *   recent workspace quick-access list. Top-level section navigation is in ShellAppRail.
 * Constraints: UI-only; workspace data sourced from module interfaces.
 */

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { quickCreateKnowledgePage } from "@/modules/platform/api";
import {
  buildWorkspaceQuickAccessItems,
  CustomizeNavigationDialog,
  getWorkspaceIdFromPath,
  MAX_VISIBLE_RECENT_WORKSPACES,
  readNavPreferences,
  buildWorkspaceContextHref,
  supportsWorkspaceSearchContext,
  type NavPreferences,
  useRecentWorkspaces,
  useSidebarLocale,
  WorkspaceQuickAccessRow,
} from "@/modules/workspace/api";

import {
  type DashboardSidebarProps,
  ORGANIZATION_MANAGEMENT_ITEMS,
  ACCOUNT_NAV_ITEMS,
  SECTION_TITLES,
  resolveNavSection,
  isActiveRoute,
  isActiveOrganizationAccount,
} from "../data/ShellSidebarNavData";
import { ShellSidebarHeader } from "../../sidebar/ShellSidebarHeader";
import { DashboardSidebarBody } from "../../sidebar/ShellSidebarBody";

export function ShellDashboardSidebar({
  pathname,
  userId,
  activeAccount,
  workspaces,
  workspacesHydrated,
  activeWorkspaceId,
  collapsed,
  onToggleCollapsed,
  onSelectWorkspace,
}: DashboardSidebarProps) {
  const searchParams = useSearchParams();

  const { isExpanded, setIsExpanded, recentWorkspaceLinks } = useRecentWorkspaces(
    activeAccount?.id,
    pathname,
    workspaces,
  );
  const [creatingKind, setCreatingKind] = useState<"page" | "database" | null>(null);
  const [navPrefs, setNavPrefs] = useState<NavPreferences>(() => readNavPreferences());
  const [customizeOpen, setCustomizeOpen] = useState(false);
  const localeBundle = useSidebarLocale();

  const showAccountManagement = isActiveOrganizationAccount(activeAccount);

  const visibleOrganizationManagementItems = useMemo(
    () => ORGANIZATION_MANAGEMENT_ITEMS.filter((item) => navPrefs.pinnedWorkspace.includes(item.id)),
    [navPrefs.pinnedWorkspace],
  );

  const visibleAccountItems = useMemo(
    () => ACCOUNT_NAV_ITEMS.filter((item) => navPrefs.pinnedWorkspace.includes(item.id)),
    [navPrefs.pinnedWorkspace],
  );

  const showRecentWorkspaces = navPrefs.pinnedPersonal.includes("recent-workspaces");

  const effectiveMaxWorkspaces = navPrefs.showLimitedWorkspaces
    ? navPrefs.maxWorkspaces
    : MAX_VISIBLE_RECENT_WORKSPACES;

  const currentSearchWorkspaceId = searchParams.get("workspaceId")?.trim() ?? "";

  useEffect(() => {
    const pathWorkspaceId = getWorkspaceIdFromPath(pathname);
    if (pathWorkspaceId && pathWorkspaceId !== activeWorkspaceId) {
      onSelectWorkspace(pathWorkspaceId);
      return;
    }

    if (!supportsWorkspaceSearchContext(pathname)) {
      return;
    }

    if (currentSearchWorkspaceId && currentSearchWorkspaceId !== activeWorkspaceId) {
      onSelectWorkspace(currentSearchWorkspaceId);
    }
  }, [pathname, activeWorkspaceId, currentSearchWorkspaceId, onSelectWorkspace]);

  const hasOverflow = recentWorkspaceLinks.length > effectiveMaxWorkspaces;
  const visibleRecentWorkspaceLinks = isExpanded
    ? recentWorkspaceLinks
    : recentWorkspaceLinks.slice(0, effectiveMaxWorkspaces);

  const allWorkspaceLinks = useMemo(
    () =>
      workspaces
        .map((workspace) => ({
          id: workspace.id,
          name: workspace.name,
          href: buildWorkspaceContextHref(pathname, workspace.id),
        }))
        .sort((a, b) => a.name.localeCompare(b.name, "zh-Hant")),
    [workspaces, pathname],
  );

  const section = resolveNavSection(pathname);
  const sectionMeta = SECTION_TITLES[section];
  const workspacePathId = getWorkspaceIdFromPath(pathname);
  const currentPanel = searchParams.get("panel");
  const currentWorkspaceTab = searchParams.get("tab");
  const hasSingleWorkspaceContext = section === "workspace" && Boolean(workspacePathId);
  const hasWorkspaceToolContext =
    Boolean(activeWorkspaceId || currentSearchWorkspaceId) &&
    (section === "knowledge" ||
      section === "knowledge-base" ||
      section === "source" ||
      section === "notebook");
  const workspaceQuickAccessId =
    workspacePathId || currentSearchWorkspaceId || (hasWorkspaceToolContext ? activeWorkspaceId ?? "" : "");
  const showWorkspaceQuickAccess = hasSingleWorkspaceContext || hasWorkspaceToolContext;
  const workspaceSettingsHref = workspaceQuickAccessId
    ? `/workspace/${encodeURIComponent(workspaceQuickAccessId)}?tab=Overview&panel=settings`
    : "";
  const workspaceQuickAccessItems = useMemo(
    () =>
      showWorkspaceQuickAccess && workspaceQuickAccessId
        ? buildWorkspaceQuickAccessItems(workspaceQuickAccessId)
        : [],
    [showWorkspaceQuickAccess, workspaceQuickAccessId],
  );

  async function handleQuickCreatePage() {
    const accountId = activeAccount?.id ?? "";
    if (!accountId || !activeWorkspaceId) {
      toast.error(!accountId ? "目前沒有 active account，無法建立" : "請先切換到工作區，再建立頁面");
      return;
    }
    setCreatingKind("page");
    try {
      const result = await quickCreateKnowledgePage({
        accountId,
        workspaceId: activeWorkspaceId,
        createdByUserId: userId ?? accountId,
      });
      if (result.success) {
        toast.success("已建立頁面");
      } else {
        toast.error(result.error?.message ?? "建立頁面失敗");
      }
    } catch (error) {
      console.error(error);
      toast.error("建立頁面失敗");
    } finally {
      setCreatingKind(null);
    }
  }

  return (
    <div className="contents">
      <aside
        aria-label="Secondary navigation"
        className={`hidden h-full shrink-0 flex-col overflow-hidden transition-[width] duration-200 md:flex ${
          collapsed ? "w-0" : "w-56 border-r border-border/50 bg-card/20"
        }`}
      >
        <ShellSidebarHeader
          sectionLabel={sectionMeta.label}
          sectionIcon={sectionMeta.icon}
          onOpenCustomize={() => {
            setCustomizeOpen(true);
          }}
          onToggleCollapsed={onToggleCollapsed}
        />

        <WorkspaceQuickAccessRow
          items={workspaceQuickAccessItems}
          pathname={pathname}
          currentPanel={currentPanel}
          currentWorkspaceTab={currentWorkspaceTab}
          workspaceSettingsHref={workspaceSettingsHref}
          isActiveRoute={(href) => isActiveRoute(pathname, href)}
        />

        <DashboardSidebarBody
          section={section}
          isActiveRoute={(href) => isActiveRoute(pathname, href)}
          activeAccountId={activeAccount?.id ?? null}
          showAccountManagement={showAccountManagement}
          visibleAccountItems={visibleAccountItems}
          visibleOrganizationManagementItems={visibleOrganizationManagementItems}
          workspacePathId={workspacePathId}
          navPrefs={navPrefs}
          localeBundle={localeBundle}
          showRecentWorkspaces={showRecentWorkspaces}
          visibleRecentWorkspaceLinks={visibleRecentWorkspaceLinks}
          hasOverflow={hasOverflow}
          isExpanded={isExpanded}
          activeWorkspaceId={activeWorkspaceId}
          onSelectWorkspace={onSelectWorkspace}
          onToggleExpanded={() => {
            setIsExpanded((prev) => !prev);
          }}
          pathname={pathname}
          workspacesHydrated={workspacesHydrated}
          allWorkspaceLinks={allWorkspaceLinks}
          currentSearchWorkspaceId={currentSearchWorkspaceId}
          creatingKind={creatingKind}
          onQuickCreatePage={() => {
            void handleQuickCreatePage();
          }}
        />
      </aside>

      <CustomizeNavigationDialog
        open={customizeOpen}
        onOpenChange={setCustomizeOpen}
        onPreferencesChange={setNavPrefs}
      />
    </div>
  );
}
````

## File: modules/platform/interfaces/web/shell/navigation/data/ShellSidebarNavData.tsx
````typescript
import {
  BookOpen,
  Bot,
  Brain,
  Building2,
  Database,
  FileText,
  UserRound,
  Users,
} from "lucide-react";
import Link from "next/link";

import type { AccountEntity, ActiveAccount } from "@/modules/platform/api";
import { isOrganizationActor } from "@/modules/platform/subdomains/access-control/api";
import {
  SHELL_ACCOUNT_SECTION_MATCHERS,
  SHELL_ACCOUNT_NAV_ITEMS,
  SHELL_ORGANIZATION_MANAGEMENT_ITEMS,
  SHELL_SECTION_LABELS,
  isExactOrChildPath,
  resolveShellNavSection,
  type ShellNavSection,
} from "@/modules/platform/subdomains/platform-config/api";
import type { WorkspaceEntity } from "@/modules/workspace/api";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface DashboardSidebarProps {
  readonly pathname: string;
  readonly userId: string | null;
  readonly activeAccount: ActiveAccount | null;
  readonly workspaces: WorkspaceEntity[];
  readonly workspacesHydrated: boolean;
  readonly activeWorkspaceId: string | null;
  readonly collapsed: boolean;
  readonly onToggleCollapsed: () => void;
  readonly onSelectWorkspace: (workspaceId: string | null) => void;
}

export type NavSection = ShellNavSection;

// ── Static nav constants ──────────────────────────────────────────────────────

export const ORGANIZATION_MANAGEMENT_ITEMS = SHELL_ORGANIZATION_MANAGEMENT_ITEMS;

export const ACCOUNT_NAV_ITEMS = SHELL_ACCOUNT_NAV_ITEMS;

export const ACCOUNT_SECTION_MATCHERS = SHELL_ACCOUNT_SECTION_MATCHERS;

export const SECTION_TITLES: Record<NavSection, { label: string; icon: React.ReactNode }> = {
  workspace: { label: SHELL_SECTION_LABELS.workspace, icon: <Building2 className="size-3" /> },
  knowledge: { label: SHELL_SECTION_LABELS.knowledge, icon: <BookOpen className="size-3" /> },
  "knowledge-base": { label: SHELL_SECTION_LABELS["knowledge-base"], icon: <BookOpen className="size-3" /> },
  "knowledge-database": {
    label: SHELL_SECTION_LABELS["knowledge-database"],
    icon: <Database className="size-3" />,
  },
  source: { label: SHELL_SECTION_LABELS.source, icon: <FileText className="size-3" /> },
  notebook: { label: SHELL_SECTION_LABELS.notebook, icon: <Brain className="size-3" /> },
  "ai-chat": { label: SHELL_SECTION_LABELS["ai-chat"], icon: <Bot className="size-3" /> },
  account: { label: SHELL_SECTION_LABELS.account, icon: <UserRound className="size-3" /> },
  organization: { label: SHELL_SECTION_LABELS.organization, icon: <Users className="size-3" /> },
  other: { label: SHELL_SECTION_LABELS.other, icon: null },
};

// ── CSS class helpers ─────────────────────────────────────────────────────────

export function sidebarItemClass(active: boolean) {
  return `group flex items-center gap-1.5 rounded-md border px-2 py-1.5 text-xs font-medium transition ${
    active
      ? "border-primary/30 bg-primary/10 text-primary"
      : "border-transparent text-muted-foreground hover:border-border/60 hover:bg-muted/70 hover:text-foreground"
  }`;
}

export const sidebarSectionTitleClass =
  "mb-1.5 px-2 text-[11px] font-semibold tracking-tight text-muted-foreground/85";

export const sidebarGroupButtonClass =
  "flex w-full items-center justify-between rounded-md border border-transparent px-2 py-1.5 text-xs font-medium text-muted-foreground transition hover:border-border/60 hover:bg-muted/70 hover:text-foreground";

// ── Pure section helpers ──────────────────────────────────────────────────────

export function resolveNavSection(pathname: string): NavSection {
  return resolveShellNavSection(pathname);
}

export function isActiveRoute(pathname: string, href: string) {
  return isExactOrChildPath(href, pathname);
}

export function isActiveOrganizationAccount(
  activeAccount: ActiveAccount | null,
): activeAccount is AccountEntity & { accountType: "organization" } {
  return isOrganizationActor(activeAccount);
}

// ── Simple section nav component ──────────────────────────────────────────────

export function SimpleNavLinks({
  items,
  title,
  isActiveRoute,
}: {
  items: readonly { href: string; label: string }[];
  title: string;
  isActiveRoute: (href: string) => boolean;
}) {
  return (
    <nav className="space-y-0.5" aria-label={`${title}導覽`}>
      <p className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70">
        {title}
      </p>
      {items.map((item) => {
        const active = isActiveRoute(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`flex items-center rounded-md px-2 py-1.5 text-xs font-medium transition ${
              active
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
````

## File: modules/platform/interfaces/web/shell/layout/ShellRootLayout.tsx
````typescript
"use client";

/**
 * ShellLayout — platform/interfaces/web component.
 * Authenticated shell frame: sidebar, header, and content area.
 *
 * Responsibilities: account switching, route guards, and shell-level UI composition.
 * Constraints: keep business logic in modules and providers, not layout rendering.
 */

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PanelLeftOpen, Search } from "lucide-react";

import { useApp } from "../../providers/ShellAppProvider";
import { useAuth, ShellGuard } from "../../../../subdomains/identity/api";
import {
  isOrganizationActor,
  resolveOrganizationRouteFallback,
} from "../../../../subdomains/access-control/api";
import { type AccountEntity } from "../../../../subdomains/account/api";
import { subscribeToProfile, type AccountProfile } from "../../../../subdomains/account-profile/api";
import {
  resolveShellPageTitle,
  isExactOrChildPath,
  SHELL_MOBILE_NAV_ITEMS,
  SHELL_ORG_PRIMARY_NAV_ITEMS,
  SHELL_ORG_SECONDARY_NAV_ITEMS,
} from "../../../../subdomains/platform-config/api";
import { AccountSwitcher } from "../../../../subdomains/organization/api";
import { ShellAppBreadcrumbs } from "../breadcrumbs/ShellAppBreadcrumbs";
import { AppRail } from "../sidebar/ShellAppRail";
import { ShellDashboardSidebar } from "../navigation/components/ShellDashboardSidebar";
import { ShellGlobalSearchDialog, useShellGlobalSearch } from "../search/ShellGlobalSearchDialog";
import { ShellHeaderControls } from "../header/components/ShellHeaderControls";
import { ShellUserAvatar } from "../header/components/ShellUserAvatar";

export function ShellLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { state: authState, logout } = useAuth();
  const { state: appState, dispatch } = useApp();
  const [logoutError, setLogoutError] = useState<string | null>(null);
  const [accountProfileState, setAccountProfileState] = useState<{ actorId: string; profile: AccountProfile | null } | null>(null);
  const { open: searchOpen, setOpen: setSearchOpen } = useShellGlobalSearch();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem("xuanwu:sidebar-collapsed") === "true";
  });
  function toggleSidebar() {
    setSidebarCollapsed((prev) => {
      const next = !prev;
      if (typeof window !== "undefined") {
        window.localStorage.setItem("xuanwu:sidebar-collapsed", String(next));
      }
      return next;
    });
  }

  const pageTitle = resolveShellPageTitle(pathname);
  const organizationAccounts = Object.values(appState.accounts ?? {});
  const accountWorkspaces = Object.values(appState.workspaces ?? {});
  const showAccountManagement = isOrganizationActor(appState.activeAccount);

  function handleSelectOrganization(account: AccountEntity) {
    dispatch({ type: "SET_ACTIVE_ACCOUNT", payload: account });
    const nextRoute = resolveOrganizationRouteFallback(pathname, account);
    if (nextRoute) {
      router.replace(nextRoute);
    }
  }

  function handleSelectPersonal() {
    if (!authState.user) return;
    dispatch({ type: "SET_ACTIVE_ACCOUNT", payload: authState.user });
    const nextRoute = resolveOrganizationRouteFallback(pathname, authState.user);
    if (nextRoute) {
      router.replace(nextRoute);
    }
  }

  function handleOrganizationCreated(account: AccountEntity) {
    dispatch({ type: "SET_ACTIVE_ACCOUNT", payload: account });
  }

  function handleSelectWorkspace(workspaceId: string | null) {
    dispatch({ type: "SET_ACTIVE_WORKSPACE", payload: workspaceId });
  }

  useEffect(() => {
    if (!appState.accountsHydrated || !appState.activeAccount) {
      return;
    }

    const nextRoute = resolveOrganizationRouteFallback(pathname, appState.activeAccount);
    if (nextRoute && nextRoute !== pathname) {
      router.replace(nextRoute);
    }
  }, [appState.accountsHydrated, appState.activeAccount, pathname, router]);

  useEffect(() => {
    const actorId = authState.user?.id;
    if (!actorId) {
      return;
    }

    const unsubscribe = subscribeToProfile(actorId, (profile) => setAccountProfileState({ actorId, profile }));

    return () => unsubscribe();
  }, [authState.user?.id]);

  const scopedProfile = accountProfileState && accountProfileState.actorId === authState.user?.id
    ? accountProfileState.profile
    : null;

  async function handleLogout() {
    setLogoutError(null);
    try {
      await logout();
    } catch {
      setLogoutError("登出失敗，請稍後再試。");
    }
  }

  return (
    <ShellGuard>
      <ShellGlobalSearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
      <div className="flex h-screen overflow-hidden bg-background">
        <AppRail
          pathname={pathname}
          user={authState.user}
          activeAccount={appState.activeAccount}
          organizationAccounts={organizationAccounts}
          workspaces={accountWorkspaces}
          workspacesHydrated={appState.workspacesHydrated}
          isOrganizationAccount={showAccountManagement}
          onSelectPersonal={handleSelectPersonal}
          onSelectOrganization={handleSelectOrganization}
          activeWorkspaceId={appState.activeWorkspaceId}
          onSelectWorkspace={handleSelectWorkspace}
          onOrganizationCreated={handleOrganizationCreated}
          onSignOut={() => {
            void handleLogout();
          }}
        />
        <ShellDashboardSidebar
          userId={authState.user?.id ?? null}
          pathname={pathname}
          activeAccount={appState.activeAccount}
          workspaces={accountWorkspaces}
          workspacesHydrated={appState.workspacesHydrated}
          activeWorkspaceId={appState.activeWorkspaceId}
          collapsed={sidebarCollapsed}
          onToggleCollapsed={toggleSidebar}
          onSelectWorkspace={handleSelectWorkspace}
        />

        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <header className="shrink-0 border-b border-border/50 bg-background/80 px-4 backdrop-blur md:px-6">
            <div className="flex h-12 items-center justify-between gap-4">
              <div className="min-w-0 flex items-center gap-3">
                {sidebarCollapsed && (
                  <button
                    type="button"
                    onClick={toggleSidebar}
                    aria-label="展開側欄"
                    title="展開側欄"
                    className="hidden size-7 items-center justify-center rounded text-muted-foreground transition hover:bg-muted hover:text-foreground md:flex"
                  >
                    <PanelLeftOpen className="size-4" />
                  </button>
                )}
                <p className="truncate text-sm font-semibold tracking-tight">{pageTitle}</p>
                <ShellAppBreadcrumbs />
                {/* Global search */}
                <button
                  type="button"
                  aria-label="全域搜尋"
                  className="hidden items-center gap-1.5 rounded-md border border-border/50 bg-background/50 px-2.5 py-1 text-xs text-muted-foreground transition hover:border-border hover:bg-muted sm:flex"
                  onClick={() => setSearchOpen(true)}
                >
                  <Search className="size-3 shrink-0" />
                  <span>搜尋…</span>
                  <kbd className="ml-1 rounded bg-muted px-1 text-[10px] text-muted-foreground/60">⌘K</kbd>
                </button>
              </div>

              <div className="ml-auto flex items-center gap-3">
                <ShellHeaderControls />
                <ShellUserAvatar
                  name={scopedProfile?.displayName ?? authState.user?.name ?? "Dimension Member"}
                  email={scopedProfile?.email ?? authState.user?.email ?? "—"}
                  onSignOut={() => {
                    void handleLogout();
                  }}
                />
              </div>
            </div>

            <div className="space-y-3 pb-3 md:hidden">
              <AccountSwitcher
                personalAccount={authState.user}
                organizationAccounts={organizationAccounts}
                activeAccountId={appState.activeAccount?.id ?? null}
                onSelectPersonal={handleSelectPersonal}
                onSelectOrganization={handleSelectOrganization}
                onOrganizationCreated={handleOrganizationCreated}
              />
            </div>

            {showAccountManagement && (
              <>
                <nav aria-label="Organization primary navigation" className="flex gap-2 overflow-auto pb-2 md:hidden">
                  {SHELL_ORG_PRIMARY_NAV_ITEMS.map((item) => {
                    const isActive = isExactOrChildPath(item.href, pathname);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        aria-current={isActive ? "page" : undefined}
                        className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                          isActive
                            ? "bg-primary/10 text-primary"
                            : "border border-border/60 text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>
                <nav aria-label="Organization secondary navigation" className="flex gap-2 overflow-auto pb-2 md:hidden">
                  {SHELL_ORG_SECONDARY_NAV_ITEMS.map((item) => {
                    const isActive = isExactOrChildPath(item.href, pathname);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        aria-current={isActive ? "page" : undefined}
                        className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                          isActive
                            ? "bg-primary/10 text-primary"
                            : "border border-border/60 text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>
              </>
            )}
            <nav aria-label="Main navigation" className="flex gap-2 overflow-auto pb-3 md:hidden">
              {SHELL_MOBILE_NAV_ITEMS.map((item) => {
                const isActive = isExactOrChildPath(item.href, pathname);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "border border-border/60 text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </header>

          {logoutError && (
            <div className="shrink-0 px-4 pt-3 text-xs text-destructive md:px-6">{logoutError}</div>
          )}

          <main className="flex-1 overflow-auto p-6">{children}</main>
        </div>
      </div>
    </ShellGuard>
  );
}
````

## File: modules/platform/interfaces/web/index.ts
````typescript
export { ShellHeaderControls } from "./shell/header/components/ShellHeaderControls";
export { ShellThemeToggle } from "./shell/header/components/ShellThemeToggle";
export { ShellNotificationButton } from "./shell/header/components/ShellNotificationButton";
export { ShellUserAvatar } from "./shell/header/components/ShellUserAvatar";
export { ShellTranslationSwitcher } from "./shell/header/components/ShellTranslationSwitcher";
export { ShellAppBreadcrumbs } from "./shell/breadcrumbs/ShellAppBreadcrumbs";
export { ShellGlobalSearchDialog, useShellGlobalSearch } from "./shell/search/ShellGlobalSearchDialog";
export { AppRail } from "./shell/sidebar/ShellAppRail";
export { ShellDashboardSidebar } from "./shell/navigation/components/ShellDashboardSidebar";
export {
  quickCreateKnowledgePage,
  type QuickCreatePageInput,
  type QuickCreatePageResult,
} from "./shell/navigation/services/shell-quick-create";
export { ShellLayout } from "./shell/layout/ShellRootLayout";
export type { DashboardSidebarProps, NavSection } from "./shell/navigation/data/ShellSidebarNavData";
export {
  resolveNavSection,
  isActiveOrganizationAccount,
  SECTION_TITLES,
  ACCOUNT_NAV_ITEMS,
  ACCOUNT_SECTION_MATCHERS,
  ORGANIZATION_MANAGEMENT_ITEMS,
  sidebarItemClass,
  sidebarSectionTitleClass,
  sidebarGroupButtonClass,
  SimpleNavLinks,
} from "./shell/navigation/data/ShellSidebarNavData";

// providers
export {
  AppContext,
  type AppState,
  type AppAction,
  type AppContextValue,
  type ActiveAccount,
} from "./providers/ShellAppProvider";
export { AppProvider, useApp } from "./providers/ShellAppProvider";
export { Providers } from "./providers/ShellProviders";
````