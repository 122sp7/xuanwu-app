import type { WorkspaceMemberRepository } from "../../../domain/repositories/WorkspaceMemberRepository";
import { AddMemberUseCase, ChangeMemberRoleUseCase, RemoveMemberUseCase } from "../../../application/use-cases/MembershipUseCases";

export class MembershipController {
  private readonly addMember: AddMemberUseCase;
  private readonly changeMemberRole: ChangeMemberRoleUseCase;
  private readonly removeMember: RemoveMemberUseCase;

  constructor(memberRepo: WorkspaceMemberRepository) {
    this.addMember = new AddMemberUseCase(memberRepo);
    this.changeMemberRole = new ChangeMemberRoleUseCase(memberRepo);
    this.removeMember = new RemoveMemberUseCase(memberRepo);
  }
}
