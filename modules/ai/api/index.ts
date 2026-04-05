/**
 * modules/ai — public API barrel.
 *
 * Public surface for the AI ingestion pipeline only.
 */
export { KnowledgeIngestionApi } from "./knowledge-ingestion-api";

export type {
	IngestionJob,
	IngestionStatus,
} from "../domain/entities/IngestionJob";
