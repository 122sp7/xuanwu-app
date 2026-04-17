import { z } from "zod";

export const TeamTypeSchema = z.enum(["internal", "external"]);
export type TeamType = z.infer<typeof TeamTypeSchema>;
