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
