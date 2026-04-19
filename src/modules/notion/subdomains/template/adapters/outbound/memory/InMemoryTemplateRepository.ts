import type { Template, TemplateCategory, TemplateScope, TemplateRepository } from "../../../domain/entities/Template";

export class InMemoryTemplateRepository implements TemplateRepository {
  private readonly store = new Map<string, Template>();

  async save(template: Template): Promise<void> {
    this.store.set(template.id, template);
  }

  async findById(id: string): Promise<Template | null> {
    return this.store.get(id) ?? null;
  }

  async findByScope(scope: TemplateScope, contextId?: string): Promise<Template[]> {
    const results = Array.from(this.store.values()).filter((t) => t.scope === scope);
    if (scope === "workspace" && contextId) {
      return results.filter((t) => t.workspaceId === contextId);
    }
    if (scope === "organization" && contextId) {
      return results.filter((t) => t.organizationId === contextId);
    }
    return results;
  }

  async listByCategory(category: TemplateCategory): Promise<Template[]> {
    return Array.from(this.store.values()).filter((t) => t.category === category);
  }

  async delete(id: string): Promise<void> {
    this.store.delete(id);
  }
}
