import {
  CreateRelationUseCase,
  ListRelationsBySourceUseCase,
  ListRelationsByTargetUseCase,
  RemoveRelationUseCase,
} from "../../../subdomains/relations/application/use-cases/manage-relation.use-cases";
import type { RelationRepository } from "../../../subdomains/relations/domain/repositories/RelationRepository";
import { makeRelationRepo } from "./repositories";

export interface RelationUseCases {
  readonly createRelation: CreateRelationUseCase;
  readonly removeRelation: RemoveRelationUseCase;
  readonly listRelationsBySource: ListRelationsBySourceUseCase;
  readonly listRelationsByTarget: ListRelationsByTargetUseCase;
}

export function makeRelationUseCases(repo: RelationRepository = makeRelationRepo()): RelationUseCases {
  return {
    createRelation: new CreateRelationUseCase(repo),
    removeRelation: new RemoveRelationUseCase(repo),
    listRelationsBySource: new ListRelationsBySourceUseCase(repo),
    listRelationsByTarget: new ListRelationsByTargetUseCase(repo),
  };
}
