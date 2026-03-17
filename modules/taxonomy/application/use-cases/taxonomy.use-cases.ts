import { commandFailureFrom, commandSuccess } from "@/shared/types";
import type { CommandResult } from "@/shared/types";
import type {
  TaxonomyCategoryEntity,
  TaxonomyRelationEntity,
  TaxonomyRelationType,
  TaxonomyTagEntity,
} from "../../domain/entities/TaxonomyCategory";
import type { TaxonomyRepository } from "../../domain/repositories/TaxonomyRepository";

const TAXONOMY_RELATION_TYPES: ReadonlySet<TaxonomyRelationType> = new Set([
  "parent-child",
  "related",
  "depends-on",
  "custom",
]);

function normalizeOptionalText(value?: string): string | undefined {
  const normalizedValue = value?.trim();
  return normalizedValue ? normalizedValue : undefined;
}

function uniqueTags(tags: TaxonomyTagEntity[]): TaxonomyTagEntity[] {
  const seen = new Set<string>();

  return tags.flatMap((tag) => {
    const normalizedName = tag.name.trim();
    const key = `${tag.orgId}:${normalizedName.toLowerCase()}`;
    if (!normalizedName || seen.has(key)) {
      return [];
    }

    seen.add(key);
    return [{ ...tag, name: normalizedName }];
  });
}

export class UpsertTaxonomyCategoryUseCase {
  constructor(
    private readonly taxonomyRepository: TaxonomyRepository,
    private readonly idGenerator: () => string = () => crypto.randomUUID(),
  ) {}

  async execute(input: {
    orgId: string;
    name: string;
    categoryId?: string;
    parentId?: string;
  }): Promise<CommandResult> {
    try {
      if (!input.orgId?.trim()) {
        return commandFailureFrom("TAXONOMY_ORG_REQUIRED", "orgId is required");
      }

      if (!input.name?.trim()) {
        return commandFailureFrom("TAXONOMY_NAME_REQUIRED", "name is required");
      }

      const existing = input.categoryId
        ? await this.taxonomyRepository.findCategoryById(input.categoryId, input.orgId)
        : null;

      const categoryId = existing?.id ?? input.categoryId ?? this.idGenerator();
      const parentId = normalizeOptionalText(input.parentId);
      if (parentId && parentId === categoryId) {
        return commandFailureFrom(
          "TAXONOMY_CATEGORY_CYCLE",
          "category cannot reference itself as parent",
        );
      }

      if (parentId) {
        const visitedParentIds = new Set<string>();
        let currentParentId: string | undefined = parentId;

        while (currentParentId) {
          if (currentParentId === categoryId) {
            return commandFailureFrom(
              "TAXONOMY_CATEGORY_CYCLE",
              "category tree cannot contain cycles",
            );
          }

          if (visitedParentIds.has(currentParentId)) {
            return commandFailureFrom(
              "TAXONOMY_CATEGORY_CYCLE",
              "category tree cannot contain cycles",
            );
          }

          visitedParentIds.add(currentParentId);
          const parent = await this.taxonomyRepository.findCategoryById(
            currentParentId,
            input.orgId,
          );
          if (!parent) {
            return commandFailureFrom(
              "TAXONOMY_PARENT_NOT_FOUND",
              "parent category does not exist",
            );
          }

          currentParentId = parent.parentId;
        }
      }

      const now = new Date();
      const category: TaxonomyCategoryEntity = {
        id: categoryId,
        orgId: input.orgId,
        name: input.name.trim(),
        parentId,
        version: existing ? existing.version + 1 : 1,
        createdAt: existing?.createdAt ?? now,
        updatedAt: now,
      };

      await this.taxonomyRepository.saveCategory(category);
      return commandSuccess(category.id, category.version);
    } catch (err) {
      return commandFailureFrom(
        "TAXONOMY_UPSERT_FAILED",
        err instanceof Error ? err.message : "Failed to upsert taxonomy category",
      );
    }
  }
}

export class ListTaxonomyCategoriesUseCase {
  constructor(private readonly taxonomyRepository: TaxonomyRepository) {}

