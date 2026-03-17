import type {
  TaxonomyCategoryEntity,
  TaxonomyRelationEntity,
  TaxonomyTagEntity,
} from "../entities/TaxonomyCategory";

export interface TaxonomyRepository {
  findCategoryById(id: string, orgId: string): Promise<TaxonomyCategoryEntity | null>;
  listCategoriesByOrg(orgId: string): Promise<TaxonomyCategoryEntity[]>;
  saveCategory(category: TaxonomyCategoryEntity): Promise<void>;
  assignTags(categoryId: string, orgId: string, tags: TaxonomyTagEntity[]): Promise<void>;
  findTagsByCategory(categoryId: string, orgId: string): Promise<TaxonomyTagEntity[]>;
  replaceRelations(
    categoryId: string,
    orgId: string,
    relations: TaxonomyRelationEntity[],
  ): Promise<void>;
  findRelationsForCategory(categoryId: string, orgId: string): Promise<TaxonomyRelationEntity[]>;
}
