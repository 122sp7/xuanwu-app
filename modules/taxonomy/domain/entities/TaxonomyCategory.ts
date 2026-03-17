export interface TaxonomyCategoryEntity {
  id: string;
  orgId: string;
  name: string;
  parentId?: string;
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaxonomyTagEntity {
  id: string;
  orgId: string;
  name: string;
  color?: string;
}

export type TaxonomyRelationType =
  | "parent-child"
  | "related"
  | "depends-on"
  | "custom";

export interface TaxonomyRelationEntity {
  orgId: string;
  fromCategoryId: string;
  toCategoryId: string;
  type: TaxonomyRelationType;
}
