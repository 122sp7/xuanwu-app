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
