import { z } from "@lib-zod";

export const TeamTypeSchema = z.enum(["internal", "external"]);
export type TeamType = z.infer<typeof TeamTypeSchema>;
