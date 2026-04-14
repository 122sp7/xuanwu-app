import { z } from "@lib-zod";

export const PLAN_CODES = ["free", "starter", "pro", "enterprise"] as const;
export type PlanCodeLiteral = (typeof PLAN_CODES)[number];

export const PlanCodeSchema = z.string().min(1).brand("PlanCode");
export type PlanCode = z.infer<typeof PlanCodeSchema>;

export function createPlanCode(raw: string): PlanCode {
  return PlanCodeSchema.parse(raw);
}
