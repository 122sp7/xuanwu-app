/**
 * relations subdomain - server-only API.
 *
 * Exports infrastructure implementations and composition helpers that must only
 * run in Server Actions, route handlers, or other server-side entry points.
 */

export { FirebaseRelationRepository } from "../../../infrastructure/relations/firebase/FirebaseRelationRepository";
export { makeRelationRepo } from "../../../interfaces/relations/composition/repositories";
export type { RelationUseCases } from "../../../interfaces/relations/composition/use-cases";
export { makeRelationUseCases } from "../../../interfaces/relations/composition/use-cases";
