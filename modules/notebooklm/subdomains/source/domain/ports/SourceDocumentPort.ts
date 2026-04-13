/**
 * Module: notebooklm/subdomains/source
 * Layer: domain/ports
 * Port: ISourceDocumentPort — commands for legacy source documents stored in accounts/{accountId}/documents.
 *
 * This port isolates the legacy Firestore collection from interfaces.
 * Infrastructure provides the Firebase adapter; interfaces consume via use cases.
 */

export interface SourceDocumentCommandPort {
  deleteDocument(accountId: string, documentId: string): Promise<void>;
  renameDocument(accountId: string, documentId: string, newName: string): Promise<void>;
}
