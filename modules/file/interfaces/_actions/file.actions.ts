"use server";

import type {
  UploadInitFileInputDto,
  UploadInitFileOutputDto,
} from "../../application/dto/file.dto";
import type { FileCommandResult } from "../contracts/file-command-result";

function createCommandId(idempotencyKey?: string) {
  const normalized = idempotencyKey?.trim();
  if (normalized) {
    return normalized;
  }

  return `file-upload-init-${Date.now()}`;
}

export async function uploadInitFile(
  input: UploadInitFileInputDto,
): Promise<FileCommandResult<UploadInitFileOutputDto>> {
  const commandId = createCommandId(input.idempotencyKey);

  if (!input.workspaceId.trim()) {
    return {
      ok: false,
      error: { code: "FILE_WORKSPACE_REQUIRED", message: "Workspace is required." },
      commandId,
    };
  }

  if (!input.organizationId.trim()) {
    return {
      ok: false,
      error: { code: "FILE_ORGANIZATION_REQUIRED", message: "Organization is required." },
      commandId,
    };
  }

  if (!input.actorAccountId.trim()) {
    return {
      ok: false,
      error: { code: "FILE_ACTOR_REQUIRED", message: "Actor account is required." },
      commandId,
    };
  }

  if (!input.fileName.trim()) {
    return {
      ok: false,
      error: { code: "FILE_NAME_REQUIRED", message: "File name is required." },
      commandId,
    };
  }

  if (!Number.isFinite(input.sizeBytes) || input.sizeBytes <= 0) {
    return {
      ok: false,
      error: { code: "FILE_INVALID_SIZE", message: "File size must be a positive number." },
      commandId,
    };
  }

  return {
    ok: false,
    error: {
      code: "FILE_UPLOAD_INIT_NOT_IMPLEMENTED",
      message: "Upload-init flow is staged and will be implemented in the next migration phase.",
    },
    commandId,
  };
}

