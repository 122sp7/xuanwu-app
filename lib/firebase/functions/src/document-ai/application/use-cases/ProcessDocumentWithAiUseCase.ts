import type { DocumentAiProcessCommand, DocumentAiProcessResult } from "../../domain/entities/DocumentAiProcess.js";
import type { DocumentAiProcessLogPort, DocumentAiProcessorPort } from "../../domain/ports/DocumentAiPorts.js";

export class ProcessDocumentWithAiUseCase {
  constructor(
    private readonly processor: DocumentAiProcessorPort,
    private readonly logPort: DocumentAiProcessLogPort
  ) {}

  async execute(command: DocumentAiProcessCommand): Promise<DocumentAiProcessResult> {
    const result = await this.processor.process(command);

    await this.logPort.save({
      actorUid: command.actorUid,
      processorName: result.processorName,
      mimeType: command.mimeType,
      pageCount: result.pageCount,
      entityCount: result.entities.length,
      createdAt: new Date(),
      metadata: command.metadata,
    });

    return result;
  }
}
