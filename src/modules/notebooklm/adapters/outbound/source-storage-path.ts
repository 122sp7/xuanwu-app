export function buildSourceUploadPath(params: {
  accountId: string;
  workspaceId: string;
  filename: string;
  uuid: string;
}): string {
  const safeName = params.filename.replace(/[^a-zA-Z0-9._-]/g, "_");
  return `sources/${params.accountId}/${params.workspaceId}/${params.uuid}-${safeName}`;
}
