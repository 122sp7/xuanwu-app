"use server";

import { z } from "zod";
import { commandFailureFrom, type CommandResult } from "../../../../shared";
import { createClientMembershipController, createClientMembershipUseCases } from "../../outbound/firebase-composition";
import { MEMBER_ROLES } from "../../../subdomains/membership/domain/entities/WorkspaceMember";

const AddMemberActionSchema = z.object({
  actorId: z.string().min(1),
  workspaceId: z.string().uuid(),
  targetActorId: z.string().min(1),
  role: z.enum(MEMBER_ROLES),
  displayName: z.string().min(1),
  email: z.string().email().optional(),
});

const ChangeMemberRoleActionSchema = z.object({
  actorId: z.string().min(1),
  memberId: z.string().uuid(),
  role: z.enum(MEMBER_ROLES),
});

const RemoveMemberActionSchema = z.object({
  actorId: z.string().min(1),
  memberId: z.string().uuid(),
});

const ListMembersActionSchema = z.object({
  workspaceId: z.string().uuid(),
});

export async function addMemberAction(rawInput: unknown): Promise<CommandResult> {
  try {
    const input = AddMemberActionSchema.parse(rawInput);
    const controller = createClientMembershipController();
    return controller.add(input.actorId, {
      workspaceId: input.workspaceId,
      actorId: input.targetActorId,
      role: input.role,
      displayName: input.displayName,
      email: input.email,
    });
  } catch (err) {
    return commandFailureFrom("MEMBERSHIP_INVALID_INPUT", err instanceof Error ? err.message : "Invalid input.");
  }
}

export async function changeMemberRoleAction(rawInput: unknown): Promise<CommandResult> {
  try {
    const input = ChangeMemberRoleActionSchema.parse(rawInput);
    const controller = createClientMembershipController();
    return controller.changeRole(input.actorId, input.memberId, input.role);
  } catch (err) {
    return commandFailureFrom("MEMBERSHIP_INVALID_INPUT", err instanceof Error ? err.message : "Invalid input.");
  }
}

export async function removeMemberAction(rawInput: unknown): Promise<CommandResult> {
  try {
    const input = RemoveMemberActionSchema.parse(rawInput);
    const controller = createClientMembershipController();
    return controller.remove(input.actorId, input.memberId);
  } catch (err) {
    return commandFailureFrom("MEMBERSHIP_INVALID_INPUT", err instanceof Error ? err.message : "Invalid input.");
  }
}

export async function listMembersAction(rawInput: unknown) {
  try {
    const input = ListMembersActionSchema.parse(rawInput);
    const { listMembersByWorkspace } = createClientMembershipUseCases();
    return listMembersByWorkspace.execute(input.workspaceId);
  } catch {
    return [];
  }
}
