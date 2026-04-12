/**
 * authoring subdomain — server-only API.
 *
 * Exports infrastructure implementations and composition helpers that must only
 * run in Server Actions, route handlers, or other server-side entry points.
 */

export { FirebaseArticleRepository } from "../../../infrastructure/authoring/firebase/FirebaseArticleRepository";
export { FirebaseCategoryRepository } from "../../../infrastructure/authoring/firebase/FirebaseCategoryRepository";
export { makeArticleRepo, makeCategoryRepo } from "../../../interfaces/authoring/composition/repositories";
export type { AuthoringUseCases } from "../../../interfaces/authoring/composition/use-cases";
export { makeAuthoringUseCases } from "../../../interfaces/authoring/composition/use-cases";
