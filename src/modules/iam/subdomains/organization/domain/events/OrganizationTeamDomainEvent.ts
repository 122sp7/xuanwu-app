import { z } from "@lib-zod";

export const OrganizationTeamCreatedEventSchema = z.object({
  type: z.literal("iam.organization.team_created"),
  eventId: z.string().uuid(),
  occurredAt: z.string().datetime(),
  payload: z.object({ teamId: z.string().uuid(), organizationId: z.string(), name: z.string(), teamType: z.enum(["internal", "external"]) }),
});
export type OrganizationTeamCreatedEvent = z.infer<typeof OrganizationTeamCreatedEventSchema>;

export const OrganizationTeamDeletedEventSchema = z.object({
  type: z.literal("iam.organization.team_deleted"),
  eventId: z.string().uuid(),
  occurredAt: z.string().datetime(),
  payload: z.object({ teamId: z.string().uuid(), organizationId: z.string() }),
});
export type OrganizationTeamDeletedEvent = z.infer<typeof OrganizationTeamDeletedEventSchema>;

export const OrganizationTeamMemberAddedEventSchema = z.object({
  type: z.literal("iam.organization.team_member_added"),
  eventId: z.string().uuid(),
  occurredAt: z.string().datetime(),
  payload: z.object({ teamId: z.string().uuid(), organizationId: z.string(), memberId: z.string() }),
});
export type OrganizationTeamMemberAddedEvent = z.infer<typeof OrganizationTeamMemberAddedEventSchema>;

export const OrganizationTeamMemberRemovedEventSchema = z.object({
  type: z.literal("iam.organization.team_member_removed"),
  eventId: z.string().uuid(),
  occurredAt: z.string().datetime(),
  payload: z.object({ teamId: z.string().uuid(), organizationId: z.string(), memberId: z.string() }),
});
export type OrganizationTeamMemberRemovedEvent = z.infer<typeof OrganizationTeamMemberRemovedEventSchema>;

export type OrganizationTeamDomainEvent =
  | OrganizationTeamCreatedEvent
  | OrganizationTeamDeletedEvent
  | OrganizationTeamMemberAddedEvent
  | OrganizationTeamMemberRemovedEvent;
