import type { WorkspaceEntity } from "@/modules/workspace/domain/entities/Workspace";
import {
  getWorkspaceFileAssets,
  type WorkspaceFileAsset,
} from "@/modules/workspace/domain/entities/WorkspaceOperationalSignals";

import { resolveFileOrganizationId } from "../../domain/services/resolve-file-organization-id";
import type { File } from "../../domain/entities/File";
import type { FileVersion } from "../../domain/entities/FileVersion";
import type { FileRepository, ListWorkspaceFilesScope } from "../../domain/repositories/FileRepository";

function nowISO() {
  return new Date().toISOString();
}

function normalizeClassification(kind: WorkspaceFileAsset["kind"]): File["classification"] {
  switch (kind) {
    case "image":
      return "image";
    case "manifest":
      return "manifest";
    case "record":
      return "record";
    default:
      return "other";
  }
}

function inferMimeType(asset: WorkspaceFileAsset): string {
  if (asset.kind === "image") {
    return "image/*";
  }

  if (asset.name.endsWith(".json")) {
    return "application/json";
  }

  return "application/octet-stream";
}

export class LegacyWorkspaceFileAssetBridge implements FileRepository {
  constructor(private readonly workspace: WorkspaceEntity) {}

  async findById(fileId: string): Promise<File | null> {
    const normalizedFileId = fileId.trim();
    if (!normalizedFileId) {
      return null;
    }

    return this.materializeFiles().find((file) => file.id === normalizedFileId) ?? null;
  }

  async listByWorkspace(scope: ListWorkspaceFilesScope): Promise<readonly File[]> {
    if (scope.workspaceId.trim() !== this.workspace.id) {
      return [];
    }

    return this.materializeFiles();
  }

  async save(file: File, versions: readonly FileVersion[] = []): Promise<void> {
    void file;
    void versions;
    throw new Error("LegacyWorkspaceFileAssetBridge is read-only and does not persist file changes.");
  }

  private materializeFiles(): File[] {
    const createdAtISO = nowISO();

    return getWorkspaceFileAssets(this.workspace).map((asset) => {
      const fileId = `legacy-file-${this.workspace.id}-${asset.id}`;
      const versionId = `legacy-version-${this.workspace.id}-${asset.id}-v1`;
      const storagePath = `legacy/workspaces/${this.workspace.id}/files/${asset.id}`;

      const currentVersion: FileVersion = {
        id: versionId,
        fileId,
        versionNumber: 1,
        status: "active",
        storagePath,
        createdAtISO,
      };

      return {
        id: fileId,
        workspaceId: this.workspace.id,
        organizationId: resolveFileOrganizationId(this.workspace.accountType, this.workspace.accountId),
        accountId: this.workspace.accountId,
        name: asset.name,
        mimeType: inferMimeType(asset),
        sizeBytes: 0,
        classification: normalizeClassification(asset.kind),
        tags: [asset.status],
        currentVersionId: currentVersion.id,
        status: asset.status === "derived" ? "archived" : "active",
        source: asset.source,
        detail: asset.detail,
        href: asset.href,
        createdAtISO,
        updatedAtISO: createdAtISO,
      };
    });
  }
}
