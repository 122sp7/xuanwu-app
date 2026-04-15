// shared/config — module-level configuration
// Place typed configuration interfaces and defaults here.
// Config values should be injected at the composition root, not read from
// process.env directly inside subdomains.

export interface TemplateModuleConfig {
  /** Maximum number of templates per account. */
  maxTemplatesPerAccount: number;
  /** Default locale for template content. */
  defaultLocale: string;
}

export const defaultTemplateModuleConfig: TemplateModuleConfig = {
  maxTemplatesPerAccount: 100,
  defaultLocale: 'en',
};
