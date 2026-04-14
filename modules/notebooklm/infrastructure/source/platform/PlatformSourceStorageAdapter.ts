/**
 * Module: notebooklm
 * Layer: infrastructure/source/platform
 * Adapter: PlatformSourceStorageAdapter — delegates to platform StorageAPI.
 */

import { storageInfrastructureApi } from "@/modules/platform/api/infrastructure";

import type {
  SourceStoragePort,
  SourceStorageUploadOptions,
} from "../../../subdomains/source/domain/ports/SourceStoragePort";

export class PlatformSourceStorageAdapter implements SourceStoragePort {
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
