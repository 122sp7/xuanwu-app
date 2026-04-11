/**
 * FirebaseStorageAuditSignalStore — Storage Adapter (Driven Adapter)
 *
 * Implements: AuditSignalStore
 * Appends immutable audit signals to "audit-signals" Firestore collection.
 */

import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { firebaseClientApp } from "@integration-firebase/client";
import type { AuditSignalStore } from "../../domain/ports/output";

export class FirebaseStorageAuditSignalStore implements AuditSignalStore {
private get db() {
return getFirestore(firebaseClientApp);
}

async write(signal: Record<string, unknown>): Promise<void> {
await addDoc(collection(this.db, "audit-signals"), {
...signal,
recordedAt: serverTimestamp(),
});
}
}
