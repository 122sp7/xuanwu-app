import type { AccountUser } from "../entities/References";

export interface ScheduleMdddMemberAvailabilityRepository {
  findMemberByAccountUserId(accountUserId: string): Promise<AccountUser | null>;
  listMembersByOrganizationId(organizationId: string): Promise<readonly AccountUser[]>;
}
