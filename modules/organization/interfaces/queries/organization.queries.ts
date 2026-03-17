/**
 * Organization Read Queries — thin wrappers for real-time subscription and one-shot reads.
 * Callable from React components/hooks, NOT server actions.
 */

import { FirebaseOrganizationRepository } from "../../infrastructure/firebase/FirebaseOrganizationRepository";
import type { MemberReference, Team, PartnerInvite, OrgPolicy } from "../../domain/entities/Organization";
import type { Unsubscribe } from "../../domain/repositories/OrganizationRepository";

const orgRepo = new FirebaseOrganizationRepository();

// ─── Members ─────────────────────────────────────────────────────────────────

export async function getOrganizationMembers(organizationId: string): Promise<MemberReference[]> {
  return orgRepo.getMembers(organizationId);
}

export function subscribeToOrganizationMembers(
  organizationId: string,
  onUpdate: (members: MemberReference[]) => void,
): Unsubscribe {
  return orgRepo.subscribeToMembers(organizationId, onUpdate);
}

// ─── Teams ───────────────────────────────────────────────────────────────────

export async function getOrganizationTeams(organizationId: string): Promise<Team[]> {
  return orgRepo.getTeams(organizationId);
}

export function subscribeToOrganizationTeams(
  organizationId: string,
  onUpdate: (teams: Team[]) => void,
): Unsubscribe {
  return orgRepo.subscribeToTeams(organizationId, onUpdate);
}

// ─── Partners ─────────────────────────────────────────────────────────────────

export async function getPartnerInvites(organizationId: string): Promise<PartnerInvite[]> {
  return orgRepo.getPartnerInvites(organizationId);
}

// ─── Policy ───────────────────────────────────────────────────────────────────

export async function getOrgPolicies(orgId: string): Promise<OrgPolicy[]> {
  return orgRepo.getPolicies(orgId);
}