  async execute(orgId: string): Promise<TaxonomyCategoryEntity[]> {
    if (!orgId?.trim()) {
      return [];
    }

    try {
      return this.taxonomyRepository.listCategoriesByOrg(orgId);
    } catch {
      return [];
    }
  }
}

export class AssignTaxonomyTagsUseCase {
  constructor(
    private readonly taxonomyRepository: TaxonomyRepository,
    private readonly idGenerator: () => string = () => crypto.randomUUID(),
  ) {}

  async execute(input: {
    categoryId: string;
    orgId: string;
    tags: Array<Pick<TaxonomyTagEntity, "id" | "name" | "color">>;
  }): Promise<CommandResult> {
    try {
      if (!input.orgId?.trim()) {
        return commandFailureFrom("TAXONOMY_ORG_REQUIRED", "orgId is required");
      }

      if (!input.categoryId?.trim()) {
        return commandFailureFrom(
          "TAXONOMY_CATEGORY_REQUIRED",
          "categoryId is required",
        );
      }

      const categoryId = input.categoryId.trim();
      const category = await this.taxonomyRepository.findCategoryById(categoryId, input.orgId);
      if (!category) {
        return commandFailureFrom(
          "TAXONOMY_CATEGORY_NOT_FOUND",
          "category does not exist",
        );
      }

      const processedTags: TaxonomyTagEntity[] = uniqueTags(
        input.tags.flatMap((tag) => {
          const name = tag.name.trim();
          if (!name) {
            return [];
          }

          return [
            {
              id: tag.id?.trim() || this.idGenerator(),
              orgId: input.orgId,
              name,
              color: normalizeOptionalText(tag.color),
            },
          ];
        }),
      );

      await this.taxonomyRepository.assignTags(categoryId, input.orgId, processedTags);
      return commandSuccess(categoryId, category.version);
    } catch (err) {
      return commandFailureFrom(
        "TAXONOMY_TAG_ASSIGN_FAILED",
        err instanceof Error ? err.message : "Failed to assign taxonomy tags",
      );
    }
  }
}

export class ReplaceTaxonomyRelationsUseCase {
  constructor(private readonly taxonomyRepository: TaxonomyRepository) {}

  async execute(input: {
    categoryId: string;
    orgId: string;
    relations: TaxonomyRelationEntity[];
  }): Promise<CommandResult> {
    try {
      if (!input.orgId?.trim()) {
        return commandFailureFrom("TAXONOMY_ORG_REQUIRED", "orgId is required");
      }

      if (!input.categoryId?.trim()) {
        return commandFailureFrom(
          "TAXONOMY_CATEGORY_REQUIRED",
          "categoryId is required",
        );
      }

      const categoryId = input.categoryId.trim();
      const category = await this.taxonomyRepository.findCategoryById(categoryId, input.orgId);
      if (!category) {
        return commandFailureFrom(
          "TAXONOMY_CATEGORY_NOT_FOUND",
          "category does not exist",
        );
      }

      const relations = input.relations.filter(
        (relation) =>
          relation.orgId === input.orgId &&
          relation.fromCategoryId === categoryId &&
          relation.toCategoryId.trim() &&
          TAXONOMY_RELATION_TYPES.has(relation.type),
      );

      await this.taxonomyRepository.replaceRelations(categoryId, input.orgId, relations);
      return commandSuccess(categoryId, category.version);
    } catch (err) {
      return commandFailureFrom(
        "TAXONOMY_RELATIONS_REPLACE_FAILED",
        err instanceof Error ? err.message : "Failed to replace taxonomy relations",
      );
    }
  }
}

export class ResolveTaxonomyRelationsUseCase {
  constructor(private readonly taxonomyRepository: TaxonomyRepository) {}

  async execute(input: {
    categoryId: string;
    orgId: string;
  }): Promise<TaxonomyRelationEntity[]> {
    if (!input.orgId?.trim() || !input.categoryId?.trim()) {
      return [];
    }

    try {
      return this.taxonomyRepository.findRelationsForCategory(
        input.categoryId.trim(),
        input.orgId,
      );
    } catch {
      return [];
    }
  }
}
