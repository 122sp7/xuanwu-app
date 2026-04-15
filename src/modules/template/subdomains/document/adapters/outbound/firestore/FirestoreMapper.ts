import { Template } from '../../../domain/entities/Template';
import { TemplateId } from '../../../domain/value-objects/TemplateId';
import { TemplateName } from '../../../domain/value-objects/TemplateName';

/**
 * Persistence model stored in Firestore.
 */
export interface TemplateDocument {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Mapper between the Template aggregate and its Firestore document representation.
 */
export const FirestoreMapper = {
  toDocument(template: Template): TemplateDocument {
    return {
      id: template.id.toString(),
      name: template.name.toString(),
      description: template.description,
      createdAt: template.createdAt.toISOString(),
      updatedAt: template.updatedAt.toISOString(),
    };
  },

  toDomain(doc: TemplateDocument): Template {
    return Template.restore({
      id: TemplateId.create(doc.id),
      name: TemplateName.create(doc.name),
      description: doc.description,
      createdAt: new Date(doc.createdAt),
      updatedAt: new Date(doc.updatedAt),
    });
  },
};
