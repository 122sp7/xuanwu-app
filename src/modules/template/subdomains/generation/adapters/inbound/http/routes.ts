/**
 * generation/routes.ts (stub)
 *
 * Register GenerationController routes here when activating this subdomain.
 * Example structure for a Next.js App Router route handler:
 *
 * ```ts
 * export async function POST(request: Request) {
 *   const body = await request.json();
 *   const controller = getGenerationController();
 *   const result = await controller.handleGenerate(body);
 *   return Response.json(result.body, { status: result.status });
 * }
 * ```
 */
export const GENERATION_ROUTES = {
  generate: '/api/templates/:sourceId/generate',
} as const;
