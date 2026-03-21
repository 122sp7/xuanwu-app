/**
 * Organization Use Cases — pure business workflows.
 * Covers: org lifecycle, members, teams, partners.
 * No React, no Firebase, no UI framework.
 */

import { commandSuccess, commandFailureFrom, type CommandResult } from "@shared-types";
import type { OrganizationRepository } from "../../domain/repositories/OrganizationRepository";
import type {
  InviteMemberInput,
  UpdateMemberRoleInput,
  CreateTeamInput,
  CreateOrganizationCommand,
  UpdateOrganizationSettingsCommand,
} from "../../domain/entities/Organization";

// ─── Org Lifecycle ────────────────────────────────────────────────────────────

export class CreateOrganizationUseCase {
  constructor(private readonly orgRepo: OrganizationRepository) {}

  async execute(command: CreateOrganizationCommand): Promise<CommandResult> {
    try {
      const orgId = await this.orgRepo.create(command);
      return commandSuccess(orgId, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "CREATE_ORGANIZATION_FAILED",
        err instanceof Error ? err.message : "Failed to create organization",
      );
    }
  }
}

export class CreateOrganizationWithTeamUseCase {
  constructor(private readonly orgRepo: OrganizationRepository) {}

  async execute(
    command: CreateOrganizationCommand,
    teamName: string,
    teamType: "internal" | "external" = "internal",
  ): Promise<CommandResult> {
    try {
      const organizationId = await this.orgRepo.create(command);
      await this.orgRepo.createTeam({
        organizationId,
        name: teamName,
        description: "",
        type: teamType,
      });
      return commandSuccess(organizationId, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "SETUP_ORGANIZATION_WITH_TEAM_FAILED",
        err instanceof Error ? err.message : "Failed to setup organization with team",
      );
    }
  }
}

export class UpdateOrganizationSettingsUseCase {
  constructor(private readonly orgRepo: OrganizationRepository) {}

  async execute(command: UpdateOrganizationSettingsCommand): Promise<CommandResult> {
    try {
      await this.orgRepo.updateSettings(command);
      return commandSuccess(command.organizationId, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "UPDATE_ORGANIZATION_SETTINGS_FAILED",
        err instanceof Error ? err.message : "Failed to update organization settings",
      );
    }
  }
}

export class DeleteOrganizationUseCase {
  constructor(private readonly orgRepo: OrganizationRepository) {}

  async execute(organizationId: string): Promise<CommandResult> {
    try {
      await this.orgRepo.delete(organizationId);
      return commandSuccess(organizationId, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "DELETE_ORGANIZATION_FAILED",
        err instanceof Error ? err.message : "Failed to delete organization",
      );
    }
  }
}

// ─── Members ─────────────────────────────────────────────────────────────────

export class InviteMemberUseCase {
  constructor(private readonly orgRepo: OrganizationRepository) {}

  async execute(input: InviteMemberInput): Promise<CommandResult> {
    try {
      const inviteId = await this.orgRepo.inviteMember(input);
      return commandSuccess(inviteId, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "INVITE_MEMBER_FAILED",
        err instanceof Error ? err.message : "Failed to invite member",
      );
    }
  }
}

export class RecruitMemberUseCase {
  constructor(private readonly orgRepo: OrganizationRepository) {}

  async execute(
    organizationId: string,
    memberId: string,
    name: string,
    email: string,
  ): Promise<CommandResult> {
    try {
      await this.orgRepo.recruitMember(organizationId, memberId, name, email);
      return commandSuccess(memberId, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "RECRUIT_MEMBER_FAILED",
        err instanceof Error ? err.message : "Failed to recruit member",
      );
    }
  }
}

export class RemoveMemberUseCase {
  constructor(private readonly orgRepo: OrganizationRepository) {}

  async execute(organizationId: string, memberId: string): Promise<CommandResult> {
    try {
      await this.orgRepo.removeMember(organizationId, memberId);
      return commandSuccess(memberId, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "REMOVE_MEMBER_FAILED",
        err instanceof Error ? err.message : "Failed to remove member",
      );
    }
  }
}

export class UpdateMemberRoleUseCase {
  constructor(private readonly orgRepo: OrganizationRepository) {}

  async execute(input: UpdateMemberRoleInput): Promise<CommandResult> {
    try {
      await this.orgRepo.updateMemberRole(input);
      return commandSuccess(input.memberId, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "UPDATE_MEMBER_ROLE_FAILED",
        err instanceof Error ? err.message : "Failed to update member role",
      );
    }
  }
}

// ─── Teams ───────────────────────────────────────────────────────────────────

export class CreateTeamUseCase {
  constructor(private readonly orgRepo: OrganizationRepository) {}

  async execute(input: CreateTeamInput): Promise<CommandResult> {
    try {
      const teamId = await this.orgRepo.createTeam(input);
      return commandSuccess(teamId, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "CREATE_TEAM_FAILED",
        err instanceof Error ? err.message : "Failed to create team",
      );
    }
  }
}

export class DeleteTeamUseCase {
  constructor(private readonly orgRepo: OrganizationRepository) {}

  async execute(organizationId: string, teamId: string): Promise<CommandResult> {
    try {
      await this.orgRepo.deleteTeam(organizationId, teamId);
      return commandSuccess(teamId, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "DELETE_TEAM_FAILED",
        err instanceof Error ? err.message : "Failed to delete team",
      );
    }
  }
}

export class UpdateTeamMembersUseCase {
  constructor(private readonly orgRepo: OrganizationRepository) {}

  async execute(
    organizationId: string,
    teamId: string,
    memberId: string,
    action: "add" | "remove",
  ): Promise<CommandResult> {
    try {
      if (action === "add") {
        await this.orgRepo.addMemberToTeam(organizationId, teamId, memberId);
      } else {
        await this.orgRepo.removeMemberFromTeam(organizationId, teamId, memberId);
      }
      return commandSuccess(teamId, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "UPDATE_TEAM_MEMBERS_FAILED",
        err instanceof Error ? err.message : "Failed to update team members",
      );
    }
  }
}

// ─── Partners ─────────────────────────────────────────────────────────────────

export class CreatePartnerGroupUseCase {
  constructor(private readonly orgRepo: OrganizationRepository) {}

  async execute(organizationId: string, groupName: string): Promise<CommandResult> {
    try {
      const teamId = await this.orgRepo.createTeam({
        organizationId,
        name: groupName,
        description: "",
        type: "external",
      });
      return commandSuccess(teamId, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "CREATE_PARTNER_GROUP_FAILED",
        err instanceof Error ? err.message : "Failed to create partner group",
      );
    }
  }
}

export class SendPartnerInviteUseCase {
  constructor(private readonly orgRepo: OrganizationRepository) {}

  async execute(
    organizationId: string,
    teamId: string,
    email: string,
  ): Promise<CommandResult> {
    try {
      const inviteId = await this.orgRepo.sendPartnerInvite(organizationId, teamId, email);
      return commandSuccess(inviteId, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "SEND_PARTNER_INVITE_FAILED",
        err instanceof Error ? err.message : "Failed to send partner invite",
      );
    }
  }
}

export class DismissPartnerMemberUseCase {
  constructor(private readonly orgRepo: OrganizationRepository) {}

  async execute(
    organizationId: string,
    teamId: string,
    memberId: string,
  ): Promise<CommandResult> {
    try {
      await this.orgRepo.dismissPartnerMember(organizationId, teamId, memberId);
      return commandSuccess(memberId, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "DISMISS_PARTNER_MEMBER_FAILED",
        err instanceof Error ? err.message : "Failed to dismiss partner member",
      );
    }
  }
}
