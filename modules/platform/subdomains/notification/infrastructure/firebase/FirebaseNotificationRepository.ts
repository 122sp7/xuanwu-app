/**
 * FirebaseNotificationRepository — Infrastructure adapter for notification persistence.
 * Firebase SDK is isolated to this file. Query recipient requires Firestore index:
 *   notifications: recipientId ASC, timestamp DESC
 *   notifications: recipientId ASC, read ASC
 */

import {
  getFirestore,
  collection,
  doc,
  addDoc,
  updateDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit as fbLimit,
  serverTimestamp,
} from "firebase/firestore";
import { firebaseClientApp } from "@integration-firebase/client";
import type { NotificationRepository } from "../../domain/repositories/NotificationRepository";
import type { NotificationEntity, DispatchNotificationInput } from "../../domain/entities/Notification";

function toNotification(id: string, data: Record<string, unknown>): NotificationEntity {
  return {
    id,
    recipientId: data.recipientId as string,
    title: data.title as string,
    message: data.message as string,
    type: data.type as NotificationEntity["type"],
    read: data.read as boolean,
    timestamp: data.timestamp as number,
    sourceEventType: typeof data.sourceEventType === "string" ? data.sourceEventType : undefined,
    metadata: data.metadata != null ? (data.metadata as Record<string, unknown>) : undefined,
  };
}

export class FirebaseNotificationRepository implements NotificationRepository {
  private get db() {
    return getFirestore(firebaseClientApp);
  }

  async dispatch(input: DispatchNotificationInput): Promise<NotificationEntity> {
    const now = Date.now();
    const ref = await addDoc(collection(this.db, "notifications"), {
      recipientId: input.recipientId,
      title: input.title,
      message: input.message,
      type: input.type,
      read: false,
      timestamp: now,
      sourceEventType: input.sourceEventType ?? null,
      metadata: input.metadata ?? null,
      _createdAt: serverTimestamp(),
    });
    return {
      id: ref.id,
      recipientId: input.recipientId,
      title: input.title,
      message: input.message,
      type: input.type,
      read: false,
      timestamp: now,
      sourceEventType: input.sourceEventType,
      metadata: input.metadata,
    };
  }

  async markAsRead(notificationId: string, _recipientId: string): Promise<void> {
    await updateDoc(doc(this.db, "notifications", notificationId), { read: true });
  }

  async markAllAsRead(recipientId: string): Promise<void> {
    const q = query(
      collection(this.db, "notifications"),
      where("recipientId", "==", recipientId),
      where("read", "==", false),
    );
    const snaps = await getDocs(q);
    await Promise.all(snaps.docs.map((d) => updateDoc(d.ref, { read: true })));
  }

  async findByRecipient(recipientId: string, maxCount = 50): Promise<NotificationEntity[]> {
    const q = query(
      collection(this.db, "notifications"),
      where("recipientId", "==", recipientId),
      orderBy("timestamp", "desc"),
      fbLimit(maxCount),
    );
    const snaps = await getDocs(q);
    return snaps.docs.map((d) => toNotification(d.id, d.data() as Record<string, unknown>));
  }

  async getUnreadCount(recipientId: string): Promise<number> {
    const q = query(
      collection(this.db, "notifications"),
      where("recipientId", "==", recipientId),
      where("read", "==", false),
    );
    const snaps = await getDocs(q);
    return snaps.size;
  }
}
