import { DocumentProcessorServiceClient } from "@google-cloud/documentai";
import type { protos } from "@google-cloud/documentai";
import type {
  DocumentAiEntity,
  DocumentAiProcessCommand,
  DocumentAiProcessResult,
} from "../../domain/entities/DocumentAiProcess.js";
import type { DocumentAiProcessorPort } from "../../domain/ports/DocumentAiPorts.js";
import {
  resolveDefaultProcessorName,
  toProcessorName,
} from "./document-ai.config.js";

export class GoogleCloudDocumentAiProcessor implements DocumentAiProcessorPort {
  private readonly defaultProcessorName: string;

  constructor(
    private readonly client: DocumentProcessorServiceClient,
    defaultProcessorName: string = resolveDefaultProcessorName()
  ) {
    this.defaultProcessorName = defaultProcessorName;
  }

  async process(command: DocumentAiProcessCommand): Promise<DocumentAiProcessResult> {
    const processorName = command.processorName
      ? toProcessorName(command.processorName)
      : this.defaultProcessorName;

    const rawDocument = this.createRawDocument(command);

    const request: protos.google.cloud.documentai.v1.IProcessRequest = {
      name: processorName,
      rawDocument,
      skipHumanReview: true,
    };

    const [response] = await this.client.processDocument(request);
    const document = response.document;

    return {
      processorName,
      text: document?.text ?? "",
      pageCount: document?.pages?.length ?? 0,
      entities: this.toEntities(document?.entities),
    };
  }

  private createRawDocument(
    command: DocumentAiProcessCommand
  ): protos.google.cloud.documentai.v1.IRawDocument {
    const contentBase64 = command.contentBase64.trim();
    if (contentBase64.length === 0) {
      throw new Error("Document AI contentBase64 is required.");
    }

    const mimeType = command.mimeType.trim();
    if (mimeType.length === 0) {
      throw new Error("Document AI mimeType is required.");
    }

    const contentBuffer = Buffer.from(contentBase64, "base64");

    if (contentBuffer.length === 0) {
      throw new Error("Decoded document payload is empty.");
    }

    return {
      content: contentBuffer,
      mimeType,
    };
  }

  private toEntities(
    entities?: protos.google.cloud.documentai.v1.Document.IEntity[] | null
  ): DocumentAiEntity[] {
    if (!entities || entities.length === 0) {
      return [];
    }

    return entities.map((entity) => ({
      type: entity.type ?? "",
      mentionText: entity.mentionText ?? "",
      confidence: entity.confidence ?? 0,
    }));
  }
}
