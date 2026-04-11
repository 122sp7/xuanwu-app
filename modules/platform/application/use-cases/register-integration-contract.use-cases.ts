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
