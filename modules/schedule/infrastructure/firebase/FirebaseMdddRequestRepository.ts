import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  where,
} from "firebase/firestore";

import { firebaseClientApp } from "@integration-firebase/client";
import type { Request } from "../../domain/mddd/entities/Request";
import type { ScheduleMdddRequestRepository } from "../../domain/mddd/repositories/RequestRepository";

const COLLECTION_NAME = "scheduleMdddRequests";

export class FirebaseMdddRequestRepository implements ScheduleMdddRequestRepository {
  private get db() {
    return getFirestore(firebaseClientApp);
  }

  async findById(requestId: string): Promise<Request | null> {
    const snapshot = await getDoc(doc(this.db, COLLECTION_NAME, requestId));
    if (!snapshot.exists()) {
      return null;
    }
    return snapshot.data() as Request;
  }

  async listByWorkspaceId(workspaceId: string): Promise<readonly Request[]> {
    const snapshots = await getDocs(
      query(collection(this.db, COLLECTION_NAME), where("workspaceId", "==", workspaceId)),
    );

    return snapshots.docs.map((snapshot) => snapshot.data() as Request);
  }

  async save(request: Request): Promise<Request> {
    await setDoc(doc(this.db, COLLECTION_NAME, request.requestId), request, { merge: true });
    return request;
  }
}
