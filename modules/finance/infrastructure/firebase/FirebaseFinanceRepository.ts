/**
 * FirebaseFinanceRepository — Infrastructure adapter for finance aggregate persistence.
 */

import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { firebaseClientApp } from "@integration-firebase/client";
import type { FinanceRepository } from "../../domain/repositories/FinanceRepository";
import type {
  FinanceAggregateEntity,
  FinanceLifecycleStage,
  FinanceClaimLineItem,
} from "../../domain/entities/Finance";

function toFinanceEntity(data: Record<string, unknown>): FinanceAggregateEntity {
  return {
    workspaceId: data.workspaceId as string,
    stage: data.stage as FinanceLifecycleStage,
    cycleIndex: (data.cycleIndex as number) ?? 0,
    receivedAmount: (data.receivedAmount as number) ?? 0,
    currentClaimLineItems: (data.currentClaimLineItems as FinanceClaimLineItem[]) ?? [],
    paymentTermStartAtISO: (data.paymentTermStartAtISO as string | null) ?? null,
    paymentReceivedAtISO: (data.paymentReceivedAtISO as string | null) ?? null,
    updatedAt: (data.updatedAt as number) ?? Date.now(),
  };
}

export class FirebaseFinanceRepository implements FinanceRepository {
  private get db() {
    return getFirestore(firebaseClientApp);
  }

  async findByWorkspaceId(workspaceId: string): Promise<FinanceAggregateEntity | null> {
    const snap = await getDoc(doc(this.db, "finance", workspaceId));
    if (!snap.exists()) return null;
    return toFinanceEntity(snap.data() as Record<string, unknown>);
  }

  async save(finance: FinanceAggregateEntity): Promise<void> {
    await setDoc(doc(this.db, "finance", finance.workspaceId), {
      ...finance,
      updatedAt: serverTimestamp(),
    });
  }

  async advanceStage(workspaceId: string, stage: FinanceLifecycleStage): Promise<void> {
    await updateDoc(doc(this.db, "finance", workspaceId), {
      stage,
      updatedAt: serverTimestamp(),
    });
  }

  async submitClaim(workspaceId: string, lineItems: FinanceClaimLineItem[]): Promise<void> {
    await updateDoc(doc(this.db, "finance", workspaceId), {
      stage: "claim-submitted",
      currentClaimLineItems: lineItems,
      updatedAt: serverTimestamp(),
    });
  }

  async recordPaymentReceived(
    workspaceId: string,
    amount: number,
    receivedAt: string,
  ): Promise<void> {
    await updateDoc(doc(this.db, "finance", workspaceId), {
      stage: "payment-received",
      receivedAmount: amount,
      paymentReceivedAtISO: receivedAt,
      updatedAt: serverTimestamp(),
    });
  }
}
