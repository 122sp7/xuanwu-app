export type { CreateRelationDto, RelationDto } from "./dto/RelationDto";
export {
  CreateRelationUseCase,
  RemoveRelationUseCase,
  ListRelationsBySourceUseCase,
  ListRelationsByTargetUseCase,
} from "./use-cases/manage-relation.use-cases";
