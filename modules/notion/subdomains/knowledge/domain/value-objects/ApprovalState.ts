import { z } from "@lib-zod";

export const ApprovalStateSchema = z.enum(["pending", "approved"]);
export type ApprovalState = z.infer<typeof ApprovalStateSchema>;
