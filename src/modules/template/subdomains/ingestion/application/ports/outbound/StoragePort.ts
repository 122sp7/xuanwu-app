/**
 * StoragePort — Outbound Port
 * Abstract contract for reading source documents from object storage.
 */
export interface StoragePort {
  readFile(path: string): Promise<Buffer>;
}
