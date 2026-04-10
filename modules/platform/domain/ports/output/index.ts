/**
 * platform output ports.
 */

import type { PlatformCommandResult } from "../input";
import type { PlatformDomainEvent } from "../../domain/events";

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
