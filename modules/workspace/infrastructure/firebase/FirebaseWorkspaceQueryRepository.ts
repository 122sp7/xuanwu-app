import type {
  WorkspaceMemberAccessChannel,
  WorkspaceMemberPresence,
  WorkspaceMemberView,
} from "../../domain/entities/WorkspaceMemberView";
import type { WorkspaceQueryRepository } from "../../domain/ports/output/WorkspaceQueryRepository";
import type { WorkspaceEntity } from "../../domain/aggregates/Workspace";
import { firestoreInfrastructureApi } from "@/modules/platform/api";
import { FirebaseWorkspaceRepository, toWorkspaceEntity } from "./FirebaseWorkspaceRepository";

const personnelLabels = {
  managerId: "Manager",
  supervisorId: "Supervisor",
  safetyOfficerId: "Safety officer",
} as const;

const personnelLabelEntries = Object.entries(personnelLabels) as Array<
  [keyof typeof personnelLabels, string]
>;

interface OrganizationMemberReference {
  id: string;
  name: string;
  email?: string;
  role?: string;
  presence?: string;
  isExternal?: boolean;
}

interface OrganizationTeam {
  id: string;
  name: string;
  memberIds: string[];
}

interface OrganizationDirectoryGateway {
  getOrganizationMembers(organizationId: string): Promise<OrganizationMemberReference[]>;
  getOrganizationTeams(organizationId: string): Promise<OrganizationTeam[]>;
}

const defaultOrganizationDirectoryGateway: OrganizationDirectoryGateway = {
  async getOrganizationMembers() {
    return [];
  },
  async getOrganizationTeams() {
    return [];
  },
};

function toPresence(value: OrganizationMemberReference["presence"] | undefined): WorkspaceMemberPresence {
  if (value === "active" || value === "away" || value === "offline") {
    return value;
  }

  return "unknown";
}

function createFallbackMember(id: string): WorkspaceMemberView {
  return {
    id,
    displayName: id,
    presence: "unknown",
    isExternal: false,
    accessChannels: [],
  };
}

export class FirebaseWorkspaceQueryRepository implements WorkspaceQueryRepository {
  constructor(
    private readonly organizationDirectoryGateway: OrganizationDirectoryGateway = defaultOrganizationDirectoryGateway,
  ) {}

  private readonly workspaceRepo = new FirebaseWorkspaceRepository();

  subscribeToWorkspacesForAccount(
    accountId: string,
    onUpdate: (workspaces: WorkspaceEntity[]) => void,
  ) {
    const normalizedAccountId = accountId.trim();
    if (!normalizedAccountId) {
      onUpdate([]);
      return () => {};
    }

    return firestoreInfrastructureApi.watchCollection<Record<string, unknown>>(
      "workspaces",
      {
        onNext: (documents) => {
          const workspaces = documents.map((document) => toWorkspaceEntity(document.id, document.data));
          onUpdate(workspaces);
        },
      },
      [{ field: "accountId", op: "==", value: normalizedAccountId }],
    );
  }

  async getWorkspaceMembers(workspaceId: string): Promise<WorkspaceMemberView[]> {
    const workspace = await this.workspaceRepo.findById(workspaceId);
    if (!workspace) {
      return [];
    }

    const members = new Map<string, WorkspaceMemberView>();
    const memberChannelKeys = new Map<string, Set<string>>();

    const mergeMember = (
      memberId: string,
      channel: WorkspaceMemberAccessChannel,
      orgMember?: OrganizationMemberReference,
    ) => {
      const current = members.get(memberId) ?? createFallbackMember(memberId);
      const channelKey = [
        channel.source,
        channel.label,
        channel.role ?? "",
        channel.protocol ?? "",
        channel.teamId ?? "",
      ].join("::");
      const knownChannelKeys = memberChannelKeys.get(memberId) ?? new Set<string>();
      memberChannelKeys.set(memberId, knownChannelKeys);
      const hasSameChannel = knownChannelKeys.has(channelKey);
      if (!hasSameChannel) {
        knownChannelKeys.add(channelKey);
      }

      members.set(memberId, {
        id: memberId,
        displayName: orgMember?.name || current.displayName,
        email: orgMember?.email ?? current.email,
        organizationRole: orgMember?.role ?? current.organizationRole,
        presence: orgMember ? toPresence(orgMember.presence) : current.presence,
        isExternal: orgMember?.isExternal ?? current.isExternal,
        accessChannels: hasSameChannel ? current.accessChannels : [...current.accessChannels, channel],
      });
    };

    if (workspace.accountType === "organization") {
      const [organizationMembers, teams] = await Promise.all([
        this.organizationDirectoryGateway.getOrganizationMembers(workspace.accountId),
        this.organizationDirectoryGateway.getOrganizationTeams(workspace.accountId),
      ]);

      const organizationMemberMap = new Map(organizationMembers.map((member) => [member.id, member]));
      const teamMap = new Map(teams.map((team) => [team.id, team]));

      const mergeTeam = (team: OrganizationTeam, role?: string, protocol?: string) => {
        const label = team.name || team.id;
        team.memberIds.forEach((memberId: string) => {
          mergeMember(
            memberId,
            {
              source: "team",
              label,
              role,
              protocol,
              teamId: team.id,
            },
            organizationMemberMap.get(memberId),
          );
        });
      };

      workspace.teamIds.forEach((teamId) => {
        const team = teamMap.get(teamId);
        if (team) {
          mergeTeam(team);
        }
      });

      workspace.grants.forEach((grant) => {
        if (grant.userId) {
          mergeMember(
            grant.userId,
            {
              source: "direct",
              label: "Direct access",
              role: grant.role,
              protocol: grant.protocol,
            },
            organizationMemberMap.get(grant.userId),
          );
        }

        if (grant.teamId) {
          const team = teamMap.get(grant.teamId);
          if (team) {
            mergeTeam(team, grant.role, grant.protocol);
          }
        }
      });

      personnelLabelEntries.forEach(([field, label]) => {
        const memberId = workspace.personnel?.[field];
        if (memberId) {
          mergeMember(
            memberId,
            {
              source: "personnel",
              label,
            },
            organizationMemberMap.get(memberId),
          );
        }
      });
    } else {
      mergeMember(workspace.accountId, {
        source: "owner",
        label: "Workspace owner",
      });

      workspace.grants.forEach((grant) => {
        if (grant.userId) {
          mergeMember(grant.userId, {
            source: "direct",
            label: "Direct access",
            role: grant.role,
            protocol: grant.protocol,
          });
        }
      });

      personnelLabelEntries.forEach(([field, label]) => {
        const memberId = workspace.personnel?.[field];
        if (memberId) {
          mergeMember(memberId, {
            source: "personnel",
            label,
          });
        }
      });
    }

    return Array.from(members.values()).sort((left, right) =>
      left.displayName.localeCompare(right.displayName),
    );
  }
}
