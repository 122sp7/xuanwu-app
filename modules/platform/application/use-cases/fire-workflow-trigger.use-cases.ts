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
