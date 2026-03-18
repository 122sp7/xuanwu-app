import { DocumentProcessorServiceClient } from "@google-cloud/documentai";
import * as logger from "firebase-functions/logger";
import { HttpsError, onCall } from "firebase-functions/v2/https";
import { ProcessDocumentWithAiUseCase } from "../../application/use-cases/ProcessDocumentWithAiUseCase.js";
import { GoogleCloudDocumentAiProcessor } from "../../infrastructure/documentai/GoogleCloudDocumentAiProcessor.js";
import {
  resolveDocumentAiApiEndpoint,
  toProcessorName,
} from "../../infrastructure/documentai/document-ai.config.js";
import { FirebaseDocumentAiProcessLogRepository } from "../../infrastructure/firebase/FirebaseDocumentAiProcessLogRepository.js";

interface ProcessDocumentPayload {
  contentBase64?: string;
  mimeType?: string;
  processorName?: string;
  metadata?: Record<string, string>;
}

const apiEndpoint = resolveDocumentAiApiEndpoint();
const documentAiClient = new DocumentProcessorServiceClient({ apiEndpoint });
const processor = new GoogleCloudDocumentAiProcessor(documentAiClient);
const logRepository = new FirebaseDocumentAiProcessLogRepository();
const useCase = new ProcessDocumentWithAiUseCase(processor, logRepository);

export const processDocumentWithAi = onCall(
  {
    region: "asia-southeast1",
    memory: "1GiB",
    timeoutSeconds: 120,
  },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Authentication is required.");
    }

    const payload = request.data as ProcessDocumentPayload;
    const contentBase64 = payload.contentBase64?.trim();
    const mimeType = payload.mimeType?.trim();

    if (!contentBase64) {
      throw new HttpsError("invalid-argument", "contentBase64 is required.");
    }

    if (!mimeType) {
      throw new HttpsError("invalid-argument", "mimeType is required.");
    }

    try {
      const result = await useCase.execute({
        contentBase64,
        mimeType,
        processorName: payload.processorName
          ? toProcessorName(payload.processorName)
          : undefined,
        actorUid: request.auth.uid,
        metadata: payload.metadata,
      });

      return {
        processorName: result.processorName,
        pageCount: result.pageCount,
        text: result.text,
        entities: result.entities,
      };
    } catch (error) {
      logger.error("Document AI process failed", {
        uid: request.auth.uid,
        errorType: error instanceof Error ? error.name : "UnknownError",
      });

      throw new HttpsError(
        "internal",
        "Failed to process document with Document AI."
      );
    }
  }
);
