import { uploadCompleteFile, uploadInitFile } from "../_actions/source-file.actions";
import { makeSourceStorageAdapter } from "./adapters";
import { resolveSourceOrganizationId } from "../../../subdomains/source/application/dto/source.dto";

const sourceStorage = makeSourceStorageAdapter();

export interface UploadWorkspaceSourceFileInput {
  readonly workspaceId: string;
  readonly accountId: string;
  readonly accountType: "user" | "organization";
  readonly file: File;
}

export interface UploadWorkspaceSourceFileResult {
  readonly success: boolean;
  readonly sourceFileId?: string;
  readonly filename?: string;
  readonly gcsUri?: string;
  readonly mimeType?: string;
  readonly sizeBytes?: number;
  readonly error?: { readonly message: string };
}

export async function uploadWorkspaceSourceFile(
  input: UploadWorkspaceSourceFileInput,
): Promise<UploadWorkspaceSourceFileResult> {
  const organizationId = resolveSourceOrganizationId(input.accountType, input.accountId);

  const initResult = await uploadInitFile({
    workspaceId: input.workspaceId,
    organizationId,
    actorAccountId: input.accountId,
    fileName: input.file.name,
    mimeType: input.file.type || "application/octet-stream",
    sizeBytes: input.file.size,
  });

  if (!initResult.ok) {
    return {
      success: false,
      error: { message: initResult.error.message },
    };
  }

  await sourceStorage.upload(input.file, initResult.data.uploadPath, {
    contentType: input.file.type || "application/octet-stream",
  });

  const completeResult = await uploadCompleteFile({
    workspaceId: input.workspaceId,
    organizationId,
    actorAccountId: input.accountId,
    fileId: initResult.data.fileId,
    versionId: initResult.data.versionId,
  });

  if (!completeResult.ok) {
    return {
      success: false,
      error: { message: completeResult.error.message },
    };
  }

  return {
    success: true,
    sourceFileId: initResult.data.fileId,
    filename: input.file.name,
    gcsUri: sourceStorage.toGsUri(initResult.data.uploadPath),
    mimeType: input.file.type || "application/octet-stream",
    sizeBytes: input.file.size,
  };
}
