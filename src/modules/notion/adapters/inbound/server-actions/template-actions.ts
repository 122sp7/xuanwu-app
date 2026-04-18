"use server";

/**
 * template-actions — notion template server actions (stub).
 *
 * Templates use case is not yet implemented. These actions return empty
 * results until TemplateUseCases are implemented.
 */

import { z } from "zod";
import type { Template } from "../../../subdomains/template/domain/entities/Template";

const QueryTemplatesInputSchema = z.object({
  workspaceId: z.string().uuid(),
  accountId: z.string().min(1),
  scope: z.enum(["workspace", "org", "global"]).optional(),
  category: z.enum(["page", "database", "workflow"]).optional(),
});

export async function queryTemplatesAction(rawInput: unknown): Promise<Template[]> {
  QueryTemplatesInputSchema.parse(rawInput);
  // TODO: implement when TemplateUseCases are available
  return [];
}
