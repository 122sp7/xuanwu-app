import { z } from "@lib-zod";

export const OrganizationIdSchema = z.string().min(1).brand("OrganizationId");
export type OrganizationId = z.infer<typeof OrganizationIdSchema>;

export function createOrganizationId(raw: string): OrganizationId {
  return OrganizationIdSchema.parse(raw);
}
