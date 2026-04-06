import type {
  OrganizationEntity,
  MemberReference,
  Team,
  OrgPolicy,
  PartnerInvite,
  OrganizationRole,
} from "../../domain/entities/Organization";

export function toOrganizationEntity(id: string, data: Record<string, unknown>): OrganizationEntity {
  return {
    id,
    name: typeof data.name === "string" ? data.name : "",
    ownerId: typeof data.ownerId === "string" ? data.ownerId : "",
    email: typeof data.email === "string" ? data.email : undefined,
    photoURL: typeof data.photoURL === "string" ? data.photoURL : undefined,
    description: typeof data.description === "string" ? data.description : undefined,
    theme: data.theme != null ? (data.theme as OrganizationEntity["theme"]) : undefined,
    members: Array.isArray(data.members) ? (data.members as MemberReference[]) : [],
    memberIds: Array.isArray(data.memberIds) ? (data.memberIds as string[]) : [],
    teams: Array.isArray(data.teams) ? (data.teams as Team[]) : [],
    partnerInvites: Array.isArray(data.partnerInvites)
      ? (data.partnerInvites as PartnerInvite[])
      : undefined,
    createdAt: data.createdAt as OrganizationEntity["createdAt"],
  };
}

export function toOrgPolicy(id: string, data: Record<string, unknown>): OrgPolicy {
  const VALID_SCOPES = new Set<OrgPolicy["scope"]>(["workspace", "member", "global"]);
  const scope = VALID_SCOPES.has(data.scope as OrgPolicy["scope"])
    ? (data.scope as OrgPolicy["scope"])
    : "global";
  return {
    id,
    orgId: data.orgId as string,
    name: typeof data.name === "string" ? data.name : "",
    description: typeof data.description === "string" ? data.description : "",
    rules: Array.isArray(data.rules) ? (data.rules as OrgPolicy["rules"]) : [],
    scope,
    isActive: data.isActive === true,
    createdAt: typeof data.createdAt === "string" ? data.createdAt : new Date().toISOString(),
    updatedAt: typeof data.updatedAt === "string" ? data.updatedAt : new Date().toISOString(),
  };
}

export function toTeam(id: string, data: Record<string, unknown>): Team {
  return {
    id,
    name: typeof data.name === "string" ? data.name : "",
    description: typeof data.description === "string" ? data.description : "",
    type: data.type === "external" ? "external" : "internal",
    memberIds: Array.isArray(data.memberIds) ? (data.memberIds as string[]) : [],
  };
}

export function toPartnerInvite(id: string, data: Record<string, unknown>): PartnerInvite {
  return {
    id,
    email: data.email as string,
    teamId: data.teamId as string,
    role: (data.role as OrganizationRole) ?? "Guest",
    inviteState: (data.inviteState as PartnerInvite["inviteState"]) ?? "pending",
    invitedAt: data.invitedAt as PartnerInvite["invitedAt"],
    protocol: typeof data.protocol === "string" ? data.protocol : "",
  };
}
