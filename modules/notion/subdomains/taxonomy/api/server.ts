/**
 * taxonomy subdomain - server-only API.
 *
 * Exports infrastructure implementations and composition helpers that must only
 * run in Server Actions, route handlers, or other server-side entry points.
 */

export { FirebaseTaxonomyRepository } from "../../../infrastructure/taxonomy/firebase/FirebaseTaxonomyRepository";
export { makeTaxonomyRepo } from "../../../interfaces/taxonomy/composition/repositories";
export type { TaxonomyUseCases } from "../../../interfaces/taxonomy/composition/use-cases";
export { makeTaxonomyUseCases } from "../../../interfaces/taxonomy/composition/use-cases";
