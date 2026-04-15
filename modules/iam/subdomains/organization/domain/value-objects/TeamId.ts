/**
 * TeamId — branded value object for OrganizationTeam identity.
 */
import { z } from "@lib-zod";

export const TeamIdSchema = z.string().uuid().brand("TeamId");
export type TeamId = z.infer<typeof TeamIdSchema>;

export function createTeamId(raw: string): TeamId {
  return TeamIdSchema.parse(raw);
}
