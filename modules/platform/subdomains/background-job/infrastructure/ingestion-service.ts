/**
 * ingestionService — Backward-compatibility re-export shim.
 *
 * Composition logic has been relocated to
 * interfaces/composition/ingestion-service.ts to fix the
 * infrastructure → application dependency direction violation.
 */

export { ingestionService } from "../interfaces/composition/ingestion-service";
export type { IngestionStatus } from "../interfaces/composition/ingestion-service";
