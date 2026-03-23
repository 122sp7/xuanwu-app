import type {
  WorkspaceMemberAccessChannel,
  WorkspaceMemberPresence,
  WorkspaceMemberView,
} from "../../domain/entities/WorkspaceMember";
import type { WorkspaceQueryRepository } from "../../domain/repositories/WorkspaceQueryRepository";
import type { WorkspaceEntity } from "../../domain/entities/Workspace";
import { FirebaseOrganizationRepository } from "@/modules/organization/infrastructure/firebase/FirebaseOrganizationRepository";
import type {
  MemberReference,
  Team,
} from "@/modules/organization/domain/entities/Organization";
import { collection, getFirestore, onSnapshot, query, where } from "firebase/firestore";
import { firebaseClientApp } from "@integration-firebase/client";
import { FirebaseWorkspaceRepository, toWorkspaceEntity } from "./FirebaseWorkspaceRepository";

const personnelLabels = {
  managerId: "Manager",
  supervisorId: "Supervisor",
  safetyOfficerId: "Safety officer",
} as const;

function toPresence(value: MemberReference["presence"] | undefined): WorkspaceMemberPresence {
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
  private get db() {
    return getFirestore(firebaseClientApp);
  }

  private readonly workspaceRepo = new FirebaseWorkspaceRepository();

  private readonly organizationRepo = new FirebaseOrganizationRepository();

  subscribeToWorkspacesForAccount(
    accountId: string,
    onUpdate: (workspaces: WorkspaceEntity[]) => void,
  ) {
    const normalizedAccountId = accountId.trim();
    if (!normalizedAccountId) {
      onUpdate([]);
      return () => {};
    }

    const q = query(
      collection(this.db, "workspaces"),
      where("accountId", "==", normalizedAccountId),
    );

    return onSnapshot(q, (snap) => {
      const workspaces = snap.docs.map((docSnap) =>
        toWorkspaceEntity(docSnap.id, docSnap.data() as Record<string, unknown>),
      );
      onUpdate(workspaces);
    });
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
      orgMember?: MemberReference,
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
        this.organizationRepo.getMembers(workspace.accountId),
        this.organizationRepo.getTeams(workspace.accountId),
      ]);

      const organizationMemberMap = new Map(organizationMembers.map((member) => [member.id, member]));
      const teamMap = new Map(teams.map((team) => [team.id, team]));

      const mergeTeam = (team: Team, role?: string, protocol?: string) => {
        const label = team.name || team.id;
        team.memberIds.forEach((memberId) => {
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

      Object.entries(personnelLabels).forEach(([field, label]) => {
        const memberId = workspace.personnel?.[field as keyof typeof workspace.personnel];
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

      Object.entries(personnelLabels).forEach(([field, label]) => {
        const memberId = workspace.personnel?.[field as keyof typeof workspace.personnel];
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
