/**
 * Module: notebooklm
 * Layer: infrastructure/source/platform
 * Adapter: PlatformSourceDocumentWatchAdapter — delegates to platform FirestoreAPI.
 */

import { firestoreInfrastructureApi } from "@/modules/platform/api";

import type {
  SourceDocumentWatchPort,
  WatchedDocument,
} from "../../../subdomains/source/domain/ports/SourceDocumentWatchPort";

export class PlatformSourceDocumentWatchAdapter implements SourceDocumentWatchPort {
  watchCollection<T>(
    collectionPath: string,
    handlers: {
      onNext: (documents: readonly WatchedDocument<T>[]) => void;
      onError?: (error: unknown) => void;
    },
  ): () => void {
    return firestoreInfrastructureApi.watchCollection<T>(collectionPath, handlers);
  }
}
