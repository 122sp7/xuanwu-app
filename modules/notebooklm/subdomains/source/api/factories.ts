import { FirebaseRagDocumentAdapter } from "../infrastructure/firebase/FirebaseRagDocumentAdapter";
import { FirebaseSourceFileAdapter } from "../infrastructure/firebase/FirebaseSourceFileAdapter";
import { FirebaseSourceDocumentCommandAdapter } from "../infrastructure/firebase/FirebaseSourceDocumentCommandAdapter";
import { FirebaseParsedDocumentAdapter } from "../infrastructure/firebase/FirebaseParsedDocumentAdapter";
import { NotionKnowledgePageGatewayAdapter } from "../infrastructure/adapters/NotionKnowledgePageGatewayAdapter";
import { waitForParsedDocument as _waitForParsedDocument } from "../infrastructure/firebase/FirebaseDocumentStatusAdapter";
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
