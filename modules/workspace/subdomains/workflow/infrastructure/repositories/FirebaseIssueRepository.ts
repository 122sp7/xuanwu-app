/**
 * @module workspace-flow/infrastructure/repositories
 * @file FirebaseIssueRepository.ts
 * @description Firebase Firestore implementation of IssueRepository for workspace-flow.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Add query pagination support and composite indexes
 */

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";

import { firebaseClientApp } from "@integration-firebase/client";
import type { Issue, OpenIssueInput, UpdateIssueInput } from "../../domain/entities/Issue";
import type { IssueRepository } from "../../domain/repositories/IssueRepository";
import { ISSUE_STATUSES, type IssueStatus } from "../../domain/value-objects/IssueStatus";
import { toIssue } from "../firebase/issue.converter";
import { WF_ISSUES_COLLECTION } from "../firebase/workspace-flow.collections";

const VALID_STATUSES = new Set<IssueStatus>(ISSUE_STATUSES);
const DEFAULT_STATUS: IssueStatus = "open";
const OPEN_STATUSES: IssueStatus[] = ["open", "investigating", "fixing", "retest"];

export class FirebaseIssueRepository implements IssueRepository {
  private get db() {
    return getFirestore(firebaseClientApp);
  }

  private get collectionRef() {
    return collection(this.db, WF_ISSUES_COLLECTION);
  }

  async create(input: OpenIssueInput): Promise<Issue> {
    const nowISO = new Date().toISOString();
    const docRef = await addDoc(this.collectionRef, {
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
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return {
      id: docRef.id,
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
    const issueRef = doc(this.db, WF_ISSUES_COLLECTION, issueId);
    const snap = await getDoc(issueRef);
    if (!snap.exists()) return null;

    const patch: Record<string, unknown> = {
      updatedAtISO: new Date().toISOString(),
      updatedAt: serverTimestamp(),
    };
    if (typeof input.title === "string") patch.title = input.title;
    if (typeof input.description === "string") patch.description = input.description;
    if (typeof input.assignedTo === "string") patch.assignedTo = input.assignedTo;

    await updateDoc(issueRef, patch);
    const updated = await getDoc(issueRef);
    if (!updated.exists()) return null;
    return toIssue(updated.id, updated.data() as Record<string, unknown>);
  }

  async delete(issueId: string): Promise<void> {
    await deleteDoc(doc(this.db, WF_ISSUES_COLLECTION, issueId));
  }

  async findById(issueId: string): Promise<Issue | null> {
    const snap = await getDoc(doc(this.db, WF_ISSUES_COLLECTION, issueId));
    if (!snap.exists()) return null;
    return toIssue(snap.id, snap.data() as Record<string, unknown>);
  }

  async findByTaskId(taskId: string): Promise<Issue[]> {
    const snaps = await getDocs(
      query(
        this.collectionRef,
        where("taskId", "==", taskId),
        orderBy("createdAtISO", "desc"),
      ),
    );
    return snaps.docs.map((d) => toIssue(d.id, d.data() as Record<string, unknown>));
  }

  async countOpenByTaskId(taskId: string): Promise<number> {
    const snaps = await getDocs(
      query(
        this.collectionRef,
        where("taskId", "==", taskId),
        where("status", "in", OPEN_STATUSES),
      ),
    );
    return snaps.size;
  }

  async transitionStatus(issueId: string, to: IssueStatus, nowISO: string): Promise<Issue | null> {
    const issueRef = doc(this.db, WF_ISSUES_COLLECTION, issueId);
    const snap = await getDoc(issueRef);
    if (!snap.exists()) return null;

    const validTo = VALID_STATUSES.has(to) ? to : DEFAULT_STATUS;
    const patch: Record<string, unknown> = {
      status: validTo,
      updatedAtISO: nowISO,
      updatedAt: serverTimestamp(),
    };
    if (validTo === "resolved") patch.resolvedAtISO = nowISO;

    await updateDoc(issueRef, patch);
    const updated = await getDoc(issueRef);
    if (!updated.exists()) return null;
    return toIssue(updated.id, updated.data() as Record<string, unknown>);
  }
}
 
