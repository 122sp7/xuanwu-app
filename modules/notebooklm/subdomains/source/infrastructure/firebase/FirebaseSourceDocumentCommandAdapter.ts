/**
 * Module: notebooklm/subdomains/source
 * Layer: infrastructure/firebase
 * Adapter: FirebaseSourceDocumentCommandAdapter — Firestore implementation of ISourceDocumentCommandPort.
 *
 * Collection path: accounts/{accountId}/documents/{documentId}
 * This is a legacy collection; new data should use the workspaceFiles collection.
 */

import { deleteDoc, doc, getFirestore, serverTimestamp, updateDoc } from "firebase/firestore";

import { firebaseClientApp } from "@integration-firebase/client";

import type { ISourceDocumentCommandPort } from "../../domain/ports/ISourceDocumentPort";

export class FirebaseSourceDocumentCommandAdapter implements ISourceDocumentCommandPort {
  private readonly db = getFirestore(firebaseClientApp);

  async deleteDocument(accountId: string, documentId: string): Promise<void> {
    await deleteDoc(doc(this.db, "accounts", accountId, "documents", documentId));
  }

  async renameDocument(accountId: string, documentId: string, newName: string): Promise<void> {
    await updateDoc(doc(this.db, "accounts", accountId, "documents", documentId), {
      title: newName,
      "source.filename": newName,
      "metadata.filename": newName,
      updatedAt: serverTimestamp(),
    });
  }
}
