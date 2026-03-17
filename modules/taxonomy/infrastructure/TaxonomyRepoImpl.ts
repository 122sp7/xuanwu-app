import type {
  TaxonomyCategoryEntity,
  TaxonomyRelationEntity,
  TaxonomyTagEntity,
} from "../domain/entities/TaxonomyCategory";
import type { TaxonomyRepository } from "../domain/repositories/TaxonomyRepository";

export class TaxonomyRepoImpl implements TaxonomyRepository {
  private readonly categories = new Map<string, TaxonomyCategoryEntity>();
  private readonly tags = new Map<string, TaxonomyTagEntity[]>();
  private readonly relations = new Map<string, TaxonomyRelationEntity[]>();

  private key(id: string, orgId: string): string {
    return JSON.stringify([orgId, id]);
  }

  private toDate(value: Date | string | number): Date {
    return value instanceof Date ? new Date(value.getTime()) : new Date(value);
  }

  private cloneCategory(category: TaxonomyCategoryEntity): TaxonomyCategoryEntity {
    return {
      ...category,
      createdAt: this.toDate(category.createdAt),
      updatedAt: this.toDate(category.updatedAt),
    };
  }

  private cloneTag(tag: TaxonomyTagEntity): TaxonomyTagEntity {
    return { ...tag };
  }

  private cloneRelation(relation: TaxonomyRelationEntity): TaxonomyRelationEntity {
    return { ...relation };
  }

  async findCategoryById(id: string, orgId: string): Promise<TaxonomyCategoryEntity | null> {
    const category = this.categories.get(this.key(id, orgId));
    return category ? this.cloneCategory(category) : null;
  }

  async listCategoriesByOrg(orgId: string): Promise<TaxonomyCategoryEntity[]> {
    return Array.from(this.categories.values())
      .filter((category) => category.orgId === orgId)
      .sort((left, right) => left.name.localeCompare(right.name))
      .map((category) => this.cloneCategory(category));
  }

  async saveCategory(category: TaxonomyCategoryEntity): Promise<void> {
    this.categories.set(this.key(category.id, category.orgId), this.cloneCategory(category));
  }

  async assignTags(categoryId: string, orgId: string, tags: TaxonomyTagEntity[]): Promise<void> {
    this.tags.set(
      this.key(categoryId, orgId),
      tags
        .sort((left, right) => left.name.localeCompare(right.name))
        .map((tag) => this.cloneTag(tag)),
    );
  }

  async findTagsByCategory(categoryId: string, orgId: string): Promise<TaxonomyTagEntity[]> {
    return (this.tags.get(this.key(categoryId, orgId)) ?? []).map((tag) => this.cloneTag(tag));
  }

  async replaceRelations(
    categoryId: string,
    orgId: string,
    relations: TaxonomyRelationEntity[],
  ): Promise<void> {
    this.relations.set(
      this.key(categoryId, orgId),
      relations
        .filter(
          (relation) =>
            relation.orgId === orgId && relation.fromCategoryId === categoryId,
        )
        .map((relation) => this.cloneRelation(relation)),
    );
  }

  async findRelationsForCategory(
    categoryId: string,
    orgId: string,
  ): Promise<TaxonomyRelationEntity[]> {
    return (this.relations.get(this.key(categoryId, orgId)) ?? []).map((relation) =>
      this.cloneRelation(relation),
    );
  }
}
