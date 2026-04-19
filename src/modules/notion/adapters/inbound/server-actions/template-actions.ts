"use server";

/**
 * template-actions — notion template server actions.
 */

import { z } from "zod";
import type { Template } from "../../../subdomains/template/domain/entities/Template";
import { createClientNotionTemplateUseCases } from "../../outbound/firebase-composition";

// ── Input schemas ─────────────────────────────────────────────────────────────

const QueryTemplatesInputSchema = z.object({
  workspaceId: z.string().uuid(),
  accountId: z.string().min(1),
  scope: z.enum(["workspace", "org", "global"]).optional(),
  category: z.enum(["page", "database", "workflow"]).optional(),
});

const CreateTemplateInputSchema = z.object({
  workspaceId: z.string().uuid(),
  accountId: z.string().min(1),
  title: z.string().min(1).max(200),
  category: z.enum(["page", "database", "workflow"]),
  createdByUserId: z.string().min(1),
  description: z.string().max(500).optional(),
});

// ── Actions ───────────────────────────────────────────────────────────────────

export async function queryTemplatesAction(rawInput: unknown): Promise<Template[]> {
  const input = QueryTemplatesInputSchema.parse(rawInput);
  const { queryTemplates } = createClientNotionTemplateUseCases();
  return queryTemplates.execute(input.workspaceId);
}

export async function createTemplateAction(rawInput: unknown) {
  const input = CreateTemplateInputSchema.parse(rawInput);
  const { createTemplate } = createClientNotionTemplateUseCases();
  return createTemplate.execute({
    workspaceId: input.workspaceId,
    title: input.title,
    category: input.category,
    createdByUserId: input.createdByUserId,
    description: input.description,
  });
}
