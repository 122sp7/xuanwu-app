import { Template } from '../entities/Template';
import { TemplateName } from '../value-objects/TemplateName';

/**
 * TemplateDomainService
 * Cross-entity or stateless domain logic that does not belong to a single aggregate.
 */
export class TemplateDomainService {
  /**
   * Business rule: Two templates are considered duplicates when their normalized
   * names match (case-insensitive, whitespace-collapsed).
   */
  isDuplicateName(existing: Template, candidate: TemplateName): boolean {
    const normalize = (v: string) =>
      v.toLowerCase().replace(/\s+/g, ' ').trim();
    return (
      normalize(existing.name.toString()) === normalize(candidate.toString())
    );
  }
}
