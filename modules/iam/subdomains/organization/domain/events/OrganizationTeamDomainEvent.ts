/**
 * OrganizationTeamDomainEvent — domain events produced by the OrganizationTeam aggregate.
 *
 * Naming: past-tense, format `iam.organization.<action>`.
 * occurredAt: ISO 8601 string (not Date) per event convention.
 */
import { z } from "@lib-zod";

// ── OrganizationTeamCreated ──────────────────────────────────────────────────

export const OrganizationTeamCreatedEventSchema = z.object({
  type: z.literal("iam.organization.team_created"),
  eventId: z.string().uuid(),
  occurredAt: z.string().datetime(),
  payload: z.object({
    teamId: z.string().uuid(),
    organizationId: z.string(),
    name: z.string(),
    teamType: z.enum(["internal", "external"]),
  }),
});
export type OrganizationTeamCreatedEvent = z.infer<typeof OrganizationTeamCreatedEventSchema>;

// ── OrganizationTeamDeleted ──────────────────────────────────────────────────

export const OrganizationTeamDeletedEventSchema = z.object({
  type: z.literal("iam.organization.team_deleted"),
  eventId: z.string().uuid(),
  occurredAt: z.string().datetime(),
  payload: z.object({
    teamId: z.string().uuid(),
    organizationId: z.string(),
  }),
});
export type OrganizationTeamDeletedEvent = z.infer<typeof OrganizationTeamDeletedEventSchema>;

// ── OrganizationTeamMemberAdded ──────────────────────────────────────────────

export const OrganizationTeamMemberAddedEventSchema = z.object({
  type: z.literal("iam.organization.team_member_added"),
  eventId: z.string().uuid(),
  occurredAt: z.string().datetime(),
  payload: z.object({
    teamId: z.string().uuid(),
    organizationId: z.string(),
    memberId: z.string(),
  }),
});
export type OrganizationTeamMemberAddedEvent = z.infer<typeof OrganizationTeamMemberAddedEventSchema>;

// ── OrganizationTeamMemberRemoved ────────────────────────────────────────────

export const OrganizationTeamMemberRemovedEventSchema = z.object({
  type: z.literal("iam.organization.team_member_removed"),
  eventId: z.string().uuid(),
  occurredAt: z.string().datetime(),
  payload: z.object({
    teamId: z.string().uuid(),
    organizationId: z.string(),
    memberId: z.string(),
  }),
});
export type OrganizationTeamMemberRemovedEvent = z.infer<
  typeof OrganizationTeamMemberRemovedEventSchema
>;

// ── Union ────────────────────────────────────────────────────────────────────

export type OrganizationTeamDomainEvent =
  | OrganizationTeamCreatedEvent
  | OrganizationTeamDeletedEvent
  | OrganizationTeamMemberAddedEvent
  | OrganizationTeamMemberRemovedEvent;
