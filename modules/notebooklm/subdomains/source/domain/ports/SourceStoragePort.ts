/**
 * Module: notebooklm/subdomains/source
 * Layer: domain/ports
 * Port: SourceStoragePort — file upload and GCS URI resolution contract.
 *
 * UI components and application services use this port instead of importing
 * platform infrastructure APIs directly, keeping the hexagonal boundary clean.
 */

export interface SourceStorageUploadOptions {
  readonly contentType?: string;
  readonly customMetadata?: Record<string, string>;
}

export interface SourceStoragePort {
  /** Upload a file blob to the given storage path. Returns the download URL. */
  upload(file: Blob, path: string, options?: SourceStorageUploadOptions): Promise<string>;
  /** Convert a relative storage path to a gs:// URI. */
  toGsUri(path: string): string;
}
