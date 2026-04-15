import type { StoragePort } from '../../../application/ports/outbound/StoragePort';

/**
 * CloudStorageAdapter — Outbound Storage Adapter (stub)
 * TODO: wire to Firebase Cloud Storage SDK in actual module implementation.
 */
export class CloudStorageAdapter implements StoragePort {
  async readFile(_path: string): Promise<Buffer> {
    throw new Error('CloudStorageAdapter.readFile is not yet implemented.');
  }
}
