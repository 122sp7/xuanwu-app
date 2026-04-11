/**
 * Module: platform/subdomains/team
 * Layer: domain/entities
 * Purpose: Team entity and related input types owned by the team subdomain.
 */

export interface Team {
  id: string;
  name: string;
  description: string;
  type: "internal" | "external";
  memberIds: string[];
}

export interface CreateTeamInput {
  organizationId: string;
  name: string;
  description: string;
  type: "internal" | "external";
}
