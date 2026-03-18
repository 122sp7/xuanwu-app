import type {
  DocumentAiProcessCommand,
  DocumentAiProcessLogEntry,
  DocumentAiProcessResult,
} from "../entities/DocumentAiProcess.js";

export interface DocumentAiProcessorPort {
  process(command: DocumentAiProcessCommand): Promise<DocumentAiProcessResult>;
}

export interface DocumentAiProcessLogPort {
  save(entry: DocumentAiProcessLogEntry): Promise<void>;
}
