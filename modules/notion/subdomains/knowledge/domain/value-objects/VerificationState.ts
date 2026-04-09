import { z } from "@lib-zod";

export const VerificationStateSchema = z.enum(["verified", "needs_review"]);
export type VerificationState = z.infer<typeof VerificationStateSchema>;
