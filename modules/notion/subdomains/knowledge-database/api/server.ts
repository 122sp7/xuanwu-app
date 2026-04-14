/**
 * database subdomain — server-only API.
 *
 * Exports infrastructure implementations and composition helpers that must only
 * run in Server Actions, route handlers, or other server-side entry points.
 */

export { FirebaseDatabaseRepository } from "../../../infrastructure/knowledge-database/firebase/FirebaseDatabaseRepository";
export { FirebaseDatabaseRecordRepository } from "../../../infrastructure/knowledge-database/firebase/FirebaseDatabaseRecordRepository";
export { FirebaseViewRepository } from "../../../infrastructure/knowledge-database/firebase/FirebaseViewRepository";
export { FirebaseAutomationRepository } from "../../../infrastructure/knowledge-database/firebase/FirebaseAutomationRepository";
export { makeDatabaseRepo, makeRecordRepo, makeViewRepo, makeAutomationRepo } from "../../../interfaces/knowledge-database/composition/repositories";
export type { DatabaseUseCases } from "../../../interfaces/knowledge-database/composition/use-cases";
export { makeDatabaseUseCases } from "../../../interfaces/knowledge-database/composition/use-cases";
