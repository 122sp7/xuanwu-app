/**
 * Module: notebooklm
 * Layer: infrastructure/source/platform
 * Adapter: PlatformSourceDocumentWatchAdapter — delegates to platform FirestoreAPI.
 */

import { firestoreInfrastructureApi } from "@/modules/platform/api";

import type {
  ISourceDocumentWatchPort,
  WatchedDocument,
} from "../../../subdomains/source/domain/ports/ISourceDocumentWatchPort";

export class PlatformSourceDocumentWatchAdapter implements ISourceDocumentWatchPort {
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
