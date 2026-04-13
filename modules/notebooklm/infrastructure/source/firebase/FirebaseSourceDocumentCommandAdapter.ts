/**
 * Module: notebooklm/subdomains/source
 * Layer: infrastructure/firebase
 * Adapter: FirebaseSourceDocumentCommandAdapter — Firestore implementation of SourceDocumentCommandPort.
 *
 * Collection path: accounts/{accountId}/documents/{documentId}
 * This is a legacy collection; new data should use the workspaceFiles collection.
 */

import { firestoreInfrastructureApi } from "@/modules/platform/api";

import type { SourceDocumentCommandPort } from "../../../subdomains/source/domain/ports/SourceDocumentPort";

export class FirebaseSourceDocumentCommandAdapter implements SourceDocumentCommandPort {
  async deleteDocument(accountId: string, documentId: string): Promise<void> {
    await firestoreInfrastructureApi.delete(`accounts/${accountId}/documents/${documentId}`);
  }

  async renameDocument(accountId: string, documentId: string, newName: string): Promise<void> {
    await firestoreInfrastructureApi.update(`accounts/${accountId}/documents/${documentId}`, {
      title: newName,
      "source.filename": newName,
      "metadata.filename": newName,
      updatedAtISO: new Date().toISOString(),
    });
  }
}
