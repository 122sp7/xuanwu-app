/**
 * Module: workspace-scheduling
 * Layer: infrastructure/mock
 * Purpose: In-memory mock implementation of IDemandRepository.
 *
 * This mock demonstrates the architectural boundary without requiring
 * a live Firebase connection. Swap with FirebaseDemandRepository
 * when persisting to Firestore.
 */

import type { WorkDemand } from "../domain/types";
import type { IDemandRepository } from "../domain/repository";

const store: WorkDemand[] = [];

export class MockDemandRepository implements IDemandRepository {
  async listByWorkspace(workspaceId: string): Promise<WorkDemand[]> {
    return store.filter((d) => d.workspaceId === workspaceId);
  }

  async listByAccount(accountId: string): Promise<WorkDemand[]> {
    return store.filter((d) => d.accountId === accountId);
  }

  async save(demand: WorkDemand): Promise<void> {
    const existing = store.findIndex((d) => d.id === demand.id);
    if (existing !== -1) {
      store[existing] = demand;
    } else {
      store.push(demand);
    }
  }

  async update(demand: WorkDemand): Promise<void> {
    const idx = store.findIndex((d) => d.id === demand.id);
    if (idx !== -1) {
      store[idx] = demand;
    }
  }

  async findById(id: string): Promise<WorkDemand | null> {
    return store.find((d) => d.id === id) ?? null;
  }
}
