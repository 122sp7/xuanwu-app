import { z } from "@lib-zod";

export const IssueIdSchema = z.string().uuid().brand("IssueId");
export type IssueId = z.infer<typeof IssueIdSchema>;

export function createIssueId(raw: string): IssueId {
  return IssueIdSchema.parse(raw);
}
