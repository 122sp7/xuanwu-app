import { z } from "@lib-zod";

export const TopKSchema = z.number().int().positive().max(100).brand("TopK");
export type TopK = z.infer<typeof TopKSchema>;

export function createTopK(raw: number): TopK {
  return TopKSchema.parse(raw);
}

export const DEFAULT_TOP_K: TopK = 10 as TopK;
