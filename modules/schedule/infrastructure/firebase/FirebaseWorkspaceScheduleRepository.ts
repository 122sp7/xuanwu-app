import { FirebaseFinanceRepository } from "@/modules/finance/infrastructure/firebase/FirebaseFinanceRepository";
import { FirebaseWorkspaceRepository } from "@/modules/workspace/infrastructure/firebase/FirebaseWorkspaceRepository";

import type {
  WorkspaceFinanceScheduleSnapshot,
  WorkspaceScheduleItem,
} from "../../domain/entities/ScheduleItem";
import type {
  ScheduleRepository,
  ScheduleScope,
} from "../../domain/repositories/ScheduleRepository";
import {
  createScheduleWorkspaceSnapshot,
  deriveScheduleItems,
  type ScheduleWorkspaceSnapshotSource,
} from "../../domain/services/derive-schedule-items";

function toScheduleFinanceSnapshot(
  finance: Awaited<ReturnType<FirebaseFinanceRepository["findByWorkspaceId"]>>,
): WorkspaceFinanceScheduleSnapshot | null {
  if (!finance) {
    return null;
  }

  return {
    stage: finance.stage,
    paymentTermStartAtISO: finance.paymentTermStartAtISO,
    paymentReceivedAtISO: finance.paymentReceivedAtISO,
  };
}

function toScheduleSnapshotSource(
  workspace: Awaited<ReturnType<FirebaseWorkspaceRepository["findById"]>>,
  finance: WorkspaceFinanceScheduleSnapshot | null,
): ScheduleWorkspaceSnapshotSource | null {
  if (!workspace) {
    return null;
  }

  return {
    createdAt: workspace.createdAt.toDate(),
    address: workspace.address,
    personnel: workspace.personnel,
    hasBetaCapability: workspace.capabilities.some((capability) => capability.status === "beta"),
    finance,
  };
}

export class FirebaseWorkspaceScheduleRepository implements ScheduleRepository {
  constructor(
    private readonly workspaceRepository = new FirebaseWorkspaceRepository(),
    private readonly financeRepository = new FirebaseFinanceRepository(),
  ) {}

  async listByWorkspace(scope: ScheduleScope): Promise<readonly WorkspaceScheduleItem[]> {
    const workspaceId = scope.workspaceId.trim();
    if (!workspaceId) {
      return [];
    }

    const [workspaceResult, financeResult] = await Promise.allSettled([
      this.workspaceRepository.findById(workspaceId),
      this.financeRepository.findByWorkspaceId(workspaceId),
    ]);

    if (workspaceResult.status === "rejected") {
      throw workspaceResult.reason;
    }

    const workspace = workspaceResult.value;
    const finance = financeResult.status === "fulfilled" ? financeResult.value : null;

    const snapshotSource = toScheduleSnapshotSource(
      workspace,
      toScheduleFinanceSnapshot(finance),
    );

    if (!snapshotSource) {
      return [];
    }

    return deriveScheduleItems(createScheduleWorkspaceSnapshot(snapshotSource));
  }
}
