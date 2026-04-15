/**
 * @module workspace-flow/infrastructure/repositories
 * @file FirebaseIssueRepository.ts
 * @description Firebase Firestore implementation of IssueRepository for workspace-flow.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Add query pagination support and composite indexes
 */

import {
  firestoreInfrastructureApi,
} from "@/modules/platform/api/infrastructure";
import { v7 as generateId } from "@lib-uuid";
import type { Issue, OpenIssueInput, UpdateIssueInput } from "../../domain/entities/Issue";
import type { IssueRepository } from "../../domain/repositories/IssueRepository";
import { ISSUE_STATUSES, type IssueStatus } from "../../domain/value-objects/IssueStatus";
import { toIssue } from "../firebase/issue.converter";
import { WF_ISSUES_COLLECTION } from "../firebase/workspace-flow.collections";

const VALID_STATUSES = new Set<IssueStatus>(ISSUE_STATUSES);
const DEFAULT_STATUS: IssueStatus = "open";
const OPEN_STATUSES: IssueStatus[] = ["open", "investigating", "fixing", "retest"];

export class FirebaseIssueRepository implements IssueRepository {
  private issuePath(issueId: string): string {
    return `${WF_ISSUES_COLLECTION}/${issueId}`;
  }

  async create(input: OpenIssueInput): Promise<Issue> {
    const nowISO = new Date().toISOString();
    const issueId = generateId();
    await firestoreInfrastructureApi.set(this.issuePath(issueId), {
      taskId: input.taskId,
      stage: input.stage,
      title: input.title,
      description: input.description ?? "",
      status: DEFAULT_STATUS,
      createdBy: input.createdBy,
      assignedTo: input.assignedTo ?? null,
      resolvedAtISO: null,
      createdAtISO: nowISO,
      updatedAtISO: nowISO,
    });

    return {
      id: issueId,
      taskId: input.taskId,
      stage: input.stage,
      title: input.title,
      description: input.description ?? "",
      status: DEFAULT_STATUS,
      createdBy: input.createdBy,
      assignedTo: input.assignedTo,
      createdAtISO: nowISO,
      updatedAtISO: nowISO,
    };
  }

  async update(issueId: string, input: UpdateIssueInput): Promise<Issue | null> {
    const path = this.issuePath(issueId);
    const snap = await firestoreInfrastructureApi.get<Record<string, unknown>>(path);
    if (!snap) return null;

    const patch: Record<string, unknown> = {
      updatedAtISO: new Date().toISOString(),
    };
    if (typeof input.title === "string") patch.title = input.title;
    if (typeof input.description === "string") patch.description = input.description;
    if (typeof input.assignedTo === "string") patch.assignedTo = input.assignedTo;

    await firestoreInfrastructureApi.update(path, patch);
    const updated = await firestoreInfrastructureApi.get<Record<string, unknown>>(path);
    if (!updated) return null;
    return toIssue(issueId, updated);
  }

  async delete(issueId: string): Promise<void> {
    await firestoreInfrastructureApi.delete(this.issuePath(issueId));
  }

  async findById(issueId: string): Promise<Issue | null> {
    const data = await firestoreInfrastructureApi.get<Record<string, unknown>>(this.issuePath(issueId));
    if (!data) return null;
    return toIssue(issueId, data);
  }

  async findByTaskId(taskId: string): Promise<Issue[]> {
    const docs = await firestoreInfrastructureApi.queryDocuments<Record<string, unknown>>(
      WF_ISSUES_COLLECTION,
      [{ field: "taskId", op: "==", value: taskId }],
      { orderBy: [{ field: "createdAtISO", direction: "desc" }] },
    );
    return docs.map((d) => toIssue(d.id, d.data));
  }

  async countOpenByTaskId(taskId: string): Promise<number> {
    const docs = await firestoreInfrastructureApi.queryDocuments<Record<string, unknown>>(
      WF_ISSUES_COLLECTION,
      [
        { field: "taskId", op: "==", value: taskId },
        { field: "status", op: "in", value: OPEN_STATUSES },
      ],
    );
    return docs.length;
  }

  async transitionStatus(issueId: string, to: IssueStatus, nowISO: string): Promise<Issue | null> {
    const path = this.issuePath(issueId);
    const snap = await firestoreInfrastructureApi.get<Record<string, unknown>>(path);
    if (!snap) return null;

    const validTo = VALID_STATUSES.has(to) ? to : DEFAULT_STATUS;
    const patch: Record<string, unknown> = {
      status: validTo,
      updatedAtISO: nowISO,
    };
    if (validTo === "resolved") patch.resolvedAtISO = nowISO;

    await firestoreInfrastructureApi.update(path, patch);
    const updated = await firestoreInfrastructureApi.get<Record<string, unknown>>(path);
    if (!updated) return null;
    return toIssue(issueId, updated);
  }
}
 
