/**
 * TeamType — value object representing the membership scope of an OrganizationTeam.
 *
 * - internal: members belong to the same Organization
 * - external: members include partner/guest actors outside the Organization
 */
import { z } from "zod";

export const TeamTypeSchema = z.enum(["internal", "external"]);
export type TeamType = z.infer<typeof TeamTypeSchema>;
