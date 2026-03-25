/**
 * @deprecated modules/file is retired. Use @/modules/asset/api instead.
 */
export type { File, FileStatus } from "../../asset/domain/entities/File";
export type { FileVersion, FileVersionStatus } from "../../asset/domain/entities/FileVersion";
export { getWorkspaceFiles } from "../../asset/interfaces/queries/file.queries";
export { WorkspaceFilesTab } from "../../asset/interfaces/components/WorkspaceFilesTab";
