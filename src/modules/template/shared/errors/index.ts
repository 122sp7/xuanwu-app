// shared/errors — shared error types for the template module

/**
 * Base error class for template module errors.
 * Subclass this for each subdomain error rather than throwing plain Error.
 */
export class TemplateModuleError extends Error {
  constructor(
    message: string,
    public readonly code: string,
  ) {
    super(message);
    this.name = 'TemplateModuleError';
  }
}

export class TemplateNotFoundError extends TemplateModuleError {
  constructor(id: string) {
    super(`Template not found: ${id}`, 'TEMPLATE_NOT_FOUND');
    this.name = 'TemplateNotFoundError';
  }
}

export class TemplateDuplicateNameError extends TemplateModuleError {
  constructor(name: string) {
    super(`Template with name already exists: ${name}`, 'TEMPLATE_DUPLICATE_NAME');
    this.name = 'TemplateDuplicateNameError';
  }
}
