/**
 * list-enabled-capabilities — use case.
 *
 * Query:   ListEnabledCapabilities
 * Purpose: Lists all currently active capabilities for a platform scope.
 */

import type { ListEnabledCapabilitiesInput } from "../dto";
import type { PlatformContextViewRepository } from "../../domain/ports/output";

export class ListEnabledCapabilitiesUseCase {
	constructor(private readonly viewRepo: PlatformContextViewRepository) {}

	async execute(input: ListEnabledCapabilitiesInput): Promise<readonly string[]> {
		const view = await this.viewRepo.getView(input.contextId);
		return view?.capabilityKeys ?? [];
	}
}
