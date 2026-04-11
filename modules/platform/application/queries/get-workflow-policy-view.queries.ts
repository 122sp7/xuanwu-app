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
