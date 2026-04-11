import { z } from "@lib-zod";

export const RelevanceScoreSchema = z.number().min(0).max(1).brand("RelevanceScore");
export type RelevanceScore = z.infer<typeof RelevanceScoreSchema>;

export function createRelevanceScore(raw: number): RelevanceScore {
  return RelevanceScoreSchema.parse(raw);
}
