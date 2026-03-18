import { Knowledge } from '../entities/knowledge.entity';
import { Taxonomy } from '../value-objects/taxonomy.vo';

export class KnowledgeAggregate {
  constructor(
    public readonly root: Knowledge,
    public taxonomy: Taxonomy
  ) {}
  
  // 業務動作：例如「更新分類時必須同時觸發標籤重整」
  updateTaxonomy(newTaxonomy: Taxonomy) {
    this.taxonomy = newTaxonomy;
  }
}