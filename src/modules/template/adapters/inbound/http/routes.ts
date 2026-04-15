import type { TemplateController } from './TemplateController';

/**
 * HTTP route definitions for the template module.
 * Framework-agnostic registration descriptor; wired up at composition root.
 */
export interface HttpRoute {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  handler: (req: {
    body?: unknown;
    params?: Record<string, string>;
  }) => Promise<unknown>;
}

export function buildTemplateRoutes(controller: TemplateController): HttpRoute[] {
  return [
    {
      method: 'POST',
      path: '/templates',
      handler: (req) => controller.create(req.body as never),
    },
    {
      method: 'PUT',
      path: '/templates/:id',
      handler: (req) =>
        controller.update({
          ...(req.body as object),
          id: req.params?.id ?? '',
        } as never),
    },
    {
      method: 'DELETE',
      path: '/templates/:id',
      handler: (req) => controller.delete(req.params?.id ?? ''),
    },
  ];
}
