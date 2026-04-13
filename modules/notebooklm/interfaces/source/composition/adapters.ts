import { FirebaseParsedDocumentAdapter } from "../../../infrastructure/source/firebase/FirebaseParsedDocumentAdapter";
import { FirebaseRagDocumentAdapter } from "../../../infrastructure/source/firebase/FirebaseRagDocumentAdapter";
import { FirebaseSourceDocumentCommandAdapter } from "../../../infrastructure/source/firebase/FirebaseSourceDocumentCommandAdapter";
import { FirebaseSourceFileAdapter } from "../../../infrastructure/source/firebase/FirebaseSourceFileAdapter";
import { FirebaseWikiLibraryAdapter } from "../../../infrastructure/source/firebase/FirebaseWikiLibraryAdapter";
import { NotionKnowledgePageGatewayAdapter } from "../../../infrastructure/source/adapters/NotionKnowledgePageGatewayAdapter";
import { waitForParsedDocument as _waitForParsedDocument } from "../../../infrastructure/source/firebase/FirebaseDocumentStatusAdapter";
import { PlatformSourcePipelineAdapter } from "../../../infrastructure/source/platform/PlatformSourcePipelineAdapter";
import { PlatformSourceStorageAdapter } from "../../../infrastructure/source/platform/PlatformSourceStorageAdapter";
import { PlatformSourceDocumentWatchAdapter } from "../../../infrastructure/source/platform/PlatformSourceDocumentWatchAdapter";
import {
  addKnowledgeBlock,
  createKnowledgePage,
} from "@/modules/notion/api";
import type { WikiLibraryRepository } from "../../../subdomains/source/domain/repositories/WikiLibraryRepository";
import type { SourceStoragePort } from "../../../subdomains/source/domain/ports/SourceStoragePort";
import type { SourceDocumentWatchPort } from "../../../subdomains/source/domain/ports/SourceDocumentWatchPort";

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

export function makeWikiLibraryAdapter(): WikiLibraryRepository {
  return new FirebaseWikiLibraryAdapter();
}

export function makeSourceStorageAdapter(): SourceStoragePort {
  return new PlatformSourceStorageAdapter();
}

export function makeSourceDocumentWatchAdapter(): SourceDocumentWatchPort {
  return new PlatformSourceDocumentWatchAdapter();
}

export function waitForParsedDocument(
  accountId: string,
  docId: string,
): Promise<{ pageCount: number; jsonGcsUri: string }> {
  return _waitForParsedDocument(accountId, docId);
}
