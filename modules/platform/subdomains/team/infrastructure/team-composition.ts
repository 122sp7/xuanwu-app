/**
 * Module: platform/subdomains/team
 * Layer: infrastructure (composition root)
 * Purpose: Internal factory for creating TeamRepository instances.
 *          NOT exported through the api/ boundary — used only by
 *          team interfaces and sibling subdomains within platform.
 */

import type { TeamRepository } from "../domain/repositories/TeamRepository";
import { FirebaseTeamRepository } from "./firebase/FirebaseTeamRepository";

/** Returns a TeamRepository backed by Firebase. */
export function createTeamRepository(): TeamRepository {
	return new FirebaseTeamRepository();
}
