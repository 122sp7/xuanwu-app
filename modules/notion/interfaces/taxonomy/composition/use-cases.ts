import {
  CreateTaxonomyNodeUseCase,
  ListTaxonomyChildrenUseCase,
  ListTaxonomyRootsUseCase,
  RemoveTaxonomyNodeUseCase,
} from "../../../subdomains/taxonomy/application/use-cases/TaxonomyUseCases";
import type { ITaxonomyRepository } from "../../../subdomains/taxonomy/domain/repositories/ITaxonomyRepository";
import { makeTaxonomyRepo } from "./repositories";

export interface TaxonomyUseCases {
  readonly createTaxonomyNode: CreateTaxonomyNodeUseCase;
  readonly removeTaxonomyNode: RemoveTaxonomyNodeUseCase;
  readonly listTaxonomyRoots: ListTaxonomyRootsUseCase;
  readonly listTaxonomyChildren: ListTaxonomyChildrenUseCase;
}

export function makeTaxonomyUseCases(
  repo: ITaxonomyRepository = makeTaxonomyRepo(),
): TaxonomyUseCases {
  return {
    createTaxonomyNode: new CreateTaxonomyNodeUseCase(repo),
    removeTaxonomyNode: new RemoveTaxonomyNodeUseCase(repo),
    listTaxonomyRoots: new ListTaxonomyRootsUseCase(repo),
    listTaxonomyChildren: new ListTaxonomyChildrenUseCase(repo),
  };
}
