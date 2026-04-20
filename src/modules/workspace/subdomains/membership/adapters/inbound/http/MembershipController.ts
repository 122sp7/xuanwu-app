import type { WorkspaceMemberRepository } from "../../../domain/repositories/WorkspaceMemberRepository";
import type { AddMemberInput, MemberRole } from "../../../domain/entities/WorkspaceMember";
import { AddMemberUseCase, ChangeMemberRoleUseCase, RemoveMemberUseCase } from "../../../application/use-cases/MembershipUseCases";
import type { PermissionCheckPort } from "../../../application/ports/PermissionCheckPort";
import type { CommandResult } from "../../../../../../shared";

export class MembershipController {
  private readonly addMember: AddMemberUseCase;
  private readonly changeMemberRole: ChangeMemberRoleUseCase;
  private readonly removeMember: RemoveMemberUseCase;

  constructor(
    memberRepo: WorkspaceMemberRepository,
    permissionCheck: PermissionCheckPort,
  ) {
    this.addMember = new AddMemberUseCase(memberRepo, permissionCheck);
    this.changeMemberRole = new ChangeMemberRoleUseCase(memberRepo, permissionCheck);
    this.removeMember = new RemoveMemberUseCase(memberRepo, permissionCheck);
  }

  async add(requesterActorId: string, input: AddMemberInput): Promise<CommandResult> {
    return this.addMember.execute(requesterActorId, input);
  }

  async changeRole(requesterActorId: string, memberId: string, role: MemberRole): Promise<CommandResult> {
    return this.changeMemberRole.execute(requesterActorId, memberId, role);
  }

  async remove(requesterActorId: string, memberId: string): Promise<CommandResult> {
    return this.removeMember.execute(requesterActorId, memberId);
  }
}
