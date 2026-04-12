import { FirebaseRagDocumentAdapter } from "../../../infrastructure/source/firebase/FirebaseRagDocumentAdapter";
import { FirebaseSourceFileAdapter } from "../../../infrastructure/source/firebase/FirebaseSourceFileAdapter";
import { FirebaseSourceDocumentCommandAdapter } from "../../../infrastructure/source/firebase/FirebaseSourceDocumentCommandAdapter";
import { FirebaseParsedDocumentAdapter } from "../../../infrastructure/source/firebase/FirebaseParsedDocumentAdapter";
import { NotionKnowledgePageGatewayAdapter } from "../../../infrastructure/source/adapters/NotionKnowledgePageGatewayAdapter";
import { waitForParsedDocument as _waitForParsedDocument } from "../../../infrastructure/source/firebase/FirebaseDocumentStatusAdapter";
import { PlatformSourcePipelineAdapter } from "../../../infrastructure/source/platform/PlatformSourcePipelineAdapter";
import {
  addKnowledgeBlock,
  createKnowledgePage,
} from "@/modules/notion/api";

export function makeSourceFileAdapter() {
  return new FirebaseSourceFileAdapter();
}

export function makeRagDocumentAdapter() {
  return new FirebaseRagDocumentAdapter();
}

export function makeSourceDocumentCommandAdapter() {
  return new FirebaseSourceDocumentCommandAdapter();
}

export function makeParsedDocumentAdapter() {
  return new FirebaseParsedDocumentAdapter();
}

export function makeSourcePipelineAdapter() {
  return new PlatformSourcePipelineAdapter();
}

export function makeKnowledgePageGateway() {
  return new NotionKnowledgePageGatewayAdapter({
    createKnowledgePage,
    addKnowledgeBlock,
  });
}

export function waitForParsedDocument(
  accountId: string,
  docId: string,
): Promise<{ pageCount: number; jsonGcsUri: string }> {
  return _waitForParsedDocument(accountId, docId);
}
