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
