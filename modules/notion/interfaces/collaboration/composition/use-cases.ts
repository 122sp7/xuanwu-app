import {
  CreateCommentUseCase,
  UpdateCommentUseCase,
  ResolveCommentUseCase,
  DeleteCommentUseCase,
  ListCommentsUseCase,
  CreateVersionUseCase,
  DeleteVersionUseCase,
  GrantPermissionUseCase,
  RevokePermissionUseCase,
} from "../../../subdomains/collaboration/application/use-cases";
import type { ICommentRepository } from "../../../subdomains/collaboration/domain/repositories/ICommentRepository";
import type { IVersionRepository } from "../../../subdomains/collaboration/domain/repositories/IVersionRepository";
import type { IPermissionRepository } from "../../../subdomains/collaboration/domain/repositories/IPermissionRepository";
import { makeCommentRepo, makeVersionRepo, makePermissionRepo } from "./repositories";

export interface CollaborationUseCases {
  readonly createComment: CreateCommentUseCase;
  readonly updateComment: UpdateCommentUseCase;
  readonly resolveComment: ResolveCommentUseCase;
  readonly deleteComment: DeleteCommentUseCase;
  readonly listComments: ListCommentsUseCase;
  readonly createVersion: CreateVersionUseCase;
  readonly deleteVersion: DeleteVersionUseCase;
  readonly grantPermission: GrantPermissionUseCase;
  readonly revokePermission: RevokePermissionUseCase;
}

export function makeCollaborationUseCases(
  commentRepo: ICommentRepository = makeCommentRepo(),
  versionRepo: IVersionRepository = makeVersionRepo(),
  permissionRepo: IPermissionRepository = makePermissionRepo(),
): CollaborationUseCases {
  return {
    createComment: new CreateCommentUseCase(commentRepo),
    updateComment: new UpdateCommentUseCase(commentRepo),
    resolveComment: new ResolveCommentUseCase(commentRepo),
    deleteComment: new DeleteCommentUseCase(commentRepo),
    listComments: new ListCommentsUseCase(commentRepo),
    createVersion: new CreateVersionUseCase(versionRepo),
    deleteVersion: new DeleteVersionUseCase(versionRepo),
    grantPermission: new GrantPermissionUseCase(permissionRepo),
    revokePermission: new RevokePermissionUseCase(permissionRepo),
  };
}
