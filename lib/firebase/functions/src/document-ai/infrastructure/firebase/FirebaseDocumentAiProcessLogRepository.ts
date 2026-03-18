import { adminFirestoreApi } from "../../../firebase/index.js";
import type { DocumentAiProcessLogEntry } from "../../domain/entities/DocumentAiProcess.js";
import type { DocumentAiProcessLogPort } from "../../domain/ports/DocumentAiPorts.js";

const COLLECTION_NAME = "documentAiProcessLogs";

export class FirebaseDocumentAiProcessLogRepository
  implements DocumentAiProcessLogPort {
  async save(entry: DocumentAiProcessLogEntry): Promise<void> {
    await adminFirestoreApi.collection(COLLECTION_NAME).add({
      actorUid: entry.actorUid,
      processorName: entry.processorName,
      mimeType: entry.mimeType,
      pageCount: entry.pageCount,
      entityCount: entry.entityCount,
      metadata: entry.metadata ?? {},
      createdAt: entry.createdAt,
      createdAtServer: adminFirestoreApi.FieldValue.serverTimestamp(),
    });
  }
}
