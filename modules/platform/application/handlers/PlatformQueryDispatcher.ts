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
