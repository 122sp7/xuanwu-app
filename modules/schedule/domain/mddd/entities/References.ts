import type { Capability, Skill } from "../value-objects/Requirements";
import type { Availability } from "../value-objects/Scheduling";

export interface AccountUser {
  readonly accountUserId: string;
  readonly teamIds: readonly string[];
  readonly skills: readonly Skill[];
  readonly capabilities: readonly Capability[];
  readonly availability: Availability;
  readonly currentLoadUnits: number;
}

export interface Team {
  readonly teamId: string;
  readonly organizationId: string;
  readonly name: string;
  readonly capabilityIds: readonly string[];
  readonly memberAccountUserIds: readonly string[];
}

export interface Organization {
  readonly organizationId: string;
  readonly maxLoadPerMember: number;
  readonly maxConcurrentAssignmentsPerMember: number;
}
