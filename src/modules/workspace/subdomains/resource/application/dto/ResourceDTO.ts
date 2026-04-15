import { z } from "@lib-zod";
import { RESOURCE_KINDS } from "../../domain/entities/ResourceQuota";

export const ProvisionQuotaSchema = z.object({
  workspaceId: z.string().uuid(),
  resourceKind: z.enum(RESOURCE_KINDS),
  limit: z.number().int().positive(),
});

export const ConsumeQuotaSchema = z.object({
  workspaceId: z.string().uuid(),
  resourceKind: z.enum(RESOURCE_KINDS),
  amount: z.number().int().positive(),
});

export type ProvisionQuotaDTO = z.infer<typeof ProvisionQuotaSchema>;
export type ConsumeQuotaDTO = z.infer<typeof ConsumeQuotaSchema>;
