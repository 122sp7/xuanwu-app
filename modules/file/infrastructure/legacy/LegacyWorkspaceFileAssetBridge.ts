import type { WorkspaceEntity } from "@/modules/workspace/domain/entities/Workspace";
import {
  getWorkspaceFileAssets,
  type WorkspaceFileAsset,
} from "@/modules/workspace/domain/entities/WorkspaceOperationalSignals";

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
  private readonly versionMap = new Map<string, FileVersion[]>();

  constructor(private readonly workspace: WorkspaceEntity) {}

  findById(fileId: string): File | null {
    const normalizedFileId = fileId.trim();
    if (!normalizedFileId) {
      return null;
    }

    return this.materializeFiles().find((file) => file.id === normalizedFileId) ?? null;
  }

  listByWorkspace(scope: ListWorkspaceFilesScope): File[] {
    if (scope.workspaceId.trim() !== this.workspace.id) {
      return [];
    }

    return this.materializeFiles();
  }

  save(file: File, versions: readonly FileVersion[] = []): void {
    if (versions.length === 0) {
      return;
    }

    this.versionMap.set(file.id, [...versions]);
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

      this.versionMap.set(fileId, [currentVersion]);

      return {
        id: fileId,
        workspaceId: this.workspace.id,
        organizationId: this.workspace.accountType === "organization" ? this.workspace.accountId : "personal",
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

