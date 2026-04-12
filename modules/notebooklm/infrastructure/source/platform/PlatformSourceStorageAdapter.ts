/**
 * Module: notebooklm
 * Layer: infrastructure/source/platform
 * Adapter: PlatformSourceStorageAdapter — delegates to platform StorageAPI.
 */

import { storageInfrastructureApi } from "@/modules/platform/api";

import type {
  ISourceStoragePort,
  SourceStorageUploadOptions,
} from "../../../subdomains/source/domain/ports/ISourceStoragePort";

export class PlatformSourceStorageAdapter implements ISourceStoragePort {
  async upload(
    file: Blob,
    path: string,
    options?: SourceStorageUploadOptions,
  ): Promise<string> {
    return storageInfrastructureApi.upload(file, path, options);
  }

  toGsUri(path: string): string {
    return storageInfrastructureApi.toGsUri(path);
  }
}
