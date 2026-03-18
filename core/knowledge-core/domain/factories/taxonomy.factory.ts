import { Taxonomy } from '../value-objects/taxonomy.vo';

export class TaxonomyFactory {
  static fromAI(rawTags: string[], suggestedCategory?: string): Taxonomy {
    return new Taxonomy(
      suggestedCategory || 'uncategorized',
      rawTags
    );
  }
}