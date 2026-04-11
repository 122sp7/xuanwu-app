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
