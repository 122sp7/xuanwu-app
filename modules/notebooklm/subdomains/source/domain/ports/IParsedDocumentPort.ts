/**
 * Module: notebooklm/subdomains/source
 * Layer: domain/ports
 * Port: IParsedDocumentPort — retrieves parsed document text from storage.
 *
 * This port isolates Firebase Storage access from interfaces.
 * Infrastructure provides the adapter; application consumes via use cases.
 */

export interface IParsedDocumentPort {
  loadParsedDocumentText(jsonGcsUri: string): Promise<string>;
}
