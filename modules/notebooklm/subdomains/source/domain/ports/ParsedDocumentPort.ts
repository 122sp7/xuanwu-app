/**
 * Module: notebooklm/subdomains/source
 * Layer: domain/ports
 * Port: ParsedDocumentPort — retrieves parsed document text from storage.
 *
 * This port isolates Firebase Storage access from interfaces.
 * Infrastructure provides the adapter; application consumes via use cases.
 */

export interface ParsedDocumentPort {
  loadParsedDocumentText(jsonGcsUri: string): Promise<string>;
}
