import { z } from "@lib-zod";

export const PageStatusSchema = z.enum(["active", "archived"]);
export type PageStatus = z.infer<typeof PageStatusSchema>;

export const PAGE_STATUSES = ["active", "archived"] as const satisfies readonly PageStatus[];
