import {
  CreateRelationUseCase,
  ListRelationsBySourceUseCase,
  ListRelationsByTargetUseCase,
  RemoveRelationUseCase,
} from "../../../subdomains/relations/application/use-cases/RelationUseCases";
import type { IRelationRepository } from "../../../subdomains/relations/domain/repositories/IRelationRepository";
import { makeRelationRepo } from "./repositories";

export interface RelationUseCases {
  readonly createRelation: CreateRelationUseCase;
  readonly removeRelation: RemoveRelationUseCase;
  readonly listRelationsBySource: ListRelationsBySourceUseCase;
  readonly listRelationsByTarget: ListRelationsByTargetUseCase;
}

export function makeRelationUseCases(repo: IRelationRepository = makeRelationRepo()): RelationUseCases {
  return {
    createRelation: new CreateRelationUseCase(repo),
    removeRelation: new RemoveRelationUseCase(repo),
    listRelationsBySource: new ListRelationsBySourceUseCase(repo),
    listRelationsByTarget: new ListRelationsByTargetUseCase(repo),
  };
}
